#!/bin/bash

echo "🧪 Testing Quantity Update Fix"
echo "=============================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API="http://localhost:8000/api"

# Step 1: Create a test product
echo -e "${BLUE}Step 1: Creating test product...${NC}"
CREATE_RESPONSE=$(curl -s -X POST "$API/products/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Quantity Fix",
    "generic_name": "TQF",
    "manufacturer": "Test Mfg",
    "min_stock_level": 10,
    "batches": [
      {
        "batch_number": "BATCH001",
        "quantity": 50,
        "manufacturing_date": "2024-01-01",
        "expiry_date": "2025-12-31"
      }
    ]
  }')

PRODUCT_ID=$(echo $CREATE_RESPONSE | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ -z "$PRODUCT_ID" ]; then
  echo -e "${RED}❌ Failed to create product${NC}"
  echo "Response: $CREATE_RESPONSE"
  exit 1
fi

echo -e "${GREEN}✅ Product created with ID: $PRODUCT_ID${NC}"
echo "   Initial quantity in batch: 50"
echo ""

# Step 2: Get initial product data
echo -e "${BLUE}Step 2: Fetching initial product data...${NC}"
INITIAL=$(curl -s -X GET "$API/products/$PRODUCT_ID/")
echo "Initial data:"
echo $INITIAL | jq '.batches[0] | {batch_number, quantity}'
echo ""

# Step 3: Update quantity via API
echo -e "${BLUE}Step 3: Updating batch quantity to 100...${NC}"
UPDATE_RESPONSE=$(curl -s -X PUT "$API/products/$PRODUCT_ID/" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Quantity Fix",
    "generic_name": "TQF",
    "manufacturer": "Test Mfg",
    "min_stock_level": 10,
    "batches": [
      {
        "batch_number": "BATCH001",
        "quantity": 100,
        "manufacturing_date": "2024-01-01",
        "expiry_date": "2025-12-31"
      }
    ]
  }')

echo "Update response:"
echo $UPDATE_RESPONSE | jq '.batches[0] | {batch_number, quantity}'
echo ""

# Step 4: Verify quantity was updated
echo -e "${BLUE}Step 4: Verifying quantity update in database...${NC}"
VERIFY=$(curl -s -X GET "$API/products/$PRODUCT_ID/")
UPDATED_QUANTITY=$(echo $VERIFY | jq '.batches[0].quantity')

if [ "$UPDATED_QUANTITY" = "100" ]; then
  echo -e "${GREEN}✅ SUCCESS: Quantity correctly updated to $UPDATED_QUANTITY${NC}"
else
  echo -e "${RED}❌ FAILED: Quantity is $UPDATED_QUANTITY (expected 100)${NC}"
fi

echo ""
echo -e "${BLUE}Final product data:${NC}"
echo $VERIFY | jq '.batches[0]'
echo ""

# Cleanup
echo -e "${BLUE}Cleaning up test data...${NC}"
curl -s -X DELETE "$API/products/$PRODUCT_ID/" > /dev/null
echo -e "${GREEN}✅ Test product deleted${NC}"
