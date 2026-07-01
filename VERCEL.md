# Frontend Deployment: Vercel

This guide outlines how to deploy the Hustlr React/Vite frontend to Vercel.

## 1. Prerequisites
- A GitHub repository containing the Hustlr code.
- A free Vercel account linked to your GitHub.

## 2. Deployment Steps
1. Log into your [Vercel Dashboard](https://vercel.com/).
2. Click **Add New...** -> **Project**.
3. Import your Hustlr GitHub repository.
4. **Important Configuration:**
   - **Framework Preset:** Vite
   - **Root Directory:** Click "Edit" and select `frontend`.
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

## 3. Environment Variables
Before clicking "Deploy", expand the **Environment Variables** section and add the following keys. 

*(Get the Firebase values from your Firebase Console, and the Google Client ID from Google Cloud Console. Set VITE_API_URL to your deployed Backend URL later).*

- `VITE_API_URL` (e.g., https://hustlr-backend-production.up.railway.app)
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_VAPID_KEY`
- `VITE_GOOGLE_CLIENT_ID`

5. Click **Deploy**. Vercel will build the frontend and provide you with a live URL!

## 4. Post-Deployment
Once Railway provides your Backend URL, come back to the Vercel Dashboard, go to **Settings > Environment Variables**, update `VITE_API_URL`, and click **Deployments > Redeploy**.
