from typing import List, Optional
from app.agents.base_agent import BaseAgent

class AgentRegistry:
    """
    Dynamic registry for all specialist agents.
    Allows the Orchestrator to find the right agent without hardcoded dependencies.
    """
    _instance = None
    _agents: List[BaseAgent] = []

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AgentRegistry, cls).__new__(cls)
            cls._agents = []
        return cls._instance

    @classmethod
    def register(cls, agent: BaseAgent):
        if agent not in cls._agents:
            cls._agents.append(agent)

    @classmethod
    def get_agent_for_intent(cls, intent: str) -> Optional[BaseAgent]:
        for agent in cls._agents:
            if agent.can_handle(intent):
                return agent
        return None

    @classmethod
    def get_all_agents_for_intent(cls, intent: str) -> List[BaseAgent]:
        return [agent for agent in cls._agents if agent.can_handle(intent)]

    @classmethod
    def get_all_agents(cls) -> List[BaseAgent]:
        return cls._agents

    @classmethod
    def clear(cls):
        cls._agents = []

def register_default_agents():
    from app.llm.gemini_client import GeminiClient
    from app.agents.planner_agent import PlannerAgent
    from app.agents.risk_analyzer_agent import RiskAnalyzerAgent
    from app.agents.scheduler_agent import SchedulerAgent
    from app.agents.watcher_agent import WatcherAgent
    
    # In a real app, trace_id and DI would be handled better.
    # For now, we inject a generic client. Agents can clone/override it if needed.
    llm = GeminiClient()
    AgentRegistry.register(PlannerAgent(llm))
    AgentRegistry.register(RiskAnalyzerAgent(llm))
    AgentRegistry.register(SchedulerAgent(llm))
    AgentRegistry.register(WatcherAgent(llm))

