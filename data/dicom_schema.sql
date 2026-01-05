-- DICOM Integration Schema
-- Medical imaging support for the EMR system

-- DICOM Studies table (equivalent to an imaging session)
CREATE TABLE IF NOT EXISTS dicom_studies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    study_instance_uid TEXT UNIQUE NOT NULL, -- DICOM standard UID
    study_date DATE,
    study_time TIME,
    study_description TEXT,
    accession_number TEXT,
    referring_physician TEXT,
    patient_age INTEGER,
    patient_weight REAL,
    modality TEXT, -- CT, MRI, X-RAY, US, etc.
    institution_name TEXT,
    station_name TEXT,
    study_status TEXT DEFAULT 'active', -- active, archived, deleted
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- DICOM Series table (group of images within a study)
CREATE TABLE IF NOT EXISTS dicom_series (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    study_id INTEGER NOT NULL,
    series_instance_uid TEXT UNIQUE NOT NULL,
    series_number INTEGER,
    series_description TEXT,
    modality TEXT,
    body_part_examined TEXT,
    patient_position TEXT,
    series_date DATE,
    series_time TIME,
    protocol_name TEXT,
    slice_thickness REAL,
    spacing_between_slices REAL,
    image_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (study_id) REFERENCES dicom_studies(id) ON DELETE CASCADE
);

-- DICOM Images/Instances table
CREATE TABLE IF NOT EXISTS dicom_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    series_id INTEGER NOT NULL,
    sop_instance_uid TEXT UNIQUE NOT NULL, -- Unique image identifier
    instance_number INTEGER,
    image_type TEXT,
    acquisition_date DATE,
    acquisition_time TIME,
    image_position_patient TEXT, -- JSON array [x,y,z]
    image_orientation_patient TEXT, -- JSON array [6 values]
    pixel_spacing TEXT, -- JSON array [x,y]
    slice_location REAL,
    window_center INTEGER,
    window_width INTEGER,
    file_path TEXT NOT NULL, -- Path to stored DICOM file
    file_size INTEGER,
    file_hash TEXT, -- For integrity checking
    thumbnail_path TEXT, -- Path to thumbnail image
    metadata JSON, -- Full DICOM metadata as JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (series_id) REFERENCES dicom_series(id) ON DELETE CASCADE
);

-- DICOM Reports/Findings
CREATE TABLE IF NOT EXISTS dicom_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    study_id INTEGER NOT NULL,
    report_type TEXT, -- radiology, pathology, etc.
    report_status TEXT DEFAULT 'draft', -- draft, preliminary, final, corrected
    findings TEXT,
    impression TEXT,
    recommendations TEXT,
    reporting_physician TEXT,
    report_date DATE,
    report_time TIME,
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (study_id) REFERENCES dicom_studies(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- DICOM Annotations (measurements, markings)
CREATE TABLE IF NOT EXISTS dicom_annotations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    annotation_type TEXT, -- measurement, arrow, text, roi
    coordinates JSON, -- Annotation coordinates and data
    measurement_value REAL,
    measurement_unit TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (image_id) REFERENCES dicom_images(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- DICOM Worklist (scheduled imaging procedures)
CREATE TABLE IF NOT EXISTS dicom_worklist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    accession_number TEXT UNIQUE NOT NULL,
    scheduled_procedure_step_id TEXT,
    modality TEXT NOT NULL,
    scheduled_station_aet TEXT, -- Application Entity Title
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    procedure_description TEXT,
    requesting_physician TEXT,
    status TEXT DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- PACS Configuration
CREATE TABLE IF NOT EXISTS pacs_nodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    node_name TEXT NOT NULL,
    aet_title TEXT NOT NULL, -- Application Entity Title
    ip_address TEXT NOT NULL,
    port INTEGER NOT NULL DEFAULT 104,
    node_type TEXT, -- SCP (server) or SCU (client)
    is_active BOOLEAN DEFAULT 1,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_dicom_studies_patient ON dicom_studies(patient_id);
CREATE INDEX IF NOT EXISTS idx_dicom_studies_uid ON dicom_studies(study_instance_uid);
CREATE INDEX IF NOT EXISTS idx_dicom_studies_date ON dicom_studies(study_date);
CREATE INDEX IF NOT EXISTS idx_dicom_studies_modality ON dicom_studies(modality);
CREATE INDEX IF NOT EXISTS idx_dicom_series_study ON dicom_series(study_id);
CREATE INDEX IF NOT EXISTS idx_dicom_series_uid ON dicom_series(series_instance_uid);
CREATE INDEX IF NOT EXISTS idx_dicom_images_series ON dicom_images(series_id);
CREATE INDEX IF NOT EXISTS idx_dicom_images_uid ON dicom_images(sop_instance_uid);
CREATE INDEX IF NOT EXISTS idx_dicom_reports_study ON dicom_reports(study_id);
CREATE INDEX IF NOT EXISTS idx_dicom_worklist_patient ON dicom_worklist(patient_id);
CREATE INDEX IF NOT EXISTS idx_dicom_worklist_date ON dicom_worklist(scheduled_date);

-- Insert sample PACS configuration
INSERT INTO pacs_nodes (node_name, aet_title, ip_address, port, node_type, description) VALUES
('Local PACS Server', 'LOCALPACS', '127.0.0.1', 104, 'SCP', 'Local development PACS server'),
('EMR Workstation', 'EMRSTATION', '127.0.0.1', 105, 'SCU', 'EMR DICOM client');