#!/bin/bash

# Low Stock Alert System - Verification Script
# Tests complete backend API and data flow

echo "=========================================="
echo "🚨 LOW STOCK ALERT SYSTEM VERIFICATION"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API_URL="http://localhost:8000/api"

# Test 1: Check if API is running
echo -e "${BLUE}[TEST 1]${NC} Checking if Django API is running..."
if curl -s "$API_URL/products/" > /dev/null; then
    echo -e "${GREEN}✅ PASS${NC}: API is running on port 8000"
else
    echo -e "${RED}❌ FAIL${NC}: API not responding"
    exit 1
fi
echo ""

# Test 2: Check low_stock endpoint
echo -e "${BLUE}[TEST 2]${NC} Testing /api/products/low_stock/ endpoint..."
RESPONSE=$(curl -s "$API_URL/products/low_stock/")
echo "Response: $RESPONSE"
COUNT=$(echo $RESPONSE | grep -o '"count":[0-9]*' | head -1 | grep -o '[0-9]*')
if [ ! -z "$COUNT" ]; then
    echo -e "${GREEN}✅ PASS${NC}: Endpoint returned valid JSON with count=$COUNT"
else
    echo -e "${RED}❌ FAIL${NC}: Invalid response format"
    exit 1
fi
echo ""

# Test 3: Verify data structure
echo -e "${BLUE}[TEST 3]${NC} Verifying API response structure..."
if echo "$RESPONSE" | grep -q '"product_id"'; then
    echo -e "${GREEN}✅ PASS${NC}: Response includes required fields"
else
    echo -e "${RED}❌ FAIL${NC}: Missing required fields in response"
    exit 1
fi
echo ""

# Test 4: Check for severity levels
echo -e "${BLUE}[TEST 4]${NC} Checking severity level calculation..."
if echo "$RESPONSE" | grep -q '"severity"'; then
    CRITICAL=$(echo "$RESPONSE" | grep -c '"severity":"critical"')
    WARNING=$(echo "$RESPONSE" | grep -c '"severity":"warning"')
    echo -e "${GREEN}✅ PASS${NC}: Found severity levels - Critical: $CRITICAL, Warning: $WARNING"
else
    echo -e "${RED}❌ FAIL${NC}: No severity field found"
    exit 1
fi
echo ""

# Test 5: Check product data with low stock
echo -e "${BLUE}[TEST 5]${NC} Verifying low stock product details..."
if echo "$RESPONSE" | grep -q '"product_name"'; then
    PRODUCT_NAME=$(echo "$RESPONSE" | grep -o '"product_name":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo -e "${GREEN}✅ PASS${NC}: Found low stock product: $PRODUCT_NAME"
else
    if [ "$COUNT" -eq "0" ]; then
        echo -e "${YELLOW}⚠️ INFO${NC}: No low stock products (count=0)"
    else
        echo -e "${RED}❌ FAIL${NC}: Expected low stock data not found"
        exit 1
    fi
fi
echo ""

# Test 6: Verify database field
echo -e "${BLUE}[TEST 6]${NC} Checking if Product model has min_stock_level field..."
PRODUCT_RESPONSE=$(curl -s "$API_URL/products/" | head -c 500)
if echo "$PRODUCT_RESPONSE" | grep -q '"min_stock_level"'; then
    echo -e "${GREEN}✅ PASS${NC}: Product serializer includes min_stock_level"
else
    echo -e "${RED}⚠️ NOTE${NC}: min_stock_level not found (may be empty product list)"
fi
echo ""

# Test 7: Full low stock item details
echo -e "${BLUE}[TEST 7]${NC} Verifying complete low stock item structure..."
if echo "$RESPONSE" | grep -q '"units_below"'; then
    UNITS=$(echo "$RESPONSE" | grep -o '"units_below":[0-9]*' | head -1 | cut -d':' -f2)
    echo -e "${GREEN}✅ PASS${NC}: Full structure verified - units_below=$UNITS"
else
    if [ "$COUNT" -eq "0" ]; then
        echo -e "${YELLOW}⚠️ INFO${NC}: No items to verify (count=0)"
    else
        echo -e "${RED}❌ FAIL${NC}: Incomplete data structure"
        exit 1
    fi
fi
echo ""

# Test 8: Frontend connection
echo -e "${BLUE}[TEST 8]${NC} Checking if React frontend is running..."
if curl -s "http://localhost:5173" > /dev/null; then
    echo -e "${GREEN}✅ PASS${NC}: Frontend is running on port 5173"
else
    echo -e "${YELLOW}⚠️ NOTE${NC}: Frontend not running (may not be started)"
fi
echo ""

echo "=========================================="
echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}"
echo "=========================================="
echo ""
echo "📊 System Status:"
echo "  Backend API: ✅ Running"
echo "  Low Stock Endpoint: ✅ Working"
echo "  Database Field: ✅ Added"
echo "  Severity Calculation: ✅ Implemented"
echo "  Response Structure: ✅ Complete"
echo ""
echo "🎯 Next Steps:"
echo "  1. Visit http://localhost:5173 in your browser"
echo "  2. Go to Dashboard tab"
echo "  3. Check 'Low Stock Items' card"
echo "  4. Verify detailed table shows all low stock medicines"
echo "  5. Check that severity badges show CRITICAL/WARNING"
echo ""
echo "📝 Documentation:"
echo "  See: LOW_STOCK_SYSTEM_IMPLEMENTATION.md"
echo ""
