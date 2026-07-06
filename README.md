# Auto Repair Shop Reservation System

A complete reservation system for an auto repair shop with a backend API and frontend application.

## Project Structure

```
auto-repair-shop-reservation/
├── backend/              # Flask/Python REST API
├── frontend/             # HTML/CSS/JavaScript frontend
├── docs/                 # Project documentation
└── README.md            # This document
```

## Features

- ✅ Customer management
- ✅ Service types & pricing
- ✅ Reservation system with time slots
- ✅ Availability checking
- ✅ Admin dashboard with statistics
- ✅ REST API with full CRUD functionality
- ✅ Responsive web interface

## Tech Stack

**Backend:**
- Python 3.8+
- Flask (web framework)
- Flask-SQLAlchemy (ORM)
- SQLite (database)
- Flask-CORS (CORS support)

**Frontend:**
- HTML5
- CSS3 (responsive design)
- Vanilla JavaScript (ES6+)
- Fetch API

## Installation & Running

Detailed instructions can be found in [SETUP.md](./SETUP.md)

## Quick Start

### Start the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python init_db.py
python app.py
```

The server runs at `http://localhost:5000`

### Open the frontend:
```bash
Open frontend/index.html in your browser
```

## API Endpoints

### Customers
- `GET /api/customers` - Retrieve all customers
- `POST /api/customers` - Create a new customer

### Services
- `GET /api/services` - Retrieve all services
- `POST /api/services` - Create a new service

### Reservations
- `GET /api/reservations` - Retrieve all reservations
- `POST /api/reservations` - Create a new reservation
- `GET /api/reservations/<id>` - Retrieve a specific reservation
- `PUT /api/reservations/<id>` - Update a reservation
- `DELETE /api/reservations/<id>` - Cancel a reservation

### Availability
- `GET /api/availability?date=YYYY-MM-DD` - Retrieve available time slots

### Statistics
- `GET /api/statistics` - Retrieve dashboard statistics

## Example API Calls

### Customer registration
```bash
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Max Müller",
    "phone": "0123456789",
    "email": "max@example.com"
  }'
```

### Create reservation
```bash
curl -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "service_id": 1,
    "reservation_date": "2026-07-15",
    "time_slot": "09:00",
    "notes": "Regular service"
  }'
```

### Check availability
```bash
curl http://localhost:5000/api/availability?date=2026-07-15
```

## Detailed Project Structure

```
backend/
├── app.py              # Main Flask application and API endpoints
├── models.py           # SQLAlchemy data models
├── init_db.py          # Database initialization with sample data
├── requirements.txt    # Python dependencies
└── repair_shop.db      # SQLite database (generated automatically)

frontend/
├── index.html          # HTML structure and navigation
├── script.js           # JavaScript logic and API communication
└── style.css           # Responsive CSS styling

docs/
└── DEVELOPMENT.md      # AI-assisted development documentation
```

## Detailed Features

### 1. Dashboard
- Overview of statistics
- Display available services
- Quick access to all functions

### 2. Reservation system
- Automatic conflict checking
- Display available time slots
- Store customer data
- Add notes to reservations

### 3. Customer management
- Automatic customer creation
- Phone-based duplicate checking
- Store contact details

### 4. Service catalog
- Different service types
- Price overview
- Time required per service

## Database Schema

### Customers
- id (PRIMARY KEY)
- name (VARCHAR)
- phone (VARCHAR, UNIQUE)
- email (VARCHAR)
- created_at (DATETIME)

### Services
- id (PRIMARY KEY)
- name (VARCHAR, UNIQUE)
- description (TEXT)
- price (FLOAT)
- duration_minutes (INTEGER)
- created_at (DATETIME)

### Reservations
- id (PRIMARY KEY)
- customer_id (FOREIGN KEY)
- service_id (FOREIGN KEY)
- reservation_date (VARCHAR)
- time_slot (VARCHAR)
- notes (TEXT)
- status (VARCHAR) [confirmed, cancelled, completed]
- created_at (DATETIME)

## Testing

### With Postman
1. Import `docs/postman_collection.json`
2. Run the requests

### With curl (see examples above)

### Manually
1. Open the frontend
2. Fill out the reservation form
3. Check the data in the dashboard

## Troubleshooting

### Port 5000 is already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### Module not found
```bash
deactivate
source venv/bin/activate
pip install -r requirements.txt
```

### CORS errors
This is normal during local testing and is handled by Flask-CORS.

## Future Improvements

- [ ] User authentication
- [ ] Email notifications
- [ ] SMS reminders
- [ ] Admin dashboard metrics
- [ ] Payment integration
- [ ] Mobile app (React Native)
- [ ] Calendar synchronization (Google Calendar)
- [ ] Rating system

## Documentation

See [DEVELOPMENT.md](./docs/DEVELOPMENT.md) for AI-assisted development details:
- Module-by-module approach
- AI tool comparison
- Development process
- Screenshots and evidence

## License

MIT License

## Contact

Nikolay Bogdanov - GitHub: @NikolayNBBogdanov
