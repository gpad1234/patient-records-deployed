import { useState, useEffect, useRef } from 'react'
import { Upload, Image, Eye, Download, ZoomIn, ZoomOut, RotateCw, Move } from 'lucide-react'
import * as cornerstone from 'cornerstone-core'
import * as cornerstoneTools from 'cornerstone-tools'
import * as cornerstoneWebImageLoader from 'cornerstone-web-image-loader'
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader'
import dicomParser from 'dicom-parser'
import Hammer from 'hammerjs'

// Initialize Cornerstone
cornerstoneWebImageLoader.external.cornerstone = cornerstone
cornerstoneTools.external.cornerstone = cornerstone
cornerstoneTools.external.Hammer = Hammer

// Enable debug mode for troubleshooting
if (typeof window !== 'undefined') {
  localStorage.setItem('debug', 'cornerstoneTools')
}

// Initialize WADO Image Loader for DICOM support
cornerstoneWADOImageLoader.external.cornerstone = cornerstone
cornerstoneWADOImageLoader.external.dicomParser = dicomParser
cornerstoneWADOImageLoader.configure({
  useWebWorkers: false, // Disable web workers to avoid CORS issues
  decodeConfig: {
    convertFloatPixelDataToInt: false,
  },
})

export default function DicomViewerNew() {
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [viewerTools, setViewerTools] = useState({
    zoom: false,
    pan: false,
    windowLevel: false
  })
  
  const viewportRef = useRef(null)
  const fileInputRef = useRef(null)

  // Debug: Log state changes
  useEffect(() => {
    console.log('uploadedFiles state changed:', uploadedFiles)
  }, [uploadedFiles])

  useEffect(() => {
    console.log('selectedFile state changed:', selectedFile)
  }, [selectedFile])

  useEffect(() => {
    // Initialize Cornerstone element when component mounts
    if (viewportRef.current) {
      try {
        cornerstone.enable(viewportRef.current)
        console.log('Cornerstone viewport enabled successfully')
      } catch (error) {
        // Check if already enabled
        if (error.message && error.message.includes('already enabled')) {
          console.log('Cornerstone viewport already enabled')
        } else {
          console.error('Error enabling cornerstone:', error)
        }
      }
    }

    return () => {
      // Cleanup on unmount
      if (viewportRef.current) {
        try {
          cornerstone.disable(viewportRef.current)
          console.log('Cornerstone viewport disabled')
        } catch (error) {
          console.error('Error disabling cornerstone:', error)
        }
      }
    }
  }, [])

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files)
    console.log('Files selected:', files.length, files)
    setIsUploading(true)

    try {
      // Process DICOM files locally
      const processedFiles = []
      
      for (const file of files) {
        console.log('Processing file:', file.name)
        const arrayBuffer = await file.arrayBuffer()
        
        try {
          // Parse DICOM file
          const byteArray = new Uint8Array(arrayBuffer)
          const dataSet = dicomParser.parseDicom(byteArray)
          console.log('DICOM parsed successfully for:', file.name)
          
          // Extract metadata
          const metadata = {
            patientName: getString(dataSet, 'x00100010') || 'Unknown',
            patientID: getString(dataSet, 'x00100020') || 'N/A',
            studyDate: getString(dataSet, 'x00080020') || 'N/A',
            modality: getString(dataSet, 'x00080060') || 'N/A',
            studyDescription: getString(dataSet, 'x00081030') || 'No description',
            seriesDescription: getString(dataSet, 'x0008103e') || 'No description',
            instanceNumber: getString(dataSet, 'x00200013') || '1'
          }

          console.log('Metadata extracted:', metadata)

          // Create blob URL for the file
          const blob = new Blob([arrayBuffer], { type: 'application/dicom' })
          const blobUrl = URL.createObjectURL(blob)
          console.log('Blob URL created:', blobUrl)

          const processedFile = {
            id: `dicom-${Date.now()}-${processedFiles.length}`,
            name: file.name,
            metadata,
            blobUrl,
            file
          }
          
          processedFiles.push(processedFile)
          console.log('File processed successfully:', processedFile)
        } catch (error) {
          console.error('Error parsing DICOM file:', error)
          alert(`Error parsing ${file.name}. Make sure it's a valid DICOM file.`)
        }
      }

      console.log('Total processed files:', processedFiles.length)
      setUploadedFiles(prev => {
        const newFiles = [...prev, ...processedFiles]
        console.log('Updated uploaded files:', newFiles)
        return newFiles
      })
      
      // Auto-select first file if none selected
      if (!selectedFile && processedFiles.length > 0) {
        console.log('Auto-selecting first file:', processedFiles[0])
        // Load immediately
        try {
          await loadDicomImage(processedFiles[0])
        } catch (error) {
          console.error('Error auto-loading first file:', error)
        }
      }
    } catch (error) {
      console.error('Error processing files:', error)
      alert('Error processing files. Please try again.')
    } finally {
      setIsUploading(false)
      // Reset file input so same file can be uploaded again
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const loadDicomImage = async (fileData) => {
    console.log('loadDicomImage called with:', fileData?.name)
    
    if (!viewportRef.current) {
      console.error('Viewport ref is null! Cannot load image.')
      alert('Viewer not ready. Please try clicking the file in the list.')
      return
    }

    try {
      console.log('Loading DICOM image:', fileData.name)
      setSelectedFile(fileData)

      // Enable the element if not already enabled
      try {
        cornerstone.enable(viewportRef.current)
      } catch (error) {
        // Element might already be enabled
        console.log('Element already enabled or error:', error.message)
      }

      // Load and display the DICOM image
      const imageId = `wadouri:${fileData.blobUrl}`
      console.log('Loading image with ID:', imageId)
      
      const image = await cornerstone.loadAndCacheImage(imageId)
      console.log('Image loaded:', image)
      
      cornerstone.displayImage(viewportRef.current, image)
      console.log('Image displayed')

      // Initialize cornerstone tools
      try {
        cornerstoneTools.init()
      } catch (error) {
        // Already initialized
        console.log('Tools already initialized')
      }
      
      const element = viewportRef.current
      
      // Add tools
      try {
        cornerstoneTools.addTool(cornerstoneTools.ZoomTool)
        cornerstoneTools.addTool(cornerstoneTools.PanTool)
        cornerstoneTools.addTool(cornerstoneTools.WwwcTool)
      } catch (error) {
        console.log('Tools already added or error:', error.message)
      }
      
      // Set default tool
      cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 })

      console.log('DICOM image loaded successfully:', fileData.metadata)
    } catch (error) {
      console.error('Error loading DICOM image:', error)
      console.error('Error stack:', error.stack)
      alert(`Error loading DICOM image: ${error.message}. Check console for details.`)
    }
  }

  const getString = (dataSet, tag) => {
    const element = dataSet.elements[tag]
    if (!element) return null
    return dataSet.string(tag) || null
  }

  const enableTool = (toolName) => {
    if (!viewportRef.current) return

    const element = viewportRef.current

    switch (toolName) {
      case 'zoom':
        cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 1 })
        setViewerTools({ zoom: true, pan: false, windowLevel: false })
        break
      case 'pan':
        cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 1 })
        setViewerTools({ zoom: false, pan: true, windowLevel: false })
        break
      case 'windowLevel':
        cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 })
        setViewerTools({ zoom: false, pan: false, windowLevel: true })
        break
      case 'reset':
        if (selectedFile) {
          cornerstone.reset(element)
        }
        break
      default:
        break
    }
  }

  const rotateViewport = () => {
    if (!viewportRef.current) return
    const viewport = cornerstone.getViewport(viewportRef.current)
    viewport.rotation += 90
    cornerstone.setViewport(viewportRef.current, viewport)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">DICOM Viewer</h1>
              <p className="text-gray-600 mt-1">Upload and view medical images (Files: {uploadedFiles.length})</p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              <Upload className="w-5 h-5" />
              {isUploading ? 'Uploading...' : 'Upload DICOM'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".dcm,.dicom,application/dicom"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* File List Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b bg-gray-50">
                <h2 className="font-semibold text-gray-900">
                  Uploaded Files ({uploadedFiles.length})
                </h2>
              </div>
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                {uploadedFiles.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Image className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p>No files uploaded</p>
                    <p className="text-sm mt-2">Click Upload to add DICOM files</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {uploadedFiles.map(file => (
                      <button
                        key={file.id}
                        onClick={() => loadDicomImage(file)}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                          selectedFile?.id === file.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                        }`}
                      >
                        <div className="font-medium text-gray-900 truncate">
                          {file.name}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          <div>{file.metadata.modality}</div>
                          <div className="truncate">{file.metadata.patientName}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Viewer Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border">
              {/* Toolbar */}
              <div className="p-4 border-b bg-gray-50 flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => enableTool('zoom')}
                  className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
                    viewerTools.zoom ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-50'
                  }`}
                  title="Zoom"
                >
                  <ZoomIn className="w-4 h-4" />
                  Zoom
                </button>
                <button
                  onClick={() => enableTool('pan')}
                  className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
                    viewerTools.pan ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-50'
                  }`}
                  title="Pan"
                >
                  <Move className="w-4 h-4" />
                  Pan
                </button>
                <button
                  onClick={() => enableTool('windowLevel')}
                  className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
                    viewerTools.windowLevel ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-50'
                  }`}
                  title="Window/Level"
                >
                  <Eye className="w-4 h-4" />
                  W/L
                </button>
                <button
                  onClick={rotateViewport}
                  className="flex items-center gap-2 px-3 py-2 rounded bg-white border hover:bg-gray-50 transition-colors"
                  title="Rotate"
                >
                  <RotateCw className="w-4 h-4" />
                  Rotate
                </button>
                <button
                  onClick={() => enableTool('reset')}
                  className="flex items-center gap-2 px-3 py-2 rounded bg-white border hover:bg-gray-50 transition-colors"
                  title="Reset"
                >
                  Reset
                </button>
              </div>

              {/* Viewport */}
              <div className="relative bg-black" style={{ height: '600px' }}>
                {/* Always render viewport so it's ready for image loading */}
                <div
                  ref={viewportRef}
                  className="w-full h-full"
                  onContextMenu={(e) => e.preventDefault()}
                />
                
                {/* Overlay messages and info */}
                {!selectedFile ? (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
                    <div className="text-center">
                      <Image className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                      <p className="text-lg">No image selected</p>
                      <p className="text-sm mt-2">Upload a DICOM file to get started</p>
                    </div>
                  </div>
                ) : (
                  <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded text-sm space-y-1 pointer-events-none">
                    <div><strong>Patient:</strong> {selectedFile.metadata.patientName}</div>
                    <div><strong>ID:</strong> {selectedFile.metadata.patientID}</div>
                    <div><strong>Modality:</strong> {selectedFile.metadata.modality}</div>
                    <div><strong>Study:</strong> {selectedFile.metadata.studyDescription}</div>
                    <div><strong>Series:</strong> {selectedFile.metadata.seriesDescription}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata Panel */}
            {selectedFile && (
              <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">Image Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Patient Name:</span>
                    <div className="text-gray-900">{selectedFile.metadata.patientName}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Patient ID:</span>
                    <div className="text-gray-900">{selectedFile.metadata.patientID}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Study Date:</span>
                    <div className="text-gray-900">{selectedFile.metadata.studyDate}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Modality:</span>
                    <div className="text-gray-900">{selectedFile.metadata.modality}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Study Description:</span>
                    <div className="text-gray-900">{selectedFile.metadata.studyDescription}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Series Description:</span>
                    <div className="text-gray-900">{selectedFile.metadata.seriesDescription}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
