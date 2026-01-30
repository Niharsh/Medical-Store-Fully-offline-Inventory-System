# Quick Start Guide: Medical Shop Authentication

Get the Medical Shop Inventory System up and running with authentication in 5 minutes!

## Prerequisites
- Python 3.12+
- Node.js 16+
- Git

## 1. Backend Setup (Django)

### Start Django Server
```bash
cd backend
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
python manage.py runserver
```

Django runs on `http://localhost:8000`

### Create First Owner (Signup)
The app uses **one-time signup** - once an owner is created, no more signups are allowed.

**Via API:**
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@medicalshop.com",
    "password": "secure123456",
    "password_confirm": "secure123456",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

**Response:**
```json
{
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  },
  "owner": {
    "id": 1,
    "email": "owner@medicalshop.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

### Check Owner Status
```bash
curl http://localhost:8000/api/auth/check_owner/
# Response: {"owner_exists": true}
```

## 2. Frontend Setup (React)

### Install Dependencies
```bash
cd frontend
npm install
```

### Start Dev Server
```bash
npm run dev
```

React runs on `http://localhost:5173` (or port shown in terminal)

### Login Flow
1. Open `http://localhost:5173`
2. AuthContext checks if owner exists
3. If no owner → Shows **Signup Page**
4. If owner exists but not logged in → Shows **Login Page**
5. Enter email: `owner@medicalshop.com` and password: `secure123456`
6. Success → Redirected to **Dashboard**

## 3. Authentication Pages

### SignupPage (`/signup`)
- **Visible when**: No owner exists yet
- **Auto-disappears after**: First signup
- **Fields**: Email, First Name, Last Name, Password, Confirm Password
- **Validates**: Email format, password strength (min 8 chars), match confirmation

### LoginPage (`/login`)
- **Visible when**: Owner exists but user not authenticated
- **Fields**: Email, Password
- **Link**: "Forgot Password?" → `/forgot-password`

### ForgotPasswordPage (`/forgot-password`)
- **Sends**: Email with password reset link
- **Valid for**: 48 hours
- **Note**: Requires email configuration (see below)

### ResetPasswordPage (`/reset-password/:token`)
- **Accessed**: Via email link
- **Action**: Sets new password
- **Result**: Auto-login after reset

## 4. Email Configuration (Password Reset)

### For Gmail:
1. Enable 2-Factor Authentication
2. Create App Password: https://myaccount.google.com/apppasswords
3. Add to `.env` or environment:

```bash
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-16-character-app-password
```

### For Other Providers:
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
EMAIL_HOST_PASSWORD=SG.your-key
```

### Test Email (Django):
```python
python manage.py shell
>>> from django.core.mail import send_mail
>>> send_mail('Subject', 'Message', 'from@email.com', ['to@email.com'])
```

## 5. API Reference

### Register (Signup)
```
POST /api/auth/register/
Content-Type: application/json

{
  "email": "owner@medicalshop.com",
  "password": "secure123456",
  "password_confirm": "secure123456",
  "first_name": "John",
  "last_name": "Doe"
}

Response: 201 Created
{
  "tokens": {"access": "...", "refresh": "..."},
  "owner": {...}
}
```

### Login
```
POST /api/auth/login/
Content-Type: application/json

{
  "email": "owner@medicalshop.com",
  "password": "secure123456"
}

Response: 200 OK
{
  "tokens": {"access": "...", "refresh": "..."},
  "owner": {...}
}
```

### Check Owner Exists
```
GET /api/auth/check_owner/

Response: 200 OK
{"owner_exists": true}
```

### Get Current User
```
GET /api/auth/me/
Authorization: Bearer {access_token}

Response: 200 OK
{
  "id": 1,
  "email": "owner@medicalshop.com",
  "first_name": "John",
  "last_name": "Doe",
  "is_active": true
}
```

### Request Password Reset
```
POST /api/auth/password_reset_request/
Content-Type: application/json

{"email": "owner@medicalshop.com"}

Response: 200 OK
{"message": "Reset email sent"}
```

### Confirm Password Reset
```
POST /api/auth/password_reset_confirm/
Content-Type: application/json

