# Project Structure & Setup Guide

Generic Medical Store Inventory & Billing System

## Directory Structure

```
Inventory/
├── frontend/                          # React + Vite Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Common/               # Reusable components
│   │   │   │   ├── Header.jsx       # App header
│   │   │   │   ├── Navigation.jsx   # Navigation menu
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   └── ErrorAlert.jsx
│   │   │   ├── Product/              # Product/Inventory components
│   │   │   │   ├── AddProductForm.jsx    # Add product form (supports all types)
│   │   │   │   └── ProductList.jsx      # Display products with type
│   │   │   └── Billing/              # Invoice/Billing components
│   │   │       ├── BillingForm.jsx       # Create invoice
│   │   │       └── InvoiceHistory.jsx    # View invoices
│   │   ├── context/                  # React Context (State Management)
│   │   │   ├── ProductContext.jsx    # Product state & operations
│   │   │   └── InvoiceContext.jsx    # Invoice state & operations
│   │   ├── pages/                    # Page components
│   │   │   ├── Dashboard.jsx         # Dashboard/Home
│   │   │   ├── Inventory.jsx         # Inventory management page
│   │   │   └── Billing.jsx           # Billing page
│   │   ├── services/                 # API service layer
│   │   │   ├── api.js               # Axios instance with interceptors
│   │   │   └── medicineService.js   # API contracts & calls (generic products)
│   │   ├── App.jsx                  # Main app with routing
│   │   ├── App.css                  # App styles
│   │   ├── index.css                # Tailwind directives & custom styles
│   │   └── main.jsx                 # React entry point
│   ├── tailwind.config.js            # Tailwind configuration
│   ├── postcss.config.js             # PostCSS configuration
│   ├── vite.config.js                # Vite configuration
│   ├── .env.local                    # Environment variables (API URL)
│   ├── .env.example                  # Example environment variables
│   ├── package.json                  # Dependencies
│   ├── README.md                     # Frontend documentation
│   └── public/
│
├── backend/                          # Django Application (To be created)
│   ├── venv/                         # Python virtual environment
│   └── [Django project structure]
│
├── API_CONTRACTS.md                  # API specifications (Frontend ↔ Backend)
├── BACKEND_INTEGRATION_GUIDE.md       # Complete backend implementation guide
├── FRONTEND_REFACTORING_SUMMARY.md    # Frontend changes & architecture
├── DOCUMENTATION_INDEX.md             # Documentation navigation guide
└── README.md                         # Project overview
```

---

## Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite 7** - Build tool & dev server
- **Tailwind CSS 4** - Styling
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **React Context API** - State management

### Backend (To be implemented)
- **Django 6** - Web framework
- **Django REST Framework** - REST API
- **django-cors-headers** - CORS support
- **PostgreSQL** (recommended) or SQLite - Database

---

## Setup Instructions

### Part 1: Frontend Setup (Already Done)

```bash
cd Inventory/frontend

# Install dependencies (already done)
npm install

# Install Tailwind and dependencies (already done)
npm install @tailwindcss/postcss react-router-dom axios

# Start development server
npm run dev

# Server runs at: http://localhost:5173/
```

**Frontend is ready for all product types!** ✅

### Part 2: Backend Setup (Next Steps)

```bash
# Navigate to backend directory
cd Inventory/backend

# Activate virtual environment (already created)
source venv/bin/activate

# Install additional packages
pip install django django-restframework django-cors-headers python-decouple

# Create Django project (if not done)
django-admin startproject shop_inventory .

# Create inventory app
django-admin startapp inventory

# Create database migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start Django server
python manage.py runserver

# Server runs at: http://localhost:8000/
```

---

## API Integration Points

### Frontend → Backend Communication

1. **Product Management**
   - Add new medicines
   - Update product details
   - Delete products
   - View inventory list

2. **Invoice Management**
   - Create invoices with items
   - View invoice history
   - Edit invoice details

3. **Stock Management**
   - Track quantity levels
   - Low stock indicators
   - Batch information

### Expected Backend Endpoints

