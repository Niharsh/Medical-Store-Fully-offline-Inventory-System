# 🆘 GETTING HELP - Comprehensive Support Guide

**Medical Store Inventory & Billing System**  
**Version**: 1.0  
**Updated**: January 21, 2026

---

## Quick Help Decision Tree

### The System Won't Start

↓ Check 1: Are both terminals running?
- **No**: Open two terminals, start both (see [SETUP_GUIDE.md](SETUP_GUIDE.md))
- **Yes**: Continue

↓ Check 2: Do you see error messages in terminals?
- **Yes**: Read [QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md) → "Backend Won't Start" or "Frontend Won't Start"
- **No**: Continue

↓ Check 3: Can you access http://localhost:5173?
- **No**: Check [QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md) → "Cannot Connect to Backend"
- **Yes**: System is working!

---

### I Can Access the System but Something's Not Working

**Products are not showing?**
→ [QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md) → "Products Not Showing"

**Delete button doesn't work?**
→ [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) → "Issue 2: Delete Handlers Stop Working"

**Invoice creation fails with HTTP 400?**
→ [QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md) → "Invoice Creation Still Returns HTTP 400"

**Forms show stale data?**
→ [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) → "Issue 4: Form Shows Stale Product Quantities"

**Edit button doesn't work?**
→ [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) → "Issue 2: Delete Handlers Stop Working" (similar issue)

**Something else?**
→ Check [DOCUMENTATION_GUIDE.md](DOCUMENTATION_GUIDE.md) to find the right document

---

## Help by Role

### 👤 I'm a Store Owner Using the System

#### Question: "How do I use the system?"
→ **Read**: [USER_GUIDE.md](USER_GUIDE.md)

#### Question: "What is this system for?"
→ **Read**: [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md) + [README.md](README.md)

#### Question: "How do I start the system?"
→ **Read**: [SETUP_GUIDE.md](SETUP_GUIDE.md) → "Quick Start"

#### Question: "What's the difference between MRP and Selling Rate?"
→ **Read**: [THREE_PRICE_MODEL.md](THREE_PRICE_MODEL.md)  
**Or**: [USER_GUIDE.md](USER_GUIDE.md) → "Managing Your Business" → "Understanding the Three Prices"

#### Question: "What if I make a mistake in an invoice?"
→ **Read**: [USER_GUIDE.md](USER_GUIDE.md) → "FAQ" → "Q6: Can I edit an invoice after creating it?"

#### Question: "Where is my data stored?"
→ **Read**: [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md) → "Database & Backup"

#### Question: "How do I backup my data?"
→ **Read**: [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md) → "Database & Backup" → "Backup Your Data"

#### Question: "How do I add a product?"
→ **Read**: [USER_GUIDE.md](USER_GUIDE.md) → "Add a New Product"

#### Question: "How do I create an invoice?"
→ **Read**: [USER_GUIDE.md](USER_GUIDE.md) → "Create an Invoice (Bill)"

#### Question: "The system is acting weird"
→ **Step 1**: Refresh the browser (Ctrl+R or F5)  
**Step 2**: Check [QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md)  
**Step 3**: If still broken, restart both servers

#### Question: "I have more questions"
→ **Read**: [USER_GUIDE.md](USER_GUIDE.md) → "FAQ" (Frequently Asked Questions)

---

### 👨‍💻 I'm a Developer/Maintainer

#### Question: "How does the system work?"
→ **Read**: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) → "System Architecture"

#### Question: "How is the code organized?"
→ **Read**: [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

#### Question: "What are the API endpoints?"
→ **Read**: [frontend/API_CONTRACTS.md](frontend/API_CONTRACTS.md)

#### Question: "How do products flow through the system?"
→ **Read**: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) → "Inventory Lifecycle"

#### Question: "How do invoices work?"
→ **Read**: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) → "Billing Lifecycle"

#### Question: "What state management is being used?"
→ **Read**: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) → "Key Components & Concepts" → "React Context API"

#### Question: "What are the known bugs?"
→ **Read**: [QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md)  
**Or**: [INVENTORY_BILLING_STATE_FIX_SUMMARY.md](INVENTORY_BILLING_STATE_FIX_SUMMARY.md)

#### Question: "Why are products disappearing?"
→ **Read**: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) → "Issue 1: Product List Disappears"

#### Question: "Why do delete buttons stop working?"
→ **Read**: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) → "Issue 2: Delete Handlers Stop Working"  
**Or**: [INVENTORY_BILLING_STATE_FIX_SUMMARY.md](INVENTORY_BILLING_STATE_FIX_SUMMARY.md) → "Issue 2"

