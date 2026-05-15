from django.db import models
from django.conf import settings
# Create your models here.

User = settings.AUTH_USER_MODEL

class JobRequest(models.Model):
    class Status(models.TextChoices):
        OPEN = 'open', 'Open'
        IN_PROGRESS = 'in_progress', 'In Progress'
        COMPLETED = 'completed', 'Completed'
        CANCELLED = 'cancelled', 'Cancelled'

    title = models.CharField(max_length=255)
    description = models.TextField()

    budget = models.DecimalField(max_digits=10, decimal_places=2)

    client = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='job_requests'
    )

    status = models.CharField(
        max_length=20,
        choices = Status.choices,
        default = Status.OPEN
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.status})"
