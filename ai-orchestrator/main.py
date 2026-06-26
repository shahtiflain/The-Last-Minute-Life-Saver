# pyrefly: ignore [missing-import]
from fastapi import FastAPI
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="AI Orchestrator")

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ai-orchestrator"}

if __name__ == "__main__":
    # pyrefly: ignore [missing-import]
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
