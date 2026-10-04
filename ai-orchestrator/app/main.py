from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.api.routes import router as orchestration_router
from app.utils.logger import get_logger
from app.agents.agent_registry import register_default_agents
from apscheduler.schedulers.asyncio import AsyncIOScheduler # type: ignore

logger = get_logger(__name__)
scheduler = AsyncIOScheduler()

async def run_watcher_job():
    logger.info("Running background AI Guardian (Watcher) job...")
    try:
        from app.core.orchestrator import Orchestrator
        from app.memory.shared_memory import SharedMemory
        from app.api.schemas import OrchestratorRequest
        import uuid
        
        shared_memory = SharedMemory()
        # Find all users. In a real app we might only query users with active tasks.
        users = await shared_memory.db.users.find({}).to_list(length=None)
        
        for user in users:
            user_id = user.get("userId")
            if not user_id:
                continue
            orchestrator = Orchestrator(shared_memory)
            await orchestrator.orchestrate(
                request=OrchestratorRequest(user_id=user_id, intent="watch"),
                trace_id=str(uuid.uuid4())
            )
    except Exception as e:
        logger.error(f"Error in background Watcher job: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up AI Orchestrator service...")
    register_default_agents()
    
    # Start APScheduler for background Guardian monitoring
    scheduler.add_job(run_watcher_job, 'interval', minutes=15)
    scheduler.start()
    
    yield
    
    logger.info("Shutting down AI Orchestrator service...")
    scheduler.shutdown()

app = FastAPI(
    title="Antigravity AI Orchestrator",
    description="Multi-agent orchestration service for The Last-Minute Life Saver",
    version="1.0.0",
    lifespan=lifespan
)

import time
import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        trace_id = request.headers.get("x-request-id") or request.headers.get("trace-id") or str(uuid.uuid4())
        start_time = time.time()
        
        response = await call_next(request)
        
        process_time_ms = int((time.time() - start_time) * 1000)
        
        # User ID is often passed from the backend in auth headers or payload.
        # We will attempt to log it if it's in a standard header.
        user_id = request.headers.get("x-user-id", "anonymous")
        
        logger.info(
            "Request processed",
            extra={
                "method": request.method,
                "url": str(request.url.path),
                "traceId": trace_id,
                "userId": user_id,
                "statusCode": response.status_code,
                "responseTimeMs": process_time_ms,
                "ip": request.client.host if request.client else "unknown"
            }
        )
        
        response.headers["X-Request-ID"] = trace_id
        return response

app.add_middleware(RequestLoggingMiddleware)

app.include_router(orchestration_router, prefix="/api/v1")

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ai-orchestrator"}

@app.get("/live")
def live_check():
    return {"status": "alive"}

@app.get("/ready")
def ready_check():
    return {"status": "ready"}
