from rest_framework.exceptions import APIException

class OrderNotFoundException(APIException):
    status_code = 404
    default_detail = "Order not found."
    default_code = "order_not_found"

class NotYourOrderException(APIException):
    status_code = 403
    default_detail = "You do not have permission to perform this action."
    default_code = "permission_denied"

class CannotDeleteCompletedOrderException(APIException):
    status_code = 400
    default_detail = "Cannot delete a completed order."
    default_code = "cannot_delete_completed_order"

class CannotRevertCompletedOrderException(APIException):
    status_code = 400
    default_detail = "Cannot revert a completed order back to pending."
    default_code = "cannot_revert_completed_order"

class CannotChangeStatusOfCompletedOrderException(APIException):
    status_code = 400
    default_detail = "Cannot change the status of a completed order."
    default_code = "cannot_change_status_of_completed_order"
