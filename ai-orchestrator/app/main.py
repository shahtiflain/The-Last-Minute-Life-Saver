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
        # In a real app, you would iterate over active users from MongoDB.
        # For this milestone, we'll log the intention.
        # orchestrator = Orchestrator()
        # await orchestrator.run(OrchestratorRequest(user_id="system_cron", intent="watch"), trace_id=str(uuid.uuid4()))
        pass
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

app.include_router(orchestration_router, prefix="/api/v1")

@app.get("/health")
def health_check():
    return {"status": "healthy"}
