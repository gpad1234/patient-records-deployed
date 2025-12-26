# Node.js API Backend

Express.js REST API with SQLite database for Diabetes EMR System.

## Quick Start

```bash
npm install
npm run dev
```

## Environment Variables

```
NODE_ENV=development
PORT=3001
DATABASE_URL=./data/diabetes.db
API_CORS=http://localhost:3000
```

## API Endpoints

### Patients
- `GET /api/patients` - List all patients
- `POST /api/patients` - Create new patient
- `GET /api/patients/:id` - Get patient details with records
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Records
- `POST /api/patients/:id/records` - Add diabetes record
- `GET /api/patients/:id/records` - Get patient records

### Statistics
- `GET /api/hospital/stats` - Hospital statistics
- `GET /api/health` - Health check

## Database

SQLite database automatically created in `data/diabetes.db` on first run.

## Scripts

```bash
npm start     # Production
npm run dev   # Development (auto-restart)
npm test      # Run tests
```
