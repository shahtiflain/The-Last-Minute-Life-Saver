from pydantic import BaseModel
from typing import List, Any
from enum import Enum

class PriorityEnum(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class CognitiveLoadEnum(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class ComplexityEnum(str, Enum):
    SIMPLE = "SIMPLE"
    MODERATE = "MODERATE"
    COMPLEX = "COMPLEX"

class ExecutionStrategyEnum(str, Enum):
    SEQUENTIAL = "SEQUENTIAL"
    PARALLEL = "PARALLEL"

class PlannedTask(BaseModel):
    title: str
    description: str | None
    priority: PriorityEnum
    estimated_minutes: int
    pomodoroCount: int
    dependencies: List[str]
    reasoning: str

class PlannerResult(BaseModel):
    estimatedTotalMinutes: int
    estimatedCompletionDate: str
    complexity: ComplexityEnum
    cognitiveLoad: CognitiveLoadEnum
    urgency: PriorityEnum
    executionStrategy: ExecutionStrategyEnum
    tasks: List[PlannedTask]

class RiskLevelEnum(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class RiskResult(BaseModel):
    riskScore: int
    riskLevel: RiskLevelEnum
    estimatedDelayMinutes: int
    atRiskTasks: List[str]
    riskFactors: List[str]
    recommendations: List[str]

class AgentLLMResponse(BaseModel):
    agent: str
    version: str
    timestamp: str
    traceId: str
    reasoning: str
    confidence: float
    result: Any

class PlannerLLMResponse(AgentLLMResponse):
    result: PlannerResult

class RiskLLMResponse(AgentLLMResponse):
    result: RiskResult
