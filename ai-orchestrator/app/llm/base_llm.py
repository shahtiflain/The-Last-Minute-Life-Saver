from abc import ABC, abstractmethod
from typing import Type, TypeVar, Optional
from pydantic import BaseModel

T = TypeVar('T', bound=BaseModel)

class BaseLLM(ABC):
    @abstractmethod
    async def generate(self, system_prompt: str, user_prompt: str, response_schema: Optional[Type[T]] = None) -> T | str:
        """
        Generates a response from the LLM provider.
        If response_schema is provided, the output must be validated against it.
        """
        pass
