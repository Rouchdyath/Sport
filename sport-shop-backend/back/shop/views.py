from rest_framework import generics, permissions, viewsets
from .models import Product, Variant, Ebook, Order
from .serializers import (
    ProductSerializer, EbookSerializer, EbookListSerializer, OrderSerializer,
    AdminProductSerializer, AdminVariantSerializer, AdminEbookSerializer,
)


# ---- Public (lecture seule, pour le site client) ----

class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class EbookListView(generics.ListAPIView):
    queryset = Ebook.objects.all()
    serializer_class = EbookListSerializer


class EbookDetailView(generics.RetrieveAPIView):
    queryset = Ebook.objects.all()
    serializer_class = EbookSerializer


class OrderCreateView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)


class MyOrdersView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by("-date_creation")


# ---- Admin (CRUD complet, réservé aux comptes is_staff) ----

class AdminProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by("-id")
    serializer_class = AdminProductSerializer
    permission_classes = [permissions.IsAdminUser]


class AdminVariantViewSet(viewsets.ModelViewSet):
    queryset = Variant.objects.all().order_by("-id")
    serializer_class = AdminVariantSerializer
    permission_classes = [permissions.IsAdminUser]


class AdminEbookViewSet(viewsets.ModelViewSet):
    queryset = Ebook.objects.all().order_by("-id")
    serializer_class = AdminEbookSerializer
    permission_classes = [permissions.IsAdminUser]

class AdminOrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by("-date_creation")
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAdminUser]