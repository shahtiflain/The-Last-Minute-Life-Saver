import uuid
from fastapi import APIRouter, Header, HTTPException, Depends
from typing import Annotated
from app.api.schemas import OrchestratorRequest, OrchestratorResponse
from app.core.orchestrator import Orchestrator
from app.memory.shared_memory import SharedMemory
from app.config.ai_settings import settings
from app.utils.logger import get_logger
from app.utils.exceptions import OrchestratorException

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
