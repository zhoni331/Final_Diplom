from rest_framework import serializers
from .models import JobRequest

class JobRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobRequest
        fields = "__all__"
        read_only_fields = ["client"]