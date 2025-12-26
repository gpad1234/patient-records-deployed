"""
Patient Records - Python MCP Service
Handles clinical protocols and lab results
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
import os
import sqlite3
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(
    level=os.getenv('LOG_LEVEL', 'INFO'),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': os.getenv('SERVICE_NAME', 'python-service'),
        'version': '1.0.0'
    })


@app.route('/info', methods=['GET'])
def info():
    """Service information endpoint"""
    return jsonify({
        'name': 'Patient Records - Python MCP Service',
        'version': '1.0.0',
        'description': 'Handles clinical protocols, lab results, and medications',
        'port': os.getenv('PORT', 5000)
    })


def get_db_connection():
    """Get database connection"""
    # Database is in the project root: /home/girish/latest-react-apps/healthcare-platform/data/patient_records.db
    project_root = os.path.join(os.path.dirname(__file__), '..', '..', '..')
    db_path = os.path.join(project_root, 'data', 'patient_records.db')
    db_path = os.path.abspath(db_path)
    logger.info(f'Connecting to database at: {db_path}')
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn


@app.route('/patients', methods=['GET'])
def get_patients():
    """Get all patients"""
    try:
        conn = get_db_connection()
        patients = conn.execute('SELECT * FROM patients').fetchall()
        conn.close()
        
        return jsonify([dict(patient) for patient in patients])
    except Exception as e:
        logger.error(f'Error fetching patients: {e}')
        return jsonify({'error': str(e)}), 500


@app.route('/patients/<int:patient_id>', methods=['GET'])
def get_patient(patient_id):
    """Get a specific patient"""
    try:
        conn = get_db_connection()
        patient = conn.execute('SELECT * FROM patients WHERE id = ?', (patient_id,)).fetchone()
        conn.close()
        
        if patient is None:
            return jsonify({'error': 'Patient not found'}), 404
            
        return jsonify(dict(patient))
    except Exception as e:
        logger.error(f'Error fetching patient: {e}')
        return jsonify({'error': str(e)}), 500


@app.route('/patients/<int:patient_id>/records', methods=['GET'])
def get_patient_records(patient_id):
    """Get medical records for a patient"""
    try:
        conn = get_db_connection()
        records = conn.execute(
            'SELECT * FROM medical_records WHERE patient_id = ? ORDER BY visit_date DESC',
            (patient_id,)
        ).fetchall()
        conn.close()
        
        return jsonify([dict(record) for record in records])
    except Exception as e:
        logger.error(f'Error fetching patient records: {e}')
        return jsonify({'error': str(e)}), 500


@app.route('/patients/<int:patient_id>/prescriptions', methods=['GET'])
def get_patient_prescriptions(patient_id):
    """Get prescriptions for a patient"""
    try:
        conn = get_db_connection()
        prescriptions = conn.execute(
            'SELECT * FROM prescriptions WHERE patient_id = ? ORDER BY start_date DESC',
            (patient_id,)
        ).fetchall()
        conn.close()
        
        return jsonify([dict(prescription) for prescription in prescriptions])
    except Exception as e:
        logger.error(f'Error fetching prescriptions: {e}')
        return jsonify({'error': str(e)}), 500


@app.route('/patients/<int:patient_id>/labs', methods=['GET'])
def get_patient_labs(patient_id):
    """Get lab results for a patient"""
    try:
        conn = get_db_connection()
        labs = conn.execute(
            'SELECT * FROM lab_results WHERE patient_id = ? ORDER BY test_date DESC',
            (patient_id,)
        ).fetchall()
        conn.close()
        
        return jsonify([dict(lab) for lab in labs])
    except Exception as e:
        logger.error(f'Error fetching lab results: {e}')
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    logger.info(f'Starting Python MCP Service on port {port}')
    app.run(host='0.0.0.0', port=port, debug=os.getenv('FLASK_DEBUG', False))
