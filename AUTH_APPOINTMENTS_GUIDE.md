# Authentication & Appointments Feature Guide

## 🎉 Release: snapshot-1.0

Tagged and pushed to GitHub with full authentication, role-based authorization, and appointment scheduling!

## 🚀 Quick Start

### 1. Initialize the Database

```bash
# Add auth and appointments tables to existing database
./scripts/init-auth-db.sh
```

### 2. Start the Services

```bash
# Start the Node.js API (with new auth endpoints)
cd services/node-api
npm start

# Start the React UI (in another terminal)
cd web
npm run dev
```

### 3. Login

Open http://localhost:5173 and you'll be redirected to the login page.

**Demo Accounts:**
- **Admin**: username: `admin`, password: `password123`
- **Doctor**: username: `dr.smith`, password: `password123`
- **Nurse**: username: `nurse.williams`, password: `password123`
- **Receptionist**: username: `receptionist`, password: `password123`

---

## 🔐 Authentication Features

### User Roles
- **Admin**: Full system access, user management
- **Doctor**: View all patients, edit records, prescribe, manage appointments
- **Nurse**: View all patients, edit records, manage appointments
- **Receptionist**: View patients, manage appointments
- **Patient**: View own records and appointments only

### Security Features
- Token-based authentication (simple Base64, can upgrade to JWT)
- Password hashing (SHA-256, can upgrade to bcrypt)
- Session management
- Audit logging for all actions
- Role-based access control (RBAC)

### API Endpoints

#### Authentication
```bash
# Register new user
POST /api/auth/register
{
  "username": "john.doe",
  "email": "john@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "role": "patient"
}

# Login
POST /api/auth/login
{
  "username": "admin",
  "password": "password123"
}

# Get current user
GET /api/auth/me
Headers: Authorization: Bearer <token>

# Logout
POST /api/auth/logout
Headers: Authorization: Bearer <token>

# Get role permissions
GET /api/auth/roles/:roleName
Headers: Authorization: Bearer <token>
```

---

## 📅 Appointment Scheduling

### Features
- Create, view, update, and cancel appointments
- Filter by status (scheduled, confirmed, completed, cancelled, no-show)
- Search by patient or provider name
- Role-based appointment visibility
- Appointment types: checkup, follow-up, consultation, emergency, procedure
- Provider availability checking

### API Endpoints

```bash
# Get all appointments (filtered by role)
GET /api/appointments
Headers: Authorization: Bearer <token>
Query params: ?status=scheduled&patientId=1&date=2026-01-05

# Get single appointment
GET /api/appointments/:id
Headers: Authorization: Bearer <token>

# Create appointment (admin, doctor, nurse, receptionist only)
POST /api/appointments
Headers: Authorization: Bearer <token>
{
  "patientId": 1,
  "providerId": 2,
  "appointmentDate": "2026-01-10",
  "appointmentTime": "09:00:00",
  "durationMinutes": 30,
  "appointmentType": "checkup",
  "reason": "Regular checkup",
  "notes": "Patient requested morning slot"
}

# Update appointment
PUT /api/appointments/:id
Headers: Authorization: Bearer <token>
{
  "status": "confirmed",
  "notes": "Patient confirmed via phone"
}

# Cancel appointment
POST /api/appointments/:id/cancel
Headers: Authorization: Bearer <token>
{
  "cancellationReason": "Patient called to reschedule"
}

# Check provider availability
GET /api/appointments/availability/:providerId/:date
Headers: Authorization: Bearer <token>
```

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'patient',
    is_active BOOLEAN DEFAULT 1,
    patient_id INTEGER,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    last_login TIMESTAMP
);
```

### Appointments Table
```sql
CREATE TABLE appointments (
    id INTEGER PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    provider_id INTEGER,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    appointment_type TEXT,
    status TEXT DEFAULT 'scheduled',
    reason TEXT,
    notes TEXT,
    created_by INTEGER,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancelled_by INTEGER,
    cancellation_reason TEXT
);
```

### Roles Table
```sql
CREATE TABLE roles (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    can_view_all_patients BOOLEAN,
    can_edit_patients BOOLEAN,
    can_delete_patients BOOLEAN,
    can_view_medical_records BOOLEAN,
    can_edit_medical_records BOOLEAN,
    can_prescribe BOOLEAN,
    can_view_appointments BOOLEAN,
    can_manage_appointments BOOLEAN,
    can_manage_users BOOLEAN
);
```

### Audit Log Table
```sql
CREATE TABLE audit_log (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id INTEGER,
    details TEXT,
    ip_address TEXT,
    created_at TIMESTAMP
);
```

---

## 🎨 UI Components

### Login Page (`/login`)
- Username/email and password inputs
- Demo account quick-fill buttons
- Error handling with user-friendly messages
- Redirects to dashboard after successful login

### Register Page (`/register`)
- Full registration form with validation
- Role selection (patient, doctor, nurse, receptionist, admin)
- Password strength validation
- Automatic login after registration

### Appointments Page (`/appointments`)
- List view with filtering and search
- Create new appointments (role-based access)
- Cancel appointments
- Status badges (scheduled, confirmed, completed, cancelled)
- Responsive design

### Sidebar Updates
- User profile display with avatar
- Role indicator
- Appointments menu item
- Logout button

---

## 🔒 Authorization Rules

### Viewing Patients
- **Admin, Doctor, Nurse**: All patients
- **Receptionist**: All patients (limited medical data)
- **Patient**: Only own record

### Managing Appointments
- **Admin, Doctor, Nurse, Receptionist**: Create/update appointments
- **All roles**: View own appointments
- **Patients**: Can only cancel own appointments

### Medical Records
- **Doctor**: Full read/write access
- **Nurse**: Full read access, limited write
- **Admin**: Full access for system management
- **Patient**: Read-only access to own records

---

## 🛠️ Production Recommendations

### Security Enhancements
1. **Replace SHA-256 with bcrypt** for password hashing:
   ```bash
   npm install bcrypt
   ```

2. **Implement JWT** instead of Base64 tokens:
   ```bash
   npm install jsonwebtoken
   ```

3. **Add rate limiting**:
   ```bash
   npm install express-rate-limit
   ```

4. **Enable HTTPS** in production

5. **Add CSRF protection**:
   ```bash
   npm install csurf
   ```

### Additional Features to Consider
- Email verification for new accounts
- Password reset functionality
- Two-factor authentication (2FA)
- SMS/Email appointment reminders
- Appointment conflict detection
- Calendar view for appointments
- Export appointment reports
- Patient portal for self-scheduling

---

## 📝 Testing

### Test Authentication
```bash
# Register a new user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123456",
    "firstName": "Test",
    "lastName": "User",
    "role": "patient"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

