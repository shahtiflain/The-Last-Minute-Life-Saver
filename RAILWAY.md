# Backend & AI Orchestrator Deployment: Railway

Railway is a fantastic Platform-as-a-Service that can seamlessly run long-running Node.js servers and Python applications (including background tasks like APScheduler) for free.

## 1. Prerequisites
- A GitHub repository containing the Hustlr code.
- A free [Railway.app](https://railway.app/) account linked to your GitHub.

## 2. Deploying the Backend
1. Log into the Railway Dashboard and click **New Project** > **Deploy from GitHub repo**.
2. Select your Hustlr repository.
3. Click **Add Variables** (do not deploy yet).
4. Go to **Settings** for this service:
   - **Root Directory:** Set this to `/backend`.
   - **Start Command:** Set to `npm start`.
5. Go to **Variables** and add the Backend environment variables:
   - `PORT` (e.g., 3000)
   - `MONGODB_URI`
   - `FRONTEND_URL` (Your Vercel URL)
   - `AI_SERVICE_URL` (Your AI Orchestrator URL, add this later)
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `ENCRYPTION_KEY`
   - `INTERNAL_API_KEY`
6. Click **Deploy**. Go to the **Settings > Networking** tab and click **Generate Domain**.

## 3. Deploying the AI Orchestrator
1. Inside the same Railway Project, click the **+ Create** button > **GitHub Repo** and select the Hustlr repo again.
2. Go to **Settings** for this new service:
   - **Root Directory:** Set this to `/ai-orchestrator`.
   - **Start Command:** Set to `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
3. Go to **Variables** and add the AI Orchestrator environment variables:
   - `PORT` (e.g., 8000)
   - `MONGODB_URI`
   - `GEMINI_API_KEY`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `INTERNAL_API_KEY`
4. Click **Deploy**. Go to the **Settings > Networking** tab and click **Generate Domain**.

## 4. Connecting Them
1. Once both services have generated domains, copy the **AI Orchestrator** domain (e.g., `https://hustlr-ai-production.up.railway.app`).
2. Go back to the **Backend** service > **Variables** and set `AI_SERVICE_URL` to that domain.
3. Railway will automatically redeploy the Backend.
4. Finally, take the **Backend** domain and put it into your Vercel `VITE_API_URL` setting!