#### Question: "How do I debug something?"
→ **Read**: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) → "Troubleshooting Guide"

#### Question: "I want to add a new feature. Where do I start?"
→ **Read**: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) → "Next Steps for Development" → "To Add a New Feature"

#### Question: "How do I make changes safely?"
→ **Read**: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) → "Rules for Safe Changes"

#### Question: "How do I migrate the database?"
→ **Read**: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) → "Next Steps for Development" → "Database Migrations"

#### Question: "What's the complete architecture?"
→ **Read**: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) → "System Architecture" (the ASCII diagram)

#### Question: "I'm new to this codebase. Where do I start?"
→ **Read in order**:
1. [README.md](README.md) (5 min)
2. [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md) (15 min)
3. [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) (10 min)
4. [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) (45 min)
5. [frontend/API_CONTRACTS.md](frontend/API_CONTRACTS.md) (30 min)

**Total**: ~105 minutes. Then you understand everything.

#### Question: "How do I test the system?"
→ **Read**: [TESTING_GUIDE.md](TESTING_GUIDE.md)

#### Question: "What React patterns are used?"
→ **Read**: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) → "Key Components & Concepts"

#### Question: "What useEffect dependencies are correct?"
→ **Read**: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) → "Rules for Safe Changes" → "DO" (point 1)

#### Question: "What's a common mistake in this codebase?"
→ **Read**: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) → "Common Issues & Solutions"  
**Or**: [INVENTORY_BILLING_STATE_FIX_SUMMARY.md](INVENTORY_BILLING_STATE_FIX_SUMMARY.md) → "Technical Deep Dive"

---

### 🧪 I'm Testing/QA

#### Question: "How do I test the system?"
→ **Read**: [TESTING_GUIDE.md](TESTING_GUIDE.md)

#### Question: "What should I check?"
→ **Read**: [FRONTEND_READY_CHECKLIST.md](FRONTEND_READY_CHECKLIST.md)

#### Question: "What are the test scenarios?"
→ **Read**: [INVENTORY_BILLING_STATE_FIX_SUMMARY.md](INVENTORY_BILLING_STATE_FIX_SUMMARY.md) → "Testing Protocol"

#### Question: "How do I verify a fix works?"
→ **Read**: [INVENTORY_BILLING_STATE_FIX_SUMMARY.md](INVENTORY_BILLING_STATE_FIX_SUMMARY.md) → "Console Log Checklist"

#### Question: "What logs should I see?"
→ **Read**: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) → "Key Components & Concepts" → "Loading States"  
**Or**: [INVENTORY_BILLING_STATE_FIX_SUMMARY.md](INVENTORY_BILLING_STATE_FIX_SUMMARY.md) → "Console Log Checklist"

---

### 🚀 I'm Deploying/Setting Up

#### Question: "How do I install the system?"
→ **Read**: [SETUP_GUIDE.md](SETUP_GUIDE.md)

#### Question: "What do I need to install?"
→ **Read**: [SETUP_GUIDE.md](SETUP_GUIDE.md) → "Prerequisites"

#### Question: "How do I start the backend?"
→ **Read**: [SETUP_GUIDE.md](SETUP_GUIDE.md) → "Start Both Services"

#### Question: "How do I start the frontend?"
→ **Read**: [SETUP_GUIDE.md](SETUP_GUIDE.md) → "Start Both Services"

#### Question: "How do I load sample data?"
→ **Read**: [SETUP_GUIDE.md](SETUP_GUIDE.md) → "Load More Sample Data"

#### Question: "What's the database setup?"
→ **Read**: [SETUP_GUIDE.md](SETUP_GUIDE.md) → "Database & Sample Data"

#### Question: "How do I access the admin panel?"
→ **Read**: [SETUP_GUIDE.md](SETUP_GUIDE.md) → "Access Points"

#### Question: "What if something fails during setup?"
→ **Read**: [QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md)

#### Question: "How do I configure the backend?"
→ **Read**: [BACKEND_INTEGRATION_GUIDE.md](BACKEND_INTEGRATION_GUIDE.md)

#### Question: "How do I check the database?"
→ **Read**: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) → "Useful Commands" → "Backend"

---

## Troubleshooting by Symptom

### ❌ Symptom: "System won't start"

**Possible Causes & Solutions**:

1. **Backend not starting**:
   - **Check**: Does terminal show "ModuleNotFoundError: No module named 'django'"?
   - **Solution**: [QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md) → "Backend Won't Start"

2. **Frontend not starting**:
   - **Check**: Does terminal show "npm: command not found"?
   - **Solution**: [QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md) → "Frontend Won't Start"

