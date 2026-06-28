import os
import datetime as dt
from app.agents.base_agent import BaseAgent
from app.api.schemas import AgentResponse, MemoryUpdate
from app.api.agent_schemas import SchedulerLLMResponse, SchedulerResult
from app.memory.request_context import RequestContext
from app.utils.logger import get_logger

logger = get_logger(__name__)

class SchedulerAgent(BaseAgent):
    @property
    def name(self) -> str:
        return "Scheduler"

    def can_handle(self, intent: str) -> bool:
        return intent in ["schedule", "plan_and_schedule", "plan_analyze_schedule"]

    async def execute(self, context: RequestContext, user_input: str) -> AgentResponse:
        # 1. Load the prompt
        prompt_path = os.path.join(os.path.dirname(__file__), "..", "..", "prompts", "system", "scheduler.md")
        try:
            with open(prompt_path, "r", encoding="utf-8") as f:
                system_prompt = f.read()
        except FileNotFoundError:
            system_prompt = "You are the Scheduler Agent."

        # 2. Add Context (Tasks and Mocked Free Slots for Milestone 6)
        # In production, we'd instantiate CalendarTool here using context.get('oauth_tokens')
        # and calculate exact free slots.
        current_tasks = context.get("tasks", [])
        staged_updates = context.get_pending_updates()
        new_tasks = [u.data for u in staged_updates if u.collection == "tasks" and u.action == "create"]
        all_tasks_to_schedule = current_tasks + new_tasks
        
        now = dt.datetime.now(dt.UTC)
        tomorrow = now + dt.timedelta(days=1)
        
        mock_slots = ""
        # Fetch real slots if we have calendar tokens
        oauth_tokens = context.get("calendar_tokens")
        if oauth_tokens and isinstance(oauth_tokens, dict) and 'access_token' in oauth_tokens:
            try:
                from app.tools.calendar_tool import CalendarTool
                # The auth token structure returned by google-auth-library has 'access_token', 'refresh_token'
                # CalendarTool expects token, refresh_token, client_id, client_secret
                from app.config.ai_settings import settings
                creds_dict = {
                    'token': oauth_tokens.get('access_token'),
                    'refresh_token': oauth_tokens.get('refresh_token'),
                    'client_id': settings.GOOGLE_CLIENT_ID,
                    'client_secret': settings.GOOGLE_CLIENT_SECRET,
                }
                cal = CalendarTool(creds_dict)
                busy_slots = cal.get_free_busy(now.isoformat(), tomorrow.isoformat())
                mock_slots = f"\n\nReal Busy Slots Today & Tomorrow:\n{busy_slots}\n(Schedule tasks around these busy slots)"
            except Exception as e:
                logger.error(f"Failed to fetch real calendar slots: {e}")
                mock_slots = "Failed to fetch real calendar slots. Assume standard working hours."
        else:
            mock_slots = f"""
            Available Slots:
            - Slot 1: {now.strftime('%Y-%m-%d')}T09:00:00Z to {now.strftime('%Y-%m-%d')}T12:00:00Z
            - Slot 2: {now.strftime('%Y-%m-%d')}T13:00:00Z to {now.strftime('%Y-%m-%d')}T17:00:00Z
            - Slot 3: {tomorrow.strftime('%Y-%m-%d')}T09:00:00Z to {tomorrow.strftime('%Y-%m-%d')}T12:00:00Z
            """
        
        state_context = f"\n\nTasks to schedule: {len(all_tasks_to_schedule)}\n"
        if all_tasks_to_schedule:
            state_context += "\n".join([f"- {t.get('title', 'Unknown')} (Priority: {t.get('priority', 'MEDIUM')}, Mins: {t.get('estimatedMinutes', 60)})" for t in all_tasks_to_schedule])
        
        system_prompt += state_context + "\n" + mock_slots

        # 3. Call LLM with Structured Output
        llm_response = await self.llm.generate(
            system_prompt=system_prompt,
            user_prompt=user_input,
            response_schema=SchedulerLLMResponse
        )

        if isinstance(llm_response, str):
            raise ValueError("Expected SchedulerLLMResponse, got string.")

        # 4. Process Results & Stage Memory Updates
        result: SchedulerResult = llm_response.result
        
        memory_updates = []
        # Stage only the recommended schedule for PENDING_APPROVAL
        for block in result.recommendedSchedule.blocks:
            memory_updates.append(MemoryUpdate(
                collection="focus_blocks",
                action="create",
                data={
                    "taskId": block.taskId,
                    "type": block.type.value,
                    "title": block.title,
                    "startTime": block.startTime,
                    "endTime": block.endTime,
                    "pomodorosAssigned": block.pomodorosAssigned,
                    "whyThisSlot": block.whyThisSlot,
                    "energyRequirement": block.energyRequirement,
                    "estimatedFocusScore": block.estimatedFocusScore,
                    "calendarEventId": block.calendarEventId,
                    "status": "PENDING_APPROVAL"
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
