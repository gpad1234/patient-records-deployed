# Data Loading & Seeding Guide

## Overview

The Diabetes EMR system includes a comprehensive data loading mechanism that supports:
- **Synthetic Patient Generation** - Generate realistic test patients with complete medical records
- **Batch Seeding** - Load 100+ patients at once via API
- **Admin Interface** - Web UI for managing test data
- **Multiple Data Source Support** - CSV, Synthea format, FHIR (extensible)

---

## Quick Start

### 1. Generate Test Data via Web UI

Navigate to: **http://localhost:3000/admin/seed**

- Input the number of patients to generate (1-1000)
- Click "🌱 Generate Test Data"
- See patients appear in the Patient List immediately

### 2. Generate via API

```bash
# Seed 50 patients
curl -X POST http://localhost:3001/api/admin/seed \
  -H "Content-Type: application/json" \
  -d '{"count": 50}'

# Response:
# {"success":true,"patientsInserted":50,"message":"Seeded 50 synthetic patients"}
```

### 3. Check Current Data Status

```bash
# Check total patient count
curl http://localhost:3001/api/admin/seed-status

# Response:
# {"totalPatients":100}
```

### 4. Clear All Data (Development Only)

```bash
# ⚠️ WARNING: This deletes all data
curl -X DELETE http://localhost:3001/api/admin/clear-all

# Response:
# {"success":true,"message":"All data cleared"}
```

---

## Data Loader Architecture

### File: `services/node-api/src/dataLoader.js`

The `DataLoader` class handles synthetic patient generation with the following methods:

#### `generateSyntheticPatients(count)`
Generates realistic patient records with:
- **Demographics**: First/Last name, MRN, email, phone, DOB, gender, address
- **Medical Info**: Diabetes type, diagnosis date, status
- **Medical Records**: Glucose readings, lab results, medications, diagnoses, allergies

**MRN Generation**: Uses timestamp + index for global uniqueness
```javascript
const baseTime = Date.now();
const mrn = `MRN${String(baseTime + i).slice(-9)}`;
```

#### Medical Record Generation Methods

**Glucose Records** (`generateGlucoseRecords(count)`)
- Generates 20 readings per patient
- Types: Fasting, Random, Postprandial, Bedtime
- Values: 80-230 mg/dL (realistic range)
- Dates: Last 30 days

**Lab Results** (`generateLabRecords(count)`)
- 10 test types: HbA1c, Glucose, Creatinine, Cholesterol, LDL, HDL, Triglycerides, BUN
- Realistic values within clinical ranges
- Status classification: Normal/Low/High/Critical
- Date range: Last 90 days

**Medications** (`generateMedications(count)`)
- 10 real diabetes/hypertension medications (Metformin, Lisinopril, Atorvastatin, etc.)
- Dosage, frequency, route, indication included
- Status: Active

**Diagnoses** (`generateDiagnoses()`)
- Primary/Secondary/Comorbidity types
- ICD-10 codes (E11.9 for Type 2 Diabetes, I10 for Hypertension, etc.)
- Status: Active

**Allergies** (`generateAllergies(count)`)
- Allergen types: Penicillin, Sulfonamides, Latex, Shellfish, Peanuts, NSAIDs
- Reaction types and severity levels: Mild/Moderate/Severe/Life-threatening

#### `seedDatabase(patientCount)`
Main seeding orchestration:
1. Generates N synthetic patients
2. Inserts patients into database
3. For each patient, inserts all medical records (glucose, labs, meds, diagnoses, allergies)
4. Returns seeding result with count

---

## API Endpoints

### POST `/api/admin/seed`
Generate and insert synthetic patients.

**Request:**
```json
{
  "count": 100
}
```

**Response:**
```json
{
  "success": true,
  "patientsInserted": 100,
  "message": "Seeded 100 synthetic patients"
}
```

**Notes:**
- Duplicate MRNs are silently ignored (UNIQUE constraint)
- Each call generates a new batch with unique timestamps
- Medical records are auto-generated for each patient

### GET `/api/admin/seed-status`
Check current patient count in database.

**Response:**
```json
{
  "totalPatients": 100
}
```

### DELETE `/api/admin/clear-all`
Clear all patient data (development only).

**Response:**
```json
{
  "success": true,
  "message": "All data cleared"
}
```

---

## Database Schema

The data loader creates records across these tables:

### Patients Table
```sql
CREATE TABLE patients (
  id INTEGER PRIMARY KEY,
  mrn TEXT UNIQUE,
  firstName TEXT,
  lastName TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  dateOfBirth TEXT,
  gender TEXT,
  diabetesType TEXT,
  diagnosisDate TEXT,
  status TEXT,
  createdAt DATETIME,
  updatedAt DATETIME
)
```

