# PDF Coordinate Inspector

A web-based tool for inspecting precise cursor coordinates within PDF documents. Upload a PDF and view real-time coordinates in multiple measurement units including pixels (px), points (pt), inches (in), centimeters (cm), millimeters (mm), and picas (pc).

## Features

- **PDF Upload**: Drag-and-drop or click to upload PDF files (max 10 MB)
- **Multi-page Support**: Navigate through pages with buttons, input, or keyboard arrows
- **Zoom Controls**: Zoom in/out, fit to width, or reset to 100%
- **Real-time Coordinates**: Hover over the PDF to see cursor position
- **Multiple Units**: Display coordinates in px, pt, in, cm, mm, pc (selectable)
- **Origin Toggle**: Switch between PDF standard (bottom-left) and screen standard (top-left)
- **High DPI Support**: Optimized for retina/high-resolution displays
- **Keyboard Navigation**: Arrow keys for pages, +/- for zoom
- **Privacy Focused**: All PDFs processed locally in the browser

## Installation

This is a client-side web application that requires no build process. Simply serve the files:

1. Clone or download this repository
2. Serve the directory using any static file server, for example:

```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server

# PHP
php -S localhost:8000
```

3. Open `http://localhost:8000` in your browser

## Usage

### Uploading a PDF

- **Drag and drop**: Drag a PDF file onto the upload area
- **Click to upload**: Click the upload area to open the file browser

### Viewing Coordinates

1. Upload a PDF file
2. The PDF will render on screen
3. Move your mouse over the PDF
4. A floating tooltip will display the cursor coordinates

### Navigation

- **Previous/Next Page**: Use the ◄ and ► buttons
- **Jump to Page**: Enter the page number in the input field
- **Keyboard**: Use ← and → arrow keys

### Zoom

- **Zoom In/Out**: Click + or - buttons
- **Zoom Level**: Current zoom percentage is displayed
- **Fit to Width**: Click "Fit" to fit page width to screen
- **Reset**: Click "Reset" to return to 100% zoom and page 1
- **Keyboard**: Use + and - keys

### Units

Toggle display of units using checkboxes:
- **Pixels (px)**: 1 decimal place
- **Points (pt)**: 2 decimal places (72 pt = 1 inch)
- **Inches (in)**: 2 decimal places
- **Centimeters (cm)**: 2 decimal places (2.54 cm = 1 inch)
- **Millimeters (mm)**: 2 decimal places (25.4 mm = 1 inch)
- **Picas (pc)**: 2 decimal places (6 pc = 1 inch, 1 pc = 12 pt)

### Origin

Select coordinate origin:
- **Bottom-Left (PDF)**: PDF coordinate system (Y increases upward)
- **Top-Left (Screen)**: Default screen coordinate system (Y increases downward)

## Technical Details

### Coordinate Calculation

Coordinates are calculated accounting for:
- Zoom level
- Device pixel ratio (for retina displays)
- Canvas offset and scroll position

### Unit Conversion

- 1 inch = 72 points (PDF standard)
- 1 inch = 2.54 centimeters
- 1 inch = 25.4 millimeters
- 1 inch = 6 picas (1 pica = 12 points)
- Pixel to point conversion uses 72 DPI standard

### Browser Compatibility

Tested on:
- Chrome/Edge (Chromium)
- Firefox
- Safari

## File Structure

```
pdfmeasurement/
├── index.html              # Main application
├── js/
│   ├── app.js              # Main app initialization & UI state
│   ├── pdf-renderer.js     # PDF.js wrapper for loading/rendering
│   ├── coordinate-tracker.js # Mouse tracking & coordinate calculations
│   └── unit-converter.js   # Unit conversion utilities
└── README.md               # This file
```

## Dependencies

- [Tailwind CSS](https://tailwindcss.com/) - Styling (CDN)
- [PDF.js](https://mozilla.github.io/pdf.js/) - PDF rendering (CDN)

## Privacy

All PDF files are processed locally in your browser. No data is sent to any server.

## Performance

- Hover coordinate update latency: <50ms
- Smooth interaction on large PDFs
- Efficient canvas rendering with page caching

## License

This project is open source and available for personal and commercial use.

## Future Enhancements (Not Implemented)

- Click-to-copy coordinates
- Drawing guides or rulers
- Annotation placement preview
- Export coordinates as JSON or CSV
- Snap-to-grid or element detection
