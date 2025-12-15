# Bestandsübertragung Tool

Ein Tool zur Verwaltung von Bestandsübertragungen für Versicherungsmakler - bestehend aus einer Web-App und einem Windows HTA-Tool für Outlook-Export.

## Komponenten

### 1. Web-App (Cloudflare Pages)

Eine Single-Page-Application zur Verwaltung von Bestandsübertragungs-Vorgängen.

**Features:**
- 50 Demo-Vorgänge beim ersten Start
- JSON-Import (Drag & Drop) für Outlook-Exports
- Automatische Zuordnung von E-Mails zu Vorgängen
- Manuelle Zuordnung für nicht erkannte E-Mails
- Vorgangs-Management mit Status-Tracking
- Filter nach Status, Versicherer, Sparte
- Volltextsuche
- CSV-Export
- localStorage-Persistenz (offline-fähig)

**Technologie:**
- Vanilla JavaScript (kein Framework)
- Lokale Datenspeicherung im Browser
- ERGO Branding (#C8102E)

### 2. HTA-Tool (Windows)

Ein Windows-Tool zum Export von E-Mails aus Microsoft Outlook.

**Features:**
- Outlook-Verbindung via COM
- Postfach-Auswahl
- Zeitraum-Filter
- Schlagwort-Filter
- Konversations-Gruppierung
- JSON-Export
- Demo-Modus (ohne Outlook)

**Voraussetzungen:**
- Windows
- Microsoft Outlook (Desktop-Version)
- Internet Explorer Modus aktiviert

## Projektstruktur

```
bestandsuebertragung/
├── web-app/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── app.js           # Hauptanwendung
│   │   ├── storage.js       # localStorage Persistenz
│   │   ├── matcher.js       # E-Mail Zuordnung
│   │   ├── extractor.js     # Schlagwort-Extraktion
│   │   ├── export.js        # CSV/JSON Export
│   │   ├── ui.js            # UI-Komponenten
│   │   └── demo-data.js     # 50 Demo-Vorgänge
│   └── demo/
│       └── neue-mails-demo.json
│
├── hta-tool/
│   ├── bestandsuebertragung-export.hta
│   ├── css/
│   │   └── main.css
│   └── js/
│       ├── config.js
│       ├── outlook-connect.js
│       ├── email-extract.js
│       └── file-export.js
│
└── README.md
```

## Installation

### Web-App auf Cloudflare Pages

1. Repository zu Cloudflare Pages verbinden
2. Build-Einstellungen:
   - Build command: (leer)
   - Build output directory: `web-app`
3. Deployen

### HTA-Tool lokal verwenden

1. `hta-tool` Ordner auf Windows-Rechner kopieren
2. `bestandsuebertragung-export.hta` doppelklicken
3. Bei Sicherheitsabfrage "Zulassen" wählen

## Workflow

### Täglicher Workflow

1. **Morgens: E-Mails exportieren**
   - HTA-Tool starten
   - Outlook verbinden
   - Zeitraum wählen (z.B. letzte 7 Tage)
   - E-Mails scannen
   - Als JSON exportieren

2. **E-Mails verarbeiten**
   - Web-App öffnen
   - JSON-Datei importieren (Drag & Drop)
   - Automatisch zugeordnete Mails prüfen
   - Nicht zugeordnete Mails manuell zuordnen oder neuen Vorgang erstellen

3. **Vorgänge bearbeiten**
   - Status aktualisieren
   - Notizen hinzufügen
   - Bei Bedarf als geflaggt markieren

4. **Auswertung**
   - Gefilterte Liste als CSV exportieren

## Datenmodell

### Vorgang

```javascript
{
  id: "case-uuid",
  createdAt: "2025-12-01T10:00:00Z",
  updatedAt: "2025-12-15T14:30:00Z",

  kunde: {
    name: "Nachname, Vorname",
    confidence: 0.95,
    source: "auto|manual"
  },
  versicherungsnummer: {
    value: "ERG-12345678",
    confidence: 0.90,
    source: "auto|manual"
  },
  versicherer: {
    name: "ERGO",
    confidence: 1.0,
    source: "email-domain|manual"
  },
  gueltigkeitsdatum: {
    value: "01.02.2026",
    confidence: 0.85,
    source: "auto|manual"
  },

  status: "neu|angefragt|in-bearbeitung|bestaetigt|abgelehnt|erledigt",
  sparte: "KFZ|Leben|Kranken|Haftpflicht|Hausrat|Rechtsschutz|Unfall|BU|Wohngebäude|Rente",
  notes: "",
  flagged: false,

  conversationIds: ["conv-123"],
  messageIds: ["msg-001", "msg-002"],
  messages: [/* E-Mail-Objekte */],

  statusHistory: [
    { date: "2025-12-01", from: null, to: "angefragt", note: "Anfrage gesendet" }
  ]
}
```

### Status-Icons

| Status | Icon | Beschreibung |
|--------|------|--------------|
| Neu | ○ | Vorgang angelegt, noch keine Aktion |
| Angefragt | ◐ | Anfrage an Versicherer gesendet |
| In Bearbeitung | ◑ | Versicherer bearbeitet Anfrage |
| Bestätigt | ● | Übertragung bestätigt |
| Abgelehnt | ✕ | Übertragung abgelehnt |
| Erledigt | ✔ | Vorgang abgeschlossen |

## Matching-Engine

Die automatische Zuordnung erfolgt nach Priorität:

1. **ConversationID** (100%) - Gleiche Outlook-Konversation
2. **Versicherungsnummer** (95%) - Exakte VS-Nr im Text
3. **Kunde + Versicherer** (80%) - Name + E-Mail-Domain
4. **Nur Kunde** (60%) - Name gefunden, aber niedriger Score

Ab 75% Confidence erfolgt automatische Zuordnung, darunter wird die E-Mail zur manuellen Prüfung markiert.

## Unterstützte Versicherer

Die E-Mail-Domain wird automatisch erkannt für:

ERGO, Allianz, AXA, HDI, Zurich, Generali, Debeka, Signal Iduna, HUK-Coburg, Nürnberger, Gothaer, Barmenia, R+V, LVM, DEVK, Continentale, WWK, Basler, HanseMerkur, INTER, Volkswohl Bund, Swiss Life, Canada Life, Condor, Alte Leipziger, Hallesche, Provinzial, SV SparkassenVersicherung, WGV

## Datenschutz

- Alle Daten werden lokal im Browser gespeichert (localStorage)
- Keine Datenübertragung an Server
- Export-Dateien verbleiben auf dem lokalen Rechner

## Browser-Unterstützung

**Web-App:**
- Chrome (empfohlen)
- Firefox
- Edge
- Safari

**HTA-Tool:**
- Nur Windows mit Internet Explorer Modus

## Lizenz

Proprietär - nur für autorisierte Nutzer.