### Related Tables
- **glucose_records** - Blood glucose readings
- **lab_results** - Lab test results with values and ranges
- **medications** - Current prescriptions
- **diagnoses** - Patient diagnoses with ICD-10 codes
- **allergies** - Known allergies with severity

Each table has foreign key constraints linking back to `patients(id)`.

---

## Realistic Data Characteristics

The synthetic patients are designed to be realistic:

### Patient Demographics
- First/last names from realistic US name lists
- MRNs in standard hospital format (MRN + digits)
- Emails in domain format (firstname.lastname@hospital.com)
- DOB ranges: 1950-2005 (age 20-75)
- Gender distribution: M/F

### Medical Realism
- **Glucose**: 80-230 mg/dL (realistic for diabetes patients)
- **HbA1c**: 5.7-8.5% (tracks glucose control)
- **Diagnoses**: Primary (Diabetes) + secondary (Hypertension, etc.)
- **Medications**: Real drugs used in diabetes management
- **Allergies**: Common hospital allergies with severity

### Data Relationships
- Each patient has 20 glucose readings (tracking over time)
- Lab results span 90 days (quarterly monitoring)
- Medications are active prescriptions
- Diagnoses include comorbidities realistic for diabetic patients

---

## Usage Patterns

### Development/Testing
```bash
# Start fresh
curl -X DELETE http://localhost:3001/api/admin/clear-all

# Load test data
curl -X POST http://localhost:3001/api/admin/seed \
  -H "Content-Type: application/json" \
  -d '{"count": 100}'

# Build features against 100 patient dataset
```

### Pagination Testing
```bash
# Page 1 (patients 1-10)
curl http://localhost:3001/api/patients/paginated?page=1&limit=10

# Page 5 (patients 41-50)
curl http://localhost:3001/api/patients/paginated?page=5&limit=10

# Different page size
curl http://localhost:3001/api/patients/paginated?page=1&limit=25
```

### Performance Testing
```bash
# Generate large datasets
curl -X POST http://localhost:3001/api/admin/seed \
  -H "Content-Type: application/json" \
  -d '{"count": 500}'

# Test pagination response times
time curl http://localhost:3001/api/patients/paginated?page=1&limit=50
```

---

## Extending the Data Loader

### Add New Patient Fields

1. Update database schema in `server.js` initializeDatabase()
2. Add field generation to `DataLoader` class
3. Update INSERT statement in `seedDatabase()`

Example: Add `middleName`
```javascript
// In generateSyntheticPatients()
const patient = {
  middleName: firstNames[Math.floor(Math.random() * firstNames.length)],
  // ...
};

// In seedDatabase()
db.run(`
  INSERT INTO patients (..., middleName, ...)
  VALUES (..., ?, ...)
`, [..., patient.middleName, ...]);
```

### Import CSV Data

Uncomment the `loadFromCSV()` method in DataLoader:
```javascript
const records = await dataLoader.loadFromCSV('/path/to/patients.csv');
// Process and insert
```

### Support FHIR Format

Extend DataLoader with FHIR parsing:
```javascript
async loadFromFHIR(fhirBundle) {
  // Parse FHIR Bundle
  // Map to patient format
  // Insert via seedDatabase()
}
```

---

## Troubleshooting

### Duplicate MRN Errors
If you see "SQLITE_CONSTRAINT: UNIQUE constraint failed: patients.mrn":
- The MRN already exists from a previous seed
- Clear data with `DELETE /api/admin/clear-all`
- Or let the system skip duplicates (they're counted as not inserted)

### Not Enough Records Inserted
If requesting 100 but only getting 50:
- Some MRNs may have been duplicates
- Try again with `count: 150`
- Check with `seed-status` endpoint for actual count

### Database File Issues
If database is locked or corrupted:
```bash
# Delete the database file
rm /Users/gp/java-code/patient-records/services/node-api/data/diabetes.db

# Restart server - will recreate fresh database
npm start
```

---

## Next Steps

**Enhancement Opportunities:**
1. **Import from Synthea** - Download real synthetic data from synthea-tools
2. **CSV Importer UI** - Upload CSV files for bulk data loading
3. **Realistic Time Series** - Spread records across months/years
4. **Provider Data** - Generate hospitals, departments, providers
5. **Care Team Assignments** - Assign multiple providers per patient
6. **Export/Download** - Export patient data as CSV/FHIR

**Performance Optimizations:**
1. Batch inserts for faster seeding (1000+ patients)
2. Database indexes on common queries
3. Caching for patient list aggregations

---

## Summary

The data loading system provides:
- ✅ Realistic synthetic patient generation
- ✅ Configurable batch seeding
- ✅ Web UI and API access
- ✅ Complete medical record creation
- ✅ Easy data reset for testing
- ✅ Extensible architecture for external data

Use it to populate the system with test data for development, testing, and demonstrations.
