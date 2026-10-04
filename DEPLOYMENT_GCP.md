# Google Cloud Run Deployment Guide

This guide provides step-by-step instructions for deploying Hustlr to Google Cloud Run, utilizing Google Secret Manager for secure environment variables and setting up custom domains.

## Prerequisites
- Google Cloud CLI (`gcloud`) installed and configured.
- Docker installed and running.
- A Google Cloud Project with billing enabled.

## 1. Project Setup
Set your project ID and configure your environment:
```bash
gcloud config set project YOUR_PROJECT_ID
gcloud services enable run.googleapis.com secretmanager.googleapis.com artifactregistry.googleapis.com
```

## 2. Google Secret Manager Configuration
Do NOT store secrets in your Docker image or GitHub repository. We will use Google Secret Manager to securely pass them to Cloud Run.

### Create Secrets
Create the following secrets in Secret Manager:
```bash
# Repeat for each secret
echo -n "your_secret_value" | gcloud secrets create hustlr_mongodb_uri --data-file=-
echo -n "your_secret_value" | gcloud secrets create hustlr_gemini_key --data-file=-
echo -n "your_secret_value" | gcloud secrets create hustlr_firebase_admin --data-file=-
```

### Required Secrets Checklist
- `hustlr_mongodb_uri` (MongoDB Atlas URI)
- `hustlr_gemini_key` (Google Gemini API Key)
- `hustlr_firebase_admin` (Firebase Service Account JSON as string)
- `hustlr_google_oauth` (OAuth Client Secret)
- `hustlr_encryption_key` (Secure key for internal encryption)

### Grant Access
Grant the default Compute Engine service account (used by Cloud Run) access to read these secrets:
```bash
gcloud secrets add-iam-policy-binding hustlr_mongodb_uri \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

## 3. GitHub Actions (CI/CD)
The project includes a `.github/workflows/deploy.yml` file. This workflow automatically builds and deploys your containers to Cloud Run when you push to the `main` branch.

To enable this:
1. Setup Workload Identity Federation (WIF) in GCP.
2. Add the following secrets to your GitHub Repository:
   - `GCP_PROJECT_ID`
   - `WIF_PROVIDER`
   - `GCP_SA_EMAIL`

## 4. Deploying Services Manually (Optional)
If you prefer to deploy manually via CLI:

```bash
# 1. Build and push to Artifact Registry
gcloud builds submit --tag us-central1-docker.pkg.dev/YOUR_PROJECT_ID/repo/hustlr-backend ./backend

# 2. Deploy to Cloud Run and attach secrets
gcloud run deploy hustlr-backend \
  --image us-central1-docker.pkg.dev/YOUR_PROJECT_ID/repo/hustlr-backend \
  --set-secrets="MONGODB_URI=hustlr_mongodb_uri:latest,GEMINI_API_KEY=hustlr_gemini_key:latest" \
  --region us-central1 \
  --allow-unauthenticated
```

## 5. Custom Domain Mapping
To look professional, map your Cloud Run services to custom domains:
- **Frontend:** `https://hustlr.app`
- **Backend:** `https://api.hustlr.app`
- **AI Orchestrator:** `https://ai.hustlr.app`

### Steps to Map Domains:
1. Go to **Cloud Run** > **Manage Custom Domains** in the Google Cloud Console.
2. Click **Add Mapping**.
3. Select your service (e.g., `hustlr-frontend`).
4. Select your verified domain and enter the desired subdomain.
5. Update your DNS records (A, AAAA, or CNAME) with your domain registrar as instructed by GCP. It takes 15-30 minutes for the SSL certificates to provision automatically.

## 6. Health Checks
All services are configured with health check endpoints:
- `/health`
- `/live`
- `/ready`

Cloud Run uses these automatically (if configured) to route traffic safely during deployments.
