/**
 * FileExport - Datei-Export Funktionen
 * Exportiert gescannte Daten als JSON-Datei
 */

var FileExport = (function() {
    'use strict';

    /**
     * Als JSON exportieren
     */
    function exportToJson(settings) {
        var data = EmailExtract.getScannedData();

        if (!data) {
            return {
                success: false,
                error: 'Keine gescannten Daten vorhanden. Bitte zuerst scannen.'
            };
        }

        var filename = generateFilename();
        var json = JSON.stringify(data, null, 2);

        return saveFile(json, filename);
    }

    /**
     * Demo-Export erstellen (ohne Outlook)
     */
    function exportDemo() {
        var demoData = generateDemoData();
        var filename = 'demo-export-' + formatDateForFilename(new Date()) + '.json';
        var json = JSON.stringify(demoData, null, 2);

        return saveFile(json, filename);
    }

    /**
     * Datei speichern (mit Dialog)
     */
    function saveFile(content, defaultFilename) {
        try {
            // FileSystemObject für Datei-Speicherung
            var fso = new ActiveXObject('Scripting.FileSystemObject');

            // Shell für Dateidialog
            var shell = new ActiveXObject('WScript.Shell');
            var desktopPath = shell.SpecialFolders('Desktop');

            // Einfacher Speicherpfad (Desktop)
            var filepath = desktopPath + '\\' + defaultFilename;

            // Datei schreiben (UTF-8)
            var stream = new ActiveXObject('ADODB.Stream');
            stream.Type = 2; // Text
            stream.Charset = 'UTF-8';
            stream.Open();
            stream.WriteText(content);
            stream.SaveToFile(filepath, 2); // 2 = überschreiben
            stream.Close();

            return {
                success: true,
                filename: filepath
            };
        } catch (e) {
            return {
                success: false,
                error: e.message || 'Datei konnte nicht gespeichert werden'
            };
        }
    }

    /**
     * Dateiname generieren
     */
    function generateFilename() {
        return Config.export.defaultFilename + '-' + formatDateForFilename(new Date()) + '.json';
    }

    /**
     * Datum für Dateinamen formatieren
     */
    function formatDateForFilename(date) {
        var year = date.getFullYear();
        var month = String(date.getMonth() + 1).padStart(2, '0');
        var day = String(date.getDate()).padStart(2, '0');
        var hours = String(date.getHours()).padStart(2, '0');
        var minutes = String(date.getMinutes()).padStart(2, '0');
        return year + month + day + '_' + hours + minutes;
    }

    /**
     * Demo-Daten generieren
     */
    function generateDemoData() {
        var now = new Date();
        var weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        return {
            exportDate: now.toISOString(),
            mailboxName: 'Demo Postfach',
            exportSettings: {
                dateRange: {
                    from: formatDate(weekAgo),
                    to: formatDate(now)
                },
                folders: ['Posteingang', 'Gesendete Elemente'],
                keywordFilter: ['bestandsübertragung', 'maklervollmacht']
            },
            totalEmails: 8,
            conversationCount: 5,
            conversations: {
                'demo-conv-001': {
                    conversationID: 'demo-conv-001',
                    subject: 'AW: Bestandsübertragung Demo-Kunde KFZ',
                    messages: [
                        {
                            entryID: 'demo-msg-001-a',
                            folder: 'sent',
                            subject: 'Bestandsübertragung Demo-Kunde KFZ - ERG-123456',
                            senderEmail: 'makler@meinbuero.de',
                            receivedTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                            bodyPlain: 'Sehr geehrte Damen und Herren,\n\nhiermit beantrage ich die Bestandsübertragung für meinen Kunden Herrn Max Demo.\n\nVS-Nr: ERG-123456\nSparte: KFZ\n\nMit freundlichen Grüßen'
                        },
                        {
                            entryID: 'demo-msg-001-b',
                            folder: 'inbox',
                            subject: 'AW: Bestandsübertragung Demo-Kunde KFZ - ERG-123456',
                            senderEmail: 'maklerservice@ergo.de',
                            receivedTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                            bodyPlain: 'Sehr geehrter Makler,\n\ndie Bestandsübertragung wurde bestätigt. Wirksamkeit ab 01.02.2026.\n\nMit freundlichen Grüßen\nERGO Maklerservice'
                        }
                    ]
                },
                'demo-conv-002': {
                    conversationID: 'demo-conv-002',
                    subject: 'Courtagezusage Muster Haftpflicht',
                    messages: [
                        {
                            entryID: 'demo-msg-002-a',
                            folder: 'sent',
                            subject: 'Courtagezusage Muster Haftpflicht - AZ-789012',
                            senderEmail: 'makler@meinbuero.de',
                            receivedTime: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                            bodyPlain: 'Anfrage Courtagezusage für Frau Anna Muster.\n\nVS-Nr: AZ-789012\nSparte: Privathaftpflicht'
                        },
                        {
                            entryID: 'demo-msg-002-b',
                            folder: 'inbox',
                            subject: 'AW: Courtagezusage Muster Haftpflicht - AZ-789012',
                            senderEmail: 'maklerservice@allianz.de',
                            receivedTime: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                            bodyPlain: 'Ihre Anfrage wird geprüft. Der Kunde wird angeschrieben.'
                        }
                    ]
                },
                'demo-conv-003': {
                    conversationID: 'demo-conv-003',
                    subject: 'Maklervollmacht Beispiel Leben',
                    messages: [
                        {
                            entryID: 'demo-msg-003-a',
                            folder: 'inbox',
                            subject: 'Maklervollmacht Beispiel Leben - HDI-345678',
                            senderEmail: 'maklerbetreuung@hdi.de',
                            receivedTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                            bodyPlain: 'Der Versicherungsnehmer hat der Übertragung widersprochen.'
                        }
                    ]
                },
                'demo-conv-004': {
                    conversationID: 'demo-conv-004',
                    subject: 'Bestandsübertragung Test Hausrat',
                    messages: [
                        {
                            entryID: 'demo-msg-004-a',
                            folder: 'sent',
                            subject: 'Bestandsübertragung Test Hausrat - AXA-567890',
                            senderEmail: 'makler@meinbuero.de',
                            receivedTime: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
                            bodyPlain: 'Bestandsübertragung Hausrat für Familie Test.'
                        }
                    ]
                },
                'demo-conv-005': {
                    conversationID: 'demo-conv-005',
                    subject: 'Übertragung Neukunde Kranken',
                    messages: [
                        {
                            entryID: 'demo-msg-005-a',
                            folder: 'inbox',
                            subject: 'Übertragung Neukunde Kranken - DEB-901234',
                            senderEmail: 'maklerservice@debeka.de',
                            receivedTime: now.toISOString(),
                            bodyPlain: 'Sehr geehrter Makler,\n\nwir benötigen noch die unterschriebene Maklervollmacht für Herrn Klaus Neukunde.\n\nBitte reichen Sie diese nach.'
                        }
                    ]
                }
            }
        };
    }

    /**
     * Datum formatieren (YYYY-MM-DD)
     */
    function formatDate(date) {
        var year = date.getFullYear();
        var month = String(date.getMonth() + 1).padStart(2, '0');
        var day = String(date.getDate()).padStart(2, '0');
        return year + '-' + month + '-' + day;
    }

    // Öffentliche API
    return {
        exportToJson: exportToJson,
        exportDemo: exportDemo,
        generateFilename: generateFilename
    };
})();
