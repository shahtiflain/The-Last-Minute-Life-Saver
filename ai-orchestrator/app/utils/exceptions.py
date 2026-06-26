class OrchestratorException(Exception):
    """Base class for Orchestrator exceptions."""
    pass

class LLMTimeoutError(OrchestratorException):
    """Raised when the LLM provider times out."""
    pass

class AgentExecutionError(OrchestratorException):
    """Raised when a specific agent fails to execute its logic."""
    pass

class UnauthorizedError(OrchestratorException):
    """Raised when the caller is not authorized to use the Orchestrator."""
    pass
