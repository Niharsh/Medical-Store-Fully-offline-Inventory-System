#!/bin/bash

# Test backend API endpoints
echo "=== Testing Django Backend API ==="
echo ""

echo "1. Testing Products Endpoint:"
curl -s http://127.0.0.1:8000/api/products/ | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(f'   ✓ Products found: {data.get(\"count\", 0)}')
    if data.get('results'):
        print(f'   Sample: {data[\"results\"][0][\"name\"]}')
except Exception as e:
    print(f'   ✗ Error: {e}')
"

echo ""
echo "2. Testing Batches Endpoint:"
curl -s http://127.0.0.1:8000/api/batches/ | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(f'   ✓ Batches found: {data.get(\"count\", 0)}')
except Exception as e:
    print(f'   ✗ Error: {e}')
"

echo ""
echo "3. Testing Admin Panel:"
curl -s -I http://127.0.0.1:8000/admin/ | grep -E "HTTP|Location" | head -1

echo ""
echo "4. Testing API Root:"
curl -s http://127.0.0.1:8000/api/ | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print('   ✓ Available endpoints:')
    for key in data.keys():
        print(f'     - {key}')
except Exception as e:
    print(f'   ✗ Error: {e}')
"

echo ""
echo "=== All Tests Complete ==="
