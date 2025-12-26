-- Patient Records Database Schema (SQLite)
CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS medical_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    visit_date DATE NOT NULL,
    diagnosis TEXT,
    treatment TEXT,
    notes TEXT,
    doctor_name TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE TABLE IF NOT EXISTS prescriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    medical_record_id INTEGER,
    medication_name TEXT NOT NULL,
    dosage TEXT,
    frequency TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (medical_record_id) REFERENCES medical_records(id)
);

CREATE TABLE IF NOT EXISTS lab_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    test_name TEXT NOT NULL,
    test_date DATE NOT NULL,
    result_value TEXT,
    unit TEXT,
    reference_range TEXT,
    status TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- Insert sample data
INSERT INTO patients (first_name, last_name, date_of_birth, gender, email, phone, address) VALUES
('John', 'Doe', '1980-05-15', 'Male', 'john.doe@email.com', '555-0101', '123 Main St, City, State 12345'),
('Jane', 'Smith', '1992-08-22', 'Female', 'jane.smith@email.com', '555-0102', '456 Oak Ave, City, State 12345'),
('Robert', 'Johnson', '1975-03-10', 'Male', 'robert.j@email.com', '555-0103', '789 Pine Rd, City, State 12345');

INSERT INTO medical_records (patient_id, visit_date, diagnosis, treatment, notes, doctor_name) VALUES
(1, '2024-01-15', 'Hypertension', 'Prescribed medication', 'Regular monitoring required', 'Dr. Smith'),
(1, '2024-06-20', 'Annual Checkup', 'All clear', 'Continue current medications', 'Dr. Smith'),
(2, '2024-03-10', 'Seasonal Allergies', 'Antihistamines', 'Patient responded well to treatment', 'Dr. Johnson'),
(3, '2024-02-05', 'Type 2 Diabetes', 'Metformin prescribed', 'Dietary counseling provided', 'Dr. Williams');

INSERT INTO prescriptions (patient_id, medical_record_id, medication_name, dosage, frequency, start_date, end_date) VALUES
(1, 1, 'Lisinopril', '10mg', 'Once daily', '2024-01-15', NULL),
(2, 3, 'Cetirizine', '10mg', 'Once daily', '2024-03-10', '2024-04-10'),
(3, 4, 'Metformin', '500mg', 'Twice daily', '2024-02-05', NULL);

INSERT INTO lab_results (patient_id, test_name, test_date, result_value, unit, reference_range, status) VALUES
(1, 'Blood Pressure', '2024-01-15', '140/90', 'mmHg', '120/80', 'High'),
(1, 'Cholesterol', '2024-01-15', '210', 'mg/dL', '<200', 'High'),
(2, 'Complete Blood Count', '2024-03-10', 'Normal', '', '', 'Normal'),
(3, 'HbA1c', '2024-02-05', '7.2', '%', '<5.7', 'High'),
(3, 'Fasting Glucose', '2024-02-05', '145', 'mg/dL', '70-100', 'High');
