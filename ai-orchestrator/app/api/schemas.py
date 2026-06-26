from pydantic import BaseModel, Field
from typing import Dict, Any, Optional

class MemoryUpdate(BaseModel):
    collection: str = Field(..., description="The MongoDB collection to update (e.g., tasks, goals)")
    action: str = Field(..., description="The action to perform (e.g., create, update, delete)")
    data: Dict[str, Any] = Field(..., description="The data to write to the collection")

class AgentResponse(BaseModel):
    agent: str = Field(..., description="Name of the agent generating this response")
    version: str = Field(default="1.0", description="Version of the agent schema")
    timestamp: str = Field(..., description="ISO datetime string")
    traceId: str = Field(..., description="Request trace ID")
    status: str = Field(..., description="Status of the execution: SUCCESS or FAILED")
    reasoning: str = Field(..., description="Explanation of how the agent arrived at this conclusion")
    confidence: float = Field(..., description="Confidence score between 0.0 and 1.0")
    result: Dict[str, Any] = Field(..., description="The raw explainable AI result from the specific agent")
    memory_updates: list[MemoryUpdate] = Field(default_factory=list, description="Internal updates to shared memory")

class OrchestratorRequest(BaseModel):
    user_id: str
    intent: str
    context: Optional[Dict[str, Any]] = None

class OrchestratorResponse(BaseModel):
    trace_id: str
    status: str
    overall_reasoning: str
    agent_responses: list[AgentResponse]
