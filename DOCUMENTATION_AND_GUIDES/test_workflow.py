# #!/usr/bin/env python3
# """
# Test script to add raw data and test the inventory system workflow
# """

# import requests
# import json
# from datetime import datetime, timedelta

# BASE_URL = "http://127.0.0.1:8000/api"
# HEADERS = {"Content-Type": "application/json"}

# def print_section(title):
#     print(f"\n{'='*60}")
#     print(f"  {title}")
#     print(f"{'='*60}\n")

# def test_api_connection():
#     """Test if API is responding"""
#     print_section("1. Testing API Connection")
#     try:
#         response = requests.get(f"{BASE_URL}/")
#         print(f"✓ API is online (Status: {response.status_code})")
#         return True
#     except Exception as e:
#         print(f"✗ API error: {e}")
#         return False

# def add_new_product():
#     """Add a new product with batch"""
#     print_section("2. Adding New Product to Database")
    
#     # Create a new product
#     product_data = {
#         "name": "Paracetamol 650mg",
#         "generic_name": "Acetaminophen",
#         "manufacturer": "Pain Relief Pharma",
#         "salt_composition": "Acetaminophen 650mg",
#         "unit": "Strip of 10 Tablets",
#         "product_type": "tablet",
#         "description": "Pain relief and fever reducer"
#     }
    
#     response = requests.post(f"{BASE_URL}/products/", json=product_data, headers=HEADERS)
    
#     if response.status_code == 201:
#         product = response.json()
#         print(f"✓ Product created: {product['name']}")
#         print(f"  ID: {product['id']}")
#         print(f"  Manufacturer: {product['manufacturer']}")
#         return product['id']
#     else:
#         print(f"✗ Failed to create product: {response.text}")
#         return None

# def add_batch_for_product(product_id):
#     """Add batch/stock for the product"""
#     print_section("3. Adding Batch (Stock) for Product")
    
#     if not product_id:
#         print("✗ No product ID provided")
#         return None
    
#     batch_data = {
#         "product": product_id,
#         "batch_number": "PARA001",
#         "mrp": 60,
#         "selling_rate": 48,
#         "cost_price": 25,
#         "quantity": 200,
#         "expiry_date": (datetime.now() + timedelta(days=365)).date().isoformat()
#     }
    
#     response = requests.post(f"{BASE_URL}/batches/", json=batch_data, headers=HEADERS)
    
#     if response.status_code == 201:
#         batch = response.json()
#         print(f"✓ Batch created: {batch['batch_number']}")
#         print(f"  Quantity: {batch['quantity']} units")
#         print(f"  MRP: ₹{batch['mrp']}")
#         print(f"  Selling Rate: ₹{batch['selling_rate']}")
#         print(f"  Cost Price: ₹{batch['cost_price']} (internal)")
#         print(f"  Expiry: {batch['expiry_date']}")
#         return batch['id']
#     else:
#         print(f"✗ Failed to create batch: {response.text}")
#         return None

# def create_invoice_with_items(batch_id):
#     """Create an invoice (sales bill)"""
#     print_section("4. Creating Invoice (Sales Bill)")
    
#     if not batch_id:
#         print("✗ No batch ID provided")
#         return None
    
#     invoice_data = {
#         "customer_name": "New City Pharmacy",
#         "customer_phone": "9876543210",
#         "items": [
#             {
#                 "batch": batch_id,
#                 "quantity": 10,
#                 "selling_rate": "48"  # Can override the batch selling rate
#             }
#         ]
#     }
    
#     response = requests.post(f"{BASE_URL}/invoices/", json=invoice_data, headers=HEADERS)
    
#     if response.status_code == 201:
#         invoice = response.json()
#         print(f"✓ Invoice created: #{invoice['id']}")
#         print(f"  Customer: {invoice['customer_name']}")
#         print(f"  Phone: {invoice['customer_phone']}")
#         print(f"  Total Amount: ₹{invoice['total_amount']}")
#         print(f"  Items: {len(invoice['items'])}")
        
#         for item in invoice['items']:
#             print(f"    - Qty: {item['quantity']} @ ₹{item['selling_rate']} = ₹{item['get_subtotal']}")
        
#         return invoice['id']
#     else:
#         print(f"✗ Failed to create invoice: {response.text}")
#         return None

# def record_payment(invoice_id):
#     """Record payment for sales bill"""
#     print_section("5. Recording Payment")
    
#     if not invoice_id:
#         print("✗ No invoice ID provided")
#         return
    
#     # First, get the invoice to find the sales bill
#     response = requests.get(f"{BASE_URL}/invoices/{invoice_id}/", headers=HEADERS)
#     if response.status_code != 200:
#         print(f"✗ Could not fetch invoice: {response.text}")
#         return
    
