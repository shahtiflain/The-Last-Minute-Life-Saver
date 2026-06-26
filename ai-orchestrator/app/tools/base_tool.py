from abc import ABC, abstractmethod
from typing import Any

class BaseTool(ABC):
    """
    Abstract base class for all tools used by agents.
    Enforces a standard execute pattern.
    """
    
    @property
    @abstractmethod
    def name(self) -> str:
        """Name of the tool."""
        pass
        
    @property
    @abstractmethod
    def description(self) -> str:
        """Description of what the tool does."""
        pass
        
    @abstractmethod
    async def execute(self, **kwargs) -> Any:
        """Executes the tool's core logic."""
        pass
