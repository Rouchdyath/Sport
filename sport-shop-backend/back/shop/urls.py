from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"admin/produits", views.AdminProductViewSet, basename="admin-produits")
router.register(r"admin/variants", views.AdminVariantViewSet, basename="admin-variants")
router.register(r"admin/ebooks", views.AdminEbookViewSet, basename="admin-ebooks")
router.register(r"admin/commandes", views.AdminOrderViewSet, basename="admin-commandes")

urlpatterns = [
    path("produits/", views.ProductListView.as_view(), name="product-list"),
    path("produits/<int:pk>/", views.ProductDetailView.as_view(), name="product-detail"),
    path("ebooks/", views.EbookListView.as_view(), name="ebook-list"),
    path("ebooks/<int:pk>/", views.EbookDetailView.as_view(), name="ebook-detail"),
    path("commandes/", views.OrderCreateView.as_view(), name="order-create"),
    path("mes-commandes/", views.MyOrdersView.as_view(), name="my-orders"),
    path("", include(router.urls)),
]