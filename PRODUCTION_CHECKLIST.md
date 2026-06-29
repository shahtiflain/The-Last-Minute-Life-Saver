# Production Readiness Checklist

Ensure the following tasks are completed and verified before directing live traffic to the application.

## Infrastructure & Build
- [ ] **Build Passes:** All CI/CD workflows complete successfully without compilation errors.
- [ ] **Docker Builds:** `docker-compose build` succeeds locally for all 3 services without missing dependencies.
- [ ] **Health Checks:** `/health`, `/live`, and `/ready` return 200 OK for all services.
- [ ] **Production Logging:** Logs output correctly structured JSON or required format (Request ID, User ID, Duration, Status Code).

## Integrations
- [ ] **Firebase Authentication Works:** Users can sign up, log in, and log out securely. Token verification works on the backend.
- [ ] **Gemini Works:** The AI Orchestrator successfully communicates with the Gemini API to process intents.
- [ ] **MongoDB Atlas Works:** Data persists across sessions, and CRUD operations correctly reflect in the database.
- [ ] **Google Calendar Works:** Calendar read/write access functions correctly without permission errors.

## Application Functionality
- [ ] **Landing Page Works:** Loads quickly, displays correctly on mobile/desktop, and links correctly to authentication.
- [ ] **CRUD Works:** Users can Create, Read, Update, and Delete tasks, goals, and habits.
- [ ] **Notifications Work:** Users receive timely and accurate push/in-app notifications for their tasks and goals.

## Security
- [ ] **Secret Manager Active:** No API keys or sensitive credentials are baked into the Docker images.
- [ ] **CORS Configured:** Backend accepts requests *only* from the allowed custom domains (`https://hustlr.app` etc.).
- [ ] **Environment Variables:** `NODE_ENV` and `PYTHON_ENV` are set to `production` in Cloud Run.
