# Diabetes EMR System - Standalone Application

**Complete Independent React + Node.js + SQLite Application**

## Quick Start

### 1. Setup
```bash
bash services/setup.sh
```

### 2. Run Backend (Node API)
```bash
cd services/node-api
npm run dev
```
Server runs on `http://localhost:3001`

### 3. Run Frontend (React UI)
```bash
cd services/web-ui
npm start
```
UI runs on `http://localhost:3000`

## Architecture

```
Diabetes EMR System
├── React Web UI (Port 3000)
│   ├── Dashboard
│   ├── Patient Management
│   └── Diabetes Records
└── Node.js API (Port 3001)
    └── SQLite Database
```

## Features

✅ **Patient Management**
- Add new patients
- View patient list
- Patient details
- Update patient info
- Delete patients

✅ **Diabetes Tracking**
- Record glucose levels
- Track blood pressure
- Add medical notes
- Complete patient history

✅ **Hospital Dashboard**
- Total patients count
- Diabetes type distribution
- Medical records summary
- Recent patient activity

✅ **Independent Deployment**
- Single Node.js backend
- SQLite embedded database
- No external DB required
- Easy containerization

## API Endpoints

```
GET    /api/patients              - List all patients
POST   /api/patients              - Create patient
GET    /api/patients/:id          - Get patient details
PUT    /api/patients/:id          - Update patient
DELETE /api/patients/:id          - Delete patient
POST   /api/patients/:id/records  - Add diabetes record
GET    /api/patients/:id/records  - Get patient records
GET    /api/hospital/stats        - Hospital statistics
GET    /api/health                - Health check
```

## Database Schema

### Patients Table
```sql
CREATE TABLE patients (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  dateOfBirth TEXT,
  diabetesType TEXT DEFAULT 'Type 2',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Diabetes Records Table
```sql
CREATE TABLE diabetes_records (
  id INTEGER PRIMARY KEY,
  patientId INTEGER NOT NULL,
  glucose REAL NOT NULL,
  bloodPressure TEXT,
  notes TEXT,
  recordDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patientId) REFERENCES patients(id)
);
```

## Environment Variables

### Node API (.env)
```
NODE_ENV=development
PORT=3001
DATABASE_URL=./data/diabetes.db
API_CORS=http://localhost:3000
```

### React UI (.env)
```
REACT_APP_API_URL=http://localhost:3001
```

## Development

### Backend Development
```bash
cd services/node-api
npm run dev      # Auto-restart on file changes
npm test         # Run tests
```

### Frontend Development
```bash
cd services/web-ui
npm start        # Dev server with hot reload
npm test         # Run tests
npm build        # Production build
```

## Production Deployment

### Build React App
```bash
cd services/web-ui
npm run build
```

### Deploy Node API
```bash
cd services/node-api
NODE_ENV=production npm start
```

### Docker (Optional)
```bash
docker-compose up
```

## Technologies

- **Frontend**: React 18, React Router, CSS3
- **Backend**: Express.js, Node.js
- **Database**: SQLite3
- **Testing**: Jest, React Testing Library
- **DevTools**: Nodemon

## Security Considerations

- [ ] Add input validation
- [ ] Implement authentication (JWT)
- [ ] Add rate limiting
- [ ] Enable HTTPS in production
- [ ] Encrypt sensitive data
- [ ] Add CSRF protection

## Future Enhancements

- [ ] User authentication & roles
- [ ] Advanced data analytics
- [ ] Export to PDF/CSV
- [ ] Appointment scheduling
- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Payment integration
- [ ] Multi-language support

## Troubleshooting

**Database locked error:**
```bash
rm services/node-api/data/diabetes.db
npm run dev  # Recreate database
```

**Port already in use:**
```bash
# Change PORT in .env
PORT=3002 npm run dev
```

**CORS errors:**
Check API_CORS environment variable matches React UI origin.

## Support

For issues or questions, refer to individual service README files:
- `services/node-api/README.md`
- `services/web-ui/README.md`
