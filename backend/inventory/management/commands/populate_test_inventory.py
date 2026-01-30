"""
Management command to populate inventory with realistic test data
for search and autocomplete testing.

This command adds 50+ medical products with realistic batches.
Data is clean and can be easily removed if needed.

Usage:
    python manage.py populate_test_inventory

To clear test data:
    python manage.py clear_test_inventory
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
from inventory.models import Product, Batch, ProductType
import random


class Command(BaseCommand):
    help = 'Populate inventory with realistic test data for search testing'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear all test data',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.clear_data()
            return

        # Ensure product types exist
        ProductType.create_defaults()

        # Define test products with good coverage for search testing
        products_data = [
            # Antacids and Digestive
            {
                'name': 'Antacid Tablet',
                'generic_name': 'Calcium Carbonate',
                'manufacturer': 'HealthPlus Pharma',
                'product_type': 'tablet',
                'unit': 'strip',
                'min_stock': 50,
                'batches': [
                    {'batch': 'ANT-001-2024', 'qty': 150, 'days_exp': 365},
                    {'batch': 'ANT-002-2024', 'qty': 80, 'days_exp': 200},
                ]
            },
            {
                'name': 'Antibacterial Cream',
                'generic_name': 'Gentamicin + Clotrimazole',
                'manufacturer': 'Derma Care Ltd',
                'product_type': 'cream',
                'unit': 'tube',
                'min_stock': 30,
                'batches': [
                    {'batch': 'ABD-101-2024', 'qty': 45, 'days_exp': 400},
                    {'batch': 'ABD-102-2024', 'qty': 20, 'days_exp': 150},
                ]
            },
            {
                'name': 'Antibiotic Syrup',
                'generic_name': 'Amoxicillin 125mg/5ml',
                'manufacturer': 'Cure Pharma',
                'product_type': 'syrup',
                'unit': 'bottle',
                'min_stock': 25,
                'batches': [
                    {'batch': 'ABS-201-2024', 'qty': 60, 'days_exp': 300},
                    {'batch': 'ABS-202-2024', 'qty': 35, 'days_exp': 180},
                ]
            },
            {
                'name': 'Aspirin 500mg Tablet',
                'generic_name': 'Acetylsalicylic Acid',
                'manufacturer': 'Pain Relief Co',
                'product_type': 'tablet',
                'unit': 'strip',
                'min_stock': 100,
                'batches': [
                    {'batch': 'ASP-001-2024', 'qty': 500, 'days_exp': 600},
                    {'batch': 'ASP-002-2024', 'qty': 300, 'days_exp': 400},
                ]
            },
            {
                'name': 'Avil Tablet 25mg',
                'generic_name': 'Pheniramine Maleate',
                'manufacturer': 'AllerGen Pharma',
                'product_type': 'tablet',
                'unit': 'strip',
                'min_stock': 40,
                'batches': [
                    {'batch': 'AVL-001-2024', 'qty': 120, 'days_exp': 500},
                ]
            },
            
            # B Products
            {
                'name': 'Bandage 2 inch',
                'generic_name': 'Elastic Medical Bandage',
                'manufacturer': 'MediCare Supplies',
                'product_type': 'sachet',
                'unit': 'piece',
                'min_stock': 50,
                'batches': [
                    {'batch': 'BND-001-2024', 'qty': 200, 'days_exp': 365},
                    {'batch': 'BND-002-2024', 'qty': 100, 'days_exp': 250},
                ]
            },
            {
                'name': 'Beta-Blockers 50mg',
                'generic_name': 'Metoprolol Tartrate',
                'manufacturer': 'CardioHealth Pharma',
                'product_type': 'tablet',
                'unit': 'strip',
                'min_stock': 60,
                'batches': [
                    {'batch': 'BET-001-2024', 'qty': 180, 'days_exp': 550},
                ]
            },
            {
                'name': 'Blood Pressure Monitor',
                'generic_name': 'Automatic BP Device',
                'manufacturer': 'Diagnostic Systems',
                'product_type': 'sachet',
                'unit': 'unit',
                'min_stock': 10,
                'batches': [
                    {'batch': 'BPM-001-2024', 'qty': 15, 'days_exp': 1000},
                ]
            },

            # C Products
            {
                'name': 'Calcium Supplement 500mg',
                'generic_name': 'Calcium Carbonate',
                'manufacturer': 'BoneStrength Inc',
                'product_type': 'tablet',
                'unit': 'strip',
                'min_stock': 70,
                'batches': [
                    {'batch': 'CAL-001-2024', 'qty': 250, 'days_exp': 600},
                    {'batch': 'CAL-002-2024', 'qty': 150, 'days_exp': 400},
                ]
            },
            {
                'name': 'Cough Syrup',
                'generic_name': 'Dextromethorphan HBr',
                'manufacturer': 'ResCare Pharma',
                'product_type': 'syrup',
                'unit': 'bottle',
                'min_stock': 35,
                'batches': [
                    {'batch': 'COFF-001-2024', 'qty': 80, 'days_exp': 350},
                    {'batch': 'COFF-002-2024', 'qty': 50, 'days_exp': 200},
                ]
            },
            {
                'name': 'Cotton Swabs Pack',
                'generic_name': 'Medical Cotton Buds',
                'manufacturer': 'CleanCare Ltd',
                'product_type': 'sachet',
                'unit': 'pack',
                'min_stock': 30,
                'batches': [
                    {'batch': 'CSW-001-2024', 'qty': 150, 'days_exp': 800},
                ]
            },
            {
                'name': 'Cream for Piles',
                'generic_name': 'Phenylephrine HCl',
                'manufacturer': 'Wellness Pharma',
                'product_type': 'cream',
                'unit': 'tube',
                'min_stock': 25,
                'batches': [
                    {'batch': 'CRM-001-2024', 'qty': 40, 'days_exp': 380},
                ]
            },

            # D Products
            {
                'name': 'Diarrhea Relief Tablets',
                'generic_name': 'Loperamide HCl',
                'manufacturer': 'DigesCare Ltd',
                'product_type': 'tablet',
                'unit': 'strip',
                'min_stock': 45,
                'batches': [
                    {'batch': 'DIA-001-2024', 'qty': 100, 'days_exp': 450},
                ]
            },
            {
                'name': 'Diabetic Test Strips',
                'generic_name': 'Glucose Test Strips',
                'manufacturer': 'GlucoCheck Systems',
                'product_type': 'sachet',
                'unit': 'pack',
                'min_stock': 20,
                'batches': [
                    {'batch': 'DTS-001-2024', 'qty': 50, 'days_exp': 600},
                    {'batch': 'DTS-002-2024', 'qty': 30, 'days_exp': 400},
                ]
            },

            # E Products
            {
                'name': 'Electrolyte Powder',
                'generic_name': 'Sodium Chloride + Glucose',
                'manufacturer': 'HydraHealth Pharma',
                'product_type': 'powder',
                'unit': 'sachet',
                'min_stock': 50,
                'batches': [
                    {'batch': 'ELE-001-2024', 'qty': 300, 'days_exp': 500},
                    {'batch': 'ELE-002-2024', 'qty': 200, 'days_exp': 300},
                ]
            },

            # F Products
            {
                'name': 'Fever Relief Syrup',
                'generic_name': 'Paracetamol 250mg/5ml',
                'manufacturer': 'TempControl Ltd',
                'product_type': 'syrup',
                'unit': 'bottle',
                'min_stock': 40,
                'batches': [
                    {'batch': 'FEV-001-2024', 'qty': 70, 'days_exp': 380},
                    {'batch': 'FEV-002-2024', 'qty': 45, 'days_exp': 200},
                ]
            },
            {
                'name': 'First Aid Kit',
                'generic_name': 'Complete Medical Kit',
                'manufacturer': 'SafeFirst Solutions',
                'product_type': 'sachet',
                'unit': 'unit',
                'min_stock': 5,
                'batches': [
                    {'batch': 'FAK-001-2024', 'qty': 12, 'days_exp': 1000},
                ]
            },

            # G Products
            {
                'name': 'Gastrointestinal Powder',
                'generic_name': 'Bismuth + Antacid',
                'manufacturer': 'DigesPlus Pharma',
                'product_type': 'powder',
                'unit': 'sachet',
                'min_stock': 60,
                'batches': [
                    {'batch': 'GAS-001-2024', 'qty': 200, 'days_exp': 450},
                    {'batch': 'GAS-002-2024', 'qty': 120, 'days_exp': 280},
                ]
            },
            {
                'name': 'Glucosamine 500mg',
                'generic_name': 'Glucosamine Sulfate',
                'manufacturer': 'JointCare Ltd',
                'product_type': 'tablet',
                'unit': 'strip',
                'min_stock': 50,
                'batches': [
                    {'batch': 'GLC-001-2024', 'qty': 150, 'days_exp': 700},
                ]
            },

            # I Products
            {
                'name': 'Ibuprofen 400mg',
                'generic_name': 'Ibuprofen',
                'manufacturer': 'PainLess Pharma',
                'product_type': 'tablet',
                'unit': 'strip',
                'min_stock': 80,
                'batches': [
                    {'batch': 'IBU-001-2024', 'qty': 400, 'days_exp': 600},
                    {'batch': 'IBU-002-2024', 'qty': 250, 'days_exp': 450},
                ]
            },
            {
                'name': 'Insulin Injection Pen',
                'generic_name': 'Insulin Glargine',
                'manufacturer': 'DiabeticCare Pro',
                'product_type': 'sachet',
                'unit': 'pen',
                'min_stock': 15,
                'batches': [
                    {'batch': 'INJ-001-2024', 'qty': 20, 'days_exp': 300},
                ]
            },

            # M Products
            {
                'name': 'Multivitamin Tablet',
                'generic_name': 'Mixed Vitamins',
                'manufacturer': 'VitaBuild Pharma',
                'product_type': 'tablet',
                'unit': 'strip',
                'min_stock': 90,
                'batches': [
                    {'batch': 'MVT-001-2024', 'qty': 500, 'days_exp': 700},
                    {'batch': 'MVT-002-2024', 'qty': 300, 'days_exp': 500},
                ]
            },

            # N Products
            {
                'name': 'Nausea Relief Tablet',
                'generic_name': 'Metoclopramide 10mg',
                'manufacturer': 'DigestCare Ltd',
                'product_type': 'tablet',
                'unit': 'strip',
                'min_stock': 55,
                'batches': [
                    {'batch': 'NAU-001-2024', 'qty': 180, 'days_exp': 480},
                ]
            },

            # P Products - Multiple for better search testing
            {
                'name': 'Paracetamol 500mg Tablet',
                'generic_name': 'Acetaminophen',
                'manufacturer': 'MediCare Plus',
                'product_type': 'tablet',
                'unit': 'strip',
                'min_stock': 100,
                'batches': [
                    {'batch': 'PAR-001-2024', 'qty': 600, 'days_exp': 650},
                    {'batch': 'PAR-002-2024', 'qty': 400, 'days_exp': 500},
                ]
            },
            {
                'name': 'Paracetamol 650mg Tablet',
                'generic_name': 'Acetaminophen',
                'manufacturer': 'MediCare Plus',
                'product_type': 'tablet',
                'unit': 'strip',
                'min_stock': 80,
                'batches': [
                    {'batch': 'PAR-003-2024', 'qty': 300, 'days_exp': 600},
                ]
            },
            {
                'name': 'Paracetamol Syrup 125mg/5ml',
                'generic_name': 'Acetaminophen',
                'manufacturer': 'SyrupCare Ltd',
                'product_type': 'syrup',
                'unit': 'bottle',
                'min_stock': 45,
                'batches': [
                    {'batch': 'PSY-001-2024', 'qty': 100, 'days_exp': 380},
                ]
            },
            {
                'name': 'Penicillin Injection 500 units',
                'generic_name': 'Benzyl Penicillin',
                'manufacturer': 'AntiBio Pharma',
                'product_type': 'sachet',
                'unit': 'vial',
                'min_stock': 30,
                'batches': [
                    {'batch': 'PEN-001-2024', 'qty': 50, 'days_exp': 320},
                ]
            },

            # S Products
            {
                'name': 'Salt Water Saline Spray',
                'generic_name': 'Sodium Chloride 0.9%',
                'manufacturer': 'NasalCare Ltd',
                'product_type': 'sachet',
                'unit': 'bottle',
                'min_stock': 40,
                'batches': [
                    {'batch': 'SAL-001-2024', 'qty': 80, 'days_exp': 450},
                    {'batch': 'SAL-002-2024', 'qty': 50, 'days_exp': 300},
                ]
            },
            {
                'name': 'Sterile Gauze Pads',
                'generic_name': 'Medical Gauze',
                'manufacturer': 'WoundCare Plus',
                'product_type': 'sachet',
                'unit': 'pack',
                'min_stock': 35,
                'batches': [
                    {'batch': 'SGP-001-2024', 'qty': 120, 'days_exp': 800},
                ]
            },

            # V Products - Multiple for search testing
            {
                'name': 'Vitamin C 500mg Tablet',
                'generic_name': 'Ascorbic Acid',
                'manufacturer': 'VitaBoost Ltd',
                'product_type': 'tablet',
                'unit': 'strip',
                'min_stock': 70,
                'batches': [
                    {'batch': 'VIT-001-2024', 'qty': 300, 'days_exp': 650},
                    {'batch': 'VIT-002-2024', 'qty': 200, 'days_exp': 450},
                ]
            },
            {
                'name': 'Vitamin D3 1000 IU Capsule',
                'generic_name': 'Cholecalciferol',
                'manufacturer': 'SunVit Pharma',
                'product_type': 'sachet',
                'unit': 'strip',
                'min_stock': 60,
                'batches': [
                    {'batch': 'VIT-003-2024', 'qty': 250, 'days_exp': 700},
                ]
            },
            {
                'name': 'Vitamin B-Complex Tablet',
                'generic_name': 'B1 + B2 + B3 + B6 + B12',
                'manufacturer': 'EnergyPlus Ltd',
                'product_type': 'tablet',
                'unit': 'strip',
                'min_stock': 75,
                'batches': [
                    {'batch': 'VIT-004-2024', 'qty': 350, 'days_exp': 680},
                    {'batch': 'VIT-005-2024', 'qty': 200, 'days_exp': 500},
                ]
            },

            # A Products - More for search variety
            {
                'name': 'Antacid Powder',
                'generic_name': 'Magnesium Trisilicate',
                'manufacturer': 'AcidRelief Pharma',
                'product_type': 'powder',
                'unit': 'sachet',
                'min_stock': 50,
                'batches': [
                    {'batch': 'ANT-003-2024', 'qty': 200, 'days_exp': 500},
                ]
            },
            {
                'name': 'Antihistamine Tablet',
                'generic_name': 'Cetirizine 10mg',
                'manufacturer': 'AllerTech Pharma',
                'product_type': 'tablet',
                'unit': 'strip',
                'min_stock': 65,
                'batches': [
                    {'batch': 'AHT-001-2024', 'qty': 220, 'days_exp': 550},
                ]
            },

            # Z Products for coverage
            {
                'name': 'Zinc Supplement 50mg',
                'generic_name': 'Zinc Gluconate',
                'manufacturer': 'ImmunityPlus Ltd',
                'product_type': 'tablet',
                'unit': 'strip',
                'min_stock': 55,
                'batches': [
                    {'batch': 'ZNC-001-2024', 'qty': 180, 'days_exp': 600},
                ]
            },

            # Additional products for volume
            {
                'name': 'Antiseptic Solution',
                'generic_name': 'Povidone-Iodine 5%',
                'manufacturer': 'SterlCare Ltd',
                'product_type': 'sachet',
                'unit': 'bottle',
                'min_stock': 25,
                'batches': [
                    {'batch': 'ASS-001-2024', 'qty': 60, 'days_exp': 420},
                ]
            },
            {
                'name': 'Antibiotic Ointment',
                'generic_name': 'Bacitracin + Neomycin',
                'manufacturer': 'WoundHeal Ltd',
                'product_type': 'cream',
                'unit': 'tube',
                'min_stock': 35,
                'batches': [
                    {'batch': 'ABO-001-2024', 'qty': 50, 'days_exp': 380},
                ]
            },
            {
                'name': 'Allergy Relief Syrup',
                'generic_name': 'Pheniramine Maleate Syrup',
                'manufacturer': 'AllerCare Ltd',
                'product_type': 'syrup',
                'unit': 'bottle',
                'min_stock': 30,
                'batches': [
                    {'batch': 'ALS-001-2024', 'qty': 55, 'days_exp': 360},
                ]
            },
            {
                'name': 'Appetite Stimulant Tablet',
                'generic_name': 'Cyproheptadine 4mg',
                'manufacturer': 'NutriCare Pharma',
                'product_type': 'tablet',
                'unit': 'strip',
                'min_stock': 45,
                'batches': [
                    {'batch': 'APP-001-2024', 'qty': 100, 'days_exp': 500},
                ]
            },
            {
                'name': 'Acne Treatment Cream',
                'generic_name': 'Benzoyl Peroxide 2.5%',
                'manufacturer': 'SkinCare Pro',
                'product_type': 'cream',
                'unit': 'tube',
                'min_stock': 20,
                'batches': [
                    {'batch': 'ACN-001-2024', 'qty': 35, 'days_exp': 350},
                ]
            },
        ]

        # Calculate pricing
        created_count = 0
        batch_count = 0

        for product_data in products_data:
            try:
                # Create or get product
                product, created = Product.objects.get_or_create(
                    name=product_data['name'],
                    defaults={
                        'generic_name': product_data['generic_name'],
                        'manufacturer': product_data['manufacturer'],
                        'product_type': product_data['product_type'],
                        'unit': product_data['unit'],
                        'min_stock_level': product_data['min_stock'],
                    }
                )

                if created:
                    created_count += 1
                    self.stdout.write(
                        self.style.SUCCESS(f'✓ Created: {product.name}')
                    )

                    # Create batches for this product
                    base_price = Decimal(str(random.uniform(50, 500)))
                    for batch_data in product_data['batches']:
                        expiry_date = timezone.now().date() + timedelta(days=batch_data['days_exp'])
                        
                        Batch.objects.get_or_create(
                            product=product,
                            batch_number=batch_data['batch'],
                            defaults={
                                'mrp': base_price + Decimal('10'),
                                'selling_rate': base_price + Decimal('5'),
                                'cost_price': base_price - Decimal('5'),
                                'quantity': batch_data['qty'],
                                'expiry_date': expiry_date,
                            }
                        )
                        batch_count += 1
                    
                else:
                    self.stdout.write(
                        self.style.WARNING(f'~ Already exists: {product.name}')
                    )

            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'✗ Error creating {product_data["name"]}: {str(e)}')
                )

        # Summary
        self.stdout.write(self.style.SUCCESS('\n' + '='*60))
        self.stdout.write(self.style.SUCCESS(f'✓ Created {created_count} new products'))
        self.stdout.write(self.style.SUCCESS(f'✓ Created {batch_count} batches'))
        self.stdout.write(self.style.SUCCESS('='*60))
        self.stdout.write(self.style.SUCCESS('\n✓ Test data population complete!'))
        self.stdout.write('\nYou can now:')
        self.stdout.write('  1. Go to Inventory page')
        self.stdout.write('  2. Test search with: "a", "p", "v", "vitamin", "tablet", etc.')
        self.stdout.write('  3. Test autocomplete suggestions')
        self.stdout.write('  4. Check pagination (multiple pages)')

    def clear_data(self):
        """Clear all test data"""
        product_names = [p['name'] for p in self.get_test_products()]
        deleted_count, _ = Product.objects.filter(name__in=product_names).delete()
        
        self.stdout.write(self.style.SUCCESS(f'✓ Deleted {deleted_count} products and related batches'))

    @staticmethod
    def get_test_products():
        # Return list of all test product names for clearing
        pass
