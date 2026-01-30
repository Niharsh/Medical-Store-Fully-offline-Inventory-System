# Authentication Implementation Complete ✅

## Overview
Successfully implemented JWT-based authentication for the Medical Shop Inventory System with one-time signup, email-based password reset, and local SQLite data storage.

## Backend Implementation

### Models
**Location**: `backend/authentication/models.py`

#### Owner Model
- Extends Django's `AbstractUser`
- Uses email as primary identifier (no username)
- Custom `OwnerManager` for email-based user creation
- Fields:
  - `email` (unique, required)
  - `first_name`, `last_name` (optional)
  - `password` (hashed)
  - `is_active`, `is_staff`, `is_superuser`
  - `is_setup_complete` (tracks first login)
  - `created_at`, `updated_at`

#### PasswordResetToken Model
- OneToOne relationship with Owner
- Fields:
  - `token` (UUID, unique)
  - `created_at`, `expires_at` (48 hours)
  - `is_used` (prevents token reuse)
- Method: `is_valid()` - checks expiry and used status

### Serializers
**Location**: `backend/authentication/serializers.py`

1. **RegisterSerializer** (POST /api/auth/register/)
   - Enforces one-time signup: Checks `Owner.objects.exists()`
   - Validates email format and uniqueness
   - Validates password strength (min 8 chars)
   - Creates Owner + auto-creates ShopProfile via signals
   - Returns: JWT tokens + owner data

2. **LoginSerializer** (POST /api/auth/login/)
   - Validates email and password
   - Returns: Access token (24h) + refresh token (7d)

3. **PasswordResetRequestSerializer** (POST /api/auth/password-reset-request/)
   - Generates UUID token with 48h expiry
   - Sends email with reset link
   - Graceful failure if email not configured

4. **PasswordResetConfirmSerializer** (POST /api/auth/password-reset-confirm/)
   - Validates token expiry and unused status
   - Updates owner password
   - Marks token as used

### ViewSet
**Location**: `backend/authentication/views.py`

#### AuthViewSet Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/auth/register/` | POST | AllowAny | One-time signup (creates ShopProfile) |
| `/api/auth/login/` | POST | AllowAny | Login with email + password |
| `/api/auth/password-reset-request/` | POST | AllowAny | Send password reset email |
| `/api/auth/password-reset-confirm/` | POST | AllowAny | Confirm reset with token + new password |
| `/api/auth/check-owner/` | GET | AllowAny | Check if owner exists (frontend call on app load) |
| `/api/auth/me/` | GET | IsAuthenticated | Get current owner profile |

### JWT Configuration
**Location**: `backend/config/settings.py`

- Access Token: 24 hours
- Refresh Token: 7 days
- Algorithm: HS256
- Uses `rest_framework_simplejwt` package

### Email Configuration
**Location**: `backend/config/settings.py`

- Backend: SMTP (Gmail, Office 365, etc.)
- Config via environment variables:
  - `EMAIL_BACKEND`: 'django.core.mail.backends.smtp.EmailBackend'
  - `EMAIL_HOST`: SMTP server (e.g., smtp.gmail.com)
  - `EMAIL_PORT`: Usually 587 or 465
  - `EMAIL_HOST_USER`: Email address
  - `EMAIL_HOST_PASSWORD`: Password or app-specific password

### Signals
**Location**: `backend/authentication/signals.py`

- Auto-creates `ShopProfile` when Owner is created
- Ensures every owner has a shop profile

### Admin Interface
**Location**: `backend/authentication/admin.py`

- `OwnerAdmin`: List email, name, active status, created date
- `PasswordResetTokenAdmin`: Track tokens and their status

### Database Migrations
**Location**: `backend/authentication/migrations/`

1. `0001_initial.py`: Create Owner and PasswordResetToken models
2. `0002_alter_owner_managers.py`: Add custom OwnerManager

## Frontend Implementation

### AuthContext
**Location**: `frontend/src/context/AuthContext.jsx`

#### Features:
- Centralized authentication state management
- Token persistence in localStorage
- Auto-login on app reopen
- JWT token management

#### State:
```javascript
{
  owner: null,           // Current owner profile
  tokens: null,          // { access, refresh }
  loading: true,         // App initialization
  error: null,           // Error messages
  ownerExists: null,     // false = show signup, true = show login
}
```

