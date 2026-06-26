# SOFTWARE ARCHITECTURE DOCUMENT

---

# Project Information

**Project Name:** The Last-Minute Life Saver

**Version:** 2.0

**Architecture Style:** Clean Architecture + Event-Driven + Multi-Agent Orchestration

**Status:** Approved

---

# Architecture Goals

The architecture is designed to satisfy the following objectives.

* Production-ready structure
* High Agentic Depth
* Modular AI architecture
* Explainable AI
* Human-in-the-Loop control
* Scalability
* Security
* Maintainability
* Testability
* Future extensibility

Every architectural decision must improve one or more of these objectives.

---

# Core Design Principles

The application follows:

* Clean Architecture
* SOLID Principles
* Feature-Based Organization
* Event-Driven Processing
* Human-in-the-Loop AI
* Shared Memory Pattern
* Orchestrator Pattern
* Separation of Concerns

The AI never bypasses user approval for irreversible actions.

---

# Technology Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

Responsibilities

* Dashboard
* Task Management
* Calendar Interface
* AI Chat
* Notifications
* Analytics
* User Interaction

---

## Backend

Node.js + Express.js

Responsibilities

* REST API
* Authentication
* Business Logic
* Validation
* Database Access
* External API Integration
* AI Service Communication

---

## AI Service

Google Antigravity SDK + Gemini API

The AI layer is responsible for:

* reasoning
* planning
* scheduling
* coaching
* risk prediction
* execution assistance

The AI layer should be deployable either:

* as an independent Python service (recommended production architecture), or
* within the backend for the hackathon MVP if deployment simplicity is preferred.

The external interface between the backend and AI layer should remain stable regardless of deployment choice.

---

## Database

MongoDB Atlas

Responsibilities

* User profiles
* Tasks
* Goals
* Habits
* AI memory
* Recommendations
* Reflection history
* Analytics

---

## Authentication

Firebase Authentication

Supports

* Google Sign-In
* Email & Password
* Secure identity verification

---

## Notifications

Firebase Cloud Messaging

Supports

* Context-aware reminders
* Focus session alerts
* Deadline warnings

---

## Calendar

Google Calendar API

Supports

* Reading events
* Suggesting focus sessions
* Detecting conflicts
* Creating proposed schedule blocks (user confirmation required)

---

# High-Level System Architecture

```text
                      USER
                        │
                        ▼
               React Frontend
                        │
                        ▼
               Express REST API
                        │
                        ▼
               AI Orchestrator
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
    Planner        Scheduler      Risk Analyzer
        ▼               ▼               ▼
 Context & Reminder   Coach & Reflection   Executor
                        │
                        ▼
                  Shared Memory
                        │
      ┌───────────┬────────────┬──────────────┐
      ▼           ▼            ▼
 MongoDB     Firebase Auth   Google Calendar
                        │
                        ▼
                    Gemini API
```

---

# Orchestrator Pattern

The AI Orchestrator is the central intelligence of the platform.

Responsibilities:

* Receive AI requests from the backend.
* Analyze user intent.
* Determine which specialist agents are required.
* Execute agents in the correct sequence.
* Merge outputs.
* Resolve conflicting recommendations.
* Update shared memory.
* Return one unified response to the backend.

No specialist agent communicates directly with another specialist agent.

All coordination occurs through the Orchestrator.

---

# Specialist Agents

The system consists of six specialist agents.

## Planner Agent

Responsibilities

* Break complex work into subtasks.
* Estimate effort.
* Generate execution plans.
* Prioritize tasks.

Outputs

* Task plan
* Estimated duration
* Priority
* Dependencies

---

## Scheduler Agent

Responsibilities

* Analyze calendar availability.
* Create focus sessions.
* Resolve scheduling conflicts.
* Balance workload.

Outputs

* Suggested schedule
* Calendar recommendations

---

## Risk Analyzer

Responsibilities

Predict

* missed deadlines
* workload overload
* procrastination

Outputs

* Risk Score
* Completion Probability
* Recommended action

---

## Context & Reminder Agent

Responsibilities

Evaluate

* calendar
* current activity
* workload
* historical behavior
* urgency

Determine

* whether to notify
* when to notify
* notification priority

---

## Coach & Reflection Agent

Responsibilities

* Daily coaching
* Weekly review
* Habit insights
* Productivity feedback
* Reflection summaries
* Future planning improvements

---

## Executor Agent

Responsibilities

Prepare work for users.

Examples

* Assignment outline
* Email draft
* Meeting agenda
* Checklist
* Study plan
* Research summary

The Executor operates in **read and draft mode** by default.

It must never perform destructive or irreversible actions without explicit user confirmation.

---

# Shared Memory Pattern

All specialist agents exchange information through Shared Memory.

Shared Memory stores:

* User Profile
* Current Tasks
* Calendar Context
* Goal State
* Habit State
* Risk History
* AI Recommendations
* Reflection History
* Productivity Metrics

Benefits

* Loose coupling
* Better debugging
* Easier testing
* Consistent context
* Future scalability

---

# Event-Driven Workflow

The architecture follows an event-driven model.

Example:

Task Created

↓

Planner Agent

↓

Plan Generated

↓

Shared Memory Updated

↓

Scheduler Agent

↓

Schedule Generated

↓

Shared Memory Updated

↓

Risk Analysis

↓

Recommendation Generated

↓

Context Evaluation

↓

Notification Decision

↓

Response Returned

Agents communicate through events and shared state rather than direct dependencies.

---

# AI Response Contract

Every specialist agent returns a standardized response.

Fields include:

* Agent Name
* Status
* Reasoning
* Confidence Score
* Memory Updates
* Suggested Next Action

This standardization simplifies orchestration and debugging.

---

# Security Architecture

* Frontend never communicates directly with MongoDB.
* Frontend never accesses Gemini directly.
* All requests pass through authenticated backend APIs.
* Firebase JWTs secure user identity.
* Backend validates authorization before invoking AI services.
* Secrets remain server-side.
* AI cannot bypass authorization rules.

---

# Human-in-the-Loop

The AI may

* Recommend
* Explain
* Plan
* Prepare
* Optimize

The AI may not

* Delete user data
* Send emails
* Modify calendars
* Execute irreversible actions

without explicit user confirmation.

Human approval always overrides AI recommendations.

---

# Scalability

The architecture supports:

* Additional specialist agents
* New external integrations
* Independent AI service deployment
* Horizontal backend scaling
* Future team collaboration features

The Orchestrator and standardized agent contract ensure new capabilities can be added without redesigning the system.
