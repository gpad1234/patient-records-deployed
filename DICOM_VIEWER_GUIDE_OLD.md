# DICOM Viewer - Enhanced with Cornerstone.js

## Overview

The DICOM viewer has been upgraded to use **Cornerstone.js**, a production-ready, open-source medical imaging library. This replaces the previous custom implementation that had file upload issues.

## Features

### ✅ Working Features
- **Client-side DICOM parsing** - No server dependency required
- **Real-time image rendering** - View DICOM images immediately after upload
- **Interactive tools**:
  - 🔍 Zoom - Zoom in/out on images
  - 👆 Pan - Move images around the viewport
  - 🎨 Window/Level - Adjust brightness and contrast
  - 🔄 Rotate - Rotate images 90 degrees
  - ↺ Reset - Reset viewport to default
- **Metadata display** - View patient info, study details, modality
- **Multi-file support** - Upload and manage multiple DICOM files
- **Thumbnail navigation** - Quick access to uploaded studies

### 📦 Technology Stack
- **Cornerstone.js Core** - Medical image rendering engine
- **Cornerstone Tools** - Interactive manipulation tools
- **Cornerstone WADO Image Loader** - DICOM file parsing and decoding
- **DICOM Parser** - Standard DICOM tag extraction
- **Hammer.js** - Touch gesture support

## Installation

Dependencies are already installed. If needed:

```bash
cd web
npm install cornerstone-core cornerstone-tools cornerstone-wado-image-loader dicom-parser hammerjs
```

## Usage

### 1. Access the Viewer
Navigate to `/imaging` in the application or click "Imaging" in the navigation menu.

### 2. Upload DICOM Files
- Click "Upload DICOM" button
- Select one or multiple `.dcm` or `.dicom` files
- Files are processed locally in your browser (no server upload required)

### 3. View Images
- Click on any file in the left sidebar
- The image will render in the main viewport
- Use toolbar buttons to interact with the image

### 4. Interactive Tools
- **Zoom**: Click and drag vertically to zoom in/out
- **Pan**: Click and drag to move the image
- **Window/Level**: Click and drag to adjust brightness/contrast
- **Rotate**: Click to rotate 90 degrees clockwise
- **Reset**: Restore original viewport settings

## File Structure

```
web/src/pages/
├── DicomViewerNew.jsx    # New Cornerstone-based viewer (ACTIVE)
└── DicomViewer.jsx       # Old implementation (deprecated)
```

## Supported DICOM Files

The viewer supports standard DICOM files including:
- CT (Computed Tomography)
- MR (Magnetic Resonance)
- CR (Computed Radiography)
- DX (Digital Radiography)
- US (Ultrasound)
- XA (X-Ray Angiography)
- And more...

## Metadata Extracted

The viewer automatically extracts and displays:
- Patient Name
- Patient ID
- Study Date
- Modality (CT, MR, etc.)
- Study Description
- Series Description
- Instance Number

## Benefits Over Previous Implementation

### ✅ Advantages
1. **No server required** - All processing happens in the browser
2. **Industry standard** - Cornerstone.js is used in production medical applications
3. **Battle-tested** - Widely used and well-maintained library
4. **Better performance** - Optimized for medical imaging
5. **Rich toolset** - Professional-grade viewing tools
6. **Active community** - Regular updates and good documentation

### ❌ Previous Issues (Now Fixed)
- ❌ File upload failures
- ❌ Server dependency
- ❌ Limited viewing capabilities
- ❌ No interactive tools
- ❌ Poor error handling

## Configuration

The viewer is configured in [DicomViewerNew.jsx](../web/src/pages/DicomViewerNew.jsx):

```javascript
cornerstoneWADOImageLoader.configure({
  useWebWorkers: true,  // Enable multi-threading for better performance
  decodeConfig: {
    convertFloatPixelDataToInt: false,  // Preserve pixel data precision
  },
})
```

## Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ IE11 (Limited support)

## Performance Tips

1. **File Size**: Keep individual files under 100MB
2. **Batch Upload**: Upload multiple files at once for efficiency
3. **Browser Cache**: Images are cached for faster reloading
4. **Modern Browser**: Use latest Chrome/Firefox for best performance

## Troubleshooting

### Image Won't Load
- Verify the file is a valid DICOM file (.dcm extension)
- Check browser console for specific errors
- Try a different DICOM file to rule out file corruption

### Slow Performance
- Reduce number of simultaneously loaded images
- Clear browser cache
- Close other browser tabs
- Use a modern browser with hardware acceleration

### Tools Not Working
- Ensure the image is loaded before using tools
- Click on the desired tool button to activate it
- Only one tool can be active at a time

## Future Enhancements

Potential improvements:
- 🔄 Multi-frame/cine viewing (video)
- 📏 Measurement tools (length, angle, area)
- 🎯 Annotations and markers
- 💾 Server-side storage integration
- 📊 3D volume rendering
- 🔗 PACS integration

## Alternative Options Considered

### OHIF Viewer
- **Pros**: Full-featured, web-based DICOM viewer
- **Cons**: Large bundle size, complex setup
- **Status**: Not chosen for this project

### DWV (DICOM Web Viewer)
- **Pros**: Lightweight, simple API
- **Cons**: Limited toolset, less community support
- **Status**: Not chosen for this project

### Cornerstone.js (Selected) ✅
- **Pros**: Perfect balance of features, size, and ease of use
- **Cons**: Requires manual tool configuration
- **Status**: Currently implemented

## Resources

- [Cornerstone.js Documentation](https://cornerstonejs.org/)
- [DICOM Standard](https://www.dicomstandard.org/)
- [Medical Imaging Primer](https://www.ncbi.nlm.nih.gov/books/NBK546688/)

## License

This implementation uses open-source libraries:
- Cornerstone.js - MIT License
- DICOM Parser - MIT License

## Support

For issues or questions:
1. Check browser console for errors
2. Review this documentation
3. Check Cornerstone.js GitHub issues
4. Contact development team

---

**Note**: This is a client-side only implementation. For production use with large image sets or PACS integration, consider implementing a proper DICOM server (Orthanc, dcm4chee) or cloud-based solution.
