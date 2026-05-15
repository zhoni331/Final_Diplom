from rest_framework.routers import DefaultRouter
from .views import ProposalViewSet, RatingViewSet

router = DefaultRouter()
router.register('', ProposalViewSet, basename = 'proposals')
router.register('ratings', RatingViewSet, basename = 'ratings')

urlpatterns = router.urls