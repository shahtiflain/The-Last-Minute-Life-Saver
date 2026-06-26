from typing import Dict, Any, List
from app.api.schemas import MemoryUpdate

class RequestContext:
    """
    In-memory context scoped to a single orchestration request.
    Reduces repeated database reads during an orchestration cycle.
    """
    def __init__(self, user_id: str, trace_id: str):
        self.user_id = user_id
        self.trace_id = trace_id
        self.state: Dict[str, Any] = {}
        self.pending_updates: List[MemoryUpdate] = []

    def load_state(self, initial_state: Dict[str, Any]):
        """Load initial state fetched from MongoDB."""
        self.state.update(initial_state)

    def get(self, key: str, default: Any = None) -> Any:
        return self.state.get(key, default)

    def set(self, key: str, value: Any):
        self.state[key] = value

    def stage_update(self, update: MemoryUpdate):
        """Queue a database update to be flushed at the end of the request."""
        self.pending_updates.append(update)

    def get_pending_updates(self) -> List[MemoryUpdate]:
        return self.pending_updates
