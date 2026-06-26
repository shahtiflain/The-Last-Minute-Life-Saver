import os
import datetime as dt
from app.agents.base_agent import BaseAgent
from app.api.schemas import AgentResponse, MemoryUpdate
from app.api.agent_schemas import WatcherLLMResponse, WatcherResult
from app.memory.request_context import RequestContext
from app.utils.logger import get_logger

logger = get_logger(__name__)

class WatcherAgent(BaseAgent):
    @property
    def name(self) -> str:
        return "Watcher"

    def can_handle(self, intent: str) -> bool:
        return intent == "watch"

    async def execute(self, context: RequestContext, user_input: str) -> AgentResponse:
        # 1. Load the prompt
        prompt_path = os.path.join(os.path.dirname(__file__), "..", "..", "prompts", "system", "watcher.md")
        try:
            with open(prompt_path, "r", encoding="utf-8") as f:
                system_prompt = f.read()
        except FileNotFoundError:
            system_prompt = "You are the AI Guardian. Monitor user progress."

        # 2. Add Context
        current_tasks = context.get("tasks", [])
        focus_blocks = context.get("focus_blocks", [])
        history = context.get("notification_history", [])
        
        state_context = f"\n\nActive Tasks: {len(current_tasks)}\nActive Focus Blocks: {len(focus_blocks)}\nNotification History: {len(history)} recent events."
        
        system_prompt += state_context

        # 3. Call LLM with Structured Output
        llm_response = await self.llm.generate(
            system_prompt=system_prompt,
            user_prompt=user_input,
            response_schema=WatcherLLMResponse
        )

        if isinstance(llm_response, str):
            raise ValueError("Expected WatcherLLMResponse, got string.")

        # 4. Process Results & Stage Memory Updates
        result: WatcherResult = llm_response.result
        memory_updates = []
        
        if result.actionTaken == "NOTIFICATION_STAGED" and result.notification:
            # Stage the notification for the Orchestrator to dispatch
            memory_updates.append(MemoryUpdate(
                collection="notification_intents",
                action="create",
                data={
                    "title": result.notification.title,
                    "body": result.notification.body,
                    "type": result.notification.type.value,
                    "priority": result.notification.priority.value,
                    "confidence": result.notification.confidence,
                    "whyAmISeeingThis": result.notification.whyAmISeeingThis,
                    "suggestedAction": result.notification.suggestedAction,
                    "proposedRecoveryBlock": result.notification.proposedRecoveryBlock,
                    "timestamp": dt.datetime.now(dt.UTC).isoformat()
                }
            ))
            
            # Log it in history so future runs can see it
            memory_updates.append(MemoryUpdate(
                collection="notification_history",
                action="create",
                data={
                    "title": result.notification.title,
                    "type": result.notification.type.value,
                    "timestamp": dt.datetime.now(dt.UTC).isoformat(),
                    "status": "SENT" # Assume sent initially, frontend updates to OPENED/IGNORED later
                }
            ))

        # 5. Return Standardized Envelope
        return AgentResponse(
            agent=self.name,
            version=llm_response.version,
            timestamp=dt.datetime.now(dt.UTC).isoformat(),
            traceId=context.trace_id,
            status="SUCCESS",
            reasoning=llm_response.reasoning,
            confidence=llm_response.confidence,
            result=result.model_dump(),
            memory_updates=memory_updates
        )
