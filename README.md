# ClockIn – HR & Zeiterfassung (UI/UX Concept Study)

**ClockIn** (fiktiv entwickelt für die "Nexus Dynamics GmbH") ist eine webbasierte Unternehmens-Software zur Verwaltung von Mitarbeitern, Abwesenheiten und (in Zukunft) Arbeitszeiten. 

> **💡 Kernfokus dieses Projekts:**
> Dieses Projekt dient in erster Linie als **UI/UX-Showcase und Konzeptstudie**. Der Schwerpunkt liegt nicht primär auf komplexer Backend-Logik, sondern auf der Frage: *"Wie muss eine moderne, intuitive und enterprise-taugliche Software für Endanwender gestaltet sein?"*

## Design-Philosophie & UX-Entscheidungen

Die gesamte Benutzeroberfläche wurde mit Fokus auf Ergonomie und einem klaren, modernen "Look & Feel" entwickelt.

*   **Soft UI & Flat Design:** Verzicht auf harte Schlagschatten. Stattdessen nutzen wir feine Rahmen, softe Hintergrund-Abstufungen und pastellige Status-Farben ("Pills").
*   **Grid-Layouts & Info-Karten:** Komplexe Ansichten (wie Einstellungen oder Kalender) nutzen ein geteiltes Raster. Neben Formularen oder Listen stehen "Info-Karten", die dem Nutzer direkt erklären, was hier passiert – ein bewährtes SaaS-Pattern zur Reduzierung von Support-Anfragen.
*   **Intuitive Navigation (Drill-Down):** Statt tiefer, verschachtelter Menüs wird oft in Listen hinein-navigiert (z.B. Abteilungen -> Positionen).
*   **Kontext-Wechsel via Toggle:** Klassische, klobige "Tabs" wurden durch moderne Button-Toggles ersetzt, um z.B. zwischen "Team-Kalender" und "Meine Anträge" fließend zu wechseln.
*   **White-Labeling Ready:** Unternehmensname und App-Name sind dynamisch in den Einstellungen anpassbar und ändern das komplette Branding der Software in Echtzeit (inkl. Login-Screen).
*   **Alphabetische Filterung:** Lange Stammdaten-Listen wurden mit einer Adressbuch-ähnlichen ABC-Filterleiste für extrem schnelles Auffinden versehen.

## Features (Aktueller Stand)

- **Interaktives Dashboard:** Rollenbasierte Startseite (Mitarbeiter vs. Management) mit anklickbaren KPI-Metriken.
- **Mitarbeiter-Verwaltung:** Alphabetisch gruppierte, durchsuchbare Listenansicht.
- **Abwesenheiten (Urlaub, Krank, Homeoffice):** 
  - Monats-Kalender für das Team.
  - "Meine Anträge"-Ansicht für den Mitarbeiter.
  - "Freigaben"-Workflow für Vorgesetzte (Genehmigen / Ablehnen).
- **Stammdaten-Verwaltung:** Abteilungen und dazugehörige Positionen.
- **Profil-Einstellungen:** Dynamisches Theming (Hell/Dunkel, Akzentfarben) und Passwort-Verwaltung.

---

## Tech-Stack (Das Fundament)

Auch wenn das Design im Vordergrund steht, ist die technische Basis auf dem neuesten Stand, um eine absolut flüssige Bedienung zu gewährleisten:

**Frontend**
- Angular 21 (Standalone Components, moderne Signals)
- Angular Material (M3 / Material 3 Design System)
- Vanilla CSS Grid & Flexbox

**Backend**
- Django 6 + Django REST Framework
- Token-basierte Authentifizierung
- SQLite (Entwicklung)

---

## Installation & Ausführung

### Voraussetzungen

- Node.js (>= 20)
- Python (>= 3.12)

### Backend starten

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

### Frontend starten

```bash
cd frontend
npm install
npx ng serve
```
Das Frontend läuft auf `http://localhost:4200/`.
