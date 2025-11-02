from django.core.mail import send_mail
from django.conf import settings
import threading


def send_email(subject, message, recipient_list, from_email=None, async_send=True):
    """
    Simple reusable email sender.
    - subject: Email subject
    - message: Email body (plain text)
    - recipient_list: list of recipients
    - from_email: optional sender (defaults to settings.DEFAULT_FROM_EMAIL)
    - async_send: send in background thread if True
    """
    from_email = from_email or settings.DEFAULT_FROM_EMAIL

    def _send():
        send_mail(
            subject=subject,
            message=message,
            from_email=from_email,
            recipient_list=recipient_list,
            fail_silently=False,
        )

    if async_send:
        threading.Thread(target=_send).start()
    else:
        _send()
