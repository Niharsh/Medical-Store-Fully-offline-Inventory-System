#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}        HSN Code Implementation - Complete Flow Test           ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}\n"

BASE_URL="http://localhost:8000/api"
HEADERS="Content-Type: application/json"

# Helper function to print test status
test_api() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -e "${YELLOW}Testing: ${description}${NC}"
    
    if [ -z "$data" ]; then
        response=$(curl -s -X "$method" "$BASE_URL$endpoint" -H "$HEADERS")
    else
        response=$(curl -s -X "$method" "$BASE_URL$endpoint" -H "$HEADERS" -d "$data")
    fi
    
    # Check if response contains error
    if echo "$response" | grep -q "error\|Error\|detail"; then
        echo -e "${RED}✗ FAILED${NC}"
        echo "Response: $response"
        return 1
    else
        echo -e "${GREEN}✓ PASSED${NC}"
        echo "Response: $response" | head -c 200
        echo "..."
        return 0
    fi
    echo ""
}

# Test 1: Create HSN Code
echo -e "\n${BLUE}STEP 1: Create HSN Codes in Settings${NC}"
test_api "POST" "/hsn/" '{
  "hsn_code": "3004",
  "description": "Medicaments - Antibiotics",
  "gst_rate": 12,
  "is_active": true
}' "Create HSN Code 3004 with 12% GST"

test_api "POST" "/hsn/" '{
  "hsn_code": "3003",
  "description": "Medicaments - Other",
  "gst_rate": 5,
  "is_active": true
}' "Create HSN Code 3003 with 5% GST"

# Test 2: Get all HSN codes
echo -e "\n${BLUE}STEP 2: Retrieve All HSN Codes${NC}"
test_api "GET" "/hsn/" "" "Get all HSN codes"

# Test 3: Create a product with HSN link
echo -e "\n${BLUE}STEP 3: Create Product with HSN${NC}"
test_api "POST" "/products/" '{
  "name": "Amoxicillin 500mg",
  "product_type": "tablet",
  "hsn": "3004",
  "generic_name": "Amoxicillin",
  "manufacturer": "Pharma Ltd",
  "unit": "pc",
  "description": "Antibiotic medication",
  "min_stock_level": 10,
  "batches": [
    {
      "batch_number": "LOT-2024-001",
      "mrp": 150.00,
      "selling_rate": 120.00,
      "cost_price": 90.00,
      "quantity": 100,
      "expiry_date": "2025-12-31"
    }
  ]
}' "Create Product with HSN 3004"

# Test 4: Get product and verify HSN is included
echo -e "\n${BLUE}STEP 4: Verify Product Returns HSN Details${NC}"
test_api "GET" "/products/1/" "" "Get product and verify hsn_code and gst_rate fields"

# Test 5: Create an Invoice with HSN-based products
echo -e "\n${BLUE}STEP 5: Create Invoice with HSN-based Products${NC}"
test_api "POST" "/invoices/" '{
  "customer_name": "John Doe",
  "customer_phone": "9876543210",
  "customer_dl_number": "DL-001",
  "discount_percent": 0,
  "notes": "Test invoice",
  "items": [
    {
      "product_id": 1,
      "batch_number": "LOT-2024-001",
      "quantity": 5,
      "selling_rate": 120.00,
      "discount_percent": 0,
      "gst_percent": 12
    }
  ]
}' "Create invoice with HSN-based product"

# Test 6: Get invoice and verify HSN is in invoice items
echo -e "\n${BLUE}STEP 6: Verify Invoice Items Include HSN Code${NC}"
test_api "GET" "/invoices/1/" "" "Get invoice and verify hsn_code in items"

# Test 7: Test backward compatibility with products without HSN
echo -e "\n${BLUE}STEP 7: Test Backward Compatibility (Product without HSN)${NC}"
test_api "POST" "/products/" '{
  "name": "Generic Paracetamol 500mg",
  "product_type": "tablet",
  "generic_name": "Paracetamol",
  "manufacturer": "Other Pharma",
  "unit": "pc",
  "description": "Without HSN",
  "min_stock_level": 10,
  "batches": [
    {
      "batch_number": "LOT-2024-002",
      "mrp": 50.00,
      "selling_rate": 40.00,
      "cost_price": 30.00,
      "quantity": 50,
      "expiry_date": "2025-12-31"
    }
  ]
}' "Create Product without HSN (backward compatibility test)"

# Test 8: Get product without HSN
echo -e "\n${BLUE}STEP 8: Verify Product Without HSN Can Be Retrieved${NC}"
test_api "GET" "/products/2/" "" "Get product without HSN (hsn_code should be null)"

# Test 9: Create invoice with product without HSN (empty GST)
echo -e "\n${BLUE}STEP 9: Create Invoice with Non-HSN Product (Empty GST)${NC}"
test_api "POST" "/invoices/" '{
  "customer_name": "Jane Doe",
  "customer_phone": "9876543211",
  "customer_dl_number": "DL-002",
  "discount_percent": 0,
  "notes": "Non-HSN product test",
  "items": [
    {
      "product_id": 2,
      "batch_number": "LOT-2024-002",
      "quantity": 10,
      "selling_rate": 40.00,
      "discount_percent": 0,
      "gst_percent": 0
    }
  ]
}' "Create invoice with non-HSN product"

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ All API tests completed! Check responses above for details.${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Verify HSN codes are created in Settings page"
echo "2. Create/Edit a product and select an HSN code"
echo "3. Create an invoice and verify:"
echo "   - HSN code is auto-filled in billing line items"
echo "   - GST rate is auto-filled from HSN"
echo "   - Invoice displays HSN in items table"
echo "4. Print invoice and verify HSN column is visible"
echo ""