{
  "token": "550e8400-e29b-41d4-a716-446655440000",
  "new_password": "newpassword123"
}

Response: 200 OK
{
  "tokens": {"access": "...", "refresh": "..."},
  "owner": {...}
}
```

## 6. Development Workflow

### Make API Requests from Frontend
```javascript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { login, logout, owner, error } = useAuth();

  const handleLogin = async () => {
    try {
      await login('owner@medicalshop.com', 'secure123456');
      // Now on dashboard
    } catch (err) {
      console.log('Login failed:', error);
    }
  };

  return (
    <>
      {owner ? (
        <>
          <p>Welcome, {owner.first_name}!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </>
  );
}
```

### Protect Routes
```javascript
import ProtectedRoute from './components/Common/ProtectedRoute';
import Dashboard from './pages/Dashboard';

<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

## 7. JWT Token Management

### Tokens Stored In
- **localStorage** (frontend)
- Keys: `access_token`, `refresh_token`

### Token Lifespan
- **Access Token**: 24 hours (short-lived)
- **Refresh Token**: 7 days (long-lived)
- **Reset Token**: 48 hours (one-time use)

### Auto-Refresh
Frontend automatically:
1. Stores tokens in localStorage
2. Includes `Authorization: Bearer {token}` header on API calls
3. Auto-refreshes expired tokens (configured in interceptor)
4. Clears tokens on logout

## 8. Testing Checklist

- [ ] Signup creates owner account
- [ ] Login with correct credentials works
- [ ] Login with wrong password fails
- [ ] Protected routes redirect to /login when not authenticated
- [ ] Logout clears tokens
- [ ] Refresh browser → Still logged in (auto-login)
- [ ] Password reset sends email
- [ ] Reset password link works (check email for link)
- [ ] New password works after reset

## 9. Common Issues & Solutions

### Issue: "Owner already exists" on signup
**Solution**: You've already created one owner. Delete `backend/db.sqlite3` to reset database.

### Issue: "Invalid email or password" on login
**Solution**: Check email and password are correct. Default test account is `admin@medicalshop.com` / `admin123456`

### Issue: Password reset email not received
**Solution**: 
1. Check email configuration in `.env`
2. Check spam folder
3. Use Gmail app password if using Gmail
4. Test with Django: `python manage.py shell` → `send_mail(...)`

### Issue: CORS errors when calling API
**Solution**: Make sure Django is running on port 8000 and CORS is configured in `settings.py`

### Issue: "Token invalid or expired" after login
**Solution**: Clear localStorage and login again:
```javascript
localStorage.clear();
window.location.reload();
```

## 10. Environment Variables

Create `.env` file in backend directory:
```
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

Create `.env` file in frontend directory:
```
VITE_API_URL=http://localhost:8000/api
```

## 11. Useful Commands

### Reset Database
```bash
cd backend
rm db.sqlite3
python manage.py migrate
python manage.py shell -c "from authentication.models import Owner; Owner.objects.create_superuser(email='admin@medicalshop.com', password='admin123456')"
```

### View Database Admin
```bash
# Go to http://localhost:8000/admin
# Login with admin email/password
```

### Check URL Patterns
```bash
python manage.py show_urls
# Shows all available API endpoints
```

### View Logs
```bash
# Check terminal where Django is running
# Or check database: SELECT * FROM django_admin_log;
```

## 12. Next Steps

After authentication is working:

1. **Electron Integration** → Build desktop app with offline-first capability
2. **Multi-User Support** → Add staff/admin roles (optional)
3. **2FA** → Add Two-Factor Authentication (optional)
4. **API Key Auth** → For headless access (optional)
5. **Session Management** → Track active sessions (optional)

## Resources

- [JWT Authentication Guide](AUTHENTICATION_IMPLEMENTATION.md)
- [Session Summary](SESSION_AUTHENTICATION_SUMMARY.md)
- [Django REST Framework Docs](https://www.django-rest-framework.org/)
- [djangorestframework-simplejwt Docs](https://django-rest-framework-simplejwt.readthedocs.io/)

---

**Questions?** Check the `AUTHENTICATION_IMPLEMENTATION.md` file for detailed documentation.
