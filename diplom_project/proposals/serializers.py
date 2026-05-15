from rest_framework import serializers
from .models import Proposal, Rating
from users.serializers import ContractorSerializer

class ProposalSerializer(serializers.ModelSerializer):
    contractor_email = serializers.CharField(source='contractor.email', read_only=True)
    contractor_id = serializers.IntegerField(source='contractor.id', read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True)
    contractor = ContractorSerializer(read_only=True)

    class Meta:
        model = Proposal
        fields = "__all__"
        read_only_fields = ['contractor']

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = "__all__"
        read_only_fields = ['client', 'contractor']

