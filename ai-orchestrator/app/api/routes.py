import uuid
from fastapi import APIRouter, Header, HTTPException, Depends
from typing import Annotated
from app.api.schemas import OrchestratorRequest, OrchestratorResponse, ScheduleApproveRequest
from app.core.orchestrator import Orchestrator
from app.memory.shared_memory import SharedMemory
from app.config.ai_settings import settings
from app.utils.logger import get_logger
from app.utils.exceptions import OrchestratorException
from app.tools.calendar_tool import CalendarTool

logger = get_logger(__name__)
router = APIRouter()

# Dependency injection for SharedMemory
def get_shared_memory() -> SharedMemory:
    return SharedMemory()

def verify_api_key(x_api_key: Annotated[str, Header()]) -> str:
    if x_api_key != settings.ORCHESTRATOR_API_KEY:
        logger.warning("Unauthorized access attempt")
        raise HTTPException(status_code=401, detail="Invalid API Key")
    return x_api_key

@router.post("/orchestrate", response_model=OrchestratorResponse)
async def orchestrate(
    request: OrchestratorRequest, 
    api_key: Annotated[str, Depends(verify_api_key)],
    shared_memory: Annotated[SharedMemory, Depends(get_shared_memory)]
):
    trace_id = str(uuid.uuid4())
    logger.info(f"Received orchestration request for user {request.user_id}", extra={"trace_id": trace_id})
    
    orchestrator = Orchestrator(shared_memory)
    
    try:
        response = await orchestrator.orchestrate(request, trace_id)
        return response
    except OrchestratorException as e:
        logger.error(f"Orchestration failed: {str(e)}", extra={"trace_id": trace_id})
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", extra={"trace_id": trace_id}, exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/schedule/approve")
async def approve_schedule(
    request: ScheduleApproveRequest,
    api_key: Annotated[str, Depends(verify_api_key)]
):
    """
    Approves a pending schedule and syncs it to Google Calendar.
    """
    trace_id = str(uuid.uuid4())
    try:
        cal_tool = CalendarTool(request.oauth_tokens)
        synced_ids = []
        for block in request.blocks:
            event_id = cal_tool.insert_event(
                title=str(block.get("title", "Focus Block")),
                start_time=str(block.get("startTime", "")),
                end_time=str(block.get("endTime", "")),
                extended_properties={"app": "antigravity"}
            )
            synced_ids.append(event_id)
            
        return {"status": "SUCCESS", "message": f"Synced {len(synced_ids)} blocks to Google Calendar.", "event_ids": synced_ids}
    except Exception as e:
        logger.error(f"Calendar Sync Error: {str(e)}", extra={"trace_id": trace_id})
        raise HTTPException(status_code=500, detail=f"Calendar Sync Error: {str(e)}")
