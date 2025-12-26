# Java Service - Test Scenarios & Test Plan

## Overview

Comprehensive test coverage strategy for Patient Records Java Service. This document details all test scenarios, test data requirements, and expected outcomes.

## Test Structure

```
Unit Tests (Fast, Isolated)
├─ Model Tests (entities, validation, conversion)
├─ Utility Tests (ID generation, date handling)
└─ Validator Tests (business rule validation)

Integration Tests (Database, Full Stack)
├─ Repository Tests (CRUD, queries, constraints)
├─ Service Tests (business logic, transactions)
└─ Controller Tests (HTTP, serialization)

End-to-End Tests (Full Request/Response)
├─ Patient workflows
├─ Insurance workflows
└─ Multi-entity scenarios

Performance Tests (Baseline metrics)
├─ Query performance
├─ Bulk operations
└─ Concurrent operations

Error Scenario Tests (Exception handling)
├─ Validation errors
├─ Not found errors
└─ Constraint violations
```

---

## Unit Test Scenarios

### Patient Model Tests

**File**: `PatientTest.java`

```
TEST CASE 1.1: Patient Creation with Valid Data
├─ Input: firstName="John", lastName="Doe", email="john@example.com", dob="1990-01-01"
├─ Expected: Patient object created successfully
└─ Assertion: All fields set correctly, ID generated

TEST CASE 1.2: Patient Creation with Null First Name
├─ Input: firstName=null
├─ Expected: Validation fails with @NotBlank error
└─ Assertion: ConstraintViolationException thrown

TEST CASE 1.3: Patient Creation with Invalid Email
├─ Input: email="invalid-email"
├─ Expected: Validation fails with @Email error
└─ Assertion: ConstraintViolationException thrown

TEST CASE 1.4: Patient Creation with Invalid Phone Format
├─ Input: phone="12345"
├─ Expected: Validation fails with @Pattern error
└─ Assertion: ConstraintViolationException thrown

TEST CASE 1.5: Patient Age Calculation
├─ Input: dateOfBirth="1990-01-01", currentDate="2025-12-09"
├─ Expected: Calculated age = 35
└─ Assertion: getAge() returns 35

TEST CASE 1.6: Patient with Null DOB
├─ Input: dateOfBirth=null
├─ Expected: @NotNull validation fails
└─ Assertion: ConstraintViolationException thrown

TEST CASE 1.7: Patient with Future DOB
├─ Input: dateOfBirth="2026-01-01"
├─ Expected: Custom validation fails (age < 0)
└─ Assertion: ValidationException thrown

TEST CASE 1.8: Patient Update Demographics
├─ Input: Create patient, then update firstName to "Jane"
├─ Expected: firstName changed, updatedAt timestamp changed
└─ Assertion: Patient.firstName == "Jane", updatedAt > createdAt

TEST CASE 1.9: Patient to DTO Conversion
├─ Input: Patient object with all fields populated
├─ Expected: PatientDTO created with matching data
└─ Assertion: All fields match, no null values

TEST CASE 1.10: DTO to Patient Conversion
├─ Input: PatientDTO with all fields
├─ Expected: Patient entity created with matching data
└─ Assertion: All fields match, ID generated
```

**Test Data**:
```java
// Valid patient
firstName: "John"
lastName: "Doe"
email: "john.doe@example.com"
phone: "5551234567"
gender: "MALE"
dateOfBirth: "1990-01-15"
address: {street: "123 Main St", city: "Boston", state: "MA", zip: "02101"}

// Invalid variants
[null_firstname, invalid_email, invalid_phone, future_dob, missing_required_fields]
```

---

### Insurance Model Tests

**File**: `InsuranceTest.java`