3. **Port already in use**:
   - **Check**: Is another process using port 8000 or 5173?
   - **Solution**: Kill other process or wait for port to free up

4. **Virtual environment not activated**:
   - **Check**: Does terminal show `(.venv)` at start?
   - **Solution**: Run `source .venv/bin/activate` before starting backend

5. **Dependencies not installed**:
   - **Check**: Is `node_modules/` folder present in frontend?
   - **Solution**: Run `npm install` in frontend directory

---

### ❌ Symptom: "Products not showing in inventory"

**Debugging Checklist**:

1. Open DevTools (F12 in browser)
2. Go to Console tab
3. Look for red error messages
4. Look for "📥 ProductContext.fetchProducts:" log
5. Go to Network tab
6. Try refreshing the page (F5)
7. Look for GET `/api/products/` request
   - **Status 200**: API working, check if response has data
   - **Status ≠ 200**: API error, check response for details
8. If no request appears: check if backend running
9. If you see request but no products returned: database might be empty
   - **Solution**: Load sample data or add products manually

**For more details**: [QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md) → "Products Not Showing"

---

### ❌ Symptom: "Delete button not working"

**Debugging Steps**:

1. Open DevTools Console (F12)
2. Click Delete button
3. Look for these logs:
   - **Expected**: "🗑️ Delete product: {...}"
   - **Expected**: "✅ ProductContext.deleteProduct: Product X deleted successfully"
4. If you see error log instead:
   - Check error message for clues
5. If no logs at all:
   - Button click not registered
   - Check if element is disabled

**For more details**: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) → "Issue 2: Delete Handlers Stop Working"

---

### ❌ Symptom: "Invoice creation returns HTTP 400"

**Common Causes**:

1. **Insufficient quantity in batch**:
   - **Fix**: Check inventory before creating invoice
   - **Verify**: Quantity available ≥ quantity requested

2. **Missing required field**:
   - **Fix**: Check form validation errors
   - **Verify**: Customer name is entered
   - **Verify**: All items have product, batch, quantity, selling_rate

3. **Selling rate is invalid**:
   - **Fix**: Make sure selling_rate > 0
   - **Verify**: Not negative or zero

4. **Product doesn't exist**:
   - **Fix**: Refresh products list
   - **Verify**: Product exists in inventory

**For detailed debugging**: [QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md) → "Invoice Creation Still Returns HTTP 400"

---

### ❌ Symptom: "Form shows stale/old quantities"

**Cause**: Product list wasn't refreshed after last invoice

**Solution**:
1. Go to Inventory tab
2. Come back to Billing tab
3. Quantities should update

**Why this happens**: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) → "Issue 4: Form Shows Stale Product Quantities"

---

### ❌ Symptom: "Cannot connect to backend from frontend"

**Debugging**:

1. **Check if backend is running**:
   - Terminal 1 should show "Starting development server at http://127.0.0.1:8000/"
   - If not: start backend

2. **Check CORS configuration**:
   - File: `backend/config/settings.py`
   - Should have: `CORS_ALLOWED_ORIGINS` with frontend URL

3. **Check frontend API URL**:
   - File: `frontend/src/services/api.js`
   - Should point to: `http://localhost:8000/api`

4. **Check network connectivity**:
   - Both running on same machine?
   - Firewall allowing localhost traffic?

**For detailed solutions**: [QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md) → "Cannot Connect to Backend"

---

## Document Quick Links by Problem

| Problem | Solution Location |
|---------|-------------------|
| System won't start | [QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md) |
| Products not showing | [QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md) |
| Delete not working | [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) + [INVENTORY_BILLING_STATE_FIX_SUMMARY.md](INVENTORY_BILLING_STATE_FIX_SUMMARY.md) |
| Invoice HTTP 400 | [QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md) |
| Cannot connect to backend | [QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md) |
| Edit not working | [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) |
| Form shows stale data | [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) |
| Database issues | [QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md) |
| Need to understand architecture | [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) |
| Need to use the system | [USER_GUIDE.md](USER_GUIDE.md) |
| Need to understand concepts | [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md) |
| Need to set up system | [SETUP_GUIDE.md](SETUP_GUIDE.md) |
| Need to find right document | [DOCUMENTATION_GUIDE.md](DOCUMENTATION_GUIDE.md) |

---

## Debugging Tools & Techniques

### Browser DevTools (F12)

**Console Tab**:
- Watch for red error messages
- Look for console.log statements
- Shows stack traces for errors

**Network Tab**:
- See all API requests
- Check Status code (200 = good, 400 = bad input, 500 = server error)
- View request payload (what was sent)
- View response (what server returned)

