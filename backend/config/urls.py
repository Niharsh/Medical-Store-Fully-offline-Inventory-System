"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from inventory.views import (
    ProductTypeViewSet, HSNViewSet, ProductViewSet, BatchViewSet,
    InvoiceViewSet, InvoiceItemViewSet,
    SalesBillViewSet, PurchaseBillViewSet, ShopProfileViewSet, WholesalerViewSet,
)

# Create API router
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
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),
    path('api/', include(router.urls)),
]
