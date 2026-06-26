# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

---

# Project Information

**Project Name:** The Last-Minute Life Saver

**Version:** 2.0

**Status:** Approved for Architecture Phase

---

# Purpose

This Software Requirements Specification defines the functional and technical behavior of The Last-Minute Life Saver.

This document translates the Product Requirements Document (PRD) into precise software requirements that guide architecture, implementation, testing, and deployment.

This document is the primary reference for implementation.

---

# Technology Stack

## Frontend

* React
* Vite
* Tailwind CSS
* TypeScript

## Backend

* Node.js
* Express.js

## Artificial Intelligence

* Google Gemini API
* Google Antigravity SDK
* Multi-Agent Orchestration

## Database

* MongoDB Atlas

## Authentication

* Firebase Authentication

## Calendar Integration

* Google Calendar API

## Notifications

* Firebase Cloud Messaging

## Deployment

Frontend:
Firebase Hosting

Backend:
Google Cloud Run

---

# System Overview

The application consists of six logical layers.

```
Frontend (React)

↓

Express Backend

↓

Antigravity Orchestrator

↓

Planner Agent
Scheduler Agent
Risk Agent
Context Agent
Reminder Agent
Coach Agent
Reflection Agent
Execution Agent

↓

Shared Memory

↓

MongoDB + Firebase + Google APIs
```

Each agent performs a single responsibility while sharing context through the orchestrator.

---

# User Role

## User

Users can

* Register
* Login
* Connect Google Calendar
* Create Tasks
* Edit Tasks
* Delete Tasks
* Complete Tasks
* Manage Habits
* View Dashboard
* Receive AI Suggestions
* Accept or Reject AI Recommendations

No administrator panel is included in the MVP.

Administrative tooling is considered future scope.

---

# Functional Requirements

## Authentication

The system shall support

* Email & Password Login
* Google Sign-In
* Secure Session Management
* Password Reset
* Email Verification
* Logout

Validation Rules

* Email must be unique.
* Passwords must satisfy the defined security policy.
* Authentication failures must never expose sensitive information.

---

## Dashboard

The dashboard shall present

* Today's Focus
* AI Priority Queue
* Calendar Timeline
* Upcoming Deadlines
* Deadline Risk Score
* Productivity Score
* Habit Progress
* AI Insights
* Focus Sessions

Dashboard data updates automatically whenever user data changes.

---

## Task Management

Users shall be able to

* Create Tasks
* Edit Tasks
* Delete Tasks
* Archive Tasks
* Restore Tasks
* Duplicate Tasks
* Add Subtasks
* Add Notes
* Upload Attachments
* Estimate Effort
* Set Deadlines
* Assign Priority
* Categorize Tasks

Each task stores

* Title
* Description
* Priority
* Estimated Duration
* Deadline
* Category
* Status
* Progress
* AI Suggestions
* Completion Probability
* Risk Score

---

## Google Calendar

The system shall

* Connect user calendars
* Read events
* Display events
* Detect scheduling conflicts
* Create AI Focus Sessions
* Recommend schedule improvements

The system must never overwrite user events without confirmation.

---

# AI Multi-Agent Requirements

## Planner Agent

Responsibilities

* Analyze workload
* Break tasks into subtasks
* Estimate effort
* Generate execution plans

---

## Scheduler Agent

Responsibilities

* Find available calendar slots
* Schedule focus sessions
* Balance workload
* Resolve conflicts

---

## Risk Prediction Agent

Responsibilities

Predict

* missed deadlines
* workload overload
* procrastination risk

Output

* Completion Probability
* Risk Score
* Suggested Action

---

## Context Agent

Continuously evaluates

* Calendar
* Time
* Task Progress
* Priority
* User Preferences
* Historical Productivity

The Context Agent determines when recommendations should be generated.

---

## Reminder Intelligence Agent

Instead of fixed reminders,

the agent decides

* Should the user be reminded?
* Is now the correct time?
* Should the reminder be delayed?
* Should the reminder be escalated?

---

## Productivity Coach Agent

Provides

* Daily coaching
* Weekly review
* Habit suggestions
* Productivity insights
* Burnout prevention tips

---

## Reflection Agent

At the end of each day

collects

* completed work
* missed work
* obstacles
* achievements

and improves future planning.

---

## Execution Agent

Helps users begin work.

Examples

* Assignment outline
* Email draft
* Study plan
* Meeting agenda
* Research starter
* Checklist generation

The agent prepares work but never submits or performs irreversible actions without user approval.

---

# Explainable AI Requirements

Every recommendation must include

* Why this recommendation?
* Why now?
* Expected benefit
* Estimated effort
* Confidence level
* Alternative actions

Users must always understand why the AI made a decision.

---

# Validation Rules

Every form validates

* Required fields
* Data type
* Date format
* Maximum length
* Duplicate entries
* File size
* Invalid characters

Validation must occur on both client and server.

---

# Error Handling

The application shall

* Display friendly error messages
* Log internal errors
* Never expose stack traces
* Suggest recovery actions where possible

---

# Security Requirements

Every feature shall include

* Firebase Authentication
* Authorization checks
* Input sanitization
* Protection against XSS
* Protection against NoSQL Injection
* CSRF protection where applicable
* Rate limiting
* Secure environment variables
* Secure token handling

---

# Notification Rules

Notifications must never rely only on time.

Before notifying,

the AI must evaluate

* Current workload
* Calendar
* Deadline proximity
* Progress
* Risk Score
* User activity
* Historical behavior

Example

❌ "Assignment due tomorrow."

✅ "Your completion probability has dropped to 58%. Starting a 45-minute focus session now will keep you on schedule."

---

# Accessibility

The application shall support

* Keyboard navigation
* Screen readers
* High contrast
* Accessible forms
* Responsive layouts
* Mobile devices

Accessibility should be verified throughout development rather than added at the end.

---

# Performance Requirements

* Fast initial page load
* Responsive interactions
* Efficient database queries
* Lazy-loaded frontend modules
* Background AI processing
* Loading states for AI operations
* Pagination for large datasets

---

# Logging

The system shall log

* Authentication events
* AI recommendations
* Calendar synchronization
* Task changes
* Errors

Logs must never contain passwords, tokens, or private user information.

---

# Business Rules

The AI assists users.

The AI does not replace users.

The AI never performs destructive or irreversible actions without explicit confirmation.

Every recommendation remains optional.

---

# Acceptance Criteria

The software is considered ready for implementation when

✓ Authentication works correctly.

✓ Task management is fully functional.

✓ Google Calendar synchronization succeeds.

✓ AI Planner generates execution plans.

✓ Risk Prediction calculates completion probability.

✓ Context-aware reminders function correctly.

✓ AI recommendations are explainable.

✓ Security validation passes.

✓ Responsive layouts work on mobile, tablet, and desktop.

✓ Documentation remains synchronized with implementation.

---

# Future Scope

The following features are intentionally excluded from the MVP.

* Administrator Portal
* Team Collaboration
* Smartwatch Support
* Offline AI
* Browser Extensions
* Desktop Application
* Third-party Team Integrations

These may be implemented after the MVP is completed.