**Elements Tab**:
- Inspect HTML elements
- Check CSS classes
- Verify element is not hidden or disabled

### Terminal Output

**Backend Terminal**:
- Shows request logs
- Shows database queries
- Shows error tracebacks

**Frontend Terminal**:
- Shows build warnings
- Shows Vite server status
- Shows hot reload messages

### Useful Commands

```bash
# See backend errors
cd backend && python manage.py runserver
# Watch terminal for error messages

# See frontend errors
cd frontend && npm run dev
# Watch terminal for build issues

# Check if product exists in database
cd backend && python manage.py shell
>>> from inventory.models import Product
>>> Product.objects.all()
>>> exit()

# Check database directly
cd backend && python manage.py dbshell
sqlite> SELECT COUNT(*) FROM inventory_product;
sqlite> .quit

# View backend logs
# Check terminal where you started: python manage.py runserver

# View frontend logs
# Open DevTools Console (F12) in browser
```

---

## Common Questions & Quick Answers

**Q: How do I restart the system?**  
A: Press Ctrl+C in both terminals. Then run the startup commands again.

**Q: Can I change the port?**  
A: Frontend: Edit `vite.config.js`. Backend: Run `python manage.py runserver 9000`

**Q: Where is my data stored?**  
A: File: `backend/db.sqlite3`

**Q: How do I backup my data?**  
A: Copy `backend/db.sqlite3` to safe location

**Q: Can I use this on production?**  
A: Current version: Local only. Can be deployed with extra configuration.

**Q: How do I update the code?**  
A: Edit files, frontend auto-reloads. Backend: restart server.

**Q: Is this system secure?**  
A: Current version: Local network only. Not encrypted. For public use: add security.

**Q: Can multiple people use it?**  
A: Current version: Single user only. Multi-user would require login system.

**Q: How do I export data?**  
A: Current version: View in database file. Can add export feature.

**Q: How do I reset everything?**  
A: Delete `backend/db.sqlite3` and restart (creates new empty database)

**Q: How do I add custom features?**  
A: Read [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) → "Next Steps for Development"

---

## When to Escalate (Get External Help)

You should seek external help if:

1. **System crashes completely** (won't start even after restart)
2. **Data is corrupted** (database file is damaged)
3. **You need advanced features** (multi-user, cloud sync, etc.)
4. **You need professional support** (for production deployment)
5. **You want paid development** (custom features, integrations)

**Before escalating**:
1. Read the relevant documentation
2. Try the suggested troubleshooting steps
3. Provide specific error messages
4. Provide steps to reproduce the issue
5. Provide screenshots or logs

---

## Self-Help Resources

### Online Learning

- **React**: https://react.dev
- **Django**: https://www.djangoproject.com/
- **REST APIs**: https://restfulapi.net/

### Community Help

- **Stack Overflow**: Tag with `react`, `django`, `django-rest-framework`
- **GitHub Issues**: If using Git

### Documentation

- **All docs in this project**: See [DOCUMENTATION_GUIDE.md](DOCUMENTATION_GUIDE.md)
- **Django docs**: https://docs.djangoproject.com/
- **React docs**: https://react.dev/learn

---

## Reporting a Bug

**If you find a bug**:

1. **Reproduce it**: Document exact steps to reproduce
2. **Gather information**:
   - What you were doing
   - What happened
   - What should have happened
   - Error messages (with screenshots)
   - Browser console logs (F12)
   - Network logs (F12 → Network tab)
3. **Check if it's known**:
   - Look in [QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md)
   - Look in [INVENTORY_BILLING_STATE_FIX_SUMMARY.md](INVENTORY_BILLING_STATE_FIX_SUMMARY.md)
4. **Record the bug**:
   - Add to issue tracker (if using Git/GitHub)
   - Document in comment/notes
   - Include all information above

---

## Next Steps

### If You're Stuck

1. **Identify your situation**: Use the "Quick Help Decision Tree" at top
2. **Find the right document**: Use [DOCUMENTATION_GUIDE.md](DOCUMENTATION_GUIDE.md)
3. **Read the relevant section**: Follow links and read deeply
4. **Try the suggested solutions**: Follow step-by-step
5. **If still stuck**: Try a different approach or document

### If Everything Works

1. Congratulations! 🎉
2. Start using the system for real work
3. Backup your data regularly
4. Read [USER_GUIDE.md](USER_GUIDE.md) for best practices
5. Help others by sharing what you learned!

---

**Last Updated**: January 21, 2026  
**Status**: ✅ Complete  

**Remember**: The documentation is your friend. Read it!

🆘 **Need help?** Start here and follow the links!
