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
        agent = AgentRegistry.get_agent_for_intent(request.intent)
        
        agent_responses: List[AgentResponse] = []
        overall_status = "SUCCESS"
        overall_reasoning = "Orchestration completed successfully."

        if not agent:
            # For Milestone 4, we don't have agents yet, so we return a placeholder
            logger.info("No matching agent found (Milestone 4 placeholder).", extra={"trace_id": trace_id})
            overall_reasoning = f"No agent registered for intent: {request.intent}"
            
        else:
            # 3. Execute Agent
            try:
                logger.info(f"Executing agent: {agent.name}", extra={"trace_id": trace_id})
                response = await agent.execute(context, request.intent)
                agent_responses.append(response)
                
                # 4. Stage updates in context
                for update in response.memory_updates:
                    context.stage_update(update)
                    
            except Exception as e:
                logger.error(f"Agent execution failed: {str(e)}", extra={"trace_id": trace_id}, exc_info=True)
                overall_status = "FAILED"
                overall_reasoning = f"Agent {agent.name} failed during execution."
                raise AgentExecutionError(overall_reasoning) from e

        # 5. Flush Context to MongoDB
        await self.shared_memory.flush_context(context)
        
        logger.info("Orchestration finished", extra={"trace_id": trace_id})
        
        return OrchestratorResponse(
            trace_id=trace_id,
            status=overall_status,
            overall_reasoning=overall_reasoning,
            agent_responses=agent_responses
        )
