
import logging
from django.conf import settings
logger = logging.getLogger(__name__)

class DebugRequestMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        logger.debug("=== INCOMING REQUEST ===")
        logger.debug(f"Method: {request.method}")
        logger.debug(f"Path: {request.path}")
        logger.debug(f"Host header: {request.META.get('HTTP_HOST')}")
        logger.debug(f"X-Forwarded-Proto: {request.META.get('HTTP_X_FORWARDED_PROTO')}")
        logger.debug(f"X-Forwarded-For: {request.META.get('HTTP_X_FORWARDED_FOR')}")
        logger.debug(f"SERVER_NAME: {request.META.get('SERVER_NAME')}")
        logger.debug(f"is_secure: {request.is_secure()}")
        logger.debug(f"ALLOWED_HOSTS value: {settings.ALLOWED_HOSTS}")
        
        response = self.get_response(request)
        
        logger.debug(f"=== RESPONSE STATUS: {response.status_code} ===")
        return response