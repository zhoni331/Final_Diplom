from rest_framework import viewsets, permissions, status
from .serializers import JobRequestSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .services import (
    get_jobs_for_user,
    create_job,
    update_job,
    set_status
    )
from .models import JobRequest
from users.permissions import IsClient

# Create your views here.


class JobRequestViewSet(viewsets.ModelViewSet):
    serializer_class = JobRequestSerializer
    def get_permissions(self):
        if self.action == "create":
            return [permissions.IsAuthenticated(), IsClient()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        qs = get_jobs_for_user(self.request.user)

        #filters
        status_param = self.request.query_params.get("status")
        min_budget = self.request.query_params.get("min_budget")
        max_budget = self.request.query_params.get("max_budget")
        search = self.request.query_params.get("search")

        if status_param:
            qs = qs.filter(status = status_param)
        if min_budget:
            qs = qs.filter(budget__gte = min_budget)
        if max_budget:
            qs = qs.filter(budget__lte = max_budget)
        if search:
            qs = qs.filter(title__icontains = search)

        return qs.order_by('-created_at')

    def perform_create(self, serializer):
        budget = serializer.validated_data.get("budget")
        if budget is None or budget <= 0:
            raise ValidationError({"budget": "Budget must be greater than 0"})
        serializer.save(client=self.request.user)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        job = self.get_object()
        if job.client != request.user:
            return Response({"error": "Only client can complete job"}, status=403)
        if job.status != JobRequest.Status.IN_PROGRESS:
            return Response({"error": "Job must be in progress"}, status=400)
        job.status = JobRequest.Status.COMPLETED
        job.save()
        return Response(self.get_serializer(job).data)
       

    def perform_update(self, serializer):
        update_job(
            self.request.user,
            self.get_object().id,
            serializer.validated_data
        )

    #actions
    @action(detail=True, methods = ['post'])
    def start(self, request, pk=None):
        job = self.get_object()
        set_status(request.user, job.id, JobRequest.Status.IN_PROGRESS)
        return Response(self.get_serializer(job).data)

    @action(detail=True, methods = ['post'])
    def complete(self, request, pk=None):
        job = self.get_object()
        set_status(request.user, job.id, JobRequest.Status.COMPLETED)
        return Response(self.get_serializer(job).data)

    @action(detail=True, methods = ['post'])
    def cancel(self, request, pk=None):
        set_status(request.user, pk, JobRequest.Status.CANCELLED)
        return Response({"message": "Job Cancelled"})