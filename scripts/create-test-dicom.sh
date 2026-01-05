#!/bin/bash

echo "🔧 Creating Sample DICOM Files for Testing"
echo "=========================================="

# Create a simple test directory
TEST_DIR="/tmp/test-dicom"
mkdir -p $TEST_DIR

echo "📁 Creating test DICOM directory: $TEST_DIR"

# Create a simple DICOM-like file with basic metadata
# Note: This is a simplified version for testing. Real DICOM files are binary with complex structure.

cat > $TEST_DIR/test-sample.dcm << 'EOF'
# Sample DICOM metadata (simplified for testing)
# In reality, this would be binary data with DICOM tags

# This file simulates a basic DICOM structure
# Patient Information
(0010,0010) PN [Test^Patient^One]           # Patient Name  
(0010,0020) LO [TEST001]                    # Patient ID
(0010,0030) DA [19800515]                   # Patient Birth Date
(0010,0040) CS [M]                          # Patient Sex

# Study Information  
(0020,000D) UI [1.2.826.0.1.3680043.8.498.12345] # Study Instance UID
(0008,0020) DA [20260103]                   # Study Date
(0008,0030) TM [143000]                     # Study Time
(0008,1030) LO [Chest X-Ray]               # Study Description
(0008,0060) CS [CR]                         # Modality

# Series Information
(0020,000E) UI [1.2.826.0.1.3680043.8.498.12345.1] # Series Instance UID
(0020,0011) IS [1]                          # Series Number
(0008,103E) LO [PA View]                    # Series Description

# Image Information
(0008,0018) UI [1.2.826.0.1.3680043.8.498.12345.1.1] # SOP Instance UID
(0020,0013) IS [1]                          # Instance Number
(0028,0010) US 512                          # Rows
(0028,0011) US 512                          # Columns
(0028,1050) DS [1024]                       # Window Center
(0028,1051) DS [2048]                       # Window Width

# Pixel data would be here in real DICOM...
EOF

echo "✓ Created test-sample.dcm"

# Create another test file
cat > $TEST_DIR/test-sample2.dcm << 'EOF'
# Second sample DICOM file with different metadata

# Patient Information
(0010,0010) PN [Test^Patient^Two]           # Patient Name  
(0010,0020) LO [TEST002]                    # Patient ID
(0010,0030) DA [19750320]                   # Patient Birth Date
(0010,0040) CS [F]                          # Patient Sex

# Study Information  
(0020,000D) UI [1.2.826.0.1.3680043.8.498.67890] # Study Instance UID
(0008,0020) DA [20260103]                   # Study Date
(0008,0030) TM [150000]                     # Study Time
(0008,1030) LO [Brain MRI]                 # Study Description
(0008,0060) CS [MR]                         # Modality

# Series Information
(0020,000E) UI [1.2.826.0.1.3680043.8.498.67890.1] # Series Instance UID
(0020,0011) IS [1]                          # Series Number
(0008,103E) LO [T1 Weighted]                # Series Description

# Image Information
(0008,0018) UI [1.2.826.0.1.3680043.8.498.67890.1.1] # SOP Instance UID
(0020,0013) IS [1]                          # Instance Number
(0028,0010) US 256                          # Rows
(0028,0011) US 256                          # Columns
(0028,1050) DS [512]                        # Window Center
(0028,1051) DS [1024]                       # Window Width
EOF

echo "✓ Created test-sample2.dcm"

echo ""
echo "📋 Test Files Created:"
ls -la $TEST_DIR/

echo ""
echo "🧪 Manual Testing Steps:"
echo "1. Use these files to test DICOM upload via web UI"
echo "2. Or test via curl command (see below)"
echo ""
echo "📝 CURL Upload Test Command:"
echo "curl -X POST \\"
echo "  http://localhost:3004/api/dicom/upload \\"
echo "  -F 'patientId=1' \\"
echo "  -F 'dicomFiles=@$TEST_DIR/test-sample.dcm' \\"
echo "  -F 'dicomFiles=@$TEST_DIR/test-sample2.dcm'"

echo ""
echo "🌐 Web Interface Testing:"
echo "1. Start React app: cd web && npm start"
echo "2. Open http://localhost:3000"
echo "3. Login with demo credentials"
echo "4. Go to 'Medical Imaging' page"
echo "5. Upload the test files created above"