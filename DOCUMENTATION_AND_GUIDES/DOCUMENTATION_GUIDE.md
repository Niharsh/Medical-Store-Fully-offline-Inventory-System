# 📖 DOCUMENTATION INDEX & NAVIGATION

**Medical Store Inventory & Billing System**  
**Complete Guide to All Documentation Files**  
**Updated**: January 21, 2026

---

## Quick Navigation

### 👤 I am a **Store Owner/Operator** (using the system)
→ Start here: [USER_GUIDE.md](USER_GUIDE.md)  
→ Then read: [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md)

### 🛠️ I am a **Developer/Maintainer** (fixing or improving code)
→ Start here: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)  
→ For API details: [frontend/API_CONTRACTS.md](frontend/API_CONTRACTS.md)

### ❓ I need **help with a specific problem**
→ Go to: [QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md)

### 🚀 I'm **deploying or setting up for the first time**
→ Follow: [SETUP_GUIDE.md](SETUP_GUIDE.md)  
→ Then: [README.md](README.md)

---

## Complete File Directory

### 📚 User-Facing Documentation

| File | For | Purpose | Read Time |
|------|-----|---------|-----------|
| **[USER_GUIDE.md](USER_GUIDE.md)** | Store Owner | How to use the system daily - create products, invoices, manage inventory | 20 min |
| **[SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md)** | Store Owner | Understand how the system works - architecture, concepts, data flow | 15 min |
| **[README.md](README.md)** | Everyone | Project overview, quick start, feature list | 10 min |
| **[SETUP_GUIDE.md](SETUP_GUIDE.md)** | Admin/Setup | How to set up the system, install, run locally or on server | 15 min |

### 🛠️ Developer-Facing Documentation

| File | For | Purpose | Read Time |
|------|-----|---------|-----------|
| **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)** | Developers | Complete guide to understanding code, architecture, flows, debugging, and making safe changes | 45 min |
| **[frontend/API_CONTRACTS.md](frontend/API_CONTRACTS.md)** | Developers | Exact API specifications - endpoints, request/response formats, business rules | 30 min |
| **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** | Developers | Directory structure, technology stack, setup instructions | 10 min |
| **[QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md)** | Developers/Users | Solutions to common issues - products not showing, delete not working, HTTP 400 errors, etc. | 10 min |

### 📋 Implementation & Fix Documentation

| File | For | Purpose | Read Time |
|------|-----|---------|-----------|
| **[INVENTORY_BILLING_STATE_FIX_SUMMARY.md](INVENTORY_BILLING_STATE_FIX_SUMMARY.md)** | Developers | Complete analysis of state management bugs fixed - root causes, solutions, test protocol | 20 min |
| **[STATE_MANAGEMENT_FIX.md](STATE_MANAGEMENT_FIX.md)** | Developers | Technical deep-dive into React closure bugs and fixes | 15 min |
| **[FIXES_COMPREHENSIVE_GUIDE.md](FIXES_COMPREHENSIVE_GUIDE.md)** | Developers | UI/UX fixes - spacing, buttons, error handling | 10 min |
| **[FIXES_SUMMARY.md](FIXES_SUMMARY.md)** | Developers | Quick summary of all fixes applied | 5 min |

### 🔧 Additional Reference

| File | For | Purpose | Read Time |
|------|-----|---------|-----------|
| **[FRONTEND_READY_CHECKLIST.md](FRONTEND_READY_CHECKLIST.md)** | Developers | Verification checklist - all features working | 5 min |
| **[IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md)** | Project Managers | Task status and completion tracking | 5 min |
| **[BACKEND_INTEGRATION_GUIDE.md](BACKEND_INTEGRATION_GUIDE.md)** | Developers | Historical - how to build the Django backend | 30 min |
| **[THREE_PRICE_MODEL.md](THREE_PRICE_MODEL.md)** | Everyone | Detailed explanation of MRP, Selling Rate, Cost Price | 10 min |
| **[TESTING_GUIDE.md](TESTING_GUIDE.md)** | QA/Testers | How to test the system comprehensively | 20 min |

---

## Reading Paths by Role

### 🏪 **Path for: Store Owner (First Time User)**

1. **[SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md)** (15 min)
   - What is this system?
   - Key concepts: products, batches, invoices
   - How data flows

