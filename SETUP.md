# Installation & Running Guide

## Prerequisites

- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **Git** - [Download](https://git-scm.com/)
- Any **text editor or IDE** (VS Code, PyCharm, etc.)
- Modern **browser** (Chrome, Firefox, Safari, Edge)

## Step-by-step Installation

### 1. Clone the repository

```bash
git clone -b auto-repair-reservation https://github.com/NikolayNBBogdanov/Auto-Repair-Reservation.git
cd Auto-Repair-Reservation
```

### 2. Create a Python virtual environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
cd backend
pip install -r requirements.txt
```

This should install:
- Flask (web framework)
- Flask-CORS (cross-origin support)
- Flask-SQLAlchemy (database ORM)
- SQLAlchemy (SQL toolkit)

### 4. Initialize the database

```bash
python init_db.py
```

Expected output:
```
✓ Database tables created
✓ 5 services added
✓ 3 customers added
✓ 3 reservations added

✓✓✓ Database initialized successfully! ✓✓✓
```

### 5. Start the backend server

```bash
python app.py
```

Expected output:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

✅ **The backend is now running at:** `http://localhost:5000`

### 6. Open the frontend

**Option A - Open directly in the browser:**
- Navigate to the `frontend/` folder
- Right-click `index.html`
- Choose "Open with Browser"

**Option B - With Live Server (VS Code):**
1. Install the extension: "Live Server" by Ritwick Dey
2. Right-click `frontend/index.html`
3. Choose "Open with Live Server"

✅ **The frontend should now be open at:** `http://localhost:5500` (or similar)

## Verification

### 1. API is reachable
```bash
curl http://localhost:5000/health
```

Result:
```json
{"status":"OK","timestamp":"2026-07-06T10:00:00.000000"}
```

### 2. Services load
```bash
curl http://localhost:5000/api/services
```

Result: A list of 5 services should be displayed.

### 3. Frontend loads
- Open `http://localhost:5500/frontend/index.html`
- The dashboard with statistics should be visible
- Navigation should work

## Usage

### Explore the dashboard
1. Start the frontend
2. You will see the dashboard with statistics
3. Click "New Reservation"
4. Fill out the form
5. Choose an available time slot
6. Click "Create Reservation"

### Test the API with curl

**Retrieve all customers:**
```bash
curl http://localhost:5000/api/customers
```

**Retrieve all reservations:**
```bash
curl http://localhost:5000/api/reservations
```

**Create a new reservation:**
```bash
curl -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "service_id": 2,
    "reservation_date": "2026-07-20",
    "time_slot": "11:00",
    "notes": "Please handle with care"
  }'
```

**Available slots for a date:**
```bash
curl "http://localhost:5000/api/availability?date=2026-07-15"
```

### Test the API with Postman

1. Download Postman: https://www.postman.com/downloads/
2. Open Postman
3. Create a new request:
   - **Method:** GET
   - **URL:** http://localhost:5000/api/statistics
   - Click "Send"

## Common Issues & Solutions

### Problem: "Port 5000 already in use"

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -i :5000
kill -9 <PID>
```

Or change the port in `backend/app.py`:
```python
if __name__ == '__main__':
    app.run(debug=True, port=5001)  # New port
```

### Problem: "ModuleNotFoundError: No module named 'flask'"

```bash
# Deactivate the virtual environment
deactivate

# Reactivate it
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

### Problem: "No such table: customers"

```bash
# Reinitialize the database
python init_db.py
```

### Problem: CORS errors in the browser console

This is normal during local testing. Flask-CORS handles it. Make sure that:
1. The backend is running at `http://localhost:5000`
2. The frontend is loading the API correctly

### Problem: Frontend does not load

1. Check that the file `frontend/index.html` exists
2. Open the Developer Console (F12) to look for errors
3. Make sure there are no file access issues

## Project Structure Explanation

```
project/
├── backend/
│   ├── app.py              # Hauptanwendung & API-Endpoints
│   ├── models.py           # Datenmodelle (Customer, Service, Reservation)
│   ├── init_db.py          # Script zur Datenbankinitialisierung
│   ├── requirements.txt    # Python-Dependencies
│   └── repair_shop.db      # SQLite Datenbank (wird auto-erstellt)
│
├── frontend/
│   ├── index.html          # HTML-Seite
│   ├── script.js           # JavaScript-Logik
│   └── style.css           # Responsive CSS
│
├── SETUP.md                # Diese Datei
└── README.md               # Projekt-Übersicht
```

## Nächste Schritte

1. ✅ Backend starten: `python app.py`
2. ✅ Frontend öffnen: `frontend/index.html`
3. ✅ Eine Reservierung erstellen: "Neue Reservierung" Form ausfüllen
4. ✅ API testen: `curl http://localhost:5000/api/statistics`
5. ✅ Statistiken überprüfen: Dashboard aktualisieren

## Hilfreiche Commands

```bash
# Backend starten
cd backend && python app.py

# Datenbank neu initialisieren
cd backend && python init_db.py

# Virtual Environment aktivieren (Windows)
venv\Scripts\activate

# Virtual Environment aktivieren (macOS/Linux)
source venv/bin/activate

# Dependencies installieren
pip install -r backend/requirements.txt

# Health Check
curl http://localhost:5000/health

# Alle Endpoints testen
curl http://localhost:5000/api/statistics
curl http://localhost:5000/api/services
curl http://localhost:5000/api/customers
curl http://localhost:5000/api/reservations
```

## Support

Wenn du Probleme hast:
1. Überprüfe die Konsole auf Fehler (Terminal/Browser Console)
2. Stelle sicher, dass Python 3.8+ installiert ist: `python --version`
3. Überprüfe, dass alle Dependencies installiert sind: `pip list`
4. Versuche die Datenbank neu zu initialisieren: `python init_db.py`

## Fertig! 🎉

Du hast jetzt das komplette Auto Repair Shop Reservation System lokal laufen!

Nächste Seite zum Erkunden:
- **Dashboard:** http://localhost:5500/frontend/index.html
- **API Docs:** Siehe README.md
