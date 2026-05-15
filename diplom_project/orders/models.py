from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Order(models.Model):

    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        IN_PROGRESS = 'in_progress', 'In Progress'
        COMPLETED = 'completed', 'Completed'
        CANCELLED = 'cancelled', 'Cancelled'

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)


    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='orders'
        )
    status = models.CharField(
        max_length=20, 
        choices=Status.choices, 
        default=Status.PENDING
        )

    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.title} ({self.status})"

# Create your models here.