2. **[README.md](README.md)** (10 min)
   - Quick start instructions
   - Feature overview

3. **[SETUP_GUIDE.md](SETUP_GUIDE.md)** (15 min)
   - How to start the system
   - Database & sample data

4. **[USER_GUIDE.md](USER_GUIDE.md)** (20 min)
   - Detailed step-by-step usage
   - How to add products
   - How to create invoices
   - FAQs

**Total Time**: ~60 minutes  
**After This**: You can use the system!

---

### 👨‍💻 **Path for: Developer/Maintainer (First Time)**

1. **[README.md](README.md)** (10 min)
   - Project overview
   - Status & features

2. **[SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md)** (15 min)
   - Understand business logic
   - Data flow & architecture

3. **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** (10 min)
   - Folder organization
   - Technology stack

4. **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)** (45 min)
   - Complete architecture deep-dive
   - Inventory lifecycle
   - Billing lifecycle
   - State management
   - Common issues & solutions
   - Rules for safe changes

5. **[frontend/API_CONTRACTS.md](frontend/API_CONTRACTS.md)** (30 min)
   - API specifications
   - Request/response formats
   - Business rules

6. **[QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md)** (10 min)
   - Common issues & fixes

**Total Time**: ~120 minutes  
**After This**: You understand the system architecture and can make changes

---

### 🐛 **Path for: Debugging a Specific Issue**

1. Check: **[QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md)**
   - Issue exists? Jump to solution
   - Not listed? Continue below

2. Check: **[INVENTORY_BILLING_STATE_FIX_SUMMARY.md](INVENTORY_BILLING_STATE_FIX_SUMMARY.md)**
   - Known state management bugs
   - Debugging console logs to look for

3. Check: **[FIXES_SUMMARY.md](FIXES_SUMMARY.md)**
   - List of all bugs fixed
   - Is your issue listed?

4. Read: **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)**
   - Troubleshooting section
   - Debugging procedures

5. Dive Deep: **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)**
   - Understand architecture
   - Trace data flows
   - Check console logs
   - Use DevTools

**Estimated Time**: 15-60 minutes depending on issue

---

### 🧪 **Path for: Testing the System**

1. **[TESTING_GUIDE.md](TESTING_GUIDE.md)** (20 min)
   - Test procedures
   - Manual test cases

2. **[INVENTORY_BILLING_STATE_FIX_SUMMARY.md](INVENTORY_BILLING_STATE_FIX_SUMMARY.md)** (20 min)
   - State management test protocol
   - Expected logs to see

3. **[USER_GUIDE.md](USER_GUIDE.md)** (20 min)
   - Practical examples
   - Step-by-step scenarios

**Total Time**: ~60 minutes  
**After This**: You've tested all major flows

---

### 🚀 **Path for: Deploying/Installing**

1. **[README.md](README.md)** (10 min)
   - Project overview

2. **[SETUP_GUIDE.md](SETUP_GUIDE.md)** (15 min)
   - Installation & setup
   - Database initialization
   - Sample data loading

3. **[BACKEND_INTEGRATION_GUIDE.md](BACKEND_INTEGRATION_GUIDE.md)** (30 min)
   - If backend needs adjustment
   - Django configuration
   - Database setup

4. **[QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md)** (10 min)
   - Common startup issues

**Total Time**: ~65 minutes  
**After This**: System ready for production

---

## Topic-Based Quick Reference

### Learning Topics

