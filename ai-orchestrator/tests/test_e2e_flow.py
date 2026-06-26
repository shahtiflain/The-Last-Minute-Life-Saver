from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_orchestrate_e2e_flow():
    # Simulate a full E2E run of the orchestration loop
    # We mock the GeminiClient underneath in a real robust test, but here we'll 
    # just test the endpoint structure and authentication rejection.
    
    # 1. Test Unauthenticated Access
    response = client.post("/api/v1/orchestrate", json={
        "user_id": "test_user_1",
        "intent": "plan_and_schedule",
        "context": {"tasks": []}
    })
    assert response.status_code in [401, 403, 422], "Should reject missing API Key"

    # 2. Test Invalid API Key
    response = client.post("/api/v1/orchestrate", headers={"x-api-key": "invalid_key"}, json={
        "user_id": "test_user_1",
        "intent": "plan_and_schedule",
        "context": {"tasks": []}
    })
    assert response.status_code in [401, 403], f"Should reject invalid API Key, got {response.status_code}"
