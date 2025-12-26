# Database Setup - SQLite & H2

## Quick Choice

**Testing:** Uses `InMemoryPatientRepository` - in-memory, no database needed
**Production:** Uses `SQLitePatientRepository` - persistent SQLite database

---

## 1. In-Memory Repository (Testing)

```java
PatientRepository repository = new InMemoryPatientRepository();
PatientService service = new PatientService(repository);

Patient patient = service.create(Patient.builder()
    .name("John Doe")
    .email("john@example.com")
    .phone("555-0123")
    .birthDate(LocalDate.of(1990, 5, 15))
    .build());
```

**Features:**
- ✅ No file system needed
- ✅ Blazing fast
- ✅ Perfect for tests
- ✅ Auto-incrementing IDs

---

## 2. SQLite Repository (Production)

```java
// Default: creates data/patient_records.db
PatientRepository repository = new SQLitePatientRepository();
PatientService service = new PatientService(repository);

// Or custom path
PatientRepository repository = new SQLitePatientRepository("custom/path/patients.db");
```

**Features:**
- ✅ Persistent file-based database
- ✅ No server needed
- ✅ Auto-creates schema
- ✅ Indexed queries (email, name)
- ✅ Supports all CRUD operations

**Database Location:**
```
data/patient_records.db
```

**Schema:**
```sql
CREATE TABLE patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    birth_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. How Tests Work

```java
@BeforeClass
public void setUp() {
    repository = new InMemoryPatientRepository();  // Fresh for each test
    service = new PatientService(repository);
}

@AfterMethod
public void cleanup() {
    service.clear();  // Clean slate between tests
}
```

**All 40 tests use InMemoryPatientRepository:**
- ✅ Fast execution
- ✅ No database setup needed
- ✅ Complete isolation
- ✅ Easy cleanup

---

## 4. Run Tests

```bash
mvn test
```

**Expected:**
- 40 tests ✅
- All pass ✅
- No database files created ✅

---

## 5. Switch to SQLite (if needed)

For integration tests with real database:

```java
@BeforeClass
public void setUp() {
    // Use SQLite instead
    repository = new SQLitePatientRepository();
    service = new PatientService(repository);
}
```

---

## 6. File Structure

```
services/java-service/
├── src/main/java/com/healthcare/java/patient/
│   ├── Patient.java
│   ├── PatientService.java
│   ├── PatientRepository.java (interface)
│   ├── InMemoryPatientRepository.java (for testing)
│   └── SQLitePatientRepository.java (for production)
├── src/test/java/com/healthcare/java/patient/
│   └── PatientServiceTest.java (40 tests)
├── data/
│   └── patient_records.db (created by SQLiteRepository)
└── pom.xml
```

---

## 7. Key Methods (All Repositories)

```java
// Save (insert or update)
Patient save(Patient patient);

// Find one
Optional<Patient> findById(Long id);

// Find many
List<Patient> findAll();
List<Patient> findByNameContaining(String name);

// Check
boolean existsByEmail(String email);

// Counts
long count();

// Delete
void delete(Long id);
void clear();
```

---

## Summary

| Aspect | In-Memory | SQLite |
|--------|-----------|--------|
| **Speed** | ⚡ Blazing | 🔥 Fast |
| **Persistence** | ❌ No | ✅ Yes |
| **Setup** | 0 steps | 0 steps (auto) |
| **Use Case** | Testing | Production |
| **Data Loss** | On restart | Never |

**Current:** Tests use In-Memory (fast, clean)
**When needed:** Switch to SQLite (one line change)
