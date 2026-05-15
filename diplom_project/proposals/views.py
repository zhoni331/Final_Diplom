from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, PermissionDenied
from django.db import models

from .serializers import ProposalSerializer, RatingSerializer
from .models import Proposal, Rating
from .services import (
    create_proposal,
    accept_proposal
)
from users.permissions import IsContractor, IsClient
from jobs.models import JobRequest
class ProposalViewSet(viewsets.ModelViewSet):
    serializer_class = ProposalSerializer
    permission_classes = [permissions.IsAuthenticated, IsContractor | IsClient]

    def get_queryset(self):
        user = self.request.user

        if user.role == "contractor":
            return Proposal.objects.filter(contractor = user)

        if user.role == "client":
            return Proposal.objects.filter(job__client = user)

        return Proposal.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        job = serializer.validated_data.get("job")
        if user.role != "contractor":
            raise PermissionDenied("Only contractor can send proposal")
        if Proposal.objects.filter(job = job, contractor = self.request.user).exists():
            raise ValidationError("You have already applied for this job")
        if job.status != JobRequest.Status.OPEN:
            raise ValidationError("Cannot respond to non-open job")

        serializer.save(contractor=self.request.user)

    #accept
    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        if request.user.role != "client":
            return Response({"error": "Only client can accept"}, status=403)
            
        proposal = accept_proposal(request.user, pk)
        return Response(self.get_serializer(proposal).data)

class RatingViewSet(viewsets.ModelViewSet):
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticated, IsClient]

    def get_queryset(self):
        return Rating.objects.filter(client=self.request.user)

    def perform_create(self, serializer):
        job = serializer.validated_data['job']
        if job.client != self.request.user:
            raise PermissionDenied("You can only rate your own jobs")
        if job.status not in [JobRequest.Status.IN_PROGRESS, JobRequest.Status.COMPLETED]:
            raise ValidationError("Can only rate jobs that are in progress or completed")
        if hasattr(job, 'rating'):
            raise ValidationError("Job already rated")
        rating = serializer.save(client=self.request.user, contractor=job.proposals.filter(status=Proposal.Status.ACCEPTED).first().contractor)

# Create your views here.
