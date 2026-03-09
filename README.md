# Spectrum by PrismaLab – All-in-One Unternehmenssoftware (UI/UX Concept Study)

**Spectrum** ist eine All-in-One Unternehmenssoftware, entwickelt von der fiktiven **PrismaLab GmbH**.

> **"Komplexes einfach machen."**
>
> PrismaLab ist ein Softwareunternehmen, das Komplexes einfach macht. Durch UX Research, Design und Engineering entwickelt PrismaLab eine All-in-One Unternehmenssoftware — und nutzt sie selbst im Alltag. Das Produkt ist der lebende Beweis, dass ihr Ansatz funktioniert: intuitiv, übersichtlich und reduziert auf das Wesentliche.

> **Kernfokus dieses Projekts:**
> Dieses Projekt dient als **UI/UX-Showcase und Konzeptstudie**. Der Schwerpunkt liegt auf der Frage: *"Wie muss eine moderne, intuitive und enterprise-taugliche Software für Endanwender gestaltet sein?"* — Komplexität unter der Haube, Einfachheit an der Oberfläche.

## Design-Philosophie

*   **"Weniger ist mehr":** Intuitiv, übersichtlich, reduziert auf das Wesentliche. Software, die ohne Handbuch funktioniert.
*   **Soft UI & Flat Design:** Keine harten Schlagschatten. Feine Rahmen, softe Hintergrund-Abstufungen und pastellige Status-Farben.
*   **Grid-Layouts & Info-Karten:** Komplexe Ansichten nutzen geteilte Raster mit erklärenden Info-Karten — ein SaaS-Pattern zur Reduzierung von Support-Anfragen.
*   **Intuitive Navigation (Drill-Down):** Statt verschachtelter Menüs wird in Listen hinein-navigiert (z.B. Abteilungen → Positionen).
*   **Kontext-Wechsel via Toggle:** Moderne Button-Toggles statt klassischer Tabs für fließende View-Wechsel.
*   **White-Labeling:** Firmenname und Software-Name sind dynamisch anpassbar und ändern das komplette Branding in Echtzeit.
*   **Per-User Theming:** 10 Farbthemen (5 maskulin, 5 feminin) mit gedämpften Custom-Paletten. Hell-/Dunkel-/System-Modus. Gender-basierte Farbstandards beim ersten Login.
*   **Accessibility:** Semantisches HTML, Keyboard-Navigation und ARIA-Labels.

## Module (aktueller Stand)

- **Dashboard:** Rollenbasierte Startseite mit KPI-Metriken und Zeiterfassungs-Widget.
- **Zeiterfassung:** Einstempeln/Ausstempeln, Pausenverwaltung, Wochenübersicht, Korrekturanträge.
- **Mitarbeiter-Verzeichnis:** Alphabetisch gruppiert, durchsuchbar, für alle Benutzer sichtbar.
- **Abwesenheiten:** Team-Kalender, persönliche Anträge, Genehmigungs-Workflow mit Dual-Approval.
- **Stammdaten:** Abteilungen und Positionen mit Drill-Down und Statistik-Dialog.
- **Profil & Einstellungen:** Profilkarte, Theming, Passwort-Verwaltung.
- **Unternehmensverwaltung** (Management): Globale Einstellungen, Branding.

## Geplante Module

Meetings, Projekte (Kanban/Gantt), Dokumente, Finanzen, Tickets/Helpdesk, Kommunikation, Schulungen, Inventar, Global Search, Notifications.

---

## Tech-Stack

**Frontend**
- Angular 21 (Standalone Components, Signals, `computed()`, `effect()`, `@let`, `@if`/`@for`/`@switch`)
- Angular Material (M3 / Material 3 Design System) mit 10 Custom-Farbpaletten
- Vanilla CSS Grid & Flexbox
- TypeScript strict

**Backend**
- Django 6 + Django REST Framework
- Token-basierte Authentifizierung
- SQLite (Entwicklung)
- Python 3.12+ (`@override`, Walrus-Operator)

---

## Installation & Ausführung

### Voraussetzungen

- Node.js (>= 20)
- Python (>= 3.12)

### Backend starten

```bash
cd backend
cp .env.example .env          # Umgebungsvariablen anlegen
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```
Das Backend läuft auf `http://127.0.0.1:8000/`.

### Frontend starten

```bash
cd frontend
npm install
npx ng serve
```
Das Frontend läuft auf `http://localhost:4200/`.

### Tests

```bash
# Backend
cd backend && python manage.py test api -v2

# Frontend
cd frontend && npx ng test
```

---

## API-Endpoints

| Endpoint | Beschreibung |
|---|---|
| `POST /api/login/` | Token-Authentifizierung |
| `GET /api/me/` | Aktueller Benutzer + Mitarbeiterdaten |
| `POST /api/change-password/` | Passwort ändern |
| `/api/departments/` | Abteilungen (CRUD) |
| `/api/positions/?department=id` | Positionen pro Abteilung (CRUD) |
| `/api/employees/` | Mitarbeiter (CRUD, paginiert) |
| `/api/absences/` | Abwesenheiten + `/approve/` + `/deny/` (paginiert) |
| `/api/time-entries/` | Zeiteinträge + `/punch_out/` + `/start_break/` + `/end_break/` (paginiert) |
| `/api/time-corrections/` | Korrekturanträge + `/approve/` + `/deny/` (paginiert) |

---

## Projektstruktur

```
backend/
  config/settings.py       # Django-Einstellungen
  api/models.py            # Department, Position, Employee, Absence, TimeEntry, TimeBreak, TimeCorrectionRequest
  api/views.py             # ViewSets + custom Actions
  api/serializers.py       # DRF Serializers
  api/permissions.py       # IsManagementOrReadOnly, IsOwnerOrStaff
  api/tests.py             # API-Tests

frontend/src/app/
  auth/                    # AuthService, Guards, Interceptor
  dashboard/               # KPI-Cards, Zeiterfassungs-Widget
  calendar/                # Abwesenheits-Kalender, Anträge, Genehmigungen
  time-tracking/           # Punch-in/out, Pausen, Wochenübersicht
  employee/                # Mitarbeiter-Verzeichnis + Formular
  settings/                # Profil, Theming, Stammdaten-Verwaltung
  shared/                  # Services, Models, Dialoge, Utilities
```
