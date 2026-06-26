from pydantic_settings import BaseSettings, SettingsConfigDict

class AISettings(BaseSettings):
    # API Keys
    GEMINI_API_KEY: str = "mock-gemini-key"
    
    # Model Configuration
    MODEL_NAME: str = "gemini-2.5-flash"
    TEMPERATURE: float = 0.2
    MAX_OUTPUT_TOKENS: int = 2048
    
    # Resiliency
    RETRY_COUNT: int = 3
    TIMEOUT_SECONDS: int = 30
    
    # Security
    ORCHESTRATOR_API_KEY: str = "mock-internal-api-key"

    # Database
    MONGO_URI: str = "mongodb://localhost:27017"
    MONGO_DB_NAME: str = "antigravity"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = AISettings()