### Test Appointments
```bash
# Get token from login response
TOKEN="your-token-here"

# Create appointment
curl -X POST http://localhost:3001/api/appointments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": 1,
    "providerId": 2,
    "appointmentDate": "2026-01-15",
    "appointmentTime": "10:00:00",
    "appointmentType": "checkup",
    "reason": "Annual checkup"
  }'

# Get all appointments
curl -X GET http://localhost:3001/api/appointments \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🐛 Troubleshooting

### Login not working
1. Check that the database was initialized: `./scripts/init-auth-db.sh`
2. Verify Node.js API is running on port 3001
3. Check browser console for errors
4. Clear localStorage: `localStorage.clear()` in browser console

### Appointments not showing
1. Ensure you're logged in
2. Check that appointments exist in database
3. Verify API endpoint is accessible
4. Check role permissions

### Database errors
1. Backup database first
2. Re-run schema: `./scripts/init-auth-db.sh`
3. Check file permissions on database file

---

## 📦 Files Added/Modified

### New Files
- `data/auth_and_appointments.sql` - Database schema
- `services/node-api/src/middleware/auth.js` - Auth middleware
- `services/node-api/src/routes/auth.js` - Auth endpoints
- `services/node-api/src/routes/appointments.js` - Appointment endpoints
- `web/src/pages/Login.jsx` - Login page
- `web/src/pages/Register.jsx` - Registration page
- `web/src/pages/Appointments.jsx` - Appointments management
- `scripts/init-auth-db.sh` - Database initialization script
- `AUTH_APPOINTMENTS_GUIDE.md` - This guide

### Modified Files
- `services/node-api/src/server.js` - Added auth and appointment routes
- `web/src/App.jsx` - Added protected routes
- `web/src/components/Sidebar.jsx` - Added user info and logout

---

## 📊 Next Steps

1. ✅ Test all authentication flows
2. ✅ Create sample appointments
3. ✅ Verify role-based access control
4. 📧 Add email notifications (future)
5. 📱 Add SMS reminders (future)
6. 📅 Add calendar view (future)
7. 🔔 Add real-time notifications (future)

---

## 🎯 Git Tag

This release is tagged as `snapshot-1.0`:
```bash
git tag
# Shows: snapshot-1.0

git show snapshot-1.0
# Shows tag details
```

---

**Congratulations! 🎉** Your EMR system now has complete authentication, authorization, and appointment scheduling capabilities!
