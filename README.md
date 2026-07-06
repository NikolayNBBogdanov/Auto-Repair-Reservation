# Auto Repair Shop Reservation System

Ein vollständiges Reservierungssystem für eine Autowerkstatt mit Backend-API und Frontend-Anwendung.

## Projektstruktur

```
auto-repair-shop-reservation/
├── backend/              # Flask/Python REST API
├── frontend/             # HTML/CSS/JavaScript Frontend
├── docs/                 # Projektdokumentation
└── README.md            # Dieses Dokument
```

## Features

- ✅ Kundenverwaltung
- ✅ Servicetypen & Pricing
- ✅ Reservierungssystem mit Zeitslots
- ✅ Verfügbarkeitsprüfung
- ✅ Admin Dashboard mit Statistiken
- ✅ REST API mit vollständiger CRUD-Funktionalität
- ✅ Responsive Web-Interface

## Technologie Stack

**Backend:**
- Python 3.8+
- Flask (Web Framework)
- Flask-SQLAlchemy (ORM)
- SQLite (Datenbank)
- Flask-CORS (CORS Support)

**Frontend:**
- HTML5
- CSS3 (Responsive Design)
- Vanilla JavaScript (ES6+)
- Fetch API

## Installation & Ausführung

Detaillierte Anweisungen findest du in [SETUP.md](./SETUP.md)

## Schnelstart

### Backend starten:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # oder venv\Scripts\activate auf Windows
pip install -r requirements.txt
python init_db.py
python app.py
```

Server läuft unter: `http://localhost:5000`

### Frontend öffnen:
```bash
Öffne frontend/index.html im Browser
```

## API Endpoints

### Customers
- `GET /api/customers` - Alle Kunden abrufen
- `POST /api/customers` - Neuen Kunden erstellen

### Services
- `GET /api/services` - Alle Services abrufen
- `POST /api/services` - Neuen Service erstellen

### Reservations
- `GET /api/reservations` - Alle Reservierungen abrufen
- `POST /api/reservations` - Neue Reservierung erstellen
- `GET /api/reservations/<id>` - Spezifische Reservierung abrufen
- `PUT /api/reservations/<id>` - Reservierung aktualisieren
- `DELETE /api/reservations/<id>` - Reservierung stornieren

### Availability
- `GET /api/availability?date=YYYY-MM-DD` - Verfügbare Zeitslots abrufen

### Statistics
- `GET /api/statistics` - Dashboard-Statistiken abrufen

## Beispiel API Calls

### Kundenregistrierung
```bash
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Max Müller",
    "phone": "0123456789",
    "email": "max@example.com"
  }'
```

### Reservierung erstellen
```bash
curl -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "service_id": 1,
    "reservation_date": "2026-07-15",
    "time_slot": "09:00",
    "notes": "Standardwechsel"
  }'
```

### Verfügbarkeit prüfen
```bash
curl http://localhost:5000/api/availability?date=2026-07-15
```

## Projektstruktur Detail

```
backend/
├── app.py              # Flask Hauptanwendung & API-Endpoints
├── models.py           # SQLAlchemy Datenmodelle
├── init_db.py          # Datenbankinitialisierung mit Sample-Daten
├── requirements.txt    # Python Dependencies
└── repair_shop.db      # SQLite Datenbank (wird auto-generiert)

frontend/
├── index.html          # HTML-Struktur & Navigaation
├── script.js           # JavaScript Logik & API-Kommunikation
└── style.css           # Responsive CSS Styling

docs/
└── DEVELOPMENT.md      # AI-Assisted Development Dokumentation
```

## Features Detailiert

### 1. Dashboard
- Übersicht der Statistiken
- Verfügbare Services anzeigen
- Schneller Zugriff auf alle Funktionen

### 2. Reservierungssystem
- Automatische Konfliktprüfung
- Verfügbare Zeitslots anzeigen
- Kundendaten speichern
- Reservierung mit Notizen

### 3. Kundenverwaltung
- Automatische Kundenerstellung
- Telefon-basierte Duplikatsprüfung
- Kontaktdetails speichern

### 4. Service-Katalog
- Verschiedene Service-Typen
- Preisübersicht
- Zeitaufwand pro Service

## Datenbank Schema

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

### Mit Postman
1. Importiere `docs/postman_collection.json`
2. Führe die Requests durch

### Mit curl (siehe Beispiele oben)

### Manuell
1. Öffne das Frontend
2. Fülle das Reservierungsformular aus
3. Überprüfe die Daten im Dashboard

## Troubleshooting

### Port 5000 ist bereits in Benutzung
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### Module nicht gefunden
```bash
deactivate
source venv/bin/activate
pip install -r requirements.txt
```

### CORS-Fehler
Das ist normal bei lokalem Testen - wird durch Flask-CORS gelöst

## Zukünftige Verbesserungen

- [ ] Benutzerauthentifizierung
- [ ] Email-Benachrichtigungen
- [ ] SMS-Reminders
- [ ] Admin-Dashboard mit Metriken
- [ ] Zahlungsintegration
- [ ] Mobile App (React Native)
- [ ] Termin-Synchronisation (Google Calendar)
- [ ] Bewertungssystem

## Dokumentation

Siehe [DEVELOPMENT.md](./docs/DEVELOPMENT.md) für AI-Assisted Development Details:
- Projektansatz pro Modul
- AI Tool Vergleich
- Entwicklungsprozess
- Screenshots und Beweise

## Lizenz

MIT License

## Kontakt

Nikolay Bogdanov - GitHub: @NikolayNBBogdanov
