from django.urls import path, include
from .views import UserViewSet, RegisterView, MeView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view()),
    path('me/', MeView.as_view()),
]