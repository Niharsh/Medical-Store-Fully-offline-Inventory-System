from django.contrib import admin
from .models import (
    ProductType, Product, Batch, Invoice, InvoiceItem,
    SalesBill, PurchaseBill, ShopProfile
)

admin.site.register(ProductType)
admin.site.register(Product)
admin.site.register(Batch)
admin.site.register(Invoice)
admin.site.register(InvoiceItem)
admin.site.register(SalesBill)
admin.site.register(PurchaseBill)
admin.site.register(ShopProfile)

# Register your models here.
