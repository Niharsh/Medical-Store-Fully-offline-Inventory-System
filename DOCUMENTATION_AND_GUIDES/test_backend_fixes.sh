#!/bin/bash

# Backend API Test Script
# Tests the fixes for:
# 1. PurchaseBill search (ForeignKey fix)
# 2. Sales summary endpoint (Invoice totals)
# 3. Purchase summary endpoint (field names)

API_BASE="http://localhost:8000/api"

echo "🧪 Backend API Tests"
echo "===================="
echo ""

# Test 1: Search PurchaseBills
echo "📝 Test 1: Search PurchaseBills (ForeignKey search fix)"
echo "Request: GET $API_BASE/purchase-bills/?search=Test"
echo ""
curl -s "$API_BASE/purchase-bills/?search=Test" | python -m json.tool || echo "Server not responding - make sure Django is running on port 8000"
echo ""
echo ""

# Test 2: Sales Bills Summary
echo "📊 Test 2: Sales Bills Summary (includes Invoice totals)"
echo "Request: GET $API_BASE/sales-bills/summary/?period=month"
echo ""
curl -s "$API_BASE/sales-bills/summary/?period=month" | python -m json.tool || echo "Server not responding"
echo ""
echo ""

# Test 3: Purchase Bills Summary
echo "📦 Test 3: Purchase Bills Summary"
echo "Request: GET $API_BASE/purchase-bills/summary/?period=month"
echo ""
curl -s "$API_BASE/purchase-bills/summary/?period=month" | python -m json.tool || echo "Server not responding"
echo ""
echo ""

# Test 4: Search with special characters (previously caused 500)
echo "🔍 Test 4: Search with special characters"
echo "Request: GET $API_BASE/purchase-bills/?search=%"
echo ""
curl -s "$API_BASE/purchase-bills/?search=%" | python -m json.tool | head -20 || echo "Server not responding"
echo ""

echo "✅ Tests completed!"
echo ""
echo "📚 Documentation: See BACKEND_ERROR_FIX_GUIDE.md for detailed explanation"
