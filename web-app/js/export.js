/**
 * Export Modul - CSV und Daten-Export Funktionen
 * Exportiert Vorgangsdaten in verschiedene Formate
 */

const Export = (function() {
    'use strict';

    // CSV-Spalten Definitionen
    const CSV_COLUMNS = [
        { key: 'id', label: 'ID' },
        { key: 'kunde.name', label: 'Kunde' },
        { key: 'versicherungsnummer.value', label: 'VS-Nr' },
        { key: 'versicherer.name', label: 'Versicherer' },
        { key: 'sparte', label: 'Sparte' },
        { key: 'status', label: 'Status' },
        { key: 'gueltigkeitsdatum.value', label: 'Gültigkeitsdatum' },
        { key: 'notes', label: 'Notizen' },
        { key: 'flagged', label: 'Geflaggt' },
        { key: 'messageCount', label: 'Mails' },
        { key: 'createdAt', label: 'Erstellt' },
        { key: 'updatedAt', label: 'Aktualisiert' }
    ];

    // Status-Labels für Export
    const STATUS_LABELS = {
        'neu': 'Neu',
        'angefragt': 'Angefragt',
        'in-bearbeitung': 'In Bearbeitung',
        'bestaetigt': 'Bestätigt',
        'abgelehnt': 'Abgelehnt',
        'erledigt': 'Erledigt'
    };

    /**
     * Vorgänge als CSV exportieren
     */
    function exportToCSV(cases, filename) {
        if (!cases || cases.length === 0) {
            UI.showToast('Keine Daten zum Exportieren', 'warning');
            return false;
        }

        // Dateiname generieren
        filename = filename || `bestandsuebertragung_${formatDateForFilename(new Date())}.csv`;

        // CSV-Header
        const headers = CSV_COLUMNS.map(col => col.label);

        // CSV-Zeilen
        const rows = cases.map(c => {
            return CSV_COLUMNS.map(col => {
                const value = getNestedValue(c, col.key);
                return formatCSVValue(value, col.key);
            });
        });

        // CSV zusammenbauen
        const csvContent = [
            headers.join(';'),
            ...rows.map(row => row.join(';'))
        ].join('\r\n');

        // BOM für UTF-8 hinzufügen (damit Excel Umlaute korrekt anzeigt)
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

        // Download
        downloadBlob(blob, filename);

        UI.showToast(`${cases.length} Vorgänge exportiert`, 'success');
        return true;
    }

    /**
     * Verschachtelten Wert aus Objekt holen
     */
    function getNestedValue(obj, path) {
        if (!obj || !path) return '';

        // Spezialfall: messageCount
        if (path === 'messageCount') {
            return obj.messages ? obj.messages.length : 0;
        }

        const parts = path.split('.');
        let value = obj;

        for (const part of parts) {
            if (value === null || value === undefined) return '';
            value = value[part];
        }

        return value;
    }

    /**
     * Wert für CSV formatieren
     */
    function formatCSVValue(value, key) {
        if (value === null || value === undefined) {
            return '';
        }

        // Boolean
        if (typeof value === 'boolean') {
            return value ? 'Ja' : 'Nein';
        }

        // Status
        if (key === 'status') {
            return STATUS_LABELS[value] || value;
        }

        // Datum
        if (key === 'createdAt' || key === 'updatedAt') {
            return formatDateForCSV(value);
        }

        // String mit Sonderzeichen escapen
        let str = String(value);

        // Semikolon, Anführungszeichen, Zeilenumbrüche behandeln
        if (str.includes(';') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
            str = '"' + str.replace(/"/g, '""') + '"';
        }

        return str;
    }

    /**
     * Datum für CSV formatieren
     */
    function formatDateForCSV(dateStr) {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateStr;
        }
    }

    /**
     * Datum für Dateinamen formatieren
     */
    function formatDateForFilename(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}${month}${day}_${hours}${minutes}`;
    }

    /**
     * Blob als Datei herunterladen
     */
    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    /**
     * Alle Daten als JSON exportieren (Backup)
     */
    function exportToJSON(filename) {
        const data = Storage.exportData();

        filename = filename || `bestandsuebertragung_backup_${formatDateForFilename(new Date())}.json`;

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        downloadBlob(blob, filename);

        UI.showToast('Backup erstellt', 'success');
        return true;
    }

    /**
     * JSON-Datei importieren (Outlook-Export oder Backup)
     */
    function importFromJSON(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);

                    // Prüfen ob es ein Backup oder ein Outlook-Export ist
                    if (data.cases && data.processed) {
                        // Backup-Import
                        const success = Storage.importData(data);
                        if (success) {
                            resolve({ type: 'backup', data: data });
                        } else {
                            reject(new Error('Backup-Import fehlgeschlagen'));
                        }
                    } else if (data.conversations) {
                        // Outlook-Export
                        resolve({ type: 'outlook', data: data });
                    } else {
                        reject(new Error('Unbekanntes Dateiformat'));
                    }
                } catch (e) {
                    reject(new Error('Ungültige JSON-Datei: ' + e.message));
                }
            };

            reader.onerror = function() {
                reject(new Error('Datei konnte nicht gelesen werden'));
            };

            reader.readAsText(file);
        });
    }

    /**
     * Outlook-Export verarbeiten
     */
    function processOutlookExport(data) {
        if (!data.conversations) {
            return { processed: 0, matched: 0, unmatched: 0, errors: [] };
        }

        const allMessages = [];

        // Alle Nachrichten aus Konversationen extrahieren
        for (const [convId, conv] of Object.entries(data.conversations)) {
            if (conv.messages) {
                conv.messages.forEach(msg => {
                    msg.conversationID = convId;
                    allMessages.push(msg);
                });
            }
        }

        // Bereits verarbeitete Nachrichten filtern
        const newMessages = allMessages.filter(msg =>
            !Storage.isMessageProcessed(msg.entryID)
        );

        if (newMessages.length === 0) {
            return {
                processed: 0,
                matched: 0,
                unmatched: 0,
                errors: [],
                message: 'Alle Nachrichten wurden bereits verarbeitet'
            };
        }

        // Matching durchführen
        const cases = Storage.getCasesArray();
        const matchResult = Matcher.batchMatch(newMessages, cases);

        // Automatische Zuordnungen durchführen
        const assignResult = Matcher.autoAssign(matchResult.matched);

        // Nicht zugeordnete Mails speichern
        matchResult.unmatched.forEach(mail => {
            Storage.addUnassignedMail(mail);
        });

        // Vorschläge auch als nicht zugeordnet behandeln
        matchResult.suggested.forEach(item => {
            Storage.addUnassignedMail(item.email);
        });

        return {
            processed: newMessages.length,
            matched: assignResult.assigned.length,
            unmatched: matchResult.unmatched.length + matchResult.suggested.length,
            suggested: matchResult.suggested.length,
            errors: assignResult.failed
        };
    }

    /**
     * Statistik-Report als Text generieren
     */
    function generateReport(cases) {
        const stats = Storage.getStats();
        const now = new Date();

        let report = `Bestandsübertragung Report\n`;
        report += `Erstellt: ${now.toLocaleDateString('de-DE')} ${now.toLocaleTimeString('de-DE')}\n`;
        report += `${'='.repeat(50)}\n\n`;

        report += `ÜBERSICHT\n`;
        report += `${'-'.repeat(50)}\n`;
        report += `Gesamt Vorgänge:     ${stats.total}\n`;
        report += `Neu:                 ${stats.neu}\n`;
        report += `Angefragt:           ${stats.angefragt}\n`;
        report += `In Bearbeitung:      ${stats['in-bearbeitung']}\n`;
        report += `Bestätigt:           ${stats.bestaetigt}\n`;
        report += `Abgelehnt:           ${stats.abgelehnt}\n`;
        report += `Erledigt:            ${stats.erledigt}\n`;
        report += `Geflaggt:            ${stats.flagged}\n\n`;

        // Nach Versicherer gruppieren
        const byVersicherer = {};
        cases.forEach(c => {
            const v = c.versicherer?.name || 'Unbekannt';
            byVersicherer[v] = (byVersicherer[v] || 0) + 1;
        });

        report += `NACH VERSICHERER\n`;
        report += `${'-'.repeat(50)}\n`;
        Object.entries(byVersicherer)
            .sort((a, b) => b[1] - a[1])
            .forEach(([versicherer, count]) => {
                report += `${versicherer.padEnd(25)} ${count}\n`;
            });

        report += `\n`;

        // Nach Sparte gruppieren
        const bySparte = {};
        cases.forEach(c => {
            const s = c.sparte || 'Unbekannt';
            bySparte[s] = (bySparte[s] || 0) + 1;
        });

        report += `NACH SPARTE\n`;
        report += `${'-'.repeat(50)}\n`;
        Object.entries(bySparte)
            .sort((a, b) => b[1] - a[1])
            .forEach(([sparte, count]) => {
                report += `${sparte.padEnd(25)} ${count}\n`;
            });

        return report;
    }

    /**
     * Report als Textdatei exportieren
     */
    function exportReport(cases, filename) {
        const report = generateReport(cases);
        filename = filename || `bestandsuebertragung_report_${formatDateForFilename(new Date())}.txt`;

        const blob = new Blob([report], { type: 'text/plain;charset=utf-8;' });
        downloadBlob(blob, filename);

        UI.showToast('Report exportiert', 'success');
        return true;
    }

    // Öffentliche API
    return {
        exportToCSV,
        exportToJSON,
        importFromJSON,
        processOutlookExport,
        generateReport,
        exportReport,

        // Hilfsfunktionen
        formatDateForFilename,
        downloadBlob
    };
})();
