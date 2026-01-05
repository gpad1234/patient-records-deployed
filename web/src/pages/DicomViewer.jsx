import { useState, useEffect } from 'react'
import { Upload, Image, Eye, Download, Trash2, Calendar } from 'lucide-react'

export default function DicomViewer() {
  const [studies, setStudies] = useState([])
  const [selectedStudy, setSelectedStudy] = useState(null)
  const [images, setImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // For demo purposes, we'll load studies for patient ID 1
    // In production, this would come from the current patient context
    fetchStudies(1)
  }, [])

  const fetchStudies = async (patientId) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:3004/api/dicom/patients/${patientId}/studies`)
      if (response.ok) {
        const data = await response.json()
        setStudies(data)
      }
    } catch (error) {
      console.error('Error fetching DICOM studies:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchImages = async (studyId) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:3004/api/dicom/studies/${studyId}/images`)
      if (response.ok) {
        const data = await response.json()
        setImages(data)
        setSelectedStudy(studyId)
      }
    } catch (error) {
      console.error('Error fetching DICOM images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (files, patientId = 1) => {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('patientId', patientId)
      
      Array.from(files).forEach(file => {
        formData.append('dicomFiles', file)
      })

      const response = await fetch('http://localhost:3004/api/dicom/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Upload successful:', result)
        fetchStudies(patientId) // Refresh studies list
        setUploadModalOpen(false)
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Error uploading DICOM files:', error)
      alert('Error uploading DICOM files. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      // DICOM dates are in YYYYMMDD format
      if (dateString.length === 8) {
        const year = dateString.substring(0, 4)
        const month = dateString.substring(4, 6)
        const day = dateString.substring(6, 8)
        return `${month}/${day}/${year}`
      }
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medical Imaging</h1>
          <p className="text-gray-600 mt-1">DICOM studies and images</p>
        </div>
        <button
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Upload className="w-5 h-5" />
          Upload DICOM
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Studies List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Studies ({studies.length})
              </h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {loading && studies.length === 0 ? (
                <div className="p-4 text-center text-gray-500">Loading studies...</div>
              ) : studies.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No DICOM studies found
                </div>
              ) : (
                studies.map(study => (
                  <div
                    key={study.id}
                    onClick={() => fetchImages(study.id)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedStudy === study.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="font-medium text-gray-900">
                      {study.study_description || 'Unnamed Study'}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <div>{study.modality || 'Unknown'}</div>
                      <div>{formatDate(study.study_date)}</div>
                      <div>{study.image_count} images</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Images Grid */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Image className="w-5 h-5" />
                Images {selectedStudy ? `(${images.length})` : ''}
              </h2>
            </div>
            
            {!selectedStudy ? (
              <div className="p-8 text-center text-gray-500">
                <Image className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p>Select a study to view images</p>
              </div>
            ) : loading ? (
              <div className="p-8 text-center text-gray-500">Loading images...</div>
            ) : images.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No images found</div>
            ) : (
              <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                {images.map(image => (
                  <div
                    key={image.id}
                    className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedImage(image)}
                  >
                    {image.thumbnail_path ? (
                      <img
                        src={`http://localhost:3004/api/dicom/thumbnails/${path.basename(image.thumbnail_path)}`}
                        alt={`Image ${image.metadata?.instanceNumber || image.id}`}
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NiA2NkM4NiA2MS41ODE3IDg5LjU4MTcgNTggOTQgNThIMTA2QzExMC40MTggNTggMTE0IDYxLjU4MTcgMTE0IDY2Vjc0QzExNCA3OC40MTgzIDExMC40MTggODIgMTA2IDgySDk0Qzg5LjU4MTcgODIgODYgNzguNDE4MyA4NiA3NFY2NloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+Cg=='
                        }}
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                        <Image className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="p-2 text-center">
                      <div className="text-xs text-gray-600">
                        #{image.metadata?.instanceNumber || image.id}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Detail Modal */}
      {selectedImage && (
        <ImageDetailModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <UploadModal
          onClose={() => setUploadModalOpen(false)}
          onUpload={handleFileUpload}
          loading={loading}
        />
      )}
    </div>
  )
}

function ImageDetailModal({ image, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">DICOM Image Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Display */}
            <div className="text-center">
              {image.thumbnail_path ? (
                <img
                  src={`http://localhost:3004/api/dicom/thumbnails/${path.basename(image.thumbnail_path)}`}
                  alt="DICOM Image"
                  className="max-w-full h-auto border rounded-lg"
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 flex items-center justify-center border rounded-lg">
                  <Image className="w-16 h-16 text-gray-400" />
                </div>
              )}
              
              <div className="mt-4 space-x-2">
                <a
                  href={`http://localhost:3004/api/dicom/files/${path.basename(image.file_path)}`}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  <Download className="w-4 h-4" />
                  Download DICOM
                </a>
              </div>
            </div>

            {/* Metadata */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Image Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Instance Number:</span>
                  <span className="ml-2 text-gray-600">
                    {image.metadata?.instanceNumber || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Modality:</span>
                  <span className="ml-2 text-gray-600">
                    {image.metadata?.modality || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Series Description:</span>
                  <span className="ml-2 text-gray-600">
                    {image.metadata?.seriesDescription || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Slice Location:</span>
                  <span className="ml-2 text-gray-600">
                    {image.metadata?.sliceLocation || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Window Center/Width:</span>
                  <span className="ml-2 text-gray-600">
                    {image.metadata?.windowCenter || 'N/A'} / {image.metadata?.windowWidth || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Image Size:</span>
                  <span className="ml-2 text-gray-600">
                    {image.metadata?.columns || 'N/A'} × {image.metadata?.rows || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">SOP Instance UID:</span>
                  <span className="ml-2 text-gray-600 text-xs font-mono break-all">
                    {image.sop_instance_uid}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function UploadModal({ onClose, onUpload, loading }) {
  const [files, setFiles] = useState([])

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (files.length > 0) {
      onUpload(files)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Upload DICOM Files</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select DICOM Files
            </label>
            <input
              type="file"
              multiple
              accept=".dcm,.dicom"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Select one or more DICOM files (.dcm, .dicom)
            </p>
          </div>

          {files.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Selected Files ({files.length}):
              </p>
              <div className="max-h-32 overflow-y-auto border rounded p-2 bg-gray-50">
                {files.map((file, index) => (
                  <div key={index} className="text-xs text-gray-600">
                    {file.name} ({Math.round(file.size / 1024)} KB)
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || files.length === 0}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Helper function for path.basename since it's not available in browser
function path_basename(str) {
  return str.split('/').reverse()[0]
}

// Make path.basename available
const path = { basename: path_basename }