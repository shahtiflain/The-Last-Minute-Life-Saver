import os
import datetime as dt
from app.agents.base_agent import BaseAgent
from app.api.schemas import AgentResponse, MemoryUpdate
from app.api.agent_schemas import RiskLLMResponse, RiskResult
from app.memory.request_context import RequestContext

class RiskAnalyzerAgent(BaseAgent):
    @property
    def name(self) -> str:
        return "RiskAnalyzer"

    def can_handle(self, intent: str) -> bool:
        return intent in ["analyze_risk", "plan_and_analyze"]

    async def execute(self, context: RequestContext, user_input: str) -> AgentResponse:
        # 1. Load the prompt
        prompt_path = os.path.join(os.path.dirname(__file__), "..", "..", "prompts", "system", "risk_analyzer.md")
        try:
            with open(prompt_path, "r", encoding="utf-8") as f:
                system_prompt = f.read()
        except FileNotFoundError:
            system_prompt = "You are the Risk Analyzer Agent. Evaluate workload."

        # 2. Add Context (Including newly staged tasks from Planner if any)
        current_tasks = context.get("tasks", [])
        staged_updates = context.get_pending_updates()
        new_tasks = [u.data for u in staged_updates if u.collection == "tasks" and u.action == "create"]
        
        state_context = f"\n\nExisting Tasks: {len(current_tasks)}\nNew Tasks Being Added: {len(new_tasks)}"
        
        system_prompt += state_context

        # 3. Call LLM with Structured Output
        llm_response = await self.llm.generate(
            system_prompt=system_prompt,
            user_prompt=user_input,
            response_schema=RiskLLMResponse
        )

        if isinstance(llm_response, str):
            raise ValueError("Expected RiskLLMResponse, got string.")

        # 4. Process Results & Stage Memory Updates
        result: RiskResult = llm_response.result
        
        memory_updates = [
            MemoryUpdate(
                collection="ai_insights",
                action="create",
                data={
                    "type": "risk_assessment",
                    "riskScore": result.riskScore,
                    "riskLevel": result.riskLevel.value,
                    "recommendations": result.recommendations,
                    "timestamp": dt.datetime.now(dt.UTC).isoformat()
                }
            )
        ]

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