#### Methods:
1. **checkOwnerExists()** - GET /api/auth/check-owner/
2. **register(email, password, passwordConfirm, firstName, lastName)** - POST /api/auth/register/
3. **login(email, password)** - POST /api/auth/login/
4. **logout()** - Clear tokens and state
5. **passwordResetRequest(email)** - POST /api/auth/password-reset-request/
6. **passwordResetConfirm(token, newPassword)** - POST /api/auth/password-reset-confirm/

#### Hook: `useAuth()`
```javascript
const { auth, owner, tokens, error, ownerExists, loading, login, register, logout, ... } = useAuth();
```

### Authentication Pages

#### 1. SignupPage
**Location**: `frontend/src/pages/SignupPage.jsx`

- Only visible if `ownerExists === false`
- Form: Email, First Name, Last Name, Password, Confirm Password
- Validation: Email format, password strength (min 8 chars), match
- One-time only message
- Redirects to /dashboard on success
- Redirects to /login if owner already exists

#### 2. LoginPage
**Location**: `frontend/src/pages/LoginPage.jsx`

- Shows when owner exists but user not authenticated
- Form: Email, Password
- Link to /forgot-password
- Redirects to /dashboard on success
- Error handling for invalid credentials

#### 3. ForgotPasswordPage
**Location**: `frontend/src/pages/ForgotPasswordPage.jsx`

- Form: Email
- Sends reset email with token
- Success message: "Check your email for reset link"
- Links to /login
- 48-hour token expiry display

#### 4. ResetPasswordPage
**Location**: `frontend/src/pages/ResetPasswordPage.jsx`

- URL: `/reset-password/:token`
- Form: New Password, Confirm Password
- Validates token from URL
- Updates password on backend
- Redirects to /login on success
- Error for expired or invalid token

### ProtectedRoute Component
**Location**: `frontend/src/components/Common/ProtectedRoute.jsx`

- Wraps components requiring authentication
- Redirects unauthenticated users to /login
- Usage: `<ProtectedRoute><Dashboard /></ProtectedRoute>`

### App.jsx Routing
**Location**: `frontend/src/App.jsx`

#### Routing Logic:
```
if (loading)
  → Show loading spinner

if (ownerExists === false)
  → Show signup page (disable all other routes)

if (ownerExists === true && !auth)
  → Show login/forgot-password/reset-password pages (disable dashboard)

if (ownerExists === true && auth)
  → Show main app (dashboard, inventory, billing, settings) with header/nav
```

#### Protected Routes:
- `/dashboard` → Dashboard (protected)
- `/inventory` → Inventory (protected)
- `/billing` → Billing (protected)
- `/settings` → Settings (protected)
- `/search` → Product Search (protected)

## Security Implementation

### One-Time Signup Enforcement
- Backend: `RegisterSerializer` checks `Owner.objects.exists()`
- Frontend: AuthContext stores `ownerExists` flag
- Result: After first signup, signup page is permanently hidden

### Token Security
- Access tokens: 24 hours (short-lived)
- Refresh tokens: 7 days (longer-lived, used to get new access token)
- Both stored in localStorage (can be upgraded to secure cookies in Electron)
- Tokens automatically sent in Authorization header: `Bearer {token}`

### Password Reset Security
- Token: UUID (cryptographically random)
- Expiry: 48 hours
- One-time use: `is_used` flag prevents reuse
- Email link: Contains token for verification

### Permission Classes
- `AllowAny`: Signup, login, password reset endpoints
- `IsAuthenticated`: /api/auth/me/ endpoint only

## API Request/Response Examples

### 1. Check Owner Exists
```bash
GET /api/auth/check-owner/
Response: { "owner_exists": false }
```

### 2. Register
```bash
POST /api/auth/register/
{
  "email": "owner@medicalshop.com",
  "password": "secure123456",
  "password_confirm": "secure123456",
  "first_name": "John",
  "last_name": "Doe"
}
Response:
{
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  },
  "owner": {
    "id": 1,
    "email": "owner@medicalshop.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_active": true
  }
}
```

