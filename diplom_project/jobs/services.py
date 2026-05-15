from .models import JobRequest
from rest_framework.exceptions import NotAuthenticated
from .exceptions import (
    NotClientException,
    NotOwnerException,
    JobRequestNotFoundException,
    InvalidStatusTransitionException
)

def get_job_or_404(job_id):
    try:
        return JobRequest.objects.get(id=job_id)
    except JobRequest.DoesNotExist:
        return JobRequestNotFoundException()

def get_jobs_for_user(user):
    if user.is_anonymous:
        raise NotAuthenticated()

    if user.role == 'client':
        return JobRequest.objects.filter(client=user)

    if user.role == 'contractor':
        return JobRequest.objects.filter(status=JobRequest.Status.OPEN)

    if user.role == 'admin':
        return JobRequest.objects.all()

def create_job(user, data):
    if user.is_anonymous:
        raise NotAuthenticated()

    if user.role != 'client':
        raise PermissionError("Only clients can create job requests.")

    return JobRequest.objects.create(client=user, **data)

def update_job(user, job_id, data):
    job = get_job_or_404(job_id)

    if user != job.client:
        raise NotOwnerException()

    if job.status in [JobRequest.Status.COMPLETED, JobRequest.Status.CANCELED]:
        raise InvalidStatusTransitionException("Cannot modify closed job")

    for field, value in data.items():
        setattr(job, field, value)

    job.save()
    return job

def set_status(user, job_id, new_status):
    job = get_job_or_404(job_id)

    if user != job.client:
        raise NotOwnerException()

    current = job.status

    allowed = {
        JobRequest.Status.OPEN: [JobRequest.Status.IN_PROGRESS, JobRequest.Status.CANCELLED],
        JobRequest.Status.IN_PROGRESS: [JobRequest.Status.COMPLETED, JobRequest.Status.CANCELLED],
        JobRequest.Status.COMPLETED: [],
        JobRequest.Status.CANCELLED: []
    }

    if new_status not in allowed[current]:
        raise ValueError("Invalid status transition")

    #Бизнес логика для статусов
    if new_status == JobRequest.Status.IN_PROGRESS:
        if not job.contractor:
            raise ValueError("No contractor assigned")

    if new_status == JobRequest.Status.COMPLETED:
        pass

    if new_status == JobRequest.Status.CANCELLED:
        from proposals.models import Proposal
        Proposal.objects.filter(job=job).update(status=Proposal.Status.REJECTED)

    job.status = new_status
    job.save()

    return job


    
