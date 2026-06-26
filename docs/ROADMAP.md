# EXECUTION ROADMAP

---

# Project Information

**Project Name:** The Last-Minute Life Saver

**Version:** 2.0 (Final)

**Status:** Ready for Development

**Target Stack:**

* React + Vite + TypeScript + Tailwind CSS
* Node.js + Express.js
* Python (Google Antigravity SDK + Gemini)
* MongoDB Atlas
* Firebase Authentication
* Firebase Cloud Messaging
* Google Calendar API

---

# Development Philosophy

This project follows an incremental milestone-based development process.

## Rules

* Read all specification documents before coding.
* Implement only one milestone at a time.
* Never skip milestones.
* Never redesign the documented architecture.
* Never implement features outside the current milestone.
* Stop after every milestone and wait for human approval.

Documentation is the source of truth.

---

# Required Reading Order

Before implementation, the AI must read:

1. MASTER_PROMPT.md
2. docs/PRD.md
3. docs/SRS.md
4. docs/ARCHITECTURE.md
5. docs/DATABASE.md
6. docs/ROADMAP.md

If conflicts exist, stop and report them before coding.

---

# Development Workflow

For every milestone:

1. Read relevant specifications.
2. Create a short implementation plan.
3. Identify risks and dependencies.
4. Implement only the approved scope.
5. Run linting.
6. Run type checking.
7. Test locally.
8. Fix issues.
9. Update documentation if required.
10. Stop and wait for approval.

No milestone is complete until the Quality Gate passes.

---

# Milestone 1 — Foundation & Authentication

## Goal

Create the project foundation and secure authentication.

### Backend

* Initialize Express.js project
* Configure TypeScript
* Configure ESLint & Prettier
* Configure environment variables
* Configure logging
* Create base API structure

### Frontend

* Initialize React + Vite
* Configure Tailwind CSS
* Configure routing
* Configure shared layout
* Configure environment variables

### Authentication

* Initialize Firebase
* Google Sign-In
* Email & Password authentication
* Protected routes
* Session persistence
* Logout

### Exit Criteria

* Project runs successfully
* User can register
* User can log in
* User can log out
* Protected routes work
* No lint/type errors

---

# Milestone 2 — Database & Backend API

## Goal

Build the backend foundation.

### Tasks

* Connect MongoDB Atlas
* Configure Mongoose
* Implement schemas from DATABASE.md
* Create indexes
* Build Firebase JWT verification middleware
* Create global error handler
* Create validation middleware

### REST APIs

Implement CRUD for:

* Users
* Tasks
* Goals
* Habits

### Exit Criteria

* Database connected
* CRUD works
* Unauthorized requests rejected
* Validation enforced
* Error handling implemented

---

# Milestone 3 — Frontend MVP

## Goal

Create a usable productivity application.

### Pages

* Login
* Dashboard
* Tasks
* Goals
* Habits
* Calendar
* Settings

### Features

* Create Task
* Edit Task
* Delete Task
* Complete Task
* View Dashboard
* Responsive UI

### Exit Criteria

Users can manage their productivity without AI features.

---

# Milestone 4 — AI Orchestrator Foundation

## Goal

Initialize the AI architecture.

### Tasks

* Create Python AI service
* Configure Antigravity SDK
* Connect Gemini API
* Create Orchestrator class
* Implement Agent interface
* Implement Shared Memory interface
* Define Agent response contract
* Expose backend endpoint for AI requests

### Exit Criteria

Node backend successfully communicates with the AI Orchestrator.

---

# Milestone 5 — Planner & Risk Analyzer

## Goal

Implement intelligent planning.

### Planner Agent

* Parse natural language input
* Create structured tasks
* Estimate effort
* Suggest priorities

### Risk Analyzer

* Calculate completion probability
* Predict overdue tasks
* Generate risk scores

### Shared Memory

* Planner writes to Shared Memory
* Risk Analyzer reads updated state
* AI recommendations stored in MongoDB

### Exit Criteria

A user can enter a natural language task and receive structured tasks with risk analysis.

---

# Milestone 6 — Google Integration & Scheduler

## Goal

Enable AI-assisted scheduling.

### Google Calendar

* Connect Calendar API
* Read user availability
* Detect conflicts

### Scheduler Agent

* Find available focus blocks
* Suggest schedules
* Respect working hours
* Avoid conflicts

### Frontend

* Display schedule suggestions
* Accept suggestion
* Reject suggestion

### Human-in-the-Loop

The Scheduler must never modify the user's calendar automatically.

Calendar changes require explicit user approval.

### Exit Criteria

The AI successfully suggests a focus session based on calendar availability.

---

# Milestone 7 — Context, Reminder & Reflection

## Goal

Deliver proactive productivity assistance.

### Context Agent

Analyze

* Current workload
* Calendar
* User activity
* Task progress
* Risk score

### Reminder Agent

Decide

* Should a reminder be sent?
* When?
* Priority?

### Reflection Agent

Generate

* Daily summary
* Weekly review
* Productivity insights
* Habit improvements

### Notifications

Integrate Firebase Cloud Messaging.

### Exit Criteria

The application delivers context-aware reminders and generates daily reflections.

---

# Milestone 8 — Polish & Deployment

## Goal

Prepare for hackathon judging.

### Testing

* End-to-end testing
* Authentication testing
* AI workflow testing
* Responsive testing
* Accessibility testing

### Performance

* Optimize frontend
* Optimize backend
* Optimize database queries

### Deployment

Frontend

* Firebase Hosting

Backend

* Google Cloud Run

Database

* MongoDB Atlas

### Demo Preparation

Prepare

* Seed demo data
* Demo user account
* Judge walkthrough
* Presentation screenshots
* Backup demo scenario

### Exit Criteria

* Application deployed
* Demo workflow verified
* All core user journeys function correctly

---

# AI Development Order

Agents must be implemented in this sequence:

1. Orchestrator
2. Planner
3. Risk Analyzer
4. Scheduler
5. Context Agent
6. Reminder Agent
7. Reflection Agent
8. Executor (optional stretch goal)

Each agent must pass testing before the next agent begins.

---

# Git Workflow

* One feature branch per milestone
* Atomic commits
* Meaningful commit messages
* Pull request before merge (if working in a team)
* Tag stable milestone releases

---

# Quality Gate

Every milestone must satisfy:

* Build succeeds
* Type checking passes
* Lint passes
* Tests pass
* Security validation passes
* Responsive UI verified
* Documentation updated
* No critical bugs

If any item fails, fix it before moving to the next milestone.

---

# MVP Completion Criteria

The MVP is complete when:

* Users authenticate securely.
* Tasks, goals, and habits are fully functional.
* Google Calendar integration works.
* AI Planner generates structured execution plans.
* Risk Analyzer predicts deadline risk.
* Scheduler suggests focus sessions.
* Context-aware reminders are delivered.
* Dashboard displays meaningful productivity insights.
* Application is deployed and ready for judging.

---

# Stretch Goals

Implement only if the MVP is complete.

* Executor Agent
* Voice interaction
* AI meeting assistant
* Email drafting
* Team collaboration
* Offline support
* Browser extension
* Mobile application

---

# Final Principle

Build a working, polished MVP before adding advanced features.

A complete and reliable product scores higher than an ambitious but unfinished one.

Quality, usability, and demonstration readiness take priority over feature count.