```
POST   /api/products/              Create product
GET    /api/products/              List products
GET    /api/products/{id}/         Get product details
PATCH  /api/products/{id}/         Update product
DELETE /api/products/{id}/         Delete product

POST   /api/invoices/              Create invoice (with items)
GET    /api/invoices/              List invoices
GET    /api/invoices/{id}/         Get invoice with items
PATCH  /api/invoices/{id}/         Update invoice
DELETE /api/invoices/{id}/         Delete invoice

POST   /api/batches/               Create batch
GET    /api/batches/               List batches
PATCH  /api/batches/{id}/          Update batch
DELETE /api/batches/{id}/          Delete batch
```

**See API_CONTRACTS.md for complete specifications.**

---

## Development Workflow

### 1. Frontend Development (In Progress)
```bash
cd frontend
npm run dev
# Frontend runs at http://localhost:5173
```

### 2. Backend Development (Next)
```bash
cd backend
source venv/bin/activate
python manage.py runserver
# Backend runs at http://localhost:8000
```

### 3. Testing Integration
- Open http://localhost:5173
- All API calls go to http://localhost:8000/api
- Check browser DevTools → Network to see API calls
- Check Django terminal for request logs

---

## Environment Variables

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:8000/api
```

### Backend (.env)
```env
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## Important Files to Read

For **Frontend Developers**:
1. `frontend/README.md` - Frontend setup and usage
2. `API_CONTRACTS.md` - What to expect from the API

For **Backend Developers**:
1. `API_CONTRACTS.md` - What to implement
2. `BACKEND_INTEGRATION_GUIDE.md` - Complete implementation guide
3. `FRONTEND_REFACTORING_SUMMARY.md` - Understanding frontend decisions

---

## Common Commands

### Frontend
```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Format code
npm run format  # (if eslint is configured)
```

### Backend
```bash
cd backend
source venv/bin/activate

# Start development server
python manage.py runserver

# Create superuser
python manage.py createsuperuser

# Make migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Shell access
python manage.py shell

# Collect static files (for production)
python manage.py collectstatic
```

---

## Architecture Decision: Frontend-First API-Driven Design

This project follows these principles:

1. **API-Driven**: Frontend communicates ONLY through HTTP API
2. **Separation of Concerns**: Frontend handles UI, Backend handles business logic
3. **No Mock Data**: All data comes from the backend
4. **Contract-Based**: API contracts are documented and fixed
5. **Zero Refactor**: Frontend needs no changes when backend is ready

This design ensures:
- ✓ Easy testing and debugging
- ✓ Easy to swap implementations
- ✓ Easy to scale independently
- ✓ Easy to maintain and extend

---

## Troubleshooting

### Frontend won't start
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### CORS errors
- Check that frontend is at `http://localhost:5173`
- Check that backend has CORS configured
- See BACKEND_INTEGRATION_GUIDE.md for CORS setup

### API not responding
1. Check Django server is running: `python manage.py runserver`
2. Check API URL in `.env.local` matches backend
3. Check browser console for detailed error messages
4. Check Django terminal for request logs

### Port conflicts
- Change frontend port: `npm run dev -- --port 3000`
- Change backend port: `python manage.py runserver 8001`
- Update `.env.local` to match new backend port

---

## Next Steps

1. ✅ **Frontend is ready** - Navigate to features, add/edit forms, API integration points are clear
2. 📝 **Read API_CONTRACTS.md** - Understand what backend must implement
3. 🚀 **Implement Backend** - Follow BACKEND_INTEGRATION_GUIDE.md
4. 🧪 **Test Integration** - Frontend at :5173, Backend at :8000
5. 🎉 **Deploy** - Both can be deployed independently

---

## Support & Documentation

- **API_CONTRACTS.md** - API specifications and contracts
- **BACKEND_INTEGRATION_GUIDE.md** - Backend implementation guide
- **FRONTEND_REFACTORING_SUMMARY.md** - Frontend architecture decisions
- **frontend/README.md** - Frontend documentation
- **Both frontend/src files have inline JSDoc comments** - Code-level documentation

Start with API_CONTRACTS.md if you're new to this project!
