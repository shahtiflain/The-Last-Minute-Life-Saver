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

    def _serialize_doc(self, doc: dict) -> dict:
        if "_id" in doc:
            doc["_id"] = str(doc["_id"])
        return doc

    async def initialize_context(self, user_id: str, trace_id: str) -> RequestContext:
        """Fetch all relevant user data and initialize the RequestContext."""
        logger.info(f"Loading shared memory for user {user_id}", extra={"trace_id": trace_id})
        
        user_doc = await self.db.users.find_one({"userId": user_id})
        
        # Extract FCM Token for Watcher Agent
        fcm_token = user_doc.get("fcmToken") if user_doc else None
        
        # Extract and decrypt Google Calendar tokens
        calendar_tokens = None
        if user_doc and "connectedAccounts" in user_doc and "googleCalendar" in user_doc["connectedAccounts"]:
            gcal = user_doc["connectedAccounts"]["googleCalendar"]
            if isinstance(gcal, dict) and "encrypted" in gcal:
                import base64, json
                from cryptography.hazmat.primitives.ciphers.aead import AESGCM
                try:
                    key = base64.b64decode(settings.ENCRYPTION_KEY)
                    parts = gcal["encrypted"].split(":")
                    if len(parts) == 3:
                        iv, tag, ciphertext = map(base64.b64decode, parts)
                        aesgcm = AESGCM(key)
                        decrypted = aesgcm.decrypt(iv, ciphertext + tag, None)
                        calendar_tokens = json.loads(decrypted.decode("utf-8"))
                except Exception as e:
                    logger.error(f"Failed to decrypt calendar tokens: {e}", extra={"trace_id": trace_id})
            else:
                calendar_tokens = gcal # fallback for unencrypted tokens during testing

        tasks_cursor = self.db.tasks.find({"userId": user_id, "status": {"$ne": "COMPLETED"}})
        goals_cursor = self.db.goals.find({"userId": user_id})
        
        tasks = [self._serialize_doc(t) for t in await tasks_cursor.to_list(length=100)]
        goals = [self._serialize_doc(g) for g in await goals_cursor.to_list(length=100)]

        context = RequestContext(user_id=user_id, trace_id=trace_id)
        context.load_state({
            "tasks": tasks,
            "goals": goals,
            "calendar_tokens": calendar_tokens,
            "fcm_token": fcm_token
        })
        
        return context

    async def flush_context(self, context: RequestContext):
        """Persist all staged updates to MongoDB in a single batch (conceptually)."""
        updates = context.get_pending_updates()
        if not updates:
            return

        logger.info(f"Flushing {len(updates)} updates to MongoDB", extra={"trace_id": context.trace_id})

        from bson.objectid import ObjectId
        
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
                        query_id = ObjectId(doc_id) if isinstance(doc_id, str) and len(doc_id) == 24 else doc_id
                        await collection.update_one(
                            {"_id": query_id, "userId": context.user_id}, 
                            {"$set": update.data}
                        )
                elif update.action == "delete":
                    if "_id" in update.data:
                        doc_id = update.data["_id"]
                        query_id = ObjectId(doc_id) if isinstance(doc_id, str) and len(doc_id) == 24 else doc_id
                        await collection.delete_one({"_id": query_id, "userId": context.user_id})
            except Exception as e:
                logger.error(f"Failed to flush update to {update.collection}: {str(e)}", extra={"trace_id": context.trace_id})
