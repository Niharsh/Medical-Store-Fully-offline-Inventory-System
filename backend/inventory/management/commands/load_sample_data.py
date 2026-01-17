from django.core.management.base import BaseCommand
from inventory.models import ProductType, Product, Batch
from datetime import datetime, timedelta


class Command(BaseCommand):
    help = 'Load sample product data for testing'

    def handle(self, *args, **options):
        # Create product types if they don't exist
        product_types_data = [
            ('tablet', 'Tablet'),
            ('syrup', 'Syrup'),
            ('powder', 'Powder'),
            ('cream', 'Cream'),
            ('diaper', 'Diaper'),
            ('condom', 'Condom'),
            ('sachet', 'Sachet'),
        ]

        product_types = {}
        for name, label in product_types_data:
            pt, created = ProductType.objects.get_or_create(
                name=name,
                defaults={'label': label, 'is_default': True}
            )
            product_types[label] = pt
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Created ProductType: {label}'))

        # Create sample products
        products_data = [
            {
                'name': 'Aspirin 500mg',
                'generic_name': 'Acetylsalicylic Acid',
                'manufacturer': 'Generic Pharma Ltd',
                'salt_composition': 'Acetylsalicylic Acid 500mg',
                'unit': 'Strip of 10 Tablets',
                'product_type': 'Tablet',
                'description': 'Pain relief and anti-inflammatory',
                'batches': [
                    {'batch_number': 'ASP001', 'mrp': 50, 'selling_rate': 40, 'cost_price': 20, 'quantity': 100, 'expiry_date': (datetime.now() + timedelta(days=365)).date()},
                    {'batch_number': 'ASP002', 'mrp': 50, 'selling_rate': 40, 'cost_price': 20, 'quantity': 150, 'expiry_date': (datetime.now() + timedelta(days=550)).date()},
                ]
            },
            {
                'name': 'Cough Syrup',
                'generic_name': 'Dextromethorphan + Chlorpheniramine',
                'manufacturer': 'Relief Pharma',
                'salt_composition': 'Dextromethorphan 10mg + Chlorpheniramine 2mg per 5ml',
                'unit': 'Bottle 100ml',
                'product_type': 'Syrup',
                'description': 'Cough suppressant and antihistamine',
                'batches': [
                    {'batch_number': 'COUGH001', 'mrp': 75, 'selling_rate': 60, 'cost_price': 30, 'quantity': 80, 'expiry_date': (datetime.now() + timedelta(days=300)).date()},
                ]
            },
            {
                'name': 'Vitamin C Powder',
                'generic_name': 'Ascorbic Acid',
                'manufacturer': 'Health Plus',
                'salt_composition': 'Ascorbic Acid 1000mg per sachet',
                'unit': 'Sachet',
                'product_type': 'Sachet',
                'description': 'Immune system booster',
                'batches': [
                    {'batch_number': 'VIT001', 'mrp': 15, 'selling_rate': 12, 'cost_price': 5, 'quantity': 500, 'expiry_date': (datetime.now() + timedelta(days=730)).date()},
                    {'batch_number': 'VIT002', 'mrp': 15, 'selling_rate': 12, 'cost_price': 5, 'quantity': 300, 'expiry_date': (datetime.now() + timedelta(days=800)).date()},
                ]
            },
            {
                'name': 'Antiseptic Cream',
                'generic_name': 'Neomycin + Bacitracin',
                'manufacturer': 'Care Derma',
                'salt_composition': 'Neomycin 3.5mg + Bacitracin 400IU per gram',
                'unit': 'Tube 20g',
                'product_type': 'Cream',
                'description': 'Wound healing and antiseptic',
                'batches': [
                    {'batch_number': 'CREAM001', 'mrp': 120, 'selling_rate': 100, 'cost_price': 50, 'quantity': 60, 'expiry_date': (datetime.now() + timedelta(days=450)).date()},
                ]
            },
            {
                'name': 'Baby Diapers (Size M)',
                'generic_name': 'Disposable Baby Diapers',
                'manufacturer': 'Baby Care Ltd',
                'salt_composition': 'Non-woven fabric with superabsorbent polymer',
                'unit': 'Pack of 40',
                'product_type': 'Diaper',
                'description': 'Comfortable and absorbent diapers for medium size babies',
                'batches': [
                    {'batch_number': 'DIAPER001', 'mrp': 850, 'selling_rate': 700, 'cost_price': 400, 'quantity': 45, 'expiry_date': (datetime.now() + timedelta(days=600)).date()},
                ]
            },
        ]

        for product_data in products_data:
            batches = product_data.pop('batches', [])
            product_type = product_data.pop('product_type')
            
            product, created = Product.objects.get_or_create(
                name=product_data['name'],
                manufacturer=product_data['manufacturer'],
                defaults={
                    'generic_name': product_data['generic_name'],
                    'salt_composition': product_data['salt_composition'],
                    'unit': product_data['unit'],
                    'product_type': product_types[product_type],
                    'description': product_data['description'],
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Created Product: {product.name}'))
            
            # Add batches
            for batch_data in batches:
                batch, batch_created = Batch.objects.get_or_create(
                    product=product,
                    batch_number=batch_data['batch_number'],
                    defaults={
                        'mrp': batch_data['mrp'],
                        'selling_rate': batch_data['selling_rate'],
                        'cost_price': batch_data['cost_price'],
                        'quantity': batch_data['quantity'],
                        'expiry_date': batch_data['expiry_date'],
                    }
                )
                if batch_created:
                    self.stdout.write(f'  ✓ Added Batch: {batch_data["batch_number"]}')

        self.stdout.write(self.style.SUCCESS('\n✅ Sample data loaded successfully!'))
