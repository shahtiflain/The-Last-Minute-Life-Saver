from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.api.routes import router as orchestration_router
from app.utils.logger import get_logger
from app.agents.agent_registry import register_default_agents

logger = get_logger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up AI Orchestrator service...")
    register_default_agents()
    yield
    logger.info("Shutting down AI Orchestrator service...")

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
