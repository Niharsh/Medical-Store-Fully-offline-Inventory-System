#!/bin/bash

# Test shop profile POST endpoint (create-or-replace behavior)
API_URL="http://127.0.0.1:8000/api/shop-profile/"

echo "=========================================="
echo "Testing Shop Profile Endpoint (POST Only)"
echo "=========================================="
echo ""

# First, try to GET existing profile
echo "1. GET /api/shop-profile/ (fetch existing)"
curl -s -X GET "$API_URL" | python3 -m json.tool
echo ""
echo ""

# Test POST with new data
echo "2. POST /api/shop-profile/ (create-or-replace)"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "shop_name": "Test Medical Store",
    "owner_name": "John Doe",
    "phone": "9876543210",
    "address": "123 Main Street",
    "gst_number": "18AABCT1234H1Z0",
    "dl_number": "DL-123456789"
  }' | python3 -m json.tool

echo ""
echo ""

# Verify by GET
echo "3. GET /api/shop-profile/ (verify data persisted)"
curl -s -X GET "$API_URL" | python3 -m json.tool

echo ""
echo ""

# Test POST again with different data (should update, not create new)
echo "4. POST /api/shop-profile/ again (should replace, not fail)"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "shop_name": "Updated Medical Store",
    "owner_name": "Jane Smith",
    "phone": "9876543211",
    "address": "456 Oak Street",
    "gst_number": "18AABCT1234H1Z1",
    "dl_number": "DL-987654321"
  }' | python3 -m json.tool

echo ""
echo ""

# Final verification
echo "5. GET /api/shop-profile/ (verify update worked)"
curl -s -X GET "$API_URL" | python3 -m json.tool

echo ""
echo "=========================================="
echo "Test Complete!"
echo "=========================================="