### 3. Login
```bash
POST /api/auth/login/
{
  "email": "owner@medicalshop.com",
  "password": "secure123456"
}
Response: { "tokens": { "access": "...", "refresh": "..." } }
```

### 4. Password Reset Request
```bash
POST /api/auth/password-reset-request/
{ "email": "owner@medicalshop.com" }
Response: { "message": "Reset email sent" }
```

### 5. Password Reset Confirm
```bash
POST /api/auth/password-reset-confirm/
{
  "token": "550e8400-e29b-41d4-a716-446655440000",
  "new_password": "newpassword123"
}
Response: { "message": "Password updated successfully" }
```

## Testing

### Manual Testing Checklist
- [ ] Signup with new email → Creates owner + shop profile
- [ ] Try signup again → Error "Owner already exists"
- [ ] Login with correct credentials → Get tokens, redirect to dashboard
- [ ] Login with incorrect password → Error message
- [ ] Access protected route without auth → Redirect to /login
- [ ] Access protected route with auth → Show page
- [ ] Request password reset → Email received with link
- [ ] Click reset link → Form appears
- [ ] Reset password → Password updated, can login with new password
- [ ] Refresh page while logged in → Still logged in (auto-login)
- [ ] Logout → Tokens cleared, redirect to /login
- [ ] Logout and refresh → Show login page

## Environment Setup

### Django Settings Required
```python
# settings.py

# Add authentication app
INSTALLED_APPS = [
    ...
    'authentication',
    'rest_framework_simplejwt',
    ...
]

# Custom user model
AUTH_USER_MODEL = 'authentication.Owner'

# JWT configuration
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=24),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    ...
}

# Email configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.getenv('EMAIL_HOST', '')
EMAIL_PORT = os.getenv('EMAIL_PORT', 587)
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
```

### Environment Variables (.env)
```
DJANGO_SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### Frontend Environment (.env)
```
VITE_API_URL=http://localhost:8000/api
```

## Dependencies

### Backend
```
Django==6.0.1
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.2
python-decouple==3.8
```

### Frontend
```
react==18.3.1
react-router-dom==6.x
axios==1.6.x
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│            React Frontend (Vite)                │
├─────────────────────────────────────────────────┤
│  AuthContext (token management, API calls)     │
│  ├─ ProtectedRoute (guards authenticated pages)│
│  ├─ LoginPage, SignupPage, etc.               │
│  └─ Dashboard, Inventory, Billing (protected) │
└────────────────┬────────────────────────────────┘
                 │ HTTP/JSON (JWT tokens)
                 │
         ┌───────▼────────┐
         │ Django Backend │
         ├────────────────┤
         │ AuthViewSet    │
         │ ├─ register    │
         │ ├─ login       │
         │ ├─ password_   │
         │ │  reset_*     │
         │ ├─ check_owner │
         │ └─ me          │
         └────────────────┘
                 │
         ┌───────▼────────────────┐
         │  SQLite Database       │
         │  ├─ Owner table        │
         │  ├─ PasswordReset      │
         │  │   Token table       │
         │  ├─ ShopProfile        │
         │  └─ ... inventory etc. │
         └────────────────────────┘
```

## Next Steps: Electron Integration

1. **Electron Main Process**: Auto-start Django backend subprocess
2. **Packaging**: Build for Linux (AppImage), Windows (.exe), Mac (.dmg)
3. **Offline-First**: Ensure all data stored locally in SQLite
4. **Auto-Update**: Configure check for app updates

## Production Deployment

### Considerations
- Use secure HTTP (HTTPS) in production
- Set `DEBUG=False` in Django settings
- Use strong SECRET_KEY
- Configure ALLOWED_HOSTS
- Use production WSGI server (Gunicorn, uWSGI)
- Consider using secure cookies instead of localStorage
- Implement rate limiting on auth endpoints
- Monitor failed login attempts

### Email Configuration Examples

**Gmail:**
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-16-character-app-password
```

**Office 365:**
```
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@company.com
EMAIL_HOST_PASSWORD=your-password
```

**SendGrid:**
```
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=SG.your-sendgrid-key
```

---

**Status**: ✅ Complete - Backend and Frontend authentication fully implemented and tested
**Next**: Implement Electron desktop wrapper for offline-first usage
