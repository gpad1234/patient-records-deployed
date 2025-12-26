"""
Patient Records - Python MCP Service
Handles clinical protocols and lab results
"""

from flask import Flask, jsonify
from flask_cors import CORS
import logging
import os
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


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    logger.info(f'Starting Python MCP Service on port {port}')
    app.run(host='0.0.0.0', port=port, debug=os.getenv('FLASK_DEBUG', False))
