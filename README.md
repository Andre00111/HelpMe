# HelpMe - Barrierearme Kommunikations-App

Eine benutzerfreundliche React-Anwendung, die Menschen mit Beeinträchtigungen hilft, über einfache, farbenfrohe Kacheln zu kommunizieren. Mit integrierter Text-to-Speech-Funktionalität.

## Features (MVP)

✅ **Startseite mit bunten Kacheln** - Große, anklickbare Kacheln mit vordefinierten Phrasen
✅ **Text-to-Speech** - Automatische Sprachausgabe bei Klick (Browser Web Speech API)
✅ **Einstellungsseite** - Dummy-Seite für zukünftige Konfiguration
✅ **Responsive Design** - Mobile-first, funktioniert auf allen Geräten
✅ **Material UI** - Modernes, benutzerfreundliches Design
✅ **React Router** - Navigation zwischen Seiten

## Geplante Features

- 🔜 Persistierung von Kacheln (localStorage)
- 🔜 GPS-Ortungsdienste
- 🔜 Anruffunktion
- 🔜 Benutzerprofile
- 🔜 Sprachgeschwindigkeit konfigurierbar
- 🔜 Tastaturnavigation und Accessibility-Verbesserungen

## Technologie-Stack

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Material UI (MUI)** - Component Library
- **React Router v6** - Navigation
- **Web Speech API** - Text-to-Speech

## Installation

### Voraussetzungen
- Node.js 18+ und npm installiert

### Setup

```bash
# Navigiere zum Projekt
cd /Users/andre/Desktop/projekte/HelpMe

# Installiere Dependencies (du machen das selbst)
npm install

# Starte Entwicklungsserver
npm run dev

# Build für Production
npm run build

# Preview Production Build
npm preview
```

Der App läuft dann unter `http://localhost:5173`

## Projektstruktur

```
HelpMe/
├── src/
│   ├── components/
│   │   ├── Layout.tsx         # App Header + Navigation
│   │   ├── Tile.tsx           # Einzelne Kachel mit TTS
│   │   └── TileGrid.tsx       # Grid aus Kacheln
│   ├── pages/
│   │   ├── Home.tsx           # Startseite mit Kacheln
│   │   └── Settings.tsx       # Einstellungen (Dummy)
│   ├── App.tsx                # Main App + Router
│   ├── main.tsx               # React Entry Point
│   └── index.css              # Global Styles
├── index.html                 # HTML Template
├── vite.config.ts            # Vite Config
├── tsconfig.json             # TypeScript Config
└── package.json              # Dependencies
```

## Erste Schritte

1. **Öffne die Startseite** - Siehst du 12 bunte Kacheln?
2. **Klick auf eine Kachel** - Die App spricht den Text laut vor
3. **Navigiere zu Einstellungen** - Zum Erstellen neuer Kacheln (noch nicht persistent)
4. **Mobile testen** - Öffne auf dem Handy, sollte gut funktionieren

## Accessibility

Der MVP fokussiert auf:
- ✅ Große, klickbare Targets (min. 44x44px)
- ✅ Hohe Farbkontraste
- ✅ Einfache, klare Sprache
- ✅ Text-to-Speech für Ältere/mit Lesebehinderungen
- 🔜 Tastaturnavigation (Tab, Enter)
- 🔜 Screen Reader Support
- 🔜 Vereinfachte Spracheinstellungen

## Nächste Schritte nach MVP

1. **Persistierung** - Kacheln in localStorage speichern
2. **Backend-Integration** - Benutzerkonten, Cloud-Sync
3. **GPS & Notrufe** - Standort teilen, Notruf-Funktionalität
4. **Offline-Mode** - PWA für Offline-Nutzung
5. **Mehrsprachigkeit** - English, Deutsch, weitere Sprachen

## Lizenz

MIT

## Kontakt & Fragen

Für Fragen zur Entwicklung oder zur Verwendung der App: [Email/Links einfügen]

---

**Viel Erfolg! Diese App kann echten Menschen helfen.** 💙
# HelpMe
