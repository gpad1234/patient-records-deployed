# Diabetes EMR - Healthcare Data Model

## Domain Model Overview

```
Healthcare System
├── Patient (Core Entity)
│   ├── Demographics
│   ├── Medical History
│   └── Care Team
├── Provider (Doctor/Nurse)
├── Visit/Encounter
│   ├── Vital Signs
│   ├── Glucose Records
│   └── Lab Results
├── Medications
├── Diagnoses
└── Allergies
```

## Database Schema

### 1. Patients Table
**Core patient demographics and diabetes information**

```sql
CREATE TABLE patients (
  id INTEGER PRIMARY KEY,
  mrn TEXT UNIQUE,              -- Medical Record Number
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  dateOfBirth TEXT,
  gender TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zipCode TEXT,
  diabetesType TEXT,            -- Type 1, Type 2, Gestational
  diagnosisDate TEXT,
  status TEXT,                  -- Active, Inactive, Deceased
  createdAt DATETIME,
  updatedAt DATETIME
);
```

**Sample Data:**
```json
{
  "id": 1,
  "mrn": "PT-2025-00001",
  "firstName": "Alice",
  "lastName": "Wonder",
  "email": "alice@hospital.com",
  "phone": "555-1111",
  "dateOfBirth": "1985-06-15",
  "gender": "Female",
  "address": "123 Health St",
  "city": "Boston",
  "state": "MA",
  "zipCode": "02101",
  "diabetesType": "Type 2",
  "diagnosisDate": "2020-03-15",
  "status": "Active"
}
```

### 2. Providers Table
**Healthcare providers (doctors, nurses, specialists)**

```sql
CREATE TABLE providers (
  id INTEGER PRIMARY KEY,
  npi TEXT UNIQUE,              -- National Provider Identifier
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  specialty TEXT,               -- Endocrinology, General Practice, etc.
  department TEXT,              -- Diabetes Care, Cardiology, etc.
  email TEXT,
  phone TEXT
);
```

**Sample Data:**
```json
{
  "id": 1,
  "npi": "1234567890",
  "firstName": "John",
  "lastName": "Smith",
  "specialty": "Endocrinology",
  "department": "Diabetes Care",
  "email": "john.smith@hospital.com"
}
```

### 3. Visits Table
**Patient encounters/appointments**

```sql
CREATE TABLE visits (
  id INTEGER PRIMARY KEY,
  patientId INTEGER,            -- FK to patients
  providerId INTEGER,           -- FK to providers
  visitDate DATETIME,
  department TEXT,
  visitType TEXT,              -- Office Visit, Telehealth, Lab, etc.
  reason TEXT,                 -- Chief complaint
  notes TEXT,
  createdAt DATETIME
);
```

### 4. Vital Signs Table
**Patient measurements during visit**

```sql
CREATE TABLE vital_signs (
  id INTEGER PRIMARY KEY,
  visitId INTEGER,              -- FK to visits
  patientId INTEGER,            -- FK to patients
  temperature REAL,             -- Fahrenheit
  bloodPressureSystolic INTEGER,
  bloodPressureDiastolic INTEGER,
  heartRate INTEGER,            -- BPM
  respiratoryRate INTEGER,      -- Breaths/min
  weight REAL,                  -- kg
  height REAL,                  -- cm
  bmi REAL,                     -- Calculated BMI
  recordedAt DATETIME
);
```

### 5. Glucose Records Table
**Diabetes-specific glucose tracking**

```sql
CREATE TABLE glucose_records (
  id INTEGER PRIMARY KEY,
  visitId INTEGER,              -- FK to visits (nullable for self-monitoring)
  patientId INTEGER,            -- FK to patients
  glucoseValue REAL NOT NULL,   -- mg/dL
  glucoseType TEXT,            -- Fasting, Random, Postprandial, etc.
  unit TEXT,                   -- mg/dL or mmol/L
  notes TEXT,
  recordedAt DATETIME
);
```

**Glucose Types:**
- Fasting (8+ hours no food)
- Random (any time)
- Postprandial (2 hours after meal)
- Bedtime
- Pre-meal
- Post-meal

### 6. Lab Results Table
**Blood tests and laboratory findings**

```sql
CREATE TABLE lab_results (
  id INTEGER PRIMARY KEY,
  visitId INTEGER,              -- FK to visits
  patientId INTEGER,            -- FK to patients
  testName TEXT NOT NULL,       -- HbA1c, Creatinine, etc.
  testCode TEXT,                -- LOINC code
  resultValue REAL,
  unit TEXT,                    -- %, mmol/mol, mg/dL, etc.
  referenceRange TEXT,          -- Normal range
  status TEXT,                  -- Normal, High, Low, Critical
  resultDate DATETIME
);
```

**Common Diabetes Tests:**
- HbA1c (Hemoglobin A1c) - 3-month average
- Fasting Glucose
- Creatinine (kidney function)
- eGFR (glomerular filtration rate)
- Total Cholesterol
- HDL Cholesterol
- LDL Cholesterol
- Triglycerides
- Urine Albumin