```
TEST CASE 2.1: Insurance Creation with Valid Data
├─ Input: provider="Blue Cross", policyNumber="BC123456", type="MEDICAL"
├─ Expected: Insurance object created
└─ Assertion: All fields set, status calculated

TEST CASE 2.2: Insurance with Null Provider
├─ Input: provider=null
├─ Expected: Validation fails
└─ Assertion: ConstraintViolationException thrown

TEST CASE 2.3: Insurance Coverage Status - Active
├─ Input: startDate="2024-01-01", endDate="2026-01-01", today="2025-12-09"
├─ Expected: Status = ACTIVE
└─ Assertion: getStatus() returns ACTIVE

TEST CASE 2.4: Insurance Coverage Status - Expired
├─ Input: startDate="2023-01-01", endDate="2024-12-31", today="2025-12-09"
├─ Expected: Status = EXPIRED
└─ Assertion: getStatus() returns EXPIRED

TEST CASE 2.5: Insurance Coverage Status - Not Started
├─ Input: startDate="2026-01-01", endDate="2027-01-01", today="2025-12-09"
├─ Expected: Status = INACTIVE
└─ Assertion: getStatus() returns INACTIVE

TEST CASE 2.6: Insurance with Invalid Date Range
├─ Input: startDate="2026-01-01", endDate="2025-01-01"
├─ Expected: Validation fails (end < start)
└─ Assertion: ValidationException thrown

TEST CASE 2.7: Insurance with Negative Deductible
├─ Input: deductible=-100.00
├─ Expected: Validation fails
└─ Assertion: ValidationException thrown

TEST CASE 2.8: Insurance Update Coverage Dates
├─ Input: Create insurance, update endDate to 2027-01-01
├─ Expected: endDate updated, status recalculated
└─ Assertion: Insurance.endDate == 2027-01-01

TEST CASE 2.9: Insurance Types Enum
├─ Input: type="MEDICAL", "DENTAL", "VISION"
├─ Expected: All types accepted
└─ Assertion: InsuranceType enum contains all types

TEST CASE 2.10: Insurance to DTO Conversion
├─ Input: Insurance object with all fields
├─ Expected: InsuranceDTO created with matching data
└─ Assertion: All numeric fields preserved correctly
```

---

### Medication Model Tests

**File**: `MedicationTest.java`

```
TEST CASE 3.1: Medication Creation with Valid Data
├─ Input: medicationName="Lisinopril", dosage="10mg", frequency="ONCE_DAILY"
├─ Expected: Medication object created
└─ Assertion: All fields set correctly

TEST CASE 3.2: Medication with Null Name
├─ Input: medicationName=null
├─ Expected: Validation fails
└─ Assertion: ConstraintViolationException thrown

TEST CASE 3.3: Medication Status - Active
├─ Input: expirationDate="2026-01-01", today="2025-12-09"
├─ Expected: Status = ACTIVE
└─ Assertion: getStatus() returns ACTIVE

TEST CASE 3.4: Medication Status - Expired
├─ Input: expirationDate="2025-11-01", today="2025-12-09"
├─ Expected: Status = EXPIRED
└─ Assertion: getStatus() returns EXPIRED

TEST CASE 3.5: Medication with Invalid Date Range
├─ Input: prescriptionDate="2025-12-09", expirationDate="2025-12-08"
├─ Expected: Validation fails
└─ Assertion: ValidationException thrown

TEST CASE 3.6: Medication Frequency Enum
├─ Input: frequency="ONCE_DAILY", "TWICE_DAILY", "THREE_TIMES_DAILY"
├─ Expected: All frequencies accepted
└─ Assertion: Frequency enum valid

TEST CASE 3.7: Medication Update Dosage
├─ Input: Create medication, update dosage to "20mg"
├─ Expected: Dosage updated, updatedAt changed
└─ Assertion: Medication.dosage == "20mg"

TEST CASE 3.8: Medication with Side Effects
├─ Input: sideEffects="Dizziness, dry cough"
├─ Expected: Stored and retrieved correctly
└─ Assertion: Side effects preserved

TEST CASE 3.9: Medication Prescriber Information
├─ Input: prescriber="Dr. Smith"
├─ Expected: Prescriber stored
└─ Assertion: Medication.prescriber == "Dr. Smith"

TEST CASE 3.10: Medication to DTO Conversion
├─ Input: Medication object with all fields
├─ Expected: MedicationDTO created
└─ Assertion: All fields match including dates
```

---

### Validator Tests

**File**: `PatientValidatorTest.java`

