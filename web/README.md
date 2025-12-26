# Patient Records - React UI

A mobile-first React application for managing patient records.

## Features

- 📱 Mobile-responsive design
- 🎯 Clean and minimal UI
- 📊 Dashboard with patient statistics
- 👥 Patient management (create, read, update, delete)
- 📋 Patient search and filtering
- ⚙️ Settings management
- 🍔 Right-sliding hamburger menu

## Installation

```bash
cd web
npm install
```

## Development

```bash
npm run dev
```

The application will run on `http://localhost:3001`

## Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/        # React components
│   ├── Layout.jsx
│   ├── Header.jsx
│   └── Sidebar.jsx
├── pages/            # Page components
│   ├── Dashboard.jsx
│   ├── PatientList.jsx
│   ├── PatientDetail.jsx
│   ├── AddPatient.jsx
│   └── Settings.jsx
├── styles/           # CSS styles
│   ├── global.css
│   ├── layout.css
│   └── components.css
├── App.jsx          # Main app component
└── main.jsx         # Entry point
```

## Mobile-First Design

The application is designed mobile-first with:
- Touch-friendly buttons and controls
- Optimized spacing and typography for small screens
- Right-sliding hamburger menu for better accessibility
- Responsive grid layouts
- Smooth animations and transitions

## API Integration

Currently using mock data. To integrate with the backend API:

1. Update API endpoints in component files (marked with TODO comments)
2. Replace mock data with actual fetch calls
3. Handle authentication if needed
4. Update the Vite proxy configuration as needed

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lazy loading of routes with React Router
- Optimized CSS with mobile-first approach
- Minimal dependencies
- Fast development and build times with Vite
- Touch-optimized interactions

## Styling

- Custom CSS with mobile-first approach
- No external UI frameworks (custom components)
- Consistent color scheme and typography
- Responsive grid system
