from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "ai-orchestrator"}

def test_orchestrate_unauthorized():
    response = client.post("/api/v1/orchestrate", json={
        "user_id": "test_user",
        "intent": "plan"
    }, headers={"x-api-key": "invalid-key"})
    
    assert response.status_code == 401

# For testing success, we would need to mock the SharedMemory
# We'll keep it simple for now to verify the infrastructure.