```
TEST CASE 4.1: Validate Valid Patient
├─ Input: Valid patient DTO with all required fields
├─ Expected: Validation passes
└─ Assertion: No exceptions thrown

TEST CASE 4.2: Reject Null First Name
├─ Input: firstName=null
├─ Expected: ValidationException with specific message
└─ Assertion: Exception thrown, message contains "firstName"

TEST CASE 4.3: Reject Empty First Name
├─ Input: firstName=""
├─ Expected: ValidationException
└─ Assertion: Exception thrown

TEST CASE 4.4: Reject Whitespace-Only First Name
├─ Input: firstName="   "
├─ Expected: ValidationException
└─ Assertion: Exception thrown

TEST CASE 4.5: Email Format Validation - Valid
├─ Input: email="john.doe@example.com"
├─ Expected: Valid
└─ Assertion: No exception

TEST CASE 4.6: Email Format Validation - Invalid (no @)
├─ Input: email="johndoe.example.com"
├─ Expected: ValidationException
└─ Assertion: Exception thrown

TEST CASE 4.7: Email Format Validation - Invalid (no domain)
├─ Input: email="john@"
├─ Expected: ValidationException
└─ Assertion: Exception thrown

TEST CASE 4.8: Phone Format Validation - Valid (10 digits)
├─ Input: phone="5551234567"
├─ Expected: Valid
└─ Assertion: No exception

TEST CASE 4.9: Phone Format Validation - Invalid (9 digits)
├─ Input: phone="555123456"
├─ Expected: ValidationException
└─ Assertion: Exception thrown

TEST CASE 4.10: Phone Format Validation - Invalid (letters)
├─ Input: phone="555ABCDEFG"
├─ Expected: ValidationException
└─ Assertion: Exception thrown

TEST CASE 4.11: Date of Birth - Valid (adult)
├─ Input: dob="1990-01-01"
├─ Expected: Valid
└─ Assertion: No exception

TEST CASE 4.12: Date of Birth - Invalid (future date)
├─ Input: dob="2026-01-01"
├─ Expected: ValidationException
└─ Assertion: Exception thrown

TEST CASE 4.13: Date of Birth - Invalid (age constraint)
├─ Input: dob="2024-01-01" (currently < 1 year old)
├─ Expected: ValidationException
└─ Assertion: Exception thrown

TEST CASE 4.14: Gender Enum Validation
├─ Input: gender="MALE", "FEMALE", "OTHER"
├─ Expected: All valid
└─ Assertion: No exceptions

TEST CASE 4.15: Address Validation - Complete
├─ Input: Complete address with street, city, state, zip
├─ Expected: Valid
└─ Assertion: No exception

TEST CASE 4.16: Address Validation - Missing Field
├─ Input: Address missing city
├─ Expected: ValidationException
└─ Assertion: Exception thrown

TEST CASE 4.17: Duplicate Email Detection
├─ Input: Patient 1 with email "john@example.com", create Patient 2 with same email
├─ Expected: Validation fails on duplicate
└─ Assertion: ValidationException thrown with "email already exists"

TEST CASE 4.18: Duplicate Phone Detection
├─ Input: Patient 1 with phone "5551234567", create Patient 2 with same phone
├─ Expected: Validation fails on duplicate
└─ Assertion: ValidationException thrown with "phone already exists"

TEST CASE 4.19: Validator with All Invalid Fields
├─ Input: Multiple invalid fields (invalid email, invalid phone, null name)
├─ Expected: ValidationException with all errors
└─ Assertion: Exception message contains all errors

TEST CASE 4.20: Validator Performance (100 patients)
├─ Input: Validate 100 patient objects sequentially
├─ Expected: Completes in < 100ms
└─ Assertion: Total execution time < 100ms
```

**File**: `InsuranceValidatorTest.java`

```
TEST CASE 5.1: Validate Valid Insurance
├─ Input: Valid insurance with all required fields
├─ Expected: Validation passes
└─ Assertion: No exceptions

TEST CASE 5.2: Reject Null Provider
├─ Input: provider=null
├─ Expected: ValidationException
└─ Assertion: Exception thrown

TEST CASE 5.3: Reject Null Policy Number
├─ Input: policyNumber=null
├─ Expected: ValidationException
└─ Assertion: Exception thrown

TEST CASE 5.4: Validate Coverage Date Range
├─ Input: startDate="2024-01-01", endDate="2026-01-01"
├─ Expected: Valid
└─ Assertion: No exception

TEST CASE 5.5: Reject Invalid Coverage Dates (end < start)
├─ Input: startDate="2026-01-01", endDate="2025-01-01"
├─ Expected: ValidationException
└─ Assertion: Exception thrown with "invalid date range"

TEST CASE 5.6: Validate Financial Fields
├─ Input: deductible=500.00, coinsurance=0.20, copay=25.00
├─ Expected: Valid
└─ Assertion: No exception

TEST CASE 5.7: Reject Negative Deductible
├─ Input: deductible=-100.00
├─ Expected: ValidationException
└─ Assertion: Exception thrown

TEST CASE 5.8: Reject Coinsurance > 1.0
├─ Input: coinsurance=1.5
├─ Expected: ValidationException
└─ Assertion: Exception thrown

TEST CASE 5.9: Reject Negative Copay
├─ Input: copay=-10.00
├─ Expected: ValidationException
└─ Assertion: Exception thrown

TEST CASE 5.10: Insurance Type Validation
├─ Input: type="MEDICAL", "DENTAL", "VISION", "LIFE"
├─ Expected: MEDICAL/DENTAL/VISION valid, LIFE invalid
└─ Assertion: Exception only for LIFE
```

