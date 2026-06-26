from motor.motor_asyncio import AsyncIOMotorClient
from app.config.ai_settings import settings
from app.memory.request_context import RequestContext
from app.utils.logger import get_logger

logger = get_logger(__name__)

class SharedMemory:
    """
    Interface to MongoDB.
    Loads context once at the start of a request, and persists updates at the end.
    """
    def __init__(self):
        self.client = AsyncIOMotorClient(settings.MONGO_URI)
        self.db = self.client[settings.MONGO_DB_NAME]

    async def initialize_context(self, user_id: str, trace_id: str) -> RequestContext:
        """Fetch all relevant user data and initialize the RequestContext."""
        logger.info(f"Loading shared memory for user {user_id}", extra={"trace_id": trace_id})
        
        # In a real scenario, this would fetch in parallel
        # For Milestone 4, this is the foundational pattern
        tasks_cursor = self.db.tasks.find({"userId": user_id, "status": {"$ne": "COMPLETED"}})
        goals_cursor = self.db.goals.find({"userId": user_id})
        
        tasks = await tasks_cursor.to_list(length=100)
        goals = await goals_cursor.to_list(length=100)

        context = RequestContext(user_id=user_id, trace_id=trace_id)
        context.load_state({
            "tasks": tasks,
            "goals": goals
        })
        
        return context

    async def flush_context(self, context: RequestContext):
        """Persist all staged updates to MongoDB in a single batch (conceptually)."""
        updates = context.get_pending_updates()
        if not updates:
            return

        logger.info(f"Flushing {len(updates)} updates to MongoDB", extra={"trace_id": context.trace_id})

        for update in updates:
            collection = self.db[update.collection]
            
            # Basic switch for different actions.
            # Real implementation would use BulkWrite for true batching
            try:
                if update.action == "create":
                    # Ensure userId is injected for security
                    doc = {**update.data, "userId": context.user_id}
                    await collection.insert_one(doc)
                elif update.action == "update":
                    if "_id" in update.data:
                        doc_id = update.data.pop("_id")
                        await collection.update_one(
                            {"_id": doc_id, "userId": context.user_id}, 
                            {"$set": update.data}
                        )
                elif update.action == "delete":
                    if "_id" in update.data:
                        await collection.delete_one({"_id": update.data["_id"], "userId": context.user_id})
            except Exception as e:
                logger.error(f"Failed to flush update to {update.collection}: {str(e)}", extra={"trace_id": context.trace_id})
