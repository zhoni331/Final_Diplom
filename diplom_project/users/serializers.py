from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()

    def get_average_rating(self, obj):
        return obj.average_rating

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'role', 'average_rating']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(
        choices = ["client", "contractor"],
        #default = "client"
    )

    class Meta:
        model = User
        fields = ["email", "password", "role"]

    def create(self, validated_data):
        role = validated_data.pop("role", "client")

        user = User(
            email=validated_data["email"],
            role=role
        )
        user.set_password(validated_data["password"])  
        user.save()
        return user

class ContractorSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'email', 'average_rating']