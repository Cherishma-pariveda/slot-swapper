from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import EventViewSet, SwapRequestViewSet, register

router = DefaultRouter()
router.register(r'events', EventViewSet, basename='events')
router.register(r'swap-requests', SwapRequestViewSet, basename='swap-requests')

urlpatterns = [
    path('register/', register,name='register'),
    path('', include(router.urls)),
    

]
