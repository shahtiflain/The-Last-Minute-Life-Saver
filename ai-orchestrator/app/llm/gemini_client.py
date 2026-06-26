import time
from typing import Type, TypeVar, Optional
from pydantic import BaseModel
from google import genai
from google.genai import types

from app.llm.base_llm import BaseLLM
from app.config.ai_settings import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)

T = TypeVar('T', bound=BaseModel)

class GeminiClient(BaseLLM):
    def __init__(self, trace_id: str = "unknown"):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.trace_id = trace_id

    async def generate(self, system_prompt: str, user_prompt: str, response_schema: Optional[Type[T]] = None) -> T | str:
        start_time = time.time()
        model_name = settings.MODEL_NAME
        
        config = types.GenerateContentConfig(
            system_instruction=system_prompt,
            temperature=settings.TEMPERATURE,
            max_output_tokens=settings.MAX_OUTPUT_TOKENS,
        )

        if response_schema:
            config.response_mime_type = "application/json"
            config.response_schema = response_schema # type: ignore

        try:
            response = self.client.models.generate_content(
                model=model_name,
                contents=user_prompt,
                config=config,
            )
            
            latency = round(time.time() - start_time, 3)
            
            # Extract usage metadata if available
            tokens_in = response.usage_metadata.prompt_token_count if response.usage_metadata else 0
            tokens_out = response.usage_metadata.candidates_token_count if response.usage_metadata else 0
            
            metrics = {
                "model": model_name,
                "latency_sec": latency,
                "tokens_in": tokens_in,
                "tokens_out": tokens_out,
            }
            
            logger.info(
                "Gemini API call successful", 
                extra={"trace_id": self.trace_id, "metrics": metrics}
            )

            if response_schema:
                # The response.text should be JSON string matching the schema
                return response_schema.model_validate_json(response.text or "")
            
            return response.text or ""
            
        except Exception as e:
            logger.error(f"Gemini API call failed: {str(e)}", extra={"trace_id": self.trace_id}, exc_info=True)
            raise