---

## Integration Test Scenarios

### Patient Repository Tests

**File**: `PatientRepositoryIntegrationTest.java`

```
TEST CASE 6.1: Create and Retrieve Patient
├─ Setup: Clean database
├─ Steps: 
│   1. Create patient
│   2. Save to database
│   3. Retrieve by ID
├─ Expected: Retrieved patient matches original
└─ Assertion: All fields match, ID identical

TEST CASE 6.2: Update Patient
├─ Setup: Patient exists in database
├─ Steps:
│   1. Retrieve patient
│   2. Update firstName
│   3. Save changes
│   4. Retrieve again
├─ Expected: firstName updated, updatedAt changed
└─ Assertion: Patient.firstName == "Jane", updatedAt > createdAt

TEST CASE 6.3: Delete Patient
├─ Setup: Patient exists in database
├─ Steps:
│   1. Create patient
│   2. Delete patient
│   3. Try to retrieve
├─ Expected: Patient not found
└─ Assertion: findById() returns empty Optional

TEST CASE 6.4: Find by Email
├─ Setup: Multiple patients created
├─ Steps:
│   1. Create patients with different emails
│   2. Query by specific email
├─ Expected: Returns correct patient
└─ Assertion: Patient.email matches query email

TEST CASE 6.5: Find by Email - Not Found
├─ Setup: Database populated
├─ Steps:
│   1. Query non-existent email
├─ Expected: Returns empty Optional
└─ Assertion: findByEmail().isEmpty() == true

TEST CASE 6.6: Find by Phone
├─ Setup: Multiple patients created
├─ Steps:
│   1. Create patients with different phones
│   2. Query by specific phone
├─ Expected: Returns correct patient
└─ Assertion: Patient.phone matches query phone

TEST CASE 6.7: List All Patients
├─ Setup: 5 patients created
├─ Steps:
│   1. Create 5 patients
│   2. Call findAll()
├─ Expected: Returns all 5 patients
└─ Assertion: List size == 5

TEST CASE 6.8: List All Patients - Empty Database
├─ Setup: Clean database
├─ Steps:
│   1. Call findAll()
├─ Expected: Returns empty list
└─ Assertion: List.size() == 0

TEST CASE 6.9: Find by Gender
├─ Setup: Multiple patients with different genders
├─ Steps:
│   1. Create patients: 3 MALE, 2 FEMALE
│   2. Query by gender MALE
├─ Expected: Returns 3 patients
└─ Assertion: List size == 3, all MALE

TEST CASE 6.10: Find by Blood Type
├─ Setup: Patients with different blood types
├─ Steps:
│   1. Create patients with O+, A+, B+
│   2. Query blood type O+
├─ Expected: Returns all O+ patients
└─ Assertion: All returned patients have bloodType="O+"

TEST CASE 6.11: Count Patients
├─ Setup: 10 patients created
├─ Steps:
│   1. Call count()
├─ Expected: Returns 10
└─ Assertion: count() == 10

TEST CASE 6.12: Pagination - Page 1
├─ Setup: 25 patients created
├─ Steps:
│   1. Query page 0, size 10
├─ Expected: Returns first 10 patients
└─ Assertion: Page content size == 10, totalElements == 25

TEST CASE 6.13: Pagination - Last Page
├─ Setup: 25 patients created
├─ Steps:
│   1. Query page 2, size 10
├─ Expected: Returns last 5 patients
└─ Assertion: Page content size == 5, totalPages == 3

TEST CASE 6.14: Sorting by Last Name
├─ Setup: 3 patients (Smith, Jones, Brown)
├─ Steps:
│   1. Query with sort by lastName
├─ Expected: Ordered Brown, Jones, Smith
└─ Assertion: Patients in alphabetical order

TEST CASE 6.15: Patient UUID Generation
├─ Setup: Create multiple patients
├─ Steps:
│   1. Create 5 patients
│   2. Collect IDs
├─ Expected: All IDs unique, valid UUIDs
└─ Assertion: All IDs are unique, UUID format valid

TEST CASE 6.16: Timestamp Tracking
├─ Setup: Create patient
├─ Steps:
│   1. Create patient
│   2. Record createdAt
│   3. Wait 100ms
│   4. Update patient
│   5. Record updatedAt
├─ Expected: createdAt < updatedAt
└─ Assertion: updatedAt > createdAt

TEST CASE 6.17: Concurrent Create Operations
├─ Setup: None
├─ Steps:
│   1. Create 10 patients in parallel
├─ Expected: All saved successfully
└─ Assertion: Database contains 10 unique patients

TEST CASE 6.18: Transaction - Create Multiple Related Records
├─ Setup: None
├─ Steps:
│   1. Create patient
│   2. Create 2 insurance policies for patient
│   3. Create 3 medications for patient
├─ Expected: All records created, relationships intact
└─ Assertion: Patient has 2 insurance, 3 medications

TEST CASE 6.19: Cascade Delete - Patient Deletion
├─ Setup: Patient with 2 insurance, 3 medications
├─ Steps:
│   1. Delete patient
│   2. Query insurance table
│   3. Query medications table
├─ Expected: Patient and all related records deleted
└─ Assertion: Insurance count == 0, Medications count == 0

TEST CASE 6.20: Database Constraint - Duplicate Email
├─ Setup: Patient with email "john@example.com" exists
├─ Steps:
│   1. Try to create patient with same email
├─ Expected: Database constraint violation
└─ Assertion: DataIntegrityViolationException thrown
```

