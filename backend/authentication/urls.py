from rest_framework.routers import SimpleRouter
from .views import AuthViewSet

router = SimpleRouter()
router.register('', AuthViewSet, basename='auth')

urlpatterns = router.urls
