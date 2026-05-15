from django.db import models
from django.conf import settings
from jobs.models import JobRequest

User = settings.AUTH_USER_MODEL

class Proposal(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        ACCEPTED = 'accepted', 'Accepted' 
        REJECTED = 'rejected', 'Rejected'

    job = models.ForeignKey(
        JobRequest,
        on_delete = models.CASCADE,
        related_name = 'proposals'
    )

    contractor = models.ForeignKey(
        User,
        on_delete = models.CASCADE,
        related_name = 'proposals'
    )

    message = models.TextField()
    price = models.DecimalField(max_digits = 10, decimal_places = 2)

    status = models.CharField(
        max_length = 20, 
        choices = Status.choices,
        default = Status.PENDING
    )

    cretaed_at = models.DateTimeField(auto_now_add = True)

    def __str__(self):
        return f"Proposal {self.id} - {self.status}"

class Rating(models.Model):
    job = models.OneToOneField(
        JobRequest,
        on_delete=models.CASCADE,
        related_name='rating'
    )
    client = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='given_ratings'
    )
    contractor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='received_ratings'
    )
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])  # 1-5 stars
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Rating for {self.job.title} - {self.rating} stars"

# Create your models here.