---

### Patient Service Integration Tests

**File**: `PatientServiceIntegrationTest.java`

```
TEST CASE 7.1: Create Patient - Full Validation
├─ Setup: None
├─ Steps:
│   1. Create PatientDTO with valid data
│   2. Call patientService.createPatient()
│   3. Verify patient in database
├─ Expected: Patient created, validated, persisted
└─ Assertion: Patient exists with correct data

TEST CASE 7.2: Create Patient - Validation Failure
├─ Setup: None
├─ Steps:
│   1. Create PatientDTO with invalid email
│   2. Call patientService.createPatient()
├─ Expected: ValidationException thrown
└─ Assertion: Patient not created, database unchanged

TEST CASE 7.3: Get Patient by ID
├─ Setup: Patient exists
├─ Steps:
│   1. Call patientService.getPatient(id)
├─ Expected: Returns correct patient
└─ Assertion: Returned patient matches

TEST CASE 7.4: Get Patient - Not Found
├─ Setup: None
├─ Steps:
│   1. Call patientService.getPatient(nonexistent_id)
├─ Expected: ResourceNotFoundException thrown
└─ Assertion: Exception with appropriate message

TEST CASE 7.5: Update Patient
├─ Setup: Patient exists
├─ Steps:
│   1. Update firstName
│   2. Call patientService.updatePatient()
│   3. Verify in database
├─ Expected: Patient updated, changes persisted
└─ Assertion: Patient.firstName == new value

TEST CASE 7.6: Update Patient - Validation Failure
├─ Setup: Patient exists
├─ Steps:
│   1. Try to update with invalid email
│   2. Call patientService.updatePatient()
├─ Expected: ValidationException thrown
└─ Assertion: Original data unchanged

TEST CASE 7.7: Delete Patient
├─ Setup: Patient exists
├─ Steps:
│   1. Call patientService.deletePatient(id)
│   2. Try to retrieve
├─ Expected: Patient deleted
└─ Assertion: findById() returns empty

TEST CASE 7.8: Delete Patient - Cascade Delete Insurance
├─ Setup: Patient with 2 insurance policies
├─ Steps:
│   1. Call patientService.deletePatient(id)
│   2. Query insurance table
├─ Expected: Patient and insurance deleted
└─ Assertion: Insurance count == 0

TEST CASE 7.9: Delete Patient - Cascade Delete Medications
├─ Setup: Patient with 3 medications
├─ Steps:
│   1. Call patientService.deletePatient(id)
│   2. Query medications table
├─ Expected: Patient and medications deleted
└─ Assertion: Medications count == 0

TEST CASE 7.10: Get All Patients
├─ Setup: 5 patients created
├─ Steps:
│   1. Call patientService.getAllPatients()
├─ Expected: Returns all 5 patients
└─ Assertion: List size == 5

TEST CASE 7.11: Search Patients by Email
├─ Setup: 3 patients with different emails
├─ Steps:
│   1. Call patientService.searchByEmail(email)
├─ Expected: Returns matching patient
└─ Assertion: Patient.email == search email

TEST CASE 7.12: Search Patients by Phone
├─ Setup: 3 patients with different phones
├─ Steps:
│   1. Call patientService.searchByPhone(phone)
├─ Expected: Returns matching patient
└─ Assertion: Patient.phone == search phone

TEST CASE 7.13: Add Insurance to Patient
├─ Setup: Patient exists
├─ Steps:
│   1. Create insurance DTO
│   2. Call patientService.addInsurance(patientId, insurance)
│   3. Verify patient has insurance
├─ Expected: Insurance added, linked to patient
└─ Assertion: Patient.insurance.size() == 1

TEST CASE 7.14: Add Medication to Patient
├─ Setup: Patient exists
├─ Steps:
│   1. Create medication DTO
│   2. Call patientService.addMedication(patientId, medication)
│   3. Verify patient has medication
├─ Expected: Medication added, linked to patient
└─ Assertion: Patient.medications.size() == 1

TEST CASE 7.15: Get Patient with All Relationships
├─ Setup: Patient with 2 insurance, 3 medications, history
├─ Steps:
│   1. Call patientService.getPatient(id)
├─ Expected: Returns patient with all relationships
└─ Assertion: Insurance list size == 2, medications size == 3

TEST CASE 7.16: Service Logging - Create Patient
├─ Setup: Logging configured
├─ Steps:
│   1. Create patient
│   2. Check logs
├─ Expected: INFO log for patient creation, DEBUG for details
└─ Assertion: Log contains patient email and ID

TEST CASE 7.17: Service Logging - Error Handling
├─ Setup: Logging configured
├─ Steps:
│   1. Try to create patient with invalid data
│   2. Check logs
├─ Expected: WARN/ERROR logs for failure
└─ Assertion: Log contains error description

TEST CASE 7.18: Transaction Rollback - Multi-Step Failure
├─ Setup: None
├─ Steps:
│   1. Start transaction
│   2. Create patient
│   3. Try to add invalid insurance
│   4. Rollback
├─ Expected: Patient not created (all-or-nothing)
└─ Assertion: Database empty after rollback

TEST CASE 7.19: Performance - Create 100 Patients
├─ Setup: None
├─ Steps:
│   1. Create 100 patients sequentially
│   2. Measure time
├─ Expected: Completes in < 10 seconds
└─ Assertion: Average < 100ms per patient

TEST CASE 7.20: Performance - Query 1000 Patient List
├─ Setup: 1000 patients created
├─ Steps:
│   1. Call patientService.getAllPatients()
│   2. Measure time
├─ Expected: Returns list in < 1 second
└─ Assertion: Query time < 1000ms
```

