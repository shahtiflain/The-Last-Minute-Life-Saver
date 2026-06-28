import uuid
from fastapi import APIRouter, Header, HTTPException, Depends
from typing import Annotated
from app.api.schemas import OrchestratorRequest, OrchestratorResponse, ScheduleApproveRequest
from app.core.orchestrator import Orchestrator
from app.memory.shared_memory import SharedMemory
from app.config.ai_settings import settings
from app.utils.logger import get_logger
from app.utils.exceptions import OrchestratorException
from app.tools.calendar_tool import CalendarTool, CalendarAuthError

logger = get_logger(__name__)
router = APIRouter()

# Dependency injection for SharedMemory
def get_shared_memory() -> SharedMemory:
    return SharedMemory()

def verify_api_key(x_api_key: Annotated[str, Header()]) -> str:
    if x_api_key != settings.INTERNAL_API_KEY:
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
    api_key: Annotated[str, Depends(verify_api_key)],
    shared_memory: Annotated[SharedMemory, Depends(get_shared_memory)]
):
    """
    Approves a pending schedule and syncs it to Google Calendar.
    """
    trace_id = str(uuid.uuid4())
    try:
        from bson.objectid import ObjectId
        
        # Load and decrypt context from shared_memory
        context = await shared_memory.initialize_context(request.user_id, trace_id)
        oauth_tokens = context.get("calendar_tokens")
        if not oauth_tokens:
            raise HTTPException(status_code=400, detail="Google Calendar is not connected")
            
        creds_dict = {
            'token': oauth_tokens.get('access_token'),
            'refresh_token': oauth_tokens.get('refresh_token'),
            'client_id': settings.GOOGLE_CLIENT_ID,
            'client_secret': settings.GOOGLE_CLIENT_SECRET,
        }
            
        cal_tool = CalendarTool(creds_dict)
        synced_ids = []
        for block in request.blocks:
            block_id = block.get("_id")
            if not block_id:
                continue
                
            try:
                # Idempotency check
                existing = await shared_memory.db.focus_blocks.find_one({"_id": ObjectId(block_id), "userId": request.user_id})
                if existing and existing.get("status") == "APPROVED":
                    logger.info(f"Block {block_id} already APPROVED, skipping calendar sync.", extra={"trace_id": trace_id})
                    continue
                
                event_id = cal_tool.insert_event(
                    title=str(block.get("title", "Focus Block")),
                    start_time=str(block.get("startTime", "")),
                    end_time=str(block.get("endTime", "")),
                    extended_properties={"app": "antigravity"}
                )
                synced_ids.append(event_id)
                
                await shared_memory.db.focus_blocks.update_one(
                    {"_id": ObjectId(block_id), "userId": request.user_id},
                    {"$set": {"status": "APPROVED", "calendarEventId": event_id}}
                )
            except Exception as update_err:
                logger.error(f"Failed to process focus block {block_id}: {update_err}", extra={"trace_id": trace_id})
            
        return {"status": "SUCCESS", "message": f"Synced {len(synced_ids)} blocks to Google Calendar.", "event_ids": synced_ids}
    except CalendarAuthError as auth_err:
        logger.error(f"Calendar Auth Error: {str(auth_err)}", extra={"trace_id": trace_id})
        # Wipe tokens so UI prompts reconnect
        await shared_memory.db.users.update_one(
            {"userId": request.user_id},
            {"$unset": {"calendar_tokens": ""}}
        )
        raise HTTPException(status_code=401, detail="Google Calendar authorization revoked or expired. Please reconnect.")
    except Exception as e:
        logger.error(f"Calendar Sync Error: {str(e)}", extra={"trace_id": trace_id})
        raise HTTPException(status_code=500, detail=f"Calendar Sync Error: {str(e)}")
