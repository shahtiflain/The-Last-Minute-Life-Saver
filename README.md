# Antigravity Project

## Project Overview
This is a monorepo-style project designed to provide a robust foundation for an AI-powered application. It integrates a modern frontend, a scalable backend, and a dedicated AI orchestration layer.

## Problem Statement
The project aims to solve complex business problems by integrating generative AI capabilities into a seamless, full-stack web application. The separation of concerns between standard business logic and AI orchestration allows for scalability and maintainability.

## Tech Stack
- **Frontend**: React, Vite, TypeScript
- **Backend**: Node.js, Express, TypeScript
- **AI Orchestrator**: Python, FastAPI, Google GenAI
- **Shared Library**: TypeScript for shared schemas and types

## Folder Structure
```text
.
├── ai-orchestrator/   # Python/FastAPI service for AI models and complex logic
├── backend/           # Node.js/Express API for business logic and data access
├── frontend/          # React/Vite web application
├── shared/            # Shared TypeScript types, schemas, and utilities
└── docs/              # Project documentation (e.g., SRS)
```

## Setup Instructions
1. Install dependencies for the TypeScript workspaces:
   - `cd backend && npm install`
   - `cd frontend && npm install`
   - `cd shared && npm install`
2. Install Python dependencies for the AI orchestrator:
   - `cd ai-orchestrator`
   - `pip install -r requirements.txt`

## Environment Variables Required
You will need to configure environment variables. Check the `.env.example` files in each directory:
- `backend/.env.example`
- `frontend/.env.example`
- `ai-orchestrator/.env.example`

## Development Workflow
To run the services locally in development mode:
- **Frontend**: `cd frontend && npm run dev`
- **Backend**: `cd backend && npm run dev`
- **AI Orchestrator**: `cd ai-orchestrator && python -m uvicorn main:app --reload`

## Architecture Summary
The system consists of a React frontend communicating with a Node.js backend. The Node.js backend acts as the main gateway and handles standard business logic, database interaction, and authentication. For AI-specific tasks, the backend communicates with the Python-based AI Orchestrator service.

## Current Milestone Status
**Milestone 1: Project Foundation - Completed**
- Initialized all project directories (`frontend`, `backend`, `ai-orchestrator`, `shared`).
- Configured foundational tooling (TypeScript, ESLint, Vite, Python requirements).
- Set up root-level configurations (`.gitignore`, `README.md`).
- Established basic server health-check endpoints.
