from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from decimal import Decimal
from django.db.models import Q

from .models import (
    ProductType, Product, Batch, Invoice, InvoiceItem,
    SalesBill, PurchaseBill
)
from .serializers import (
    ProductTypeSerializer, ProductSerializer, BatchSerializer,
    InvoiceSerializer, InvoiceItemSerializer, InvoiceCreateSerializer,
    SalesBillSerializer, SalesBillUpdateSerializer,
    PurchaseBillSerializer, PurchaseBillUpdateSerializer
)


class StandardPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 100


class ProductTypeViewSet(viewsets.ModelViewSet):
    """
    Product Types - manage custom and default product types
    """
    queryset = ProductType.objects.all()
    serializer_class = ProductTypeSerializer
    pagination_class = StandardPagination
    
    @action(detail=False, methods=['post'])
    def create_defaults(self, request):
        """Create default product types if they don't exist"""
        ProductType.create_defaults()
        return Response(
            {'message': 'Default product types created/verified'},
            status=status.HTTP_200_OK
        )


class BatchViewSet(viewsets.ModelViewSet):
    """
    Batches - manage product batches with batch-specific pricing
    """
    queryset = Batch.objects.all()
    serializer_class = BatchSerializer
    pagination_class = StandardPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['product', 'expiry_date']
    ordering_fields = ['expiry_date', 'created_at']
    ordering = ['expiry_date']


class ProductViewSet(viewsets.ModelViewSet):
    """
    Products - list all products with batches, three-price model support
    GET /api/products/
    - Includes all batches for each product
    - Three prices per batch: MRP, Selling Rate, Cost Price
    - Cost Price is included in response for inventory management
    """
    queryset = Product.objects.prefetch_related('batches').all()
    serializer_class = ProductSerializer
    pagination_class = StandardPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'generic_name', 'manufacturer']
    ordering_fields = ['name', 'created_at', 'updated_at']
    ordering = ['-updated_at']


class InvoiceItemViewSet(viewsets.ModelViewSet):
    """
    Invoice Items - individual items within invoices
    """
    queryset = InvoiceItem.objects.all()
    serializer_class = InvoiceItemSerializer
    pagination_class = StandardPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['invoice', 'product']
    ordering_fields = ['created_at']
    ordering = ['-created_at']


class InvoiceViewSet(viewsets.ModelViewSet):
    """
    Invoices - bills/invoices for selling medicines
    
    GET /api/invoices/
    - Returns invoices with calculated totals
    - Total calculated using SELLING RATE ONLY (NOT mrp)
    - Includes all items for each invoice
    
    POST /api/invoices/
    - Create invoice with items
    - Automatically deducts quantity from batches
    - Calculates and stores total using selling rates
    - Stores both original_selling_rate and selling_rate for price history
    
    PATCH /api/invoices/{id}/
    - Update invoice details
    """
    queryset = Invoice.objects.prefetch_related('items').all()
    pagination_class = StandardPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['customer_name', 'customer_phone']
    ordering_fields = ['created_at', 'total_amount']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return InvoiceCreateSerializer
        return InvoiceSerializer
    
    def create(self, request, *args, **kwargs):
        """Create invoice with items"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        invoice = serializer.save()
        
        # Return created invoice with full details
        output_serializer = InvoiceSerializer(invoice)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)


class SalesBillViewSet(viewsets.ModelViewSet):
    """
    Sales Bills - track payment status for sales invoices
    
    GET /api/sales-bills/
    - Returns all sales bills with payment status
    
    POST /api/sales-bills/
    - Create sales bill for an invoice
    
    PATCH /api/sales-bills/{id}/
    - Update amount paid and notes
    - Automatically recalculates amount_due and payment_status
    """
    queryset = SalesBill.objects.select_related('invoice').all()
    pagination_class = StandardPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['payment_status']
    ordering_fields = ['created_at', 'total_amount']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action in ['partial_update', 'update']:
            return SalesBillUpdateSerializer
        return SalesBillSerializer
    
    def perform_update(self, serializer):
        """Update and recalculate payment status"""
        serializer.save()


class PurchaseBillViewSet(viewsets.ModelViewSet):
    """
    Purchase Bills - track payment status for purchase invoices
    
    GET /api/purchase-bills/
    - Returns all purchase bills with payment status
    
    POST /api/purchase-bills/
    - Create purchase bill for a wholesaler
    
    PATCH /api/purchase-bills/{id}/
    - Update amount paid and notes
    - Automatically recalculates amount_due and payment_status
    """
    queryset = PurchaseBill.objects.all()
    pagination_class = StandardPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['payment_status']
    search_fields = ['wholesaler']
    ordering_fields = ['created_at', 'total_amount']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action in ['partial_update', 'update']:
            return PurchaseBillUpdateSerializer
        return PurchaseBillSerializer
    
    def perform_update(self, serializer):
        """Update and recalculate payment status"""
        serializer.save()
