from abc import ABC, abstractmethod
from app.api.schemas import AgentResponse
from app.memory.request_context import RequestContext
from app.llm.base_llm import BaseLLM

class BaseAgent(ABC):
    """
    Abstract base class for all specialist agents.
    """
    def __init__(self, llm: BaseLLM):
        self.llm = llm

    @property
    @abstractmethod
    def name(self) -> str:
        """Name of the agent (e.g., Planner, Scheduler)."""
        pass

    @abstractmethod
    def can_handle(self, intent: str) -> bool:
        """Determines if this agent should handle the given intent."""
        pass

    @abstractmethod
    async def execute(self, context: RequestContext, user_input: str) -> AgentResponse:
        """
        Executes the agent's core logic.
        Must return a standardized AgentResponse.
        """
        pass
