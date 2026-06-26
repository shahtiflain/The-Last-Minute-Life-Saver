import os
import datetime as dt
from app.agents.base_agent import BaseAgent
from app.api.schemas import AgentResponse, MemoryUpdate
from app.api.agent_schemas import PlannerLLMResponse, PlannerResult
from app.memory.request_context import RequestContext

class PlannerAgent(BaseAgent):
    @property
    def name(self) -> str:
        return "Planner"

    def can_handle(self, intent: str) -> bool:
        return intent in ["plan", "plan_and_analyze"]

    async def execute(self, context: RequestContext, user_input: str) -> AgentResponse:
        # 1. Load the prompt
        prompt_path = os.path.join(os.path.dirname(__file__), "..", "..", "prompts", "system", "planner.md")
        try:
            with open(prompt_path, "r", encoding="utf-8") as f:
                system_prompt = f.read()
        except FileNotFoundError:
            system_prompt = "You are the Planner Agent. Break down tasks."

        # 2. Add Context
        current_tasks = context.get("tasks", [])
        state_context = f"\n\nCurrent Active Tasks: {len(current_tasks)}"
        if current_tasks:
            state_context += "\n" + "\n".join([f"- {t.get('title', 'Unknown')} (Status: {t.get('status', 'TODO')})" for t in current_tasks])

        system_prompt += state_context

        # 3. Call LLM with Structured Output
        llm_response = await self.llm.generate(
            system_prompt=system_prompt,
            user_prompt=user_input,
            response_schema=PlannerLLMResponse
        )

        if isinstance(llm_response, str):
            # Fallback if the LLM didn't return the structured object properly
            raise ValueError("Expected PlannerLLMResponse, got string.")

        # 4. Process Results & Stage Memory Updates
        memory_updates = []
        result: PlannerResult = llm_response.result
        
        for task in result.tasks:
            memory_updates.append(MemoryUpdate(
                collection="tasks",
                action="create",
                data={
                    "title": task.title,
                    "description": task.description,
                    "priority": task.priority.value,
                    "estimatedMinutes": task.estimated_minutes,
                    "pomodoroCount": task.pomodoroCount,
                    "dependencies": task.dependencies,
                    "reasoning": task.reasoning,
                    "status": "TODO"
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
