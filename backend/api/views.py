from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from .models import Product, Blog, CartItem, Order, OTP
from .serializers import ProductSerializer, BlogSerializer, CartItemSerializer, OrderSerializer
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from django.conf import settings
import razorpay
import random
import string

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        category = request.query_params.get('category', '')
        min_price = request.query_params.get('min_price', '')
        max_price = request.query_params.get('max_price', '')
        
        products = Product.objects.all()
        
        if query:
            products = products.filter(name__icontains=query)
        
        if category:
            products = products.filter(category=category)
        
        if min_price:
            products = products.filter(price__gte=float(min_price))
        
        if max_price:
            products = products.filter(price__lte=float(max_price))
        
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

class BlogViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [AllowAny]

class CartViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    
    def get_queryset(self):
        session_id = self.request.query_params.get('session_id', '')
        if session_id:
            return CartItem.objects.filter(session_id=session_id)
        return CartItem.objects.none()
    
    @action(detail=False, methods=['post'])
    def add_to_cart(self, request):
        session_id = request.data.get('session_id')
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)
        
        if not session_id or not product_id:
            return Response(
                {'error': 'session_id and product_id required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        cart_item, created = CartItem.objects.get_or_create(
            session_id=session_id,
            product_id=product_id,
            defaults={'quantity': quantity}
        )
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
        
        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['delete'])
    def clear_cart(self, request):
        session_id = request.query_params.get('session_id')
        if session_id:
            CartItem.objects.filter(session_id=session_id).delete()
            return Response({'message': 'Cart cleared successfully'}, status=status.HTTP_200_OK)
        return Response({'error': 'session_id required'}, status=status.HTTP_400_BAD_REQUEST)

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def user_orders(self, request):
        email = request.query_params.get('email')
        if email:
            orders = Order.objects.filter(email=email).order_by('-created_at')
            serializer = self.get_serializer(orders, many=True)
            return Response(serializer.data)
        return Response({'error': 'Email required'}, status=status.HTTP_400_BAD_REQUEST)

class PaymentViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'])
    def create_order(self, request):
        client = razorpay.Client(auth=("rzp_test_SfpVCfrWmj6BGu", "TOmvEdHlBUiNyR50YRQ55wtA"))
        amount = int(float(request.data.get('amount')) * 100)
        
        data = {
            "amount": amount,
            "currency": "INR",
            "receipt": "order_rcptid_11",
            "payment_capture": 1
        }
        
        order = client.order.create(data=data)
        return Response(order)
    
    @action(detail=False, methods=['post'])
    def verify_payment(self, request):
        client = razorpay.Client(auth=("rzp_test_SfpVCfrWmj6BGu", "TOmvEdHlBUiNyR50YRQ55wtA"))
        
        try:
            client.utility.verify_payment_signature(request.data)
            return Response({'status': 'success'}, status=status.HTTP_200_OK)
        except:
            return Response({'status': 'failed'}, status=status.HTTP_400_BAD_REQUEST)

class RegisterViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create(
            username=username,
            email=email,
            password=make_password(password)
        )
        
        return Response({'message': 'User created successfully', 'user_id': user.id}, status=status.HTTP_201_CREATED)

class OTPSendViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'])
    def send_otp(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response({'error': 'Email required'}, status=status.HTTP_400_BAD_REQUEST)
        
        otp = ''.join(random.choices(string.digits, k=6))
        
        OTP.objects.filter(email=email).delete()
        OTP.objects.create(email=email, otp=otp)
        
        try:
            send_mail(
                'Your OTP Code',
                f'Your OTP code is: {otp}. Valid for 5 minutes.',
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )
            return Response({'message': 'OTP sent successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'])
    def verify_otp(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        
        try:
            otp_record = OTP.objects.get(email=email, otp=otp)
            if otp_record.is_valid():
                otp_record.delete()
                return Response({'verified': True}, status=status.HTTP_200_OK)
            else:
                return Response({'verified': False, 'error': 'OTP expired'}, status=status.HTTP_400_BAD_REQUEST)
        except OTP.DoesNotExist:
            return Response({'verified': False, 'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

class GoogleLoginViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'])
    def google_login(self, request):
        email = request.data.get('email')
        name = request.data.get('name')
        
        if not email:
            return Response({'error': 'Email required'}, status=status.HTTP_400_BAD_REQUEST)
        
        user, created = User.objects.get_or_create(
            username=email,
            email=email,
            defaults={'first_name': name or ''}
        )
        
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': email
        }, status=status.HTTP_200_OK)