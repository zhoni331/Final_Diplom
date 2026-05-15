from rest_framework.routers import DefaultRouter
from .views import JobRequestViewSet

router = DefaultRouter()
router.register(r'', JobRequestViewSet, basename='jobs')

urlpatterns = router.urls