from rest_framework import serializers
from django.db import transaction
from decimal import Decimal
from .models import (
    ProductType, Product, Batch, Invoice, InvoiceItem,
    SalesBill, PurchaseBill
)


class ProductTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductType
        fields = ['name', 'label', 'is_default', 'created_at']
        read_only_fields = ['created_at']


class BatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Batch
        fields = [
            'id', 'batch_number', 'mrp', 'selling_rate', 'cost_price',
            'quantity', 'expiry_date', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class ProductSerializer(serializers.ModelSerializer):
    batches = BatchSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'product_type', 'generic_name', 'manufacturer',
            'salt_composition', 'unit', 'description', 'batches',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class InvoiceItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    subtotal = serializers.SerializerMethodField()
    
    class Meta:
        model = InvoiceItem
        fields = [
            'id', 'product_id', 'product_name', 'batch_number', 'quantity',
            'original_selling_rate', 'selling_rate', 'mrp', 'subtotal',
            'created_at'
        ]
        read_only_fields = ['created_at']
    
    def get_subtotal(self, obj):
        """Calculate subtotal using SELLING RATE ONLY"""
        return str(obj.get_subtotal())


class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Invoice
        fields = [
            'id', 'customer_name', 'customer_phone', 'total_amount',
            'notes', 'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['total_amount', 'created_at', 'updated_at']


class InvoiceCreateSerializer(serializers.Serializer):
    """Serializer for creating invoices with items"""
    customer_name = serializers.CharField(max_length=255)
    customer_phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)
    items = serializers.ListField(
        child=serializers.DictField(),
        min_length=1
    )
    
    def validate_items(self, items):
        """Validate invoice items"""
        for i, item in enumerate(items):
            # Check required fields
            required_fields = ['product_id', 'batch_number', 'quantity', 'selling_rate', 'original_selling_rate', 'mrp']
            for field in required_fields:
                if field not in item:
                    raise serializers.ValidationError(
                        f"Item {i+1} missing required field: {field}"
                    )
            
            # Validate positive values
            if int(item['quantity']) <= 0:
                raise serializers.ValidationError(
                    f"Item {i+1} quantity must be greater than 0"
                )
            
            if Decimal(str(item['selling_rate'])) <= 0:
                raise serializers.ValidationError(
                    f"Item {i+1} selling_rate must be greater than 0"
                )
            
            # Check product exists
            try:
                product = Product.objects.get(id=int(item['product_id']))
            except Product.DoesNotExist:
                raise serializers.ValidationError(
                    f"Item {i+1} references non-existent product (ID: {item['product_id']})"
                )
            
            # Check batch exists and has enough quantity
            try:
                batch = Batch.objects.get(
                    product=product,
                    batch_number=item['batch_number']
                )
            except Batch.DoesNotExist:
                raise serializers.ValidationError(
                    f"Item {i+1} references non-existent batch: {item['batch_number']}"
                )
            
            if batch.quantity < int(item['quantity']):
                raise serializers.ValidationError(
                    f"Item {i+1} insufficient quantity in batch. Available: {batch.quantity}, Requested: {item['quantity']}"
                )
        
        return items
    
    def create(self, validated_data):
        """Create invoice with items in a transaction"""
        items_data = validated_data.pop('items')
        
        with transaction.atomic():
            # Create invoice
            invoice = Invoice.objects.create(**validated_data)
            
            # Create invoice items and update batch quantities
            for item_data in items_data:
                product = Product.objects.get(id=int(item_data['product_id']))
                batch = Batch.objects.get(
                    product=product,
                    batch_number=item_data['batch_number']
                )
                
                # Create invoice item
                InvoiceItem.objects.create(
                    invoice=invoice,
                    product=product,
                    batch_number=item_data['batch_number'],
                    quantity=int(item_data['quantity']),
                    original_selling_rate=Decimal(str(item_data['original_selling_rate'])),
                    selling_rate=Decimal(str(item_data['selling_rate'])),
                    mrp=Decimal(str(item_data['mrp']))
                )
                
                # Reduce batch quantity
                batch.quantity -= int(item_data['quantity'])
                batch.save()
            
            # Recalculate invoice total
            invoice.save()
        
        return invoice


class SalesBillSerializer(serializers.ModelSerializer):
    invoice = InvoiceSerializer(read_only=True)
    
    class Meta:
        model = SalesBill
        fields = [
            'id', 'invoice', 'total_amount', 'amount_paid', 'amount_due',
            'payment_status', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['amount_due', 'payment_status', 'created_at', 'updated_at']


class SalesBillUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesBill
        fields = ['amount_paid', 'notes']


class PurchaseBillSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseBill
        fields = [
            'id', 'wholesaler', 'total_amount', 'amount_paid', 'amount_due',
            'payment_status', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['amount_due', 'payment_status', 'created_at', 'updated_at']


class PurchaseBillUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseBill
        fields = ['amount_paid', 'notes']
