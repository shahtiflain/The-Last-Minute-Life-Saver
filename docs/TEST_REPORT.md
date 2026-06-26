# Test Report

**Project**: Last-Minute Life Saver (AI Orchestrator)
**Status**: 100% Passing
**Framework**: `pytest`, `fastapi.testclient`

## 1. Unit Test Coverage
Unit tests validate the core internal mechanisms of the FastAPI application without invoking external HTTP/LLM calls.

* **Agent Registry (`test_api.py`)**: 
  * Verifies `AgentRegistry.get_all_agents_for_intent()` correctly maps string intents (e.g., `"plan"`, `"watch"`) to the correct array of Agent instances.
* **Schema Validation (`test_api.py`)**: 
  * Verifies Pydantic strict typing throws `ValidationError` when invalid shapes are provided to the API endpoints.

## 2. Integration Test Coverage
Integration tests validate the connections between our internal components.

* **Shared Memory Context**:
  * Validates that `RequestContext` correctly stages updates locally in memory, and only commits them when `flush_context()` is executed.
* **Notification Tool**:
  * Tests that `NotificationTool` falls back gracefully to `MOCK` mode when `FIREBASE_CREDENTIALS_PATH` is omitted, rather than crashing the server.

## 3. End-to-End (E2E) Coverage
E2E tests simulate raw user traffic hitting the network boundaries.

* **Orchestration Gateway (`tests/test_e2e_flow.py`)**:
  * Successfully verified `POST /api/v1/orchestrate`.
  * **Security Gate**: Asserted that passing requests without `x-api-key` results in `401/403/422` HTTP responses, successfully protecting the AI from public abuse.
  * **Invalid Key**: Asserted that passing an invalid API key string results in a `401/403` HTTP response.

## 4. Known Edge Cases Tested
* **Empty Task Lists**: Passing an empty context to the Planner does not crash; it safely returns an empty task list array.
* **Missing Firebase Keys**: Verified in development that the server does not crash if Firebase configuration is missing (degrades gracefully).
* **Missing Google OAuth**: The Calendar Tool correctly raises `HttpError` exceptions which are caught and formatted safely to HTTP 500s for the frontend to handle.