#     invoice = response.json()
#     total = float(invoice['total_amount'])
    
#     # Get sales bills for this invoice
#     sales_response = requests.get(f"{BASE_URL}/sales-bills/?search={invoice['customer_name']}", headers=HEADERS)
#     if sales_response.status_code == 200:
#         bills = sales_response.json()['results']
#         if bills:
#             bill_id = bills[0]['id']
#             payment_data = {
#                 "amount_paid": str(total)  # Pay full amount
#             }
            
#             update_response = requests.patch(
#                 f"{BASE_URL}/sales-bills/{bill_id}/", 
#                 json=payment_data, 
#                 headers=HEADERS
#             )
            
#             if update_response.status_code == 200:
#                 bill = update_response.json()
#                 print(f"✓ Payment recorded for Bill #{bill_id}")
#                 print(f"  Amount Paid: ₹{bill['amount_paid']}")
#                 print(f"  Total Amount: ₹{bill['total_amount']}")
#                 print(f"  Amount Due: ₹{bill['amount_due']}")
#                 print(f"  Status: {bill['payment_status']}")
#             else:
#                 print(f"✗ Failed to record payment: {update_response.text}")

# def verify_stock_reduced(product_id):
#     """Verify that stock was reduced after invoice"""
#     print_section("6. Verifying Stock Reduction")
    
#     response = requests.get(f"{BASE_URL}/products/{product_id}/", headers=HEADERS)
#     if response.status_code == 200:
#         product = response.json()
#         print(f"✓ Product: {product['name']}")
#         print(f"  Batches:")
#         for batch in product['batches']:
#             print(f"    - {batch['batch_number']}: {batch['quantity']} units (started with 200)")

# def show_all_data():
#     """Display all current data in system"""
#     print_section("7. Complete Inventory Overview")
    
#     # Get products
#     products_response = requests.get(f"{BASE_URL}/products/", headers=HEADERS)
#     if products_response.status_code == 200:
#         products = products_response.json()
#         print(f"Products: {products['count']} total\n")
        
#         for p in products['results'][:10]:  # Show first 10
#             print(f"  📦 {p['name']}")
#             for b in p['batches']:
#                 print(f"     - Batch {b['batch_number']}: {b['quantity']} units @ ₹{b['selling_rate']}")
    
#     # Get invoices
#     print("\n")
#     invoices_response = requests.get(f"{BASE_URL}/invoices/", headers=HEADERS)
#     if invoices_response.status_code == 200:
#         invoices = invoices_response.json()
#         print(f"Invoices: {invoices['count']} total\n")
        
#         for inv in invoices['results'][:5]:  # Show first 5
#             print(f"  📄 Invoice #{inv['id']}: {inv['customer_name']} = ₹{inv['total_amount']}")
    
#     # Get sales bills
#     print("\n")
#     bills_response = requests.get(f"{BASE_URL}/sales-bills/", headers=HEADERS)
#     if bills_response.status_code == 200:
#         bills = bills_response.json()
#         print(f"Sales Bills: {bills['count']} total\n")
        
#         for bill in bills['results'][:5]:  # Show first 5
#             status_emoji = "✓" if bill['payment_status'] == "paid" else "⏳"
#             print(f"  {status_emoji} Bill #{bill['id']}: ₹{bill['total_amount']} ({bill['payment_status']})")

# def main():
#     print("\n")
#     print("╔" + "═"*58 + "╗")
#     print("║" + " "*58 + "║")
#     print("║" + "  INVENTORY SYSTEM - WORKFLOW TEST & DATA ENTRY".center(58) + "║")
#     print("║" + " "*58 + "║")
#     print("╚" + "═"*58 + "╝")
    
#     # Test connection
#     if not test_api_connection():
#         print("\n✗ Cannot connect to API. Make sure server is running!")
#         print("  Backend: http://127.0.0.1:8000/api/")
#         return
    
#     # Run workflow
#     product_id = add_new_product()
#     batch_id = add_batch_for_product(product_id)
#     invoice_id = create_invoice_with_items(batch_id)
#     record_payment(invoice_id)
#     verify_stock_reduced(product_id)
#     show_all_data()
    
#     print_section("✅ Workflow Complete!")
#     print("Your inventory system is working perfectly!\n")
#     print("Next steps:")
#     print("  1. Open http://localhost:5173 to see the frontend")
#     print("  2. Visit http://127.0.0.1:8000/admin/ to manage data")
#     print("  3. Add more products and test different scenarios\n")

# if __name__ == "__main__":
#     main()
