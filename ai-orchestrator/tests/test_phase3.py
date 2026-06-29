import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from app.agents.planner_agent import PlannerAgent
from app.agents.scheduler_agent import SchedulerAgent
from app.agents.risk_analyzer_agent import RiskAnalyzerAgent
from app.memory.request_context import RequestContext
from app.api.agent_schemas import PlannerLLMResponse, PlannerResult, PlannedTask, SchedulerLLMResponse, SchedulerResult, RiskLLMResponse, RiskResult
import sys

@pytest.mark.asyncio
async def test_planner_agent_output():
    llm = AsyncMock()
    agent = PlannerAgent(llm=llm)
    
    mock_result = PlannerResult(
        estimatedTotalMinutes=60,
        estimatedCompletionDate="2026-06-28",
        complexity="MODERATE",
        cognitiveLoad="MEDIUM",
        urgency="HIGH",
        executionStrategy="SEQUENTIAL",
        tasks=[
            PlannedTask(title="Mock Task", description="Mock Desc", priority="CRITICAL", estimated_minutes=60, pomodoroCount=3, dependencies=[], reasoning="Because")
        ]
    )
    mock_response = PlannerLLMResponse(agent="Planner", version="1.0", timestamp="2026", traceId="1", reasoning="Test", confidence=0.9, result=mock_result)
    agent.llm.generate.return_value = mock_response
    
    context = RequestContext(user_id="test_user", trace_id="trace_1")
    response = await agent.execute(context, "Do something")
    
    assert response.status == "SUCCESS"
    assert len(response.memory_updates) == 1
    assert response.memory_updates[0].collection == "tasks"
    assert response.memory_updates[0].data["title"] == "Mock Task"

@pytest.mark.asyncio
async def test_scheduler_agent_with_real_calendar():
    llm = AsyncMock()
    agent = SchedulerAgent(llm=llm)
    
    from app.api.agent_schemas import ScheduleOption
    mock_result = SchedulerResult(recommendedSchedule=ScheduleOption(scheduleQualityScore=90, blocks=[]), alternativeSchedules=[])
    mock_response = SchedulerLLMResponse(agent="Scheduler", version="1.0", timestamp="2026", traceId="1", reasoning="Test", confidence=0.9, result=mock_result)
    agent.llm.generate.return_value = mock_response
    
    context = RequestContext(user_id="test_user", trace_id="trace_1")
    context.load_state({"calendar_tokens": {"access_token": "mock_token"}})
    
    with patch('app.tools.calendar_tool.CalendarTool', create=True) as mock_calendar_tool_class:
        mock_cal_instance = MagicMock()
        mock_cal_instance.get_free_busy.return_value = [{"start": "2026-01-01T09:00:00Z", "end": "2026-01-01T10:00:00Z"}]
        mock_calendar_tool_class.return_value = mock_cal_instance
        
        response = await agent.execute(context, "Schedule it")
        
        mock_cal_instance.get_free_busy.assert_called_once()
        assert response.status == "SUCCESS"

@pytest.mark.asyncio
async def test_risk_analyzer_context():
    llm = AsyncMock()
    agent = RiskAnalyzerAgent(llm=llm)
    
    mock_result = RiskResult(riskScore=85, riskLevel="HIGH", estimatedDelayMinutes=0, atRiskTasks=[], riskFactors=[], recommendations=["Do less"])
    mock_response = RiskLLMResponse(agent="Risk", version="1.0", timestamp="2026", traceId="1", reasoning="Test", confidence=0.9, result=mock_result)
    agent.llm.generate.return_value = mock_response
    
    context = RequestContext(user_id="test_user", trace_id="trace_1")
    context.load_state({"tasks": [{"title": "Overload Task", "estimatedMinutes": 600}]})
    
    response = await agent.execute(context, "Analyze me")
    
    # Verify the llm generate was called and it included "Overload Task"
    args, kwargs = agent.llm.generate.call_args
    assert "Overload Task" in kwargs["system_prompt"]
    assert response.status == "SUCCESS"
    assert response.result["riskScore"] == 85
