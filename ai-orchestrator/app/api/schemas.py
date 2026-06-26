from pydantic import BaseModel, Field
from typing import Dict, Any, Optional

class MemoryUpdate(BaseModel):
    collection: str = Field(..., description="The MongoDB collection to update (e.g., tasks, goals)")
    action: str = Field(..., description="The action to perform (e.g., create, update, delete)")
    data: Dict[str, Any] = Field(..., description="The data to write to the collection")

class AgentResponse(BaseModel):
    agent_name: str = Field(..., description="Name of the agent generating this response")
    status: str = Field(..., description="Status of the execution: SUCCESS or FAILED")
    reasoning: str = Field(..., description="Explanation of how the agent arrived at this conclusion")
    confidence_score: float = Field(..., description="Confidence score between 0.0 and 1.0")
    memory_updates: list[MemoryUpdate] = Field(default_factory=list, description="List of proposed updates to shared memory")
    suggested_next_action: Optional[str] = Field(None, description="Recommended next action for the user or orchestrator")

class OrchestratorRequest(BaseModel):
    user_id: str
    intent: str
    context: Optional[Dict[str, Any]] = None

class OrchestratorResponse(BaseModel):
    trace_id: str
    status: str
    overall_reasoning: str
    agent_responses: list[AgentResponse]
