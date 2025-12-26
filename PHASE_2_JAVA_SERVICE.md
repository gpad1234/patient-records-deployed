# Phase 2: Java Service - Patient Records Data Layer

## Overview

Build the Java service as a fully-tested, production-ready data persistence layer with comprehensive logging and test framework. This service is the foundation for all patient record operations.

## 📋 Table of Contents

1. [Architecture & Data Model](#architecture--data-model)
2. [Project Structure](#project-structure)
3. [Development Roadmap](#development-roadmap)
4. [Data Model Specification](#data-model-specification)
5. [Test Scenarios](#test-scenarios)
6. [Implementation Checkpoints](#implementation-checkpoints)
7. [Logging Strategy](#logging-strategy)
8. [Build & Testing Framework](#build--testing-framework)

---

## Architecture & Data Model

### Service Purpose
Central data persistence layer for patient healthcare records. All patient data flows through this service.

### Core Entities
```
Patient (core entity)
├─ Demographics (name, DOB, contact)
├─ Insurance (multiple policies)
├─ Medications (current & history)
└─ Medical History

Insurance (relationship)
├─ Policy details
├─ Coverage info
└─ Claim history

Medication (relationship)
├─ Current prescriptions
├─ Dosage & frequency
└─ Interaction data

MedicalHistory (temporal)
├─ Conditions
├─ Allergies
└─ Prior treatments
```

---

## Project Structure

```
services/java-service/
├── src/
│   ├── main/
│   │   ├── java/com/healthcare/java/service/
│   │   │   ├── JavaMCPServiceApp.java         # Entry point
│   │   │   │
│   │   │   ├── config/
│   │   │   │   ├── DatabaseConfig.java        # SQLite config
│   │   │   │   ├── JpaConfig.java             # JPA/Hibernate config
│   │   │   │   └── LoggingConfig.java         # Logging setup
│   │   │   │
│   │   │   ├── model/
│   │   │   │   ├── Patient.java               # JPA entity
│   │   │   │   ├── Insurance.java             # JPA entity
│   │   │   │   ├── Medication.java            # JPA entity
│   │   │   │   └── MedicalHistory.java        # JPA entity
│   │   │   │
│   │   │   ├── dto/
│   │   │   │   ├── PatientDTO.java            # Request/response DTOs
│   │   │   │   ├── InsuranceDTO.java
│   │   │   │   └── MedicationDTO.java
│   │   │   │
│   │   │   ├── repository/
│   │   │   │   ├── PatientRepository.java     # Spring Data JPA
│   │   │   │   ├── InsuranceRepository.java
│   │   │   │   ├── MedicationRepository.java
│   │   │   │   └── MedicalHistoryRepository.java
│   │   │   │
│   │   │   ├── service/
│   │   │   │   ├── PatientService.java        # Business logic
│   │   │   │   ├── InsuranceService.java
│   │   │   │   ├── MedicationService.java
│   │   │   │   └── MedicalHistoryService.java
│   │   │   │
│   │   │   ├── controller/
│   │   │   │   ├── PatientController.java     # REST endpoints
│   │   │   │   ├── InsuranceController.java
│   │   │   │   ├── MedicationController.java
│   │   │   │   └── HealthController.java
│   │   │   │
│   │   │   ├── exception/
│   │   │   │   ├── ResourceNotFoundException.java
│   │   │   │   ├── ValidationException.java
│   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   └── ErrorResponse.java
│   │   │   │
│   │   │   ├── validator/
│   │   │   │   ├── PatientValidator.java
│   │   │   │   └── InsuranceValidator.java
│   │   │   │
│   │   │   └── util/
│   │   │       ├── IDGenerator.java
│   │   │       └── DateUtils.java
│   │   │
│   │   └── resources/
│   │       ├── application.properties         # Main config
│   │       ├── application-dev.properties     # Dev config
│   │       ├── application-test.properties    # Test config
│   │       ├── logback.xml                    # Logging config
│   │       └── db/
│   │           └── schema.sql                 # Database schema
│   │
│   └── test/
│       ├── java/com/healthcare/java/service/
│       │   ├── integration/
│       │   │   ├── PatientServiceIntegrationTest.java
│       │   │   ├── InsuranceServiceIntegrationTest.java
│       │   │   ├── MedicationServiceIntegrationTest.java
│       │   │   └── DatabaseInitTest.java
│       │   │
│       │   ├── unit/
│       │   │   ├── model/
│       │   │   │   ├── PatientTest.java
│       │   │   │   └── InsuranceTest.java
│       │   │   ├── validator/
│       │   │   │   ├── PatientValidatorTest.java
│       │   │   │   └── InsuranceValidatorTest.java
│       │   │   └── util/
│       │   │       └── IDGeneratorTest.java
│       │   │
│       │   ├── controller/
│       │   │   ├── PatientControllerTest.java
│       │   │   ├── InsuranceControllerTest.java
│       │   │   └── HealthControllerTest.java
│       │   │
│       │   ├── fixture/
│       │   │   ├── PatientTestFixture.java    # Test data builders
│       │   │   ├── InsuranceTestFixture.java
│       │   │   └── MedicationTestFixture.java
│       │   │
│       │   └── config/
│       │       ├── TestDatabaseConfig.java    # Test-specific config
│       │       └── TestDataLoader.java        # Seed test data
│       │
│       └── resources/
│           ├── application-test.properties
│           ├── logback-test.xml
│           └── test-data.sql
│
├── pom.xml                                    # Maven config (updated)
└── README.md                                  # Service documentation
```

---

## Development Roadmap

### Sprint 1: Foundation & Setup
**Duration**: 2-3 days
**Goal**: Project scaffolding, config, database schema

- [ ] **Commit 1**: Update `pom.xml` with all dependencies
  - Spring Boot, JPA, Hibernate
  - SQLite JDBC driver
  - Testing frameworks (JUnit 5, Mockito, TestContainers)
  - Logging (SLF4J, Logback)
  - Validation (Jakarta Bean Validation)

- [ ] **Commit 2**: Database configuration
  - `DatabaseConfig.java` (SQLite connection)
  - `JpaConfig.java` (Hibernate/JPA setup)
  - `schema.sql` (Create tables)
  - Application properties files (dev, test, prod)

- [ ] **Commit 3**: Logging framework
  - `LoggingConfig.java`
  - `logback.xml` (console + file logging)
  - Structured logging patterns
  - Log levels by package

- [ ] **Commit 4**: Exception handling
  - Custom exception classes
  - `GlobalExceptionHandler.java`
  - Error response DTOs
  - HTTP status code mapping

### Sprint 2: Data Model & Repositories
**Duration**: 2-3 days
**Goal**: JPA entities, repositories, basic CRUD

- [ ] **Commit 5**: Patient entity & repository
  - `Patient.java` (JPA entity with annotations)
  - `PatientDTO.java` (request/response)
  - `PatientRepository.java` (Spring Data)
  - Database migration scripts

- [ ] **Commit 6**: Insurance entity & repository
  - `Insurance.java` (JPA entity, FK to Patient)
  - `InsuranceDTO.java`
  - `InsuranceRepository.java`
  - Custom query methods (by patient ID, status)

- [ ] **Commit 7**: Medication entity & repository
  - `Medication.java` (JPA entity, FK to Patient)
  - `MedicationDTO.java`
  - `MedicationRepository.java`
  - Query methods (active, by patient)

- [ ] **Commit 8**: MedicalHistory entity & repository
  - `MedicalHistory.java` (JPA entity, temporal)
  - `MedicalHistoryDTO.java`
  - `MedicalHistoryRepository.java`
  - Date-range queries

### Sprint 3: Business Logic & Validation
**Duration**: 2-3 days
**Goal**: Service layer, validators, business rules

- [ ] **Commit 9**: PatientService
  - CRUD operations (create, read, update, delete)
  - Search/filter methods
  - Logging at each step
  - Error handling

- [ ] **Commit 10**: PatientValidator
  - Required field validation
  - Email/phone format validation
  - Age constraints
  - Duplicate detection

- [ ] **Commit 11**: InsuranceService & Validator
  - Policy validation
  - Coverage status checks
  - Claim eligibility logic
  - Expiration date validation

- [ ] **Commit 12**: MedicationService & Validator
  - Dosage validation
  - Drug interaction checks
  - Prescription logic
  - Allergy cross-reference

### Sprint 4: REST API & Controllers
**Duration**: 2-3 days
**Goal**: REST endpoints, request handling, responses

- [ ] **Commit 13**: PatientController
  - GET /patients (list all)
  - GET /patients/{id} (get by ID)
  - POST /patients (create)
  - PUT /patients/{id} (update)
  - DELETE /patients/{id} (delete)
  - Logging, error responses

- [ ] **Commit 14**: InsuranceController
  - GET /patients/{id}/insurance (by patient)
  - POST /patients/{id}/insurance (add)
  - PUT /insurance/{id} (update)
  - DELETE /insurance/{id} (delete)

- [ ] **Commit 15**: MedicationController & HealthController
  - GET /patients/{id}/medications
  - POST /patients/{id}/medications
  - GET /health (service health check)
  - GET /info (service metadata)

### Sprint 5: Testing & Quality
**Duration**: 3-5 days
**Goal**: Comprehensive test coverage (>80%), integration tests

- [ ] **Commit 16**: Unit tests - Models & Validators
  - PatientTest.java
  - PatientValidatorTest.java
  - InsuranceValidatorTest.java
  - IDGeneratorTest.java

- [ ] **Commit 17**: Unit tests - Repositories
  - PatientRepositoryTest.java
  - InsuranceRepositoryTest.java
  - MedicationRepositoryTest.java
  - Test data fixtures

- [ ] **Commit 18**: Unit tests - Controllers
  - PatientControllerTest.java (MockMvc)
  - InsuranceControllerTest.java
  - HealthControllerTest.java
  - Request/response validation

- [ ] **Commit 19**: Integration tests
  - PatientServiceIntegrationTest.java (full stack)
  - DatabaseInitTest.java (schema validation)
  - Multi-entity transaction tests
  - Error scenario tests

- [ ] **Commit 20**: Test coverage & documentation
  - Generate coverage reports
  - Document test strategy
  - Add test fixtures guide
  - Performance baselines

---

## Data Model Specification

### Patient Entity

```java
@Entity
@Table(name = "patients")
public class Patient {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @NotBlank
    private String firstName;
    
    @NotBlank
    private String lastName;
    
    @NotNull
    private LocalDate dateOfBirth;
    
    @Email
    @NotBlank
    private String email;
    
    @Pattern(regexp = "^\\d{10}$")
    private String phone;
    
    @Enumerated(EnumType.STRING)
    private Gender gender;
    
    @Embedded
    private Address address;
    
    private String bloodType;
    
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    private List<Insurance> insurance;
    
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    private List<Medication> medications;
    
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    private List<MedicalHistory> medicalHistory;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

### Insurance Entity

```java
@Entity
@Table(name = "insurance")
public class Insurance {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @NotNull
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;
    
    @NotBlank
    private String provider;
    
    @NotBlank
    private String policyNumber;
    
    @Enumerated(EnumType.STRING)
    private InsuranceType insuranceType; // MEDICAL, DENTAL, VISION
    
    @NotNull
    private LocalDate coverageStartDate;
    
    @NotNull
    private LocalDate coverageEndDate;
    
    @Enumerated(EnumType.STRING)
    private CoverageStatus status; // ACTIVE, INACTIVE, EXPIRED
    
    private BigDecimal deductible;
    private BigDecimal coinsurance;
    private BigDecimal copay;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

### Medication Entity

```java
@Entity
@Table(name = "medications")
public class Medication {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @NotNull
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;
    
    @NotBlank
    private String medicationName;
    
    @NotBlank
    private String dosage;
    
    @Enumerated(EnumType.STRING)
    private Frequency frequency; // ONCE_DAILY, TWICE_DAILY, etc.
    
    @NotNull
    private LocalDate prescriptionDate;
    
    @NotNull
    private LocalDate expirationDate;
    
    @Enumerated(EnumType.STRING)
    private MedicationStatus status; // ACTIVE, INACTIVE, EXPIRED
    
    private String prescriber;
    private String reason;
    private String sideEffects;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

### MedicalHistory Entity

```java
@Entity
@Table(name = "medical_history")
public class MedicalHistory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @NotNull
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;
    
    @Enumerated(EnumType.STRING)
    private HistoryType type; // CONDITION, ALLERGY, SURGERY, LAB_RESULT
    
    @NotBlank
    private String description;
    
    @NotNull
    private LocalDate dateRecorded;
    
    private String details;
    
    private String severity;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

---

## Test Scenarios

### Unit Test Scenarios

#### Patient Model Tests
```
✓ Create patient with valid data
✓ Reject patient with missing first name
✓ Reject patient with invalid email
✓ Reject patient with invalid phone format
✓ Calculate age from DOB correctly
✓ Update patient demographics
✓ Patient to DTO conversion
✓ DTO to Patient conversion
```

#### PatientValidator Tests
```
✓ Accept valid patient
✓ Reject duplicate email
✓ Reject duplicate phone
✓ Reject invalid email format
✓ Reject invalid phone format
✓ Reject age < 0
✓ Reject future DOB
✓ Validate address fields
```

#### Insurance Model Tests
```
✓ Create insurance with valid data
✓ Validate coverage dates (start < end)
✓ Calculate coverage status (active/inactive/expired)
✓ Validate deductible > 0
✓ Reject expired coverage
✓ Update coverage dates
✓ Insurance to DTO conversion
```

#### Medication Model Tests
```
✓ Create medication with valid data
✓ Validate dosage format
✓ Calculate medication status (active/expired)
✓ Validate prescription < expiration
✓ Validate frequency enum
✓ Update medication status
✓ Medication to DTO conversion
```

### Integration Test Scenarios

#### Patient Service Integration Tests
```
✓ Create patient and verify in database
✓ Read patient by ID
✓ Update patient and verify changes
✓ Delete patient and verify removal
✓ Search patients by email
✓ Search patients by phone
✓ List all patients
✓ Patient with multiple insurance policies
✓ Patient with multiple medications
✓ Cascade delete (patient → insurance → medications)
✓ Transaction rollback on validation error
```

#### Insurance Service Integration Tests
```
✓ Create insurance linked to patient
✓ Update insurance coverage dates
✓ Deactivate expired insurance
✓ Query all insurance by patient ID
✓ Query insurance by type (medical/dental/vision)
✓ Query active insurance only
✓ Verify foreign key constraint
```

#### Medication Service Integration Tests
```
✓ Create medication linked to patient
✓ Mark medication as expired automatically
✓ Query active medications by patient
✓ Query expired medications
✓ Update medication dosage
✓ Delete medication
✓ Verify foreign key constraint
```

#### MedicalHistory Integration Tests
```
✓ Create history record (condition)
✓ Create history record (allergy)
✓ Query history by type
✓ Query history by date range
✓ Update history record
✓ Delete history record
```

#### Cross-Service Integration Tests
```
✓ Create patient with insurance and medications
✓ Query patient with all relationships
✓ Update patient cascades to insurance/medications
✓ Delete patient removes all related records
✓ Transaction consistency across entities
✓ Concurrent updates don't conflict
```

#### Database Schema Tests
```
✓ All tables created successfully
✓ All columns have correct types
✓ Primary keys exist
✓ Foreign keys exist and enforce
✓ Indexes exist for performance
✓ Constraints enforced (NOT NULL, UNIQUE)
✓ Defaults applied correctly
✓ Schema matches entity definitions
```

### Controller/API Tests

#### PatientController Tests
```
✓ GET /patients returns all patients
✓ GET /patients/{id} returns patient
✓ GET /patients/{id} returns 404 for missing
✓ POST /patients creates patient
✓ POST /patients validates input
✓ POST /patients returns 400 for invalid
✓ PUT /patients/{id} updates patient
✓ PUT /patients/{id} validates changes
✓ DELETE /patients/{id} deletes patient
✓ DELETE /patients/{id} returns 404 for missing
✓ All responses contain correct JSON
✓ All responses have correct status codes
```

#### HealthController Tests
```
✓ GET /health returns 200
✓ GET /health contains status
✓ GET /info contains service name
✓ GET /info contains version
✓ Database connectivity check in health
```

### Error Scenario Tests

```
✓ Handle missing patient ID gracefully
✓ Handle invalid email format
✓ Handle duplicate email (constraint)
✓ Handle database connection failure
✓ Handle malformed JSON request
✓ Handle transaction timeout
✓ Handle concurrent modifications
✓ Handle cascading deletes properly
```

### Performance Tests

```
✓ Create 1000 patients < 5 seconds
✓ Query patient by ID < 100ms
✓ List 1000 patients < 1 second
✓ Update patient < 100ms
✓ Database query with 10K records < 500ms
✓ Bulk insert/update efficiency
```

---

## Implementation Checkpoints

### Checkpoint 1: Database Ready
```bash
# Verify database setup
sqlite3 data/patient_records.db ".schema"

# Should show tables:
# - patients
# - insurance
# - medications
# - medical_history
```

**Exit Criteria**:
- [ ] Schema created
- [ ] Foreign keys defined
- [ ] Indexes created
- [ ] Schema test passes

### Checkpoint 2: Entities Ready
```bash
# Build and verify no entity errors
mvn clean compile

# Verify entity files exist
ls services/java-service/src/main/java/com/healthcare/java/service/model/
```

**Exit Criteria**:
- [ ] All 4 entities compile
- [ ] JPA annotations correct
- [ ] Relationships mapped correctly
- [ ] No Hibernate warnings

### Checkpoint 3: Repositories Ready
```bash
# Build with repositories
mvn clean compile

# Run repository tests
mvn test -Dtest="*Repository*"
```

**Exit Criteria**:
- [ ] All repository tests pass
- [ ] CRUD operations working
- [ ] Custom queries working
- [ ] Test coverage > 80%

### Checkpoint 4: Services Ready
```bash
# Build with services
mvn clean compile

# Run service tests
mvn test -Dtest="*Service*"
```

**Exit Criteria**:
- [ ] All service tests pass
- [ ] Validation working
- [ ] Business logic correct
- [ ] Error handling works

### Checkpoint 5: Controllers Ready
```bash
# Build with controllers
mvn clean compile

# Run controller tests
mvn test -Dtest="*Controller*"
```

**Exit Criteria**:
- [ ] All controller tests pass
- [ ] Endpoints return correct status
- [ ] JSON serialization works
- [ ] Error responses formatted

### Checkpoint 6: Full Integration Ready
```bash
# Run all tests
mvn clean test

# Generate coverage report
mvn clean test jacoco:report

# View report
open target/site/jacoco/index.html
```

**Exit Criteria**:
- [ ] All tests pass (>20 tests minimum)
- [ ] Coverage > 80%
- [ ] No compilation warnings
- [ ] Service starts successfully

### Checkpoint 7: Service Deployable
```bash
# Build package
mvn clean package

# Start service
./scripts/start-java-service.sh

# Verify service
curl http://localhost:8080/health
```

**Exit Criteria**:
- [ ] JAR builds successfully
- [ ] Service starts without errors
- [ ] Health endpoint responds
- [ ] Logs show proper initialization

---

## Logging Strategy

### Logging Configuration (logback.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <!-- Properties -->
  <property name="LOG_FILE_PATH" value="logs"/>
  <property name="LOG_FILE_NAME" value="java-service"/>
  
  <!-- Console Appender -->
  <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
    <encoder>
      <pattern>
        %d{HH:mm:ss.SSS} [%-5level] [%thread] %logger{36} - %msg%n
      </pattern>
    </encoder>
  </appender>
  
  <!-- File Appender (rolling) -->
  <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <file>${LOG_FILE_PATH}/${LOG_FILE_NAME}.log</file>
    <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
      <fileNamePattern>
        ${LOG_FILE_PATH}/${LOG_FILE_NAME}-%d{yyyy-MM-dd}.%i.log
      </fileNamePattern>
      <maxFileSize>10MB</maxFileSize>
      <maxHistory>30</maxHistory>
      <totalSizeCap>1GB</totalSizeCap>
    </rollingPolicy>
    <encoder>
      <pattern>
        %d{yyyy-MM-dd HH:mm:ss.SSS} [%-5level] [%thread] %logger{36} - %msg%n
      </pattern>
    </encoder>
  </appender>
  
  <!-- Loggers -->
  <logger name="com.healthcare.java.service" level="DEBUG"/>
  <logger name="org.springframework" level="INFO"/>
  <logger name="org.hibernate" level="INFO"/>
  <logger name="org.hibernate.SQL" level="DEBUG"/>
  
  <!-- Root Logger -->
  <root level="INFO">
    <appender-ref ref="CONSOLE"/>
    <appender-ref ref="FILE"/>
  </root>
</configuration>
```

### Logging Patterns by Layer

**Controllers** (Request/Response)
```java
@RestController
public class PatientController {
    private static final Logger logger = LoggerFactory.getLogger(PatientController.class);
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getPatient(@PathVariable String id) {
        logger.info("GET /patients/{}: Retrieving patient", id);
        try {
            Patient patient = patientService.getPatient(id);
            logger.debug("Patient retrieved: {}", patient.getId());
            return ResponseEntity.ok(patient);
        } catch (ResourceNotFoundException e) {
            logger.warn("Patient not found: {}", id);
            throw e;
        } catch (Exception e) {
            logger.error("Error retrieving patient: {}", id, e);
            throw e;
        }
    }
}
```

**Services** (Business Logic)
```java
@Service
public class PatientService {
    private static final Logger logger = LoggerFactory.getLogger(PatientService.class);
    
    public Patient createPatient(PatientDTO dto) {
        logger.info("Creating new patient: {}", dto.getEmail());
        
        PatientValidator.validate(dto);
        logger.debug("Patient validation passed");
        
        Patient patient = new Patient(dto);
        Patient saved = patientRepository.save(patient);
        
        logger.info("Patient created successfully: {}", saved.getId());
        return saved;
    }
}
```

**Repositories** (Data Access)
```java
@Repository
public interface PatientRepository extends JpaRepository<Patient, String> {
    @Query("SELECT p FROM Patient p WHERE p.email = ?1")
    Optional<Patient> findByEmail(String email);
}
```

**Log Levels**:
- **ERROR**: Patient update failed, database error, unexpected exception
- **WARN**: Patient not found, validation failed, deprecated API usage
- **INFO**: Patient created, service started, important business events
- **DEBUG**: Entity details, query results, method entry/exit
- **TRACE**: Field-level details (disabled by default)

---

## Build & Testing Framework

### Maven Dependencies (pom.xml)

```xml
<dependencies>
  <!-- Spring Boot -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <version>3.2.0</version>
  </dependency>
  
  <!-- Spring Data JPA & Hibernate -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
    <version>3.2.0</version>
  </dependency>
  
  <!-- SQLite JDBC -->
  <dependency>
    <groupId>org.xerial</groupId>
    <artifactId>sqlite-jdbc</artifactId>
    <version>3.44.2.1</version>
  </dependency>
  
  <!-- Validation -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
    <version>3.2.0</version>
  </dependency>
  
  <!-- Logging -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-logging</artifactId>
    <version>3.2.0</version>
  </dependency>
  
  <!-- Testing -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <version>3.2.0</version>
    <scope>test</scope>
  </dependency>
  
  <dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.10.0</version>
    <scope>test</scope>
  </dependency>
  
  <dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <version>5.4.0</version>
    <scope>test</scope>
  </dependency>
  
  <dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-junit-jupiter</artifactId>
    <version>5.4.0</version>
    <scope>test</scope>
  </dependency>
  
  <!-- Code Coverage -->
  <dependency>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.10</version>
    <scope>test</scope>
  </dependency>
</dependencies>
```

### Testing Framework Structure

```java
// Base test class with common setup
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public abstract class BaseIntegrationTest {
    
    @Autowired
    protected TestRestTemplate restTemplate;
    
    @Autowired
    protected PatientRepository patientRepository;
    
    @BeforeEach
    public void setUp() {
        // Clear database
        patientRepository.deleteAll();
    }
}

// Fixture pattern for test data
public class PatientTestFixture {
    public static Patient createValidPatient() {
        return new Patient()
            .setFirstName("John")
            .setLastName("Doe")
            .setEmail("john@example.com")
            .setPhone("5551234567")
            .setDateOfBirth(LocalDate.of(1990, 1, 1));
    }
}

// Unit test example
@ExtendWith(MockitoExtension.class)
public class PatientServiceTest {
    
    @Mock
    private PatientRepository patientRepository;
    
    @InjectMocks
    private PatientService patientService;
    
    @Test
    public void testCreatePatientSuccess() {
        // Arrange
        PatientDTO dto = new PatientDTO("John", "Doe", "john@example.com");
        
        // Act
        Patient result = patientService.createPatient(dto);
        
        // Assert
        assertNotNull(result.getId());
        verify(patientRepository, times(1)).save(any());
    }
}

// Integration test example
@SpringBootTest
public class PatientServiceIntegrationTest extends BaseIntegrationTest {
    
    @Test
    public void testCreateAndRetrievePatient() {
        // Arrange
        Patient patient = PatientTestFixture.createValidPatient();
        
        // Act
        Patient saved = patientRepository.save(patient);
        Patient retrieved = patientRepository.findById(saved.getId()).orElse(null);
        
        // Assert
        assertNotNull(retrieved);
        assertEquals(saved.getId(), retrieved.getId());
    }
}
```

### Build Commands

```bash
# Clean build with all tests
mvn clean test

# Build with coverage report
mvn clean test jacoco:report

# Build package (JAR)
mvn clean package

# Run specific test class
mvn test -Dtest=PatientServiceTest

# Run specific test method
mvn test -Dtest=PatientServiceTest#testCreatePatient

# Check code coverage threshold
mvn clean verify

# Run only integration tests
mvn test -Dgroups=integration
```

---

## Success Metrics

### Code Quality
- [ ] Test Coverage > 80%
- [ ] No compilation warnings
- [ ] SonarQube rating: A or B
- [ ] All tests pass

### Performance
- [ ] GET by ID < 100ms
- [ ] LIST 1000 patients < 1 second
- [ ] CREATE patient < 200ms
- [ ] UPDATE patient < 200ms

### Documentation
- [ ] README completed
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Entity relationship diagram
- [ ] Test strategy document
- [ ] Logging standards document

### Deployability
- [ ] Service starts in < 5 seconds
- [ ] Health check endpoint responds
- [ ] All dependencies included
- [ ] No external dependencies required (besides Java/Maven)

---

## Next Steps

1. **Review & Approve** this plan
2. **Create Maven modules** structure
3. **Add test framework** scaffolding
4. **Begin Sprint 1** (Foundation & Setup)

Each commit should be:
- ✅ Testable
- ✅ Buildable
- ✅ Reviewable (< 400 lines per commit)
- ✅ Deployable (service starts successfully)

---

**Created**: December 9, 2025
**Status**: Ready for Implementation
**Estimated Duration**: 3-4 weeks (20 working days)
**Lead Commitment**: Full-stack Java development with testing
