#!/bin/bash

# Autocomplete Fix - Verification Script
# This script helps verify that all fixes are working correctly

echo "╔════════════════════════════════════════════════════════════════════════════════╗"
echo "║              ✅ AUTOCOMPLETE FIX - VERIFICATION SCRIPT                         ║"
echo "╚════════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Check 1: Verify ProductAutocomplete.jsx exists and has new code
echo "📝 CHECK 1: ProductAutocomplete.jsx exists..."
if [ -f "frontend/src/components/Product/ProductAutocomplete.jsx" ]; then
    echo "✅ File found"
    
    # Check for error handling
    if grep -q "response.ok" "frontend/src/components/Product/ProductAutocomplete.jsx"; then
        echo "✅ Has response.ok check"
    else
        echo "❌ Missing response.ok check"
    fi
    
    # Check for Content-Type verification
    if grep -q "content-type" "frontend/src/components/Product/ProductAutocomplete.jsx"; then
        echo "✅ Has Content-Type check"
    else
        echo "❌ Missing Content-Type check"
    fi
    
    # Check for JSON parse safety
    if grep -q "JSON.parse(text)" "frontend/src/components/Product/ProductAutocomplete.jsx"; then
        echo "✅ Has safe JSON.parse with text variable"
    else
        echo "❌ Missing safe JSON.parse"
    fi
    
    # Check for input never clears
    if grep -q "setInputValue(value)" "frontend/src/components/Product/ProductAutocomplete.jsx"; then
        echo "✅ Input change handler looks safe"
    else
        echo "❌ Input change handler might not be safe"
    fi
    
    # Check for try-catch error handling
    CATCH_COUNT=$(grep -c "catch (error)" "frontend/src/components/Product/ProductAutocomplete.jsx")
    echo "✅ Found $CATCH_COUNT error handlers"
    
else
    echo "❌ File not found"
fi

echo ""
echo "📝 CHECK 2: ProductList.jsx updated..."
if [ -f "frontend/src/components/Product/ProductList.jsx" ]; then
    if grep -q "ProductAutocomplete" "frontend/src/components/Product/ProductList.jsx"; then
        echo "✅ ProductList imports ProductAutocomplete"
    else
        echo "❌ ProductList doesn't import ProductAutocomplete"
    fi
    
    if ! grep -q "ProductSearchBar" "frontend/src/components/Product/ProductList.jsx"; then
        echo "✅ ProductSearchBar import removed"
    else
        echo "⚠️  ProductSearchBar still imported"
    fi
else
    echo "❌ ProductList.jsx not found"
fi

echo ""
echo "📝 CHECK 3: Backend API check..."
if command -v curl &> /dev/null; then
    echo "Testing /api/products/ endpoint..."
    RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:8000/api/products/?limit=10)
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | head -n-1)
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo "✅ Backend API is running (HTTP 200)"
        
        # Check if response is JSON
        if echo "$BODY" | grep -q "{" || echo "$BODY" | grep -q "["; then
            echo "✅ Response looks like JSON"
        else
            echo "❌ Response doesn't look like JSON"
        fi
    else
        echo "❌ Backend API error (HTTP $HTTP_CODE)"
        echo "   → Make sure backend is running: python manage.py runserver"
    fi
else
    echo "⚠️  curl not found, skipping backend test"
fi

echo ""
echo "📝 CHECK 4: Frontend running..."
if command -v curl &> /dev/null; then
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173)
    if [ "$RESPONSE" = "200" ]; then
        echo "✅ Frontend is running on localhost:5173"
    else
        echo "❌ Frontend not responding (HTTP $RESPONSE)"
        echo "   → Make sure frontend is running: cd frontend && npm run dev"
    fi
else
    echo "⚠️  curl not found, skipping frontend test"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════════════════════╗"
echo "║                         NEXT STEPS FOR TESTING                                ║"
echo "╚════════════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "1. Open browser: http://localhost:5173"
echo "2. Navigate to Inventory page"
echo "3. Click search input, type 'a'"
echo "4. Check browser console (F12) for logs"
echo ""
echo "Expected Console Logs:"
echo "  ✅ Loaded 1000 products for autocomplete"
echo "  ✅ Input changed to: \"a\""
echo "  ✅ Filtering with query: \"a\""
echo "  ✅ Found XXX matching products"
echo ""
echo "Expected UI Behavior:"
echo "  ✓ Dropdown appears with suggestions"
echo "  ✓ Input shows 'a' (NOT cleared)"
echo "  ✓ No JSON parse errors"
echo "  ✓ No page refresh or flicker"
echo ""
echo "Test Results:"
echo "  [ ] Type one letter → see dropdown"
echo "  [ ] Input stays stable (no clearing)"
echo "  [ ] No JSON parse errors"
echo "  [ ] Keyboard navigation works (arrows, Enter, Esc)"
echo "  [ ] Click product → edit dialog opens"
echo ""
echo "Documentation:"
echo "  📖 AUTOCOMPLETE_FIX_COMPLETE.md (comprehensive guide)"
echo "  📖 AUTOCOMPLETE_QUICK_START.md (quick reference)"
echo "  📖 AUTOCOMPLETE_TESTING.md (detailed test cases)"
echo ""
echo "════════════════════════════════════════════════════════════════════════════════"
echo ""
