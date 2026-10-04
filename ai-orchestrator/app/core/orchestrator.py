from typing import List
from app.api.schemas import OrchestratorRequest, OrchestratorResponse, AgentResponse
from app.memory.shared_memory import SharedMemory
from app.agents.agent_registry import AgentRegistry
from app.utils.logger import get_logger
from app.utils.exceptions import AgentExecutionError

logger = get_logger(__name__)

class Orchestrator:
    """
    The central intelligence of the platform.
    Routes requests to agents and manages shared memory.
    """
    def __init__(self, shared_memory: SharedMemory):
        self.shared_memory = shared_memory

    async def orchestrate(self, request: OrchestratorRequest, trace_id: str) -> OrchestratorResponse:
        logger.info(f"Starting orchestration for intent: {request.intent}", extra={"trace_id": trace_id})
        
        # 1. Initialize RequestContext (Memory Cache)
        context = await self.shared_memory.initialize_context(request.user_id, trace_id)
        if request.context:
            context.load_state(request.context)

        # 2. Find appropriate agent(s)
        agents = AgentRegistry.get_all_agents_for_intent(request.intent)
        
        agent_responses: List[AgentResponse] = []
        overall_status = "SUCCESS"
        overall_reasoning = "Orchestration completed successfully."

        if not agents:
            logger.info("No matching agent found.", extra={"trace_id": trace_id})
            overall_reasoning = f"No agent registered for intent: {request.intent}"
            
        else:
            # 3. Execute Agents Sequentially
            for agent in agents:
                try:
                    logger.info(f"Executing agent: {agent.name}", extra={"trace_id": trace_id})
                    response = await agent.execute(context, request.intent)
                    agent_responses.append(response)
                    
                    # 4. Stage updates in context so the NEXT agent sees them
                    for update in response.memory_updates:
                        context.stage_update(update)
                        
                except Exception as e:
                    logger.error(f"Agent execution failed: {str(e)}", extra={"trace_id": trace_id}, exc_info=True)
                    overall_status = "FAILED"
                    overall_reasoning = f"Agent {agent.name} failed during execution."
                    raise AgentExecutionError(overall_reasoning) from e

        # 4.5 Dispatch Staged Notifications
        # The Watcher stages NotificationIntents. We send them here (Decoupled Architecture).
        staged_notifications = [u.data for u in context.get_pending_updates() if u.collection == "notification_intents"]
        if staged_notifications:
            from app.tools.notification_tool import NotificationTool, InvalidFCMTokenError
            notifier = NotificationTool()
            user_fcm_token = request.context.get("fcm_token") # Assumes frontend provides this in context
            
            for notif in staged_notifications:
                if user_fcm_token:
                    try:
                        notifier.send_notification(
                            fcm_token=user_fcm_token,
                            title=notif.get("title", "AI Guardian"),
                            body=notif.get("body", ""),
                            data_payload={
                                "priority": notif.get("priority", "LOW"),
                                "type": notif.get("type", "PROGRESS"),
                                "whyAmISeeingThis": notif.get("whyAmISeeingThis", ""),
                                "suggestedAction": notif.get("suggestedAction", "")
                            }
                        )
                    except InvalidFCMTokenError:
                        logger.warning(f"FCM Token for user {request.user_id} is invalid. Wiping from DB.", extra={"trace_id": trace_id})
                        await self.shared_memory.db.users.update_one(
                            {"userId": request.user_id},
                            {"$unset": {"fcmToken": ""}}
                        )
                        break # Stop trying for this run
                else:
                    logger.warning("FCM Token not provided in request context; skipping push notification dispatch.")

        # 5. Flush Context to MongoDB
        await self.shared_memory.flush_context(context)
        
        logger.info("Orchestration finished", extra={"trace_id": trace_id})
        
        return OrchestratorResponse(
            trace_id=trace_id,
            status=overall_status,
            overall_reasoning=overall_reasoning,
            agent_responses=agent_responses
        )
