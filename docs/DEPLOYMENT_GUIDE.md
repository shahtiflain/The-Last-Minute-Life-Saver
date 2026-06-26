# Deployment Guide

This guide details how to deploy the entire Last-Minute Life Saver stack, focusing on the AI Orchestrator.

## 1. Local Setup
Requirements: Node.js 18+, Python 3.13+, MongoDB.

1. **Database**: Spin up a local MongoDB instance or grab a MongoDB Atlas connection string.
2. **Environment Variables**: Copy `.env.example` to `.env` in all three workspaces (`backend`, `frontend`, `ai-orchestrator`) and fill in your secrets.
3. **Run AI Orchestrator**:
   ```bash
   cd ai-orchestrator
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```
4. **Run Node Backend**: `cd backend && npm run dev`
5. **Run React Frontend**: `cd frontend && npm run dev`

## 2. Docker Setup (AI Orchestrator)
A production-ready `Dockerfile` is provided in `ai-orchestrator/`.
```bash
cd ai-orchestrator
docker build -t antigravity-ai .
docker run -p 8000:8000 --env-file .env antigravity-ai
```

## 3. Production Deployment
We recommend the following PAAS architecture:
* **Frontend (React)**: Vercel or Netlify.
* **Backend (Node.js)**: Render or Heroku.
* **AI Orchestrator (FastAPI)**: Render (using the Dockerfile) or AWS App Runner.

## 4. Environment Variables Required
The production `.env` must contain:
```ini
GEMINI_API_KEY=xxx
INTERNAL_API_KEY=super_secret_key_matching_the_node_backend
MONGO_URI=mongodb+srv://...
FIREBASE_CREDENTIALS_PATH=/etc/secrets/serviceAccountKey.json
ENV=prod
```

## 5. Firebase Configuration
To enable the AI Guardian push notifications:
1. Go to the Firebase Console -> Project Settings -> Service Accounts.
2. Generate a new private key (`.json`).
3. In your deployment provider (e.g., Render), upload this JSON file as a "Secret File" and map `FIREBASE_CREDENTIALS_PATH` to its path.

## 6. MongoDB Atlas Configuration
1. Create a Serverless Database on MongoDB Atlas.
2. Under Network Access, whitelist the IP addresses of your Node.js and FastAPI hosting providers (or allow `0.0.0.0/0` if using dynamic IPs, though peering is safer).
3. Grab the connection string for `MONGO_URI`.

## 7. Google Calendar OAuth Configuration
1. Go to Google Cloud Console. Enable the **Google Calendar API**.
2. Setup the **OAuth Consent Screen**.
3. Create OAuth 2.0 Client IDs. Provide the frontend with the Client ID to perform the login flow.
4. The frontend will pass the resulting access/refresh tokens to the backend, which are injected into the Orchestrator's API payload.