---

### Controller Tests

**File**: `PatientControllerTest.java`

```
TEST CASE 8.1: GET /patients - List All
├─ HTTP: GET /patients
├─ Setup: 3 patients created
├─ Expected: 
│   - Status: 200 OK
│   - Body: List of 3 patients
│   - Headers: Content-Type: application/json
└─ Assertion: Response status 200, list size 3

TEST CASE 8.2: GET /patients - Empty List
├─ HTTP: GET /patients
├─ Setup: No patients
├─ Expected:
│   - Status: 200 OK
│   - Body: Empty list []
└─ Assertion: Response status 200, list empty

TEST CASE 8.3: GET /patients/{id} - Valid ID
├─ HTTP: GET /patients/valid-id
├─ Setup: Patient with ID exists
├─ Expected:
│   - Status: 200 OK
│   - Body: Patient object
│   - Content-Type: application/json
└─ Assertion: Status 200, patient data matches

TEST CASE 8.4: GET /patients/{id} - Invalid ID
├─ HTTP: GET /patients/invalid-id
├─ Setup: Patient doesn't exist
├─ Expected:
│   - Status: 404 Not Found
│   - Body: ErrorResponse with message
└─ Assertion: Status 404, error message present

TEST CASE 8.5: POST /patients - Valid Request
├─ HTTP: POST /patients
├─ Body: Valid PatientDTO (JSON)
├─ Expected:
│   - Status: 201 Created
│   - Body: Created Patient with ID
│   - Headers: Location: /patients/{id}
└─ Assertion: Status 201, patient ID generated, data matches

TEST CASE 8.6: POST /patients - Invalid Request (Missing Required Field)
├─ HTTP: POST /patients
├─ Body: PatientDTO without firstName
├─ Expected:
│   - Status: 400 Bad Request
│   - Body: ErrorResponse with validation message
└─ Assertion: Status 400, error message mentions firstName

TEST CASE 8.7: POST /patients - Invalid Email Format
├─ HTTP: POST /patients
├─ Body: PatientDTO with invalid email
├─ Expected:
│   - Status: 400 Bad Request
│   - Body: ErrorResponse mentioning email
└─ Assertion: Status 400, error field specific

TEST CASE 8.8: POST /patients - Duplicate Email
├─ HTTP: POST /patients
├─ Body: PatientDTO with existing email
├─ Expected:
│   - Status: 409 Conflict
│   - Body: ErrorResponse "Email already exists"
└─ Assertion: Status 409, conflict message

TEST CASE 8.9: PUT /patients/{id} - Valid Update
├─ HTTP: PUT /patients/valid-id
├─ Body: Updated PatientDTO
├─ Setup: Patient exists
├─ Expected:
│   - Status: 200 OK
│   - Body: Updated Patient
└─ Assertion: Status 200, changes applied

TEST CASE 8.10: PUT /patients/{id} - Not Found
├─ HTTP: PUT /patients/invalid-id
├─ Body: PatientDTO
├─ Expected:
│   - Status: 404 Not Found
│   - Body: ErrorResponse
└─ Assertion: Status 404

TEST CASE 8.11: DELETE /patients/{id} - Valid ID
├─ HTTP: DELETE /patients/valid-id
├─ Setup: Patient exists
├─ Expected:
│   - Status: 204 No Content
│   - Body: Empty
└─ Assertion: Status 204

TEST CASE 8.12: DELETE /patients/{id} - Not Found
├─ HTTP: DELETE /patients/invalid-id
├─ Expected:
│   - Status: 404 Not Found
│   - Body: ErrorResponse
└─ Assertion: Status 404

TEST CASE 8.13: JSON Serialization - All Fields
├─ HTTP: GET /patients/{id}
├─ Expected:
│   - firstName, lastName present
│   - email, phone present
│   - dateOfBirth in ISO format
│   - createdAt, updatedAt in ISO format
│   - Insurance list serialized
│   - Medication list serialized
└─ Assertion: JSON validates against schema

TEST CASE 8.14: JSON Deserialization - Valid Request
├─ HTTP: POST /patients
├─ Body: Valid JSON with ISO date formats
├─ Expected: Deserialization succeeds
└─ Assertion: Dates parsed correctly

TEST CASE 8.15: Request Validation - Required Fields
├─ HTTP: POST /patients
├─ Body: Missing multiple required fields
├─ Expected: Status 400, all missing fields in error
└─ Assertion: Error message comprehensive

TEST CASE 8.16: Response Headers - CORS
├─ HTTP: GET /patients
├─ Expected: Access-Control headers present (if CORS enabled)
└─ Assertion: Headers include CORS directives

TEST CASE 8.17: Content Type Negotiation
├─ HTTP: GET /patients (Accept: application/json)
├─ Expected: Content-Type: application/json
└─ Assertion: Correct content type returned

TEST CASE 8.18: Error Response Format
├─ HTTP: GET /patients/invalid
├─ Expected:
│   - ErrorResponse with: timestamp, status, message, path
│   - Consistent format
└─ Assertion: Error format matches schema

TEST CASE 8.19: Large Request Body
├─ HTTP: POST /patients
├─ Body: Valid JSON with max field lengths (1000+ chars)
├─ Expected: Status 201, data preserved
└─ Assertion: All data stored correctly

TEST CASE 8.20: Performance - Response Time
├─ HTTP: GET /patients
├─ Setup: 100 patients
├─ Expected: Response < 500ms
└─ Assertion: Controller response time acceptable
```

