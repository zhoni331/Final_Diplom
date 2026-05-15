from .models import Order
from rest_framework.exceptions import NotAuthenticated
from .exceptions import (OrderNotFoundException, 
NotYourOrderException, 
CannotDeleteCompletedOrderException,
CannotRevertCompletedOrderException,
CannotChangeStatusOfCompletedOrderException)

def get_orders_for_user(user):
    if user.role == 'admin':
        return Order.objects.all()
    return Order.objects.filter(user=user)

def create_order(user, data):
    order = Order.objects.create(user=user, **data)
    return order

def update_order(user, order_id, data):
    if user.is_anonymous:
        raise NotAuthenticated()
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        raise OrderNotFoundException()

    if order.user != user and user.role != 'admin':
        raise NotYourOrderException()

    if order.status == 'completed':
        raise CannotChangeStatusOfCompletedOrderException()

    new_status = data.get('status')
    if new_status:
        if order.status == Order.Status.COMPLETED:
            raise CannotChangeStatusOfCompletedOrderException()
        if new_status == Order.Status.PENDING and order.status != Order.Status.PENDING:
            raise CannotRevertCompletedOrderException()

    for field, value in data.items():
        setattr(order, field, value)

    order.save()
    return order

def delete_order(user, order_id):
    if user.is_anonymous:
        raise NotAuthenticated()
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        raise OrderNotFoundException()
        
    if order.user != user and user.role != 'admin':
        raise NotYourOrderException()

    if order.status == 'completed':
        raise CannotDeleteCompletedOrderException()

    order.delete()