| Topic | Document | Section |
|-------|----------|---------|
| **What is the system?** | [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md) | "What Is This System?" |
| **How do I use it?** | [USER_GUIDE.md](USER_GUIDE.md) | "Inventory Management" + "Creating Invoices" |
| **How does it work internally?** | [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) | "System Architecture" |
| **Folder structure** | [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | "Directory Structure" |
| **API endpoints** | [frontend/API_CONTRACTS.md](frontend/API_CONTRACTS.md) | All sections |
| **Product management** | [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) | "Inventory Lifecycle" |
| **Invoice creation** | [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) | "Billing Lifecycle" |
| **State management** | [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) | "Key Components & Concepts" |
| **React hooks & patterns** | [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) | "Rules for Safe Changes" |
| **Error handling** | [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) | "Common Issues & Solutions" |
| **Testing procedures** | [TESTING_GUIDE.md](TESTING_GUIDE.md) | All sections |
| **Bug fixes explained** | [INVENTORY_BILLING_STATE_FIX_SUMMARY.md](INVENTORY_BILLING_STATE_FIX_SUMMARY.md) | All sections |

### Problem-Solving Topics

| Problem | Solution Location |
|---------|-------------------|
| "System won't start" | [QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md) → "Backend Won't Start" |
| "Products not showing" | [QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md) → "Products Not Showing" |
| "Delete button not working" | [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) → "Issue 2: Delete Handlers Stop Working" |
| "Invoice HTTP 400 error" | [QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md) → "Invoice Creation Still Returns HTTP 400" |
| "Stale product data in billing" | [INVENTORY_BILLING_STATE_FIX_SUMMARY.md](INVENTORY_BILLING_STATE_FIX_SUMMARY.md) → "Issue 3" |
| "Edit button doesn't work" | [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) → "Issue 2" |
| "Form shows old quantities" | [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) → "Issue 5" |
| "Cannot connect to backend" | [QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md) → "Cannot Connect to Backend" |
| "Database issues" | [QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md) → "Database Issues" |
| "Performance problems" | [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) → "Performance Impact" |

---

## Document Summary

### By Length

| Estimated Read Time | Documents |
|-------------------|-----------|
| **5 minutes** | FIXES_SUMMARY.md, FRONTEND_READY_CHECKLIST.md, IMPLEMENTATION_CHECKLIST.md |
| **10 minutes** | README.md, PROJECT_STRUCTURE.md, QUICK_TROUBLESHOOTING.md, THREE_PRICE_MODEL.md, FIXES_COMPREHENSIVE_GUIDE.md |
| **15-20 minutes** | SYSTEM_OVERVIEW.md, SETUP_GUIDE.md, STATE_MANAGEMENT_FIX.md, INVENTORY_BILLING_STATE_FIX_SUMMARY.md |
| **20-30 minutes** | USER_GUIDE.md, frontend/API_CONTRACTS.md, BACKEND_INTEGRATION_GUIDE.md, TESTING_GUIDE.md |
| **45+ minutes** | DEVELOPER_GUIDE.md |

### By Audience

| Audience | Primary Docs | Secondary Docs |
|----------|-------------|-----------------|
| **Store Owner** | USER_GUIDE.md, SYSTEM_OVERVIEW.md | README.md, SETUP_GUIDE.md |
| **Frontend Developer** | DEVELOPER_GUIDE.md, frontend/API_CONTRACTS.md | INVENTORY_BILLING_STATE_FIX_SUMMARY.md, QUICK_TROUBLESHOOTING.md |
| **Backend Developer** | DEVELOPER_GUIDE.md, BACKEND_INTEGRATION_GUIDE.md, frontend/API_CONTRACTS.md | PROJECT_STRUCTURE.md |
| **QA/Tester** | TESTING_GUIDE.md, USER_GUIDE.md | QUICK_TROUBLESHOOTING.md, DEVELOPER_GUIDE.md |
| **DevOps/Admin** | SETUP_GUIDE.md, DEVELOPER_GUIDE.md | BACKEND_INTEGRATION_GUIDE.md |

---

## Key Topics Explained

### Concepts

- **Products**: Items you sell (medicines, syrups, creams, etc.)
- **Batches**: Groups of same product with different prices/expiry
- **Invoices**: Bills created when customers buy
- **Inventory**: Current stock levels
- **Three-Price Model**: MRP (display), Selling Rate (billing), Cost Price (internal)
- **Payment Status**: Track if invoice is paid or partial

### Features

- Add/Edit/Delete products
- Create invoices with multiple items
- Automatic inventory deduction
- Sales history tracking
- Payment status management
- Multi-batch support
- Flexible product types (custom or predefined)

### Architecture

- **Frontend**: React + Vite (what you see in browser)
- **Backend**: Django REST Framework (data & calculations)
- **Database**: SQLite (stores all data)
- **Communication**: HTTP API (JSON format)

### Known Issues & Fixes

- ✅ Product list disappears (fixed: useEffect dependency)
- ✅ Delete buttons stop working (fixed: remove array dependencies)
- ✅ Invoice HTTP 400 errors (fixed: refetch products after creation)
- ✅ Stale product data (fixed: proper state management)

---

## File Organization by Purpose

### 📊 Understanding the Business

1. [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md) - What the system does
2. [USER_GUIDE.md](USER_GUIDE.md) - How to use it
3. [THREE_PRICE_MODEL.md](THREE_PRICE_MODEL.md) - Pricing explained

### 💻 Understanding the Code

1. [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - File organization
2. [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) - Complete technical guide
3. [frontend/API_CONTRACTS.md](frontend/API_CONTRACTS.md) - API specs

### 🔧 Setting It Up

1. [SETUP_GUIDE.md](SETUP_GUIDE.md) - Installation
2. [BACKEND_INTEGRATION_GUIDE.md](BACKEND_INTEGRATION_GUIDE.md) - Backend setup
3. [README.md](README.md) - Quick start

### 🐛 Fixing Problems

1. [QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md) - Common issues
2. [INVENTORY_BILLING_STATE_FIX_SUMMARY.md](INVENTORY_BILLING_STATE_FIX_SUMMARY.md) - State bugs
3. [FIXES_SUMMARY.md](FIXES_SUMMARY.md) - All fixes applied

### ✅ Testing & Quality

1. [TESTING_GUIDE.md](TESTING_GUIDE.md) - How to test
2. [FRONTEND_READY_CHECKLIST.md](FRONTEND_READY_CHECKLIST.md) - Verification
3. [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md) - Status tracking

---

## How to Find Information

### Method 1: I know what I need

Look at the **Topic-Based Quick Reference** section above.

### Method 2: I don't know where to start

Look at your role under **Reading Paths by Role** section.

### Method 3: Searching

Each document is organized with:
- Table of Contents at top
- Clear section headers
- Indexed topics
- Cross-references to related docs

Use browser Find (Ctrl+F) to search within a document.

### Method 4: Ask a question

Common questions answered in:
- [USER_GUIDE.md](USER_GUIDE.md) → "Frequently Asked Questions"
- [QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md) → "Common Issues"
- [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) → "Troubleshooting Guide"

---

## Maintenance & Updates

### When You Make Changes

Update these docs:
- If changing feature: [USER_GUIDE.md](USER_GUIDE.md)
- If changing code structure: [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
- If changing API: [frontend/API_CONTRACTS.md](frontend/API_CONTRACTS.md)
- If fixing bug: [QUICK_TROUBLESHOOTING.md](QUICK_TROUBLESHOOTING.md)
- If major changes: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)

### Version Control

All docs are in git. When you update:
```
git add *.md
git commit -m "Update docs for feature X"
git push
```

### Keeping Current

Review docs every:
- **After each major fix**: Update QUICK_TROUBLESHOOTING.md
- **After adding feature**: Update USER_GUIDE.md
- **Quarterly**: Review all docs for accuracy
- **Yearly**: Major documentation refresh

---

## Document Relationships

```
README.md (Overview)
    ↓
    ├─→ SYSTEM_OVERVIEW.md (Business understanding)
    │   ├─→ USER_GUIDE.md (How to use)
    │   └─→ THREE_PRICE_MODEL.md (Pricing details)
    │
    ├─→ PROJECT_STRUCTURE.md (Code organization)
    │   ├─→ DEVELOPER_GUIDE.md (Complete guide)
    │   │   ├─→ QUICK_TROUBLESHOOTING.md (Common issues)
    │   │   └─→ frontend/API_CONTRACTS.md (API specs)
    │   │
    │   └─→ BACKEND_INTEGRATION_GUIDE.md (Backend building)
    │
    └─→ SETUP_GUIDE.md (Installation)
        └─→ Testing
            ├─→ TESTING_GUIDE.md
            ├─→ FRONTEND_READY_CHECKLIST.md
            └─→ INVENTORY_BILLING_STATE_FIX_SUMMARY.md
```

---

## Last Updated

- **Date**: January 21, 2026
- **Status**: ✅ Complete & Current
- **All docs reviewed**: Yes
- **All links verified**: Yes
- **Ready for production**: Yes

---

**For questions about which document to read, refer to this index!**

Thank you for using the Medical Store Inventory & Billing System! 🏥💊📊