---

### Health Controller Tests

**File**: `HealthControllerTest.java`

```
TEST CASE 9.1: GET /health - Service Running
├─ HTTP: GET /health
├─ Expected:
│   - Status: 200 OK
│   - Body: { "status": "UP", "service": "java-service" }
└─ Assertion: Status 200, UP status

TEST CASE 9.2: GET /health - Database Connected
├─ HTTP: GET /health
├─ Expected:
│   - Body includes: "database": "UP"
│   - Response time < 100ms
└─ Assertion: Database connectivity verified

TEST CASE 9.3: GET /info - Service Metadata
├─ HTTP: GET /info
├─ Expected:
│   - Status: 200 OK
│   - Body: { "name": "patient-records-service", "version": "1.0.0" }
└─ Assertion: Metadata present

TEST CASE 9.4: GET /metrics - Available
├─ HTTP: GET /metrics
├─ Expected: Status 200 (if enabled)
└─ Assertion: Metrics endpoint responsive

TEST CASE 9.5: Health Check - Periodic Verification
├─ Automation: Run health check every 10 seconds for 2 minutes
├─ Expected: All checks pass, no failures
└─ Assertion: Service stable over time
```

---

## Error Scenario Tests

```
TEST CASE 10.1: Handle NULL Pointer Exception
├─ Trigger: Null field in entity
├─ Expected: Caught by validation layer before reaching DB
└─ Assertion: ValidationException thrown, not NPE

TEST CASE 10.2: Handle Database Connection Failure
├─ Trigger: Database unavailable
├─ Expected: Error logged, proper error response
└─ Assertion: HTTP 503 Service Unavailable

TEST CASE 10.3: Handle Transaction Timeout
├─ Trigger: Long-running transaction
├─ Expected: Transaction rolled back, error response
└─ Assertion: Original state preserved

TEST CASE 10.4: Handle Concurrent Modification
├─ Trigger: Two threads modify same patient
├─ Expected: Optimistic locking prevents corruption
└─ Assertion: One succeeds, other gets error

TEST CASE 10.5: Handle Malformed JSON
├─ Trigger: Invalid JSON in request body
├─ Expected: Status 400 Bad Request
└─ Assertion: Clear error message about JSON

TEST CASE 10.6: Handle Unicode in Names
├─ Trigger: Names with accents, emojis
├─ Expected: Stored and retrieved correctly
└─ Assertion: No encoding corruption

TEST CASE 10.7: Handle Very Long Strings
├─ Trigger: 5000+ character field
├─ Expected: Either truncated or rejected
└─ Assertion: No buffer overflow

TEST CASE 10.8: Handle SQL Injection Attempt
├─ Trigger: Malicious SQL in email field
├─ Expected: Treated as data, not executed
└─ Assertion: Email validation catches invalid format
```

