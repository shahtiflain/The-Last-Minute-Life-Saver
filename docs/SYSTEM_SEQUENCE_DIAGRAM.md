# System Sequence Diagrams

These Mermaid sequence diagrams map out the critical paths for the AI Orchestrator.

## 1. Task Planning Flow
This flow handles the initial breakdown of raw user input into actionable, risk-analyzed tasks.

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant Node API
    participant FastAPI Orchestrator
    participant Shared Memory
    participant Planner Agent
    participant Risk Agent
    
    User->>Frontend: "Plan my week: CS homework and launch prep"
    Frontend->>Node API: POST /plan
    Node API->>FastAPI Orchestrator: POST /api/v1/orchestrate (intent: plan)
    
    FastAPI Orchestrator->>Shared Memory: Fetch user context
    FastAPI Orchestrator->>Planner Agent: execute(context, raw_input)
    Planner Agent->>Planner Agent: Call Gemini LLM
    Planner Agent-->>FastAPI Orchestrator: MemoryUpdate(tasks)
    FastAPI Orchestrator->>Shared Memory: stage_update(tasks)
    
    FastAPI Orchestrator->>Risk Agent: execute(context)
    Risk Agent->>Risk Agent: Call Gemini LLM
    Risk Agent-->>FastAPI Orchestrator: MemoryUpdate(risk_score)
    FastAPI Orchestrator->>Shared Memory: stage_update(risk_score)
    
    FastAPI Orchestrator->>Shared Memory: flush_context() (Write to MongoDB)
    FastAPI Orchestrator-->>Node API: AgentResponse[]
    Node API-->>Frontend: 200 OK (Tasks & Risk)
    Frontend-->>User: Display Task Breakdown
```

## 2. Scheduler Flow
This flow maps approved tasks to actual calendar time blocks.

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant FastAPI Orchestrator
    participant Calendar Tool
    participant Google API
    participant Scheduler Agent
    participant Shared Memory
    
    User->>Frontend: Click "Generate Schedule"
    Frontend->>FastAPI Orchestrator: POST /api/v1/orchestrate (intent: schedule)
    
    FastAPI Orchestrator->>Calendar Tool: get_free_busy()
    Calendar Tool->>Google API: Fetch existing busy blocks
    Google API-->>Calendar Tool: Busy slots
    
    FastAPI Orchestrator->>Scheduler Agent: execute(context + free_slots)
    Scheduler Agent->>Scheduler Agent: Call Gemini LLM (Calendar Tetris)
    Scheduler Agent-->>FastAPI Orchestrator: MemoryUpdate(focus_blocks: PENDING_APPROVAL)
    FastAPI Orchestrator->>Shared Memory: flush_context()
    
    FastAPI Orchestrator-->>Frontend: ScheduleOption[]
    
    User->>Frontend: Approve Schedule Option A
    Frontend->>FastAPI Orchestrator: POST /api/v1/schedule/approve
    FastAPI Orchestrator->>Calendar Tool: insert_event(blocks)
    Calendar Tool->>Google API: Write events
    FastAPI Orchestrator-->>Frontend: 200 OK (Synced)
```

## 3. Watcher Notification Flow (AI Guardian)
This background flow monitors the user and dispatches intelligent nudges via Firebase.

```mermaid
sequenceDiagram
    participant APScheduler (Cron)
    participant FastAPI Orchestrator
    participant Watcher Agent
    participant Calendar Tool
    participant Notification Tool
    participant FCM (Firebase)
    actor User Device
    
    APScheduler->>FastAPI Orchestrator: Trigger run_watcher_job() (Every 15m)
    
    FastAPI Orchestrator->>Calendar Tool: Check for manual calendar overrides
    Calendar Tool-->>FastAPI Orchestrator: Calendar State
    
    FastAPI Orchestrator->>Watcher Agent: execute(context + calendar_state)
    Watcher Agent->>Watcher Agent: Evaluate progress vs elapsed time
    Watcher Agent->>Watcher Agent: Evaluate emotional intelligence (Past notifications)
    Watcher Agent-->>FastAPI Orchestrator: MemoryUpdate(notification_intent)
    
    FastAPI Orchestrator->>Notification Tool: dispatch(staged_notifications)
    Notification Tool->>FCM: send_notification(payload)
    FCM-->>User Device: Push Notification ("Looks like you're stuck, need help?")
```
