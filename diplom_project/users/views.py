from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status
from .serializers import RegisterSerializer
from .serializers import UserSerializer
from .models import User
from .permissions import IsAdmin
from .services import (
    get_all_users, 
    get_user_by_id, 
    create_user, 
    delete_user,
    register_user)
from rest_framework.permissions import AllowAny
# Create your views here.


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return get_all_users()

    def retrieve(self, request, *args, **kwargs):
        # Allow anyone to view profiles
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def perform_create(self, serializer):
        return create_user(serializer.validated_data)
    
    def perform_destroy(self, instance):
        delete_user(self.request.user, instance.id)

class RegisterView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    


