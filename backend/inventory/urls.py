from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductTypeViewSet, HSNViewSet, ProductViewSet, BatchViewSet,
    InvoiceViewSet, InvoiceItemViewSet,
    SalesBillViewSet, PurchaseBillViewSet, ShopProfileViewSet, WholesalerViewSet
)

router = DefaultRouter()
router.register(r'product-types', ProductTypeViewSet, basename='producttype')
router.register(r'hsn', HSNViewSet, basename='hsn')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'batches', BatchViewSet, basename='batch')
router.register(r'invoices', InvoiceViewSet, basename='invoice')
router.register(r'invoice-items', InvoiceItemViewSet, basename='invoiceitem')
router.register(r'sales-bills', SalesBillViewSet, basename='salesbill')
router.register(r'purchase-bills', PurchaseBillViewSet, basename='purchasebill')
router.register(r'shop-profile', ShopProfileViewSet, basename='shopprofile')
router.register(r'wholesalers', WholesalerViewSet, basename='wholesaler')

urlpatterns = [
    path('', include(router.urls)),
]
