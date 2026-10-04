import json
import os
from typing import Dict, Optional

import firebase_admin  # type: ignore
from firebase_admin import credentials, messaging  # type: ignore

from app.utils.logger import get_logger

logger = get_logger(__name__)


class InvalidFCMTokenError(Exception):
    """Raised when an FCM token is invalid or unregistered."""
    pass


class NotificationTool:
    """
    Firebase Cloud Messaging Notification Tool

    Initialization order:

    1. FIREBASE_SERVICE_ACCOUNT
       -> Full Firebase Service Account JSON stored as an environment variable.
       (Recommended for Railway, Cloud Run, Render, etc.)

    2. FIREBASE_CREDENTIALS_PATH
       -> Path to serviceAccountKey.json.
       (Recommended for local development.)

    3. MOCK MODE
       -> Notifications are logged instead of sent.
    """

    def __init__(self):
        self._initialized = False

        # Firebase already initialized
        if firebase_admin._apps:
            self._initialized = True
            logger.info("Firebase Admin already initialized.")
            return

        try:
            # ==========================================================
            # OPTION 1 : Railway / Cloud Run
            # ==========================================================
            service_account_json = os.getenv("FIREBASE_SERVICE_ACCOUNT")

            if service_account_json:
                logger.info(
                    "Initializing Firebase using FIREBASE_SERVICE_ACCOUNT..."
                )

                cred_dict = json.loads(service_account_json)

                cred = credentials.Certificate(cred_dict)

                firebase_admin.initialize_app(cred)

                self._initialized = True

                logger.info(
                    "Firebase Admin initialized successfully "
                    "(Environment Variable)."
                )
                return

            # ==========================================================
            # OPTION 2 : Local Development
            # ==========================================================
            cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH")

            if cred_path and os.path.exists(cred_path):
                logger.info(
                    f"Initializing Firebase using credential file: {cred_path}"
                )

                cred = credentials.Certificate(cred_path)

                firebase_admin.initialize_app(cred)

                self._initialized = True

                logger.info(
                    "Firebase Admin initialized successfully "
                    "(Credential File)."
                )
                return

            # ==========================================================
            # OPTION 3 : Mock Mode
            # ==========================================================
            logger.warning(
                "Firebase Admin credentials not configured. "
                "NotificationTool is running in MOCK mode."
            )

        except Exception as e:
            logger.exception(
                f"Failed to initialize Firebase Admin: {str(e)}"
            )

    def send_notification(
        self,
        fcm_token: str,
        title: str,
        body: str,
        data_payload: Optional[Dict[str, str]] = None,
    ) -> bool:
        """
        Sends a push notification through Firebase Cloud Messaging.
        Falls back to MOCK mode when Firebase isn't configured.
        """

        if not self._initialized:
            logger.info(
                f"[MOCK FCM] "
                f"Token={fcm_token} | "
                f"Title='{title}' | "
                f"Body='{body}' | "
                f"Data={data_payload}"
            )
            return True

        try:
            message = messaging.Message(
                notification=messaging.Notification(
                    title=title,
                    body=body,
                ),
                data=data_payload or {},
                token=fcm_token,
            )

            response = messaging.send(message)

            logger.info(f"FCM notification sent successfully: {response}")

            return True

        except messaging.UnregisteredError as e:
            logger.error(f"FCM token is unregistered: {str(e)}")
            raise InvalidFCMTokenError(
                f"Token is unregistered: {str(e)}"
            )

        except Exception as e:
            error_message = str(e).lower()

            if (
                "invalid-registration-token" in error_message
                or "not-registered" in error_message
            ):
                logger.error(f"Invalid FCM token: {str(e)}")
                raise InvalidFCMTokenError(
                    f"Token is invalid: {str(e)}"
                )

            logger.exception(
                f"Unexpected error sending FCM notification: {str(e)}"
            )

            return False