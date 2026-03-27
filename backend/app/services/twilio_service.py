import asyncio

from twilio.rest import Client

from app.core.config import settings


class TwilioService:
    def __init__(self) -> None:
        self._client = None

    def is_configured(self) -> bool:
        return bool(
            settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN and settings.TWILIO_FROM_NUMBER
        )

    def _ensure_configured(self) -> None:
        if not self.is_configured():
            raise ValueError("Twilio configuration is missing in backend environment")

    def _get_client(self) -> Client:
        self._ensure_configured()
        if self._client is None:
            self._client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        return self._client

    def _send_sms_sync(self, to_phone: str, message: str) -> str:
        client = self._get_client()
        response = client.messages.create(
            body=message,
            from_=settings.TWILIO_FROM_NUMBER,
            to=to_phone,
        )
        return response.sid

    async def send_sms(self, to_phone: str, message: str) -> str:
        # Twilio's SDK call is blocking; run it in a worker thread to avoid blocking the event loop.
        return await asyncio.to_thread(self._send_sms_sync, to_phone, message)


twilio_service = TwilioService()