---

## Test Execution Strategy

### Phase 1: Unit Tests (Run First)
```bash
mvn test -Dtest=*Test
# Expected: 20+ tests pass
# Duration: < 5 seconds
# Coverage: Model, validator, utility
```

### Phase 2: Integration Tests
```bash
mvn test -Dtest=*IntegrationTest
# Expected: 30+ tests pass
# Duration: < 30 seconds
# Coverage: Repository, service, controller
```

### Phase 3: Full Test Suite
```bash
mvn clean test
# Expected: 50+ tests, 80%+ coverage
# Duration: < 60 seconds
# Coverage: Complete codebase
```

### Phase 4: Coverage Report
```bash
mvn clean test jacoco:report
open target/site/jacoco/index.html
# Expected: 80%+ line coverage
# Identify gaps: <80% classes
```

---

## Test Data Management

### Fixtures (Reusable Test Data)

```java
public class PatientTestFixture {
    public static Patient validPatient() { ... }
    public static Patient patientWithInsurance() { ... }
    public static Patient patientWithMedications() { ... }
}

public class InsuranceTestFixture {
    public static Insurance activePolicy() { ... }
    public static Insurance expiredPolicy() { ... }
    public static Insurance inactivePolicy() { ... }
}

public class MedicationTestFixture {
    public static Medication activemedication() { ... }
    public static Medication expiredmedication() { ... }
}
```

### Database Reset Strategy

```java
@BeforeEach
void setUp() {
    // Clear all tables in order of foreign keys
    medicationRepository.deleteAll();
    insuranceRepository.deleteAll();
    medicalHistoryRepository.deleteAll();
    patientRepository.deleteAll();
}
```

---

## Success Criteria

- [ ] All 50+ test cases implemented
- [ ] All tests pass with no failures
- [ ] Code coverage > 80%
- [ ] Test execution < 60 seconds
- [ ] No flaky tests (all pass consistently)
- [ ] Error messages clear and helpful
- [ ] Performance baselines established

---

**Document Version**: 1.0
**Created**: December 9, 2025
**Status**: Ready for Implementation
