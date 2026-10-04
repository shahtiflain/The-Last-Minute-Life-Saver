from typing import List, Dict, Any, Optional
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build # type: ignore
from googleapiclient.errors import HttpError # type: ignore
from app.utils.logger import get_logger

logger = get_logger(__name__)

class CalendarAuthError(Exception):
    pass

class CalendarTool:
    def __init__(self, credentials_dict: Dict[str, Any]):
        """
        Initializes the Google Calendar API client.
        credentials_dict should contain: token, refresh_token, token_uri, client_id, client_secret
        """
        self.creds = Credentials(
            token=credentials_dict.get('token'),
            refresh_token=credentials_dict.get('refresh_token'),
            token_uri=credentials_dict.get('token_uri', 'https://oauth2.googleapis.com/token'),
            client_id=credentials_dict.get('client_id'),
            client_secret=credentials_dict.get('client_secret'),
            scopes=['https://www.googleapis.com/auth/calendar.events']
        )
        self.service = build('calendar', 'v3', credentials=self.creds)

    def get_free_busy(self, time_min: str, time_max: str, time_zone: str = 'UTC') -> List[Dict[str, str]]:
        """
        Fetches busy blocks from the user's primary calendar.
        time_min and time_max should be ISO 8601 formatted strings.
        Returns a list of dicts with 'start' and 'end' keys.
        """
        try:
            body = {
                "timeMin": time_min,
                "timeMax": time_max,
                "timeZone": time_zone,
                "items": [{"id": "primary"}]
            }
            events_result = self.service.freebusy().query(body=body).execute()
            calendars = events_result.get('calendars', {})
            primary = calendars.get('primary', {})
            busy_slots = primary.get('busy', [])
            return busy_slots
        except HttpError as error:
            logger.error(f"An error occurred fetching free/busy: {error}")
            if error.resp.status in [401, 403]:
                raise CalendarAuthError("Google Calendar authentication failed (token expired or revoked).")
            raise

    def insert_event(self, title: str, start_time: str, end_time: str, time_zone: str = 'UTC', extended_properties: Optional[Dict[str, str]] = None) -> str:
        """
        Inserts an event into the primary calendar.
        Returns the event ID.
        """
        try:
            event = {
                'summary': title,
                'start': {
                    'dateTime': start_time,
                    'timeZone': time_zone,
                },
                'end': {
                    'dateTime': end_time,
                    'timeZone': time_zone,
                }
            }
            
            if extended_properties:
                event['extendedProperties'] = {
                    'private': extended_properties
                }

            event_result = self.service.events().insert(calendarId='primary', body=event).execute()
            return event_result.get('id', '')
        except HttpError as error:
            logger.error(f"An error occurred inserting event: {error}")
            if error.resp.status in [401, 403]:
                raise CalendarAuthError("Google Calendar authentication failed (token expired or revoked).")
            raise
