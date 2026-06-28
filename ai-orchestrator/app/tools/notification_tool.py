import os
import firebase_admin # type: ignore
from firebase_admin import credentials, messaging # type: ignore
from typing import Dict, Optional
from app.utils.logger import get_logger

logger = get_logger(__name__)

class InvalidFCMTokenError(Exception):
    pass

class NotificationTool:
    def __init__(self):
        """
        Initializes the FCM tool. 
        Requires FIREBASE_CREDENTIALS_JSON to be set in the environment or a path.
        For milestone 7, we'll mock initialization if not provided so it doesn't crash.
        """
        self._initialized = False
        if not firebase_admin._apps:
            try:
                # E.g. point to a serviceAccountKey.json
                cred_path = os.environ.get("FIREBASE_CREDENTIALS_PATH")
                if cred_path and os.path.exists(cred_path):
                    cred = credentials.Certificate(cred_path)
                    firebase_admin.initialize_app(cred)
                    self._initialized = True
                else:
                    logger.warning("FCM credentials not found. NotificationTool will operate in MOCK mode.")
            except Exception as e:
                logger.error(f"Failed to initialize FCM: {str(e)}")
        else:
            self._initialized = True

    def send_notification(self, fcm_token: str, title: str, body: str, data_payload: Optional[Dict[str, str]] = None) -> bool:
        """
        Pushes a notification via Firebase Cloud Messaging.
        """
        if not self._initialized:
            logger.info(f"[MOCK FCM] Sending to {fcm_token}: {title} - {body} | Data: {data_payload}")
            return True
            
        try:
            message = messaging.Message(
                notification=messaging.Notification(
                    title=title,
                    body=body
                ),
                data=data_payload or {},
                token=fcm_token
            )
            response = messaging.send(message)
            logger.info(f"Successfully sent FCM message: {response}")
            return True
        except messaging.UnregisteredError as e:
            logger.error(f"FCM Token Unregistered: {str(e)}")
            raise InvalidFCMTokenError(f"Token is unregistered: {str(e)}")
        except Exception as e:
            if "invalid-registration-token" in str(e).lower() or "not-registered" in str(e).lower():
                logger.error(f"FCM Token Invalid: {str(e)}")
                raise InvalidFCMTokenError(f"Token is invalid: {str(e)}")
            logger.error(f"Error sending FCM message: {str(e)}")
            return False
