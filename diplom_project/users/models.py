from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email must be provided")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError("Superuser must have is_staff=True")
        if extra_fields.get('is_superuser') is not True:
            raise ValueError("Superuser must have is_superuser=True")

        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    username = None  

    email = models.EmailField(unique=True)

    role = models.CharField(
        max_length=20,
        choices=[
            ('admin', 'Admin'),
            ('client', 'Client'),
            ('contractor', 'Contractor'),
        ],
        default='client'
    )

    @property
    def average_rating(self):
        from django.db.models import Avg
        avg = self.received_ratings.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 2) if avg else 0.00

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()
