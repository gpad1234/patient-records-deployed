# Password Authentication Schema

## Overview

The application uses **SHA256 hashing with a salt** for password storage and verification. This is implemented in the authentication middleware.

## Hashing Scheme

### Algorithm
```
password_hash = SHA256(password + salt)
```

### Salt Configuration
- **Default Salt**: `"default-salt-change-me"`
- **Environment Variable**: `PASSWORD_SALT` (optional)
- **Location**: Set in `.env` file or system environment

### Implementation
```javascript
// File: services/node-api/src/middleware/auth.js
function hashPassword(password) {
  return crypto
    .createHash('sha256')
    .update(password + process.env.PASSWORD_SALT || 'default-salt-change-me')
    .digest('hex');
}
```

## Generating Password Hashes

### Method 1: Using Node.js REPL
```bash
cd services/node-api
node -e "const auth = require('./src/middleware/auth'); console.log(auth.hashPassword('your_password'));"
```

### Method 2: Using Node.js Script
```javascript
const crypto = require('crypto');
const password = 'your_password';
const salt = process.env.PASSWORD_SALT || 'default-salt-change-me';
const hash = crypto.createHash('sha256').update(password + salt).digest('hex');
console.log(hash);
```

### Method 3: Direct in Node REPL
```bash
node
> const crypto = require('crypto');
> crypto.createHash('sha256').update('password123' + 'default-salt-change-me').digest('hex');
```

## Default Credentials

All default users use the password: **`password123`**

| Username | Role | Email | Password |
|----------|------|-------|----------|
| admin | admin | admin@hospital.com | password123 |
| dr.smith | doctor | dr.smith@hospital.com | password123 |
| dr.johnson | doctor | dr.johnson@hospital.com | password123 |
| nurse.williams | nurse | nurse.williams@hospital.com | password123 |
| receptionist | receptionist | receptionist@hospital.com | password123 |

### Password Hash for "password123"
```
2eb966329ce601f8ce6f3319a9c478657b9e14e18d613c9cd5092616a5fd104a
```

## Testing Authentication

### 1. Test Login (Success)
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@hospital.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin",
    "patientId": null
  },
  "token": "eyJ1c2VySWQiOjEsInVzZXJu..."
}
```

### 2. Test Login (Invalid Credentials)
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"wrong_password"}'
```

**Expected Response:**
```json
{
  "error": "Invalid credentials"
}
```

### 3. Test Protected Endpoint
```bash
# First, get a token
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Use the token to access protected endpoint
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Test User Registration
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "firstName": "Test",
    "lastName": "User",
    "role": "patient"
  }'
```

### 5. Check Available Roles
```bash
curl http://localhost:3001/api/auth/roles
```

## Updating User Passwords

### Update in Database
```bash
# Generate hash for new password
NEW_HASH=$(cd services/node-api && node -e "const auth = require('./src/middleware/auth'); console.log(auth.hashPassword('new_password'));")

# Update in database
sqlite3 services/node-api/data/diabetes.db \
  "UPDATE users SET password_hash = '$NEW_HASH' WHERE username = 'admin';"
```

### Update All Users to Same Password
```bash
# Generate hash
HASH=$(cd services/node-api && node -e "const auth = require('./src/middleware/auth'); console.log(auth.hashPassword('password123'));")

# Update all users
sqlite3 services/node-api/data/diabetes.db \
  "UPDATE users SET password_hash = '$HASH';"
```

## Token Schema

### Token Format
The application uses **Base64-encoded JSON** tokens (not JWT).

### Token Structure
```json
{
  "userId": 1,
  "username": "admin",
  "role": "admin",
  "timestamp": 1767387526065,
  "random": "hex_string"
}
```

### Token Expiration
- **Lifetime**: 24 hours
- **Validation**: Checked on each authenticated request
- **Header Format**: `Authorization: Bearer <token>`

## Security Notes

⚠️ **Production Considerations:**

1. **Change the default salt** via `PASSWORD_SALT` environment variable
2. **Use bcrypt** instead of SHA256 for production (higher security)
3. **Implement JWT** with proper signing for tokens
4. **Add rate limiting** to login endpoint
5. **Use HTTPS** in production
6. **Store salt in secure environment** (not in code)

### Recommended Production Setup
```bash
# .env file
PASSWORD_SALT=your-secure-random-salt-here-minimum-32-characters
JWT_SECRET=your-jwt-secret-here
```

## Troubleshooting

### "Invalid credentials" error
1. Check the password hash in database matches what the server generates
2. Verify the `PASSWORD_SALT` environment variable (if set)
3. Test hash generation matches database value:
   ```bash
   cd services/node-api
   node -e "const auth = require('./src/middleware/auth'); console.log(auth.hashPassword('password123'));"
   sqlite3 data/diabetes.db "SELECT password_hash FROM users WHERE username='admin';"
   ```

### Reset All User Passwords
```bash
cd /home/girish/emr-react/patient-records-deployed
HASH=$(cd services/node-api && node -e "const auth = require('./src/middleware/auth'); console.log(auth.hashPassword('password123'));")
sqlite3 services/node-api/data/diabetes.db "UPDATE users SET password_hash = '$HASH';"
```

## API Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login and get token |
| GET | `/api/auth/me` | Yes | Get current user profile |
| PUT | `/api/auth/me` | Yes | Update current user profile |
| GET | `/api/auth/roles` | No | Get all available roles |
| GET | `/api/auth/users` | Yes (admin) | Get all users |

## Quick Reference

```bash
# Start services
cd services/node-api && npm start &
cd web && npm run dev &

# Test login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'

# Access web UI
open http://localhost:3000

# Check API health
curl http://localhost:3001/api/auth/roles
```
