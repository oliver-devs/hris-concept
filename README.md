# Mitarbeiter-Verwaltung

Webbasierte Anwendung zur Verwaltung von Mitarbeitern, Abteilungen und Positionen. Gebaut mit Angular und Django REST Framework.

## Tech-Stack

**Frontend**
- Angular 21 (Standalone Components, Signals)
- Angular Material (UI-Komponenten)
- TypeScript

**Backend**
- Django 6 + Django REST Framework
- Token-basierte Authentifizierung
- SQLite (Entwicklung)

## Features

- Mitarbeiter anlegen, bearbeiten und löschen
- Automatische User-Erstellung mit generiertem Passwort bei Neuanlage
- Freigabe-Workflow (is_approved)
- Abteilungs- und Positionsverwaltung
- Passwort-Änderung
- Suchfunktion mit Echtzeit-Filterung
- Login mit Token-Authentifizierung
- Responsive Material Design UI

## Installation

### Voraussetzungen

- Node.js (>= 20)
- Python (>= 3.12)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Das Backend läuft auf `http://127.0.0.1:8000/`.

### Frontend

```bash
cd frontend
npm install
npx ng serve
```

Das Frontend läuft auf `http://localhost:4200/`.

## Projektstruktur

```
mitarbeiter_api/
├── backend/
│   ├── api/                  # Django App (Models, Views, Serializers)
│   │   ├── models.py         # Employee, Department, Position
│   │   ├── views.py          # ViewSets + API-Views
│   │   ├── serializers.py    # DRF Serializer
│   │   ├── admin.py          # Admin-Konfiguration
│   │   └── urls.py           # API-Routen
│   └── config/               # Django-Konfiguration
│       ├── settings.py
│       └── urls.py
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── auth/         # Login, Guard, Interceptor
│       │   ├── dashboard/    # Dashboard-Ansicht
│       │   ├── employee/     # Mitarbeiter CRUD + Service
│       │   ├── department/   # Abteilungsverwaltung
│       │   ├── settings/     # Einstellungen + Positionsverwaltung
│       │   └── shared/       # Dialoge (Confirm, Password)
│       └── environments/     # Environment-Konfiguration
└── README.md
```

## API-Endpunkte

| Methode | URL | Beschreibung |
|---------|-----|--------------|
| POST | `/api/login/` | Login (Token erhalten) |
| GET | `/api/me/` | Aktueller Benutzer |
| GET/POST | `/api/employees/` | Mitarbeiter auflisten/anlegen |
| GET/PUT/DELETE | `/api/employees/:id/` | Mitarbeiter lesen/bearbeiten/löschen |
| GET/POST | `/api/departments/` | Abteilungen auflisten/anlegen |
| GET/PUT/DELETE | `/api/departments/:id/` | Abteilung lesen/bearbeiten/löschen |
| GET/POST | `/api/positions/` | Positionen auflisten/anlegen |
| GET/PUT/DELETE | `/api/positions/:id/` | Position lesen/bearbeiten/löschen |
| POST | `/api/change-password/` | Passwort ändern |