### 7. Medications Table
**Patient prescriptions and medications**

```sql
CREATE TABLE medications (
  id INTEGER PRIMARY KEY,
  patientId INTEGER,            -- FK to patients
  medicationName TEXT,
  dosage TEXT,                  -- 500, 1000, etc.
  unit TEXT,                    -- mg, units, etc.
  frequency TEXT,               -- Daily, BID, TID, QID, PRN
  route TEXT,                   -- PO, IV, IM, SC, etc.
  startDate TEXT,
  endDate TEXT,
  indication TEXT,              -- Why prescribed
  prescribedBy INTEGER,         -- FK to providers
  status TEXT                   -- Active, Inactive, Discontinued
);
```

**Common Diabetes Medications:**
- Metformin
- Insulin (multiple types)
- GLP-1 Agonists
- SGLT2 Inhibitors
- Sulfonylureas

### 8. Diagnoses Table
**Patient diagnoses and comorbidities**

```sql
CREATE TABLE diagnoses (
  id INTEGER PRIMARY KEY,
  patientId INTEGER,            -- FK to patients
  diagnosisCode TEXT,
  diagnosisName TEXT,
  icd10Code TEXT,              -- ICD-10 CM code
  diagnosisType TEXT,          -- Primary, Secondary, Comorbidity
  onsetDate TEXT,
  resolvedDate TEXT,
  status TEXT                  -- Active, Resolved, Inactive
);
```

**Diabetes-Related Conditions:**
- Hypertension
- Hyperlipidemia
- Diabetic Retinopathy
- Diabetic Nephropathy
- Diabetic Neuropathy
- Cardiovascular Disease
- Obesity

### 9. Allergies Table
**Patient medication and food allergies**

```sql
CREATE TABLE allergies (
  id INTEGER PRIMARY KEY,
  patientId INTEGER,
  allergen TEXT,               -- Substance name
  reactionType TEXT,           -- Rash, Anaphylaxis, etc.
  severity TEXT,              -- Mild, Moderate, Severe, Life-threatening
  notes TEXT,
  recordedDate DATETIME
);
```

### 10. Care Team Table
**Team members responsible for patient care**

```sql
CREATE TABLE care_team (
  id INTEGER PRIMARY KEY,
  patientId INTEGER,
  providerId INTEGER,
  role TEXT,                  -- Primary Care, Cardiologist, Nutritionist, etc.
  startDate DATETIME,
  endDate DATETIME
);
```

## Relationships

```
Patient (1) ──────── (M) Visits
Patient (1) ──────── (M) Glucose Records
Patient (1) ──────── (M) Lab Results
Patient (1) ──────── (M) Medications
Patient (1) ──────── (M) Diagnoses
Patient (1) ──────── (M) Allergies
Patient (1) ──────── (M) Care Team Members

Provider (1) ──────── (M) Visits
Provider (1) ──────── (M) Medications (prescribed)
Provider (1) ──────── (M) Care Team Assignments

Visit (1) ──────── (1) Vital Signs
Visit (1) ──────── (M) Glucose Records
Visit (1) ──────── (M) Lab Results
```

## API Endpoints (To Be Implemented)

### Patients
```
GET    /api/patients
POST   /api/patients
GET    /api/patients/:id
PUT    /api/patients/:id
DELETE /api/patients/:id
```

### Providers
```
GET    /api/providers
POST   /api/providers
```

### Visits
```
GET    /api/patients/:patientId/visits
POST   /api/patients/:patientId/visits
GET    /api/visits/:visitId
```

### Vital Signs
```
GET    /api/visits/:visitId/vitals
POST   /api/visits/:visitId/vitals
```

### Lab Results
```
GET    /api/patients/:patientId/labs
POST   /api/patients/:patientId/labs
GET    /api/labs/:labId
```

### Glucose Records
```
GET    /api/patients/:patientId/glucose
POST   /api/patients/:patientId/glucose
```

### Medications
```
GET    /api/patients/:patientId/medications
POST   /api/patients/:patientId/medications
PUT    /api/patients/:patientId/medications/:medId
```

### Diagnoses
```
GET    /api/patients/:patientId/diagnoses
POST   /api/patients/:patientId/diagnoses
```

## Healthcare Standards

- **ICD-10 CM**: Diagnosis codes (e.g., E11.9 - Type 2 diabetes)
- **LOINC**: Lab test codes
- **SNOMED CT**: Clinical terminology
- **HL7**: Healthcare data exchange standard
- **FHIR**: Fast Healthcare Interoperability Resources

## Data Validation Rules

- MRN must be unique per hospital
- Email must be valid format
- DOB must be before today
- Blood pressure: Systolic 70-180, Diastolic 40-120
- Glucose: 20-600 mg/dL
- HbA1c: Target <7% for most diabetics
- Weight/Height positive numbers

## Security & Compliance

- HIPAA compliant data handling
- Audit trail for all modifications
- Role-based access control
- Encryption of sensitive data
- Regular backups
