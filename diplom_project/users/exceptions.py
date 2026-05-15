from rest_framework.exceptions import APIException

class NotAdminException(APIException):
    status_code = 403
    default_detail = "Only admins can perform this action."
    default_code = "not_admin"

class CannotDeleteSelfException(APIException):
    status_code = 400
    default_detail = "Users cannot delete themselves."
    default_code = "cannot_delete_self"

class UserNotFoundException(APIException):
    status_code = 404
    default_detail = "User not found."
    default_code = "user_not_found"

class UserHasOrdersException(APIException):
    status_code = 400
    default_detail = "Cannot delete user with existing orders."
    default_code = "user_has_orders"