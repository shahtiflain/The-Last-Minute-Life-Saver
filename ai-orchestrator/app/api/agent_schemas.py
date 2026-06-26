from pydantic import BaseModel
from typing import List, Any, Literal
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

class BlockTypeEnum(str, Enum):
    TASK = "TASK"
    BREAK = "BREAK"

class ScheduledBlock(BaseModel):
    taskId: str | None
    type: BlockTypeEnum
    title: str
    startTime: str
    endTime: str
    pomodorosAssigned: int
    whyThisSlot: List[str]
    energyRequirement: Literal["LOW", "MEDIUM", "HIGH"]
    estimatedFocusScore: int
    calendarEventId: str | None = None

class ScheduleOption(BaseModel):
    scheduleQualityScore: int
    blocks: List[ScheduledBlock]

class SchedulerResult(BaseModel):
    recommendedSchedule: ScheduleOption
    alternativeSchedules: List[ScheduleOption]

class SchedulerLLMResponse(AgentLLMResponse):
    result: SchedulerResult

class NotificationTypeEnum(str, Enum):
    START = "START"
    PROGRESS = "PROGRESS"
    WARNING = "WARNING"
    ENCOURAGEMENT = "ENCOURAGEMENT"
    RECOVERY = "RECOVERY"
    SUMMARY = "SUMMARY"

class WatcherNotification(BaseModel):
    title: str
    body: str
    type: NotificationTypeEnum
    priority: PriorityEnum
    confidence: float
    whyAmISeeingThis: str
    suggestedAction: str | None = None
    proposedRecoveryBlock: dict | None = None

class WatcherResult(BaseModel):
    actionTaken: Literal["NOTIFICATION_STAGED", "NO_ACTION"]
    notification: WatcherNotification | None = None

class WatcherLLMResponse(AgentLLMResponse):
    result: WatcherResult
