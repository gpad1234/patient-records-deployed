-- Authentication and Authorization Schema
-- Add these tables to the existing SQLite database

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'patient', -- admin, doctor, nurse, receptionist, patient
    is_active BOOLEAN DEFAULT 1,
    patient_id INTEGER, -- Link to patient record if role is 'patient'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- Roles table for detailed permissions
CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL, -- admin, doctor, nurse, receptionist, patient
    description TEXT,
    can_view_all_patients BOOLEAN DEFAULT 0,
    can_edit_patients BOOLEAN DEFAULT 0,
    can_delete_patients BOOLEAN DEFAULT 0,
    can_view_medical_records BOOLEAN DEFAULT 0,
    can_edit_medical_records BOOLEAN DEFAULT 0,
    can_prescribe BOOLEAN DEFAULT 0,
    can_view_appointments BOOLEAN DEFAULT 0,
    can_manage_appointments BOOLEAN DEFAULT 0,
    can_manage_users BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User sessions for JWT-like tracking
CREATE TABLE IF NOT EXISTS user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    provider_id INTEGER, -- Links to users table where role='doctor' or 'nurse'
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    appointment_type TEXT, -- checkup, follow-up, consultation, emergency
    status TEXT DEFAULT 'scheduled', -- scheduled, confirmed, completed, cancelled, no-show
    reason TEXT,
    notes TEXT,
    created_by INTEGER, -- User who created the appointment
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancelled_by INTEGER,
    cancellation_reason TEXT,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (provider_id) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (cancelled_by) REFERENCES users(id)
);

-- Appointment reminders
CREATE TABLE IF NOT EXISTS appointment_reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    appointment_id INTEGER NOT NULL,
    reminder_type TEXT NOT NULL, -- email, sms, push
    reminder_time TIMESTAMP NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, sent, failed
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id)
);

-- Audit log for security and compliance
CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL, -- login, logout, create, update, delete, view
    resource_type TEXT, -- patient, appointment, user, etc.
    resource_id INTEGER,
    details TEXT, -- JSON string with additional details
    ip_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert default roles
INSERT INTO roles (name, description, can_view_all_patients, can_edit_patients, can_delete_patients, 
                   can_view_medical_records, can_edit_medical_records, can_prescribe, 
                   can_view_appointments, can_manage_appointments, can_manage_users) VALUES
('admin', 'System Administrator', 1, 1, 1, 1, 1, 0, 1, 1, 1),
('doctor', 'Medical Doctor', 1, 1, 0, 1, 1, 1, 1, 1, 0),
('nurse', 'Registered Nurse', 1, 1, 0, 1, 1, 0, 1, 1, 0),
('receptionist', 'Front Desk Receptionist', 1, 1, 0, 0, 0, 0, 1, 1, 0),
('patient', 'Patient', 0, 0, 0, 0, 0, 0, 0, 0, 0);

-- Insert sample users (password is 'password123' hashed with bcrypt)
-- Note: In production, use proper bcrypt hashing
INSERT INTO users (username, email, password_hash, first_name, last_name, role, is_active) VALUES
('admin', 'admin@hospital.com', '$2b$10$rqQWQxGqxQxGqxQxGqxQxe', 'Admin', 'User', 'admin', 1),
('dr.smith', 'dr.smith@hospital.com', '$2b$10$rqQWQxGqxQxGqxQxGqxQxe', 'Sarah', 'Smith', 'doctor', 1),
('dr.johnson', 'dr.johnson@hospital.com', '$2b$10$rqQWQxGqxQxGqxQxGqxQxe', 'Michael', 'Johnson', 'doctor', 1),
('nurse.williams', 'nurse.williams@hospital.com', '$2b$10$rqQWQxGqxQxGqxQxGqxQxe', 'Emily', 'Williams', 'nurse', 1),
('receptionist', 'receptionist@hospital.com', '$2b$10$rqQWQxGqxQxGqxQxGqxQxe', 'Lisa', 'Davis', 'receptionist', 1);

-- Insert sample appointments
INSERT INTO appointments (patient_id, provider_id, appointment_date, appointment_time, duration_minutes, 
                         appointment_type, status, reason, created_by) VALUES
(1, 2, '2026-01-05', '09:00:00', 30, 'checkup', 'scheduled', 'Blood pressure follow-up', 5),
(1, 2, '2026-01-10', '14:00:00', 30, 'follow-up', 'scheduled', 'Review lab results', 5),
(2, 3, '2026-01-06', '10:30:00', 30, 'consultation', 'confirmed', 'Allergy consultation', 5),
(3, 2, '2026-01-07', '11:00:00', 45, 'checkup', 'scheduled', 'Diabetes management', 5);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_provider ON appointments(provider_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_resource ON audit_log(resource_type, resource_id);
