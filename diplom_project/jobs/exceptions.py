from rest_framework.exceptions import APIException

class NotClientException(APIException):
    status_code = 403
    default_detail = "Only clients can perform this action."
    default_code = "not_client"

class NotOwnerException(APIException):
    status_code = 403
    default_detail = "You do not have permission to perform this action."
    default_code = "not_owner"

class JobRequestNotFoundException(APIException):
    status_code = 404
    default_detail = "Job request not found."
    default_code = "job_request_not_found"

class InvalidStatusTransitionException(APIException):
    status_code = 400
    default_detail = "Invalid status transition."
    default_code = "invalid_status_transition"