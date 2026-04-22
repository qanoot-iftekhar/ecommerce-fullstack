from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import ProductViewSet, BlogViewSet, CartViewSet, OrderViewSet, PaymentViewSet, RegisterViewSet, OTPSendViewSet, GoogleLoginViewSet

router = DefaultRouter()
router.register('products', ProductViewSet)
router.register('blogs', BlogViewSet)
router.register('cart', CartViewSet)
router.register('orders', OrderViewSet)
router.register('payment', PaymentViewSet, basename='payment')
router.register('register', RegisterViewSet, basename='register')
router.register('otp', OTPSendViewSet, basename='otp')
router.register('google', GoogleLoginViewSet, basename='google')

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]