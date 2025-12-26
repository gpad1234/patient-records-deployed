# Diabetes EMR System - React Web UI & Node API

## Project Structure

```
services/
├── java-service/          # Virtual Threads TCP Server (Pilot)
├── node-api/              # Express.js backend
│   ├── src/
│   │   └── server.js      # API endpoints
│   └── package.json
└── web-ui/                # React frontend
    ├── src/
    │   ├── components/
    │   │   ├── PatientList.jsx
    │   │   ├── PatientForm.jsx
    │   │   ├── DiabetesRecords.jsx
    │   │   ├── HospitalDashboard.jsx
    │   │   └── Navigation.jsx
    │   ├── App.jsx
    │   ├── App.css
    │   └── index.jsx
    ├── public/
    │   └── index.html
    └── package.json
```

## Features

### Node API (Express.js)
- ✅ Patient CRUD operations
- ✅ Diabetes records management
- ✅ Hospital statistics dashboard
- ✅ RESTful endpoints
- ✅ CORS enabled

### React Frontend
- ✅ Hospital dashboard with statistics
- ✅ Patient list view
- ✅ Add new patient form
- ✅ Diabetes medical records per patient
- ✅ Glucose tracking
- ✅ Blood pressure monitoring
- ✅ Medical notes
- ✅ Responsive design

## API Endpoints

```
GET    /api/patients              - List all patients
POST   /api/patients              - Create new patient
GET    /api/patients/:id          - Get patient details
POST   /api/patients/:id/records  - Add diabetes record
GET    /api/hospital/stats        - Hospital statistics
```

## Getting Started

### Node API
```bash
cd services/node-api
npm install
npm run dev              # Runs on http://localhost:3001
```

### React Web UI
```bash
cd services/web-ui
npm install
npm start               # Runs on http://localhost:3000
```

## Environment Variables

Create `.env` file in `web-ui/`:
```
REACT_APP_API_URL=http://localhost:3001
```

## Data Model

### Patient
```json
{
  "id": 1,
  "name": "Alice Wonder",
  "email": "alice@hospital.com",
  "phone": "555-1111",
  "dateOfBirth": "1985-06-15",
  "diabetesType": "Type 2",
  "createdAt": "2025-12-10T10:00:00Z",
  "records": []
}
```

### Diabetes Record
```json
{
  "id": 1702200000000,
  "glucose": 145,
  "bloodPressure": "120/80",
  "notes": "Patient feeling well",
  "recordDate": "2025-12-10T10:00:00Z"
}
```

## Hospital Management Features

1. **Dashboard** - Overview of all patients and statistics
2. **Patient Management** - Add, view, update patient info
3. **Diabetes Tracking** - Record glucose levels, blood pressure
4. **Medical History** - Complete patient record history
5. **Portal Integration** - Centralized hospital system

## Technology Stack

- **Frontend**: React 18, React Router, CSS3
- **Backend**: Node.js, Express.js
- **Database**: In-memory (can be upgraded to MongoDB/PostgreSQL)
- **Integration**: TCP backend (Java) for real-time data

## Next Steps

- [ ] Connect to Java TCP backend
- [ ] Add MongoDB/PostgreSQL database
- [ ] Implement authentication (JWT)
- [ ] Add data validation
- [ ] Unit tests
- [ ] Docker containerization
- [ ] Deployment setup

## Data Loading & Seeding

The system includes a comprehensive data loading mechanism for test patient generation:

### Quick Start
```bash
# Generate 100 synthetic patients via API
curl -X POST http://localhost:3001/api/admin/seed \
  -H "Content-Type: application/json" \
  -d '{"count": 100}'
```

### Web UI for Data Management
Navigate to: **http://localhost:3000/admin/seed**
- Generate test patients with medical records
- Check current database status  
- Clear all data for fresh start

### Features
- ✅ Generates realistic patient demographics
- ✅ Includes complete medical histories (glucose, labs, medications, diagnoses, allergies)
- ✅ Supports 100+ patients with pagination
- ✅ Batch seeding via API
- ✅ Web interface for data management

**See [DATA_LOADING.md](DATA_LOADING.md) for detailed documentation**

## Pagination

The patient list supports pagination for handling large datasets:
- 10 patients per page by default
- Navigate with First/Previous/Next/Last buttons
- API endpoint: `/api/patients/paginated?page=1&limit=10`

## Future Enhancements

- Patient search and filtering
- Export records to PDF
- Mobile app (React Native)
- Medication tracking
- Appointment scheduling
- Doctor notes integration
- Alert system for high glucose levels
- CSV/FHIR data import
- Synthea integration
