# Installation & Ausführung Guide

## Voraussetzungen

- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **Git** - [Download](https://git-scm.com/)
- Ein beliebiger **Text-Editor oder IDE** (VS Code, PyCharm, etc.)
- Moderne **Browser** (Chrome, Firefox, Safari, Edge)

## Schritt-für-Schritt Installation

### 1. Repository klonen

```bash
git clone -b auto-repair-reservation https://github.com/NikolayNBBogdanov/Auto-Repair-Reservation.git
cd Auto-Repair-Reservation
```

### 2. Python Virtual Environment erstellen

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

### 3. Dependencies installieren

```bash
cd backend
pip install -r requirements.txt
```

Das sollte folgende Pakete installieren:
- Flask (Web Framework)
- Flask-CORS (Cross-Origin Support)
- Flask-SQLAlchemy (Datenbank ORM)
- SQLAlchemy (SQL Toolkit)

### 4. Datenbank initialisieren

```bash
python init_db.py
```

Output sollte sein:
```
✓ Database tables created
✓ 5 Services hinzugefügt
✓ 3 Kunden hinzugefügt
✓ 3 Reservierungen hinzugefügt

✓✓✓ Datenbank erfolgreich initialisiert! ✓✓✓
```

### 5. Backend-Server starten

```bash
python app.py
```

Output sollte sein:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

✅ **Backend ist jetzt läuft unter:** `http://localhost:5000`

### 6. Frontend öffnen

**Option A - Direkt im Browser:**
- Navigiere zum `frontend/` Ordner
- Rechtsklick auf `index.html`
- Wähle "Mit Browser öffnen"

**Option B - Mit Live Server (VS Code):**
1. Installiere Extension: "Live Server" von Ritwick Dey
2. Rechtsklick auf `frontend/index.html`
3. Wähle "Open with Live Server"

✅ **Frontend sollte jetzt offen sein unter:** `http://localhost:5500` (oder ähnlich)

## Verifizierung

### 1. API ist erreichbar
```bash
curl http://localhost:5000/health
```

Ergebnis:
```json
{"status":"OK","timestamp":"2026-07-06T10:00:00.000000"}
```

### 2. Services laden
```bash
curl http://localhost:5000/api/services
```

Ergebnis: Liste von 5 Services sollte angezeigt werden

### 3. Frontend lädt
- Öffne `http://localhost:5500/frontend/index.html`
- Dashboard mit Statistiken sollte sichtbar sein
- Navigation sollte funktionieren

## Verwendung

### Dashboard erkunden
1. Starte das Frontend
2. Du siehst das Dashboard mit Statistiken
3. Klicke auf "Neue Reservierung"
4. Fülle das Formular aus
5. Wähle einen verfügbaren Zeitslot
6. Klicke "Reservierung erstellen"

### API testen mit curl

**Alle Kunden abrufen:**
```bash
curl http://localhost:5000/api/customers
```

**Alle Reservierungen abrufen:**
```bash
curl http://localhost:5000/api/reservations
```

**Neue Reservierung erstellen:**
```bash
curl -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "service_id": 2,
    "reservation_date": "2026-07-20",
    "time_slot": "11:00",
    "notes": "Bitte vorsichtig behandeln"
  }'
```

**Verfügbare Slots für ein Datum:**
```bash
curl "http://localhost:5000/api/availability?date=2026-07-15"
```

### API testen mit Postman

1. Lade Postman herunter: https://www.postman.com/downloads/
2. Öffne Postman
3. Erstelle neue Request:
   - **Method:** GET
   - **URL:** http://localhost:5000/api/statistics
   - Klick "Send"

## Häufige Probleme & Lösungen

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

Oder ändere den Port in `backend/app.py`:
```python
if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Neuer Port
```

### Problem: "ModuleNotFoundError: No module named 'flask'"

```bash
# Virtual Environment deaktivieren
deactivate

# Neu aktivieren
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Dependencies neu installieren
pip install -r requirements.txt
```

### Problem: "No such table: customers"

```bash
# Datenbank neu initialisieren
python init_db.py
```

### Problem: CORS-Fehler im Browser Console

Das ist normal bei lokalem Testen. Flask-CORS kümmert sich darum. Überprüfe, dass:
1. Backend läuft auf `http://localhost:5000`
2. Frontend lädt die API korrekt

### Problem: Frontend lädt nicht

1. Überprüfe, dass die Datei `frontend/index.html` existiert
2. Öffne Developer Console (F12) auf Fehler zu prüfen
3. Stelle sicher, dass keine Datei-Zugriffs-Probleme vorliegen

## Projektstruktur Erklärung

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
