# API Reference (AI Orchestrator)

The AI Orchestrator exposes a FastAPI REST interface strictly for internal service-to-service communication (Node.js backend → Python Orchestrator). 

## Authentication
All requests must include the `x-api-key` header.
- **Header**: `x-api-key`
- **Value**: Must match `INTERNAL_API_KEY` defined in `.env`.

---

## 1. Orchestrate Agents
The primary gateway for all AI reasoning.

- **Endpoint**: `POST /api/v1/orchestrate`
- **Description**: Evaluates the `intent` string, dynamically routes the request to the correct sequence of AI Agents, stages memory updates, and flushes them to MongoDB.

### Request Body (`OrchestratorRequest`)
```json
{
  "user_id": "string",
  "intent": "string", 
  "context": {
    "tasks": [],
    "fcm_token": "string"
  }
}
```
*Valid Intents*: `plan`, `analyze_risk`, `schedule`, `plan_and_schedule`, `plan_analyze_schedule`, `watch`.

### Response (`200 OK`)
Returns an array of `AgentResponse` objects representing the trace of what happened.

```json
[
  {
    "agent": "Planner",
    "version": "1.0",
    "timestamp": "2026-06-26T21:00:00Z",
    "traceId": "uuid-string",
    "status": "SUCCESS",
    "reasoning": "Tasks broken down successfully.",
    "confidence": 0.95,
    "result": { ... },
    "memory_updates": []
  }
]
```

### Errors
- `403 Forbidden`: Missing or invalid `x-api-key`.
- `422 Unprocessable Entity`: Malformed JSON body (caught by Pydantic).
- `500 Internal Server Error`: Agent execution failure or Gemini API timeout.

---

## 2. Approve Schedule
Syncs an LLM-generated schedule directly to the user's Google Calendar.

- **Endpoint**: `POST /api/v1/schedule/approve`
- **Description**: Consumes an array of `ScheduledBlock` items, instantiates the `CalendarTool`, and performs write operations to Google Calendar.

### Request Body (`ScheduleApproveRequest`)
```json
{
  "user_id": "string",
  "oauth_tokens": {
    "token": "string",
    "refresh_token": "string",
    "client_id": "string",
    "client_secret": "string"
  },
  "blocks": [
    {
      "title": "Fix Prod Bug",
      "startTime": "2026-06-27T09:00:00Z",
      "endTime": "2026-06-27T10:00:00Z"
    }
  ]
}
```

### Response (`200 OK`)
```json
{
  "status": "SUCCESS",
  "message": "Synced 1 blocks to Google Calendar.",
  "event_ids": ["google-event-id-123"]
}
```

### Errors
- `403 Forbidden`: Missing or invalid `x-api-key`.
- `500 Internal Server Error`: Calendar Sync Error (e.g., OAuth token revoked).
