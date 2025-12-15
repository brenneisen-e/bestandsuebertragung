# Outlook Sicherheitseinstellungen für E-Mail Export

## Problem
Das VBScript kann E-Mail-Inhalte (Body, Sender) nicht lesen, weil Outlook den programmatischen Zugriff blockiert.

Fehlermeldung: `ERROR -2147467260` (E_ABORT / Object Model Guard)

## Lösung 1: Trust Center Einstellungen ändern (Empfohlen)

1. **Outlook öffnen**
2. Gehe zu: **Datei → Optionen → Trust Center**
3. Klicke auf **Einstellungen für das Trust Center...**
4. Wähle links **Programmgesteuerter Zugriff**
5. Unter "Programmgesteuerter Zugriff" wähle eine der folgenden Optionen:
   - **"Mich bei verdächtiger Aktivität warnen, wenn mein Antivirenprogramm inaktiv oder veraltet ist"** (Standard mit AV)
   - **"Mich nie vor verdächtiger Aktivität warnen"** (weniger sicher, aber funktioniert garantiert)
6. Klicke **OK**
7. **Outlook neu starten**
8. VBScript erneut ausführen

## Lösung 2: Als Outlook-Makro ausführen

Falls die Trust Center Einstellungen nicht geändert werden können (z.B. durch IT-Policy), kann das Script als Outlook-Makro ausgeführt werden:

1. In Outlook: **Alt + F11** (öffnet VBA-Editor)
2. Im VBA-Editor: **Einfügen → Modul**
3. Code aus `outlook-export-macro.vba` einfügen
4. Makro ausführen: **Alt + F8** → `ExportEmails` → **Ausführen**

## Lösung 3: Gruppenrichtlinie (für IT-Admins)

Falls Outlook durch Gruppenrichtlinien gesperrt ist:

Registry-Schlüssel:
```
HKEY_CURRENT_USER\Software\Policies\Microsoft\Office\16.0\Outlook\Security
```

Wert: `ObjectModelGuard` = `2` (für "Automatisch genehmigen")

## Warum passiert das?

Outlook schützt E-Mail-Inhalte vor programmatischem Zugriff durch externe Scripts, um Malware zu verhindern. Das betrifft:
- E-Mail Body (Text und HTML)
- Absender E-Mail-Adresse
- Empfänger
- Anhänge

Erlaubt bleibt:
- Betreff
- Empfangsdatum
- Ordnername
- BodyFormat (ob HTML/Text/RTF)
