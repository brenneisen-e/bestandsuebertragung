/**
 * Demo-Daten Modul - 50 Beispiel-Vorgänge für Bestandsübertragung
 * Realistische Verteilung: viele angefragt (wartend), wenige in-bearbeitung
 */

const DemoData = (function() {
    'use strict';

    // Liste der Demo-Makler (8 verschiedene)
    const MAKLER = [
        { name: "Versicherungsbüro Meier GmbH", email: "kontakt@vb-meier.de" },
        { name: "Schmidt & Partner Finanzberatung", email: "info@schmidt-partner.de" },
        { name: "Assekuranz Hofmann", email: "makler@hofmann-assekuranz.de" },
        { name: "Finanzkonzepte Wagner", email: "beratung@fk-wagner.de" },
        { name: "Maklerbüro Krause", email: "service@makler-krause.de" },
        { name: "Becker Versicherungsmakler", email: "team@becker-makler.de" },
        { name: "Finanzhaus Richter", email: "info@finanzhaus-richter.de" },
        { name: "Weber Assekuranzmakler", email: "makler@weber-assekuranz.de" }
    ];

    // Sparten
    const SPARTEN = ["KFZ", "Leben", "Kranken", "Haftpflicht", "Hausrat", "Rechtsschutz", "Unfall", "BU", "Wohngebäude", "Rente"];

    // Vornamen und Nachnamen für realistische Daten
    const NACHNAMEN = ["Müller", "Schmidt", "Weber", "Wagner", "Fischer", "Becker", "Schulz", "Hoffmann", "Koch", "Richter", "Klein", "Wolf", "Schröder", "Neumann", "Schwarz", "Braun", "Zimmermann", "Krüger", "Hofmann", "Hartmann"];
    const VORNAMEN = ["Thomas", "Anna", "Michael", "Julia", "Stefan", "Maria", "Andreas", "Sandra", "Martin", "Nicole", "Christian", "Petra", "Markus", "Sabine", "Daniel", "Claudia", "Peter", "Susanne", "Frank", "Karin"];

    /**
     * Generiert Demo-Daten
     */
    function generateDemoCases() {
        const cases = {};
        const now = new Date();
        let caseIndex = 1;

        // Hilfsfunktionen
        function randomItem(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }

        function randomDate(daysAgo) {
            const date = new Date(now);
            date.setDate(date.getDate() - daysAgo);
            return date.toISOString();
        }

        function generateVsNr() {
            return 'ERG-' + Math.floor(1000000 + Math.random() * 9000000);
        }

        function generateName() {
            return `${randomItem(NACHNAMEN)}, ${randomItem(VORNAMEN)}`;
        }

        function createCase(status, maklerIndex, sparteIndex, daysAgo, daysUpdated) {
            const id = `case-${String(caseIndex++).padStart(3, '0')}`;
            const makler = MAKLER[maklerIndex % MAKLER.length];
            const sparte = SPARTEN[sparteIndex % SPARTEN.length];
            const kunde = generateName();
            const vsNr = generateVsNr();

            const createdAt = randomDate(daysAgo);
            const updatedAt = randomDate(daysUpdated);

            // Workflow-Daten basierend auf Status generieren
            const workflow = generateWorkflow(status, daysAgo, daysUpdated);

            return {
                id,
                createdAt,
                updatedAt,
                kunde: { name: kunde, source: "auto", confidence: 0.95 },
                versicherungsnummer: { value: vsNr, source: "auto", confidence: 0.98 },
                gueltigkeitsdatum: { value: "01.01.2026", source: "auto", confidence: 0.9 },
                status,
                sparte,
                makler,
                notes: "",
                workflow,
                conversationIds: [`conv-${id}`],
                messageIds: [`msg-${id}-a`],
                messages: [
                    {
                        entryID: `msg-${id}-a`,
                        folder: "sent",
                        subject: `Bestandsübertragung ${kunde.split(',')[0]} ${sparte} - ${vsNr}`,
                        senderEmail: makler.email,
                        receivedTime: createdAt,
                        bodyPlain: `Sehr geehrte Damen und Herren,\n\nhiermit beantragen wir die Bestandsübertragung für den Kunden ${kunde}.\n\nVS-Nr: ${vsNr}\nSparte: ${sparte}\nGültig ab: 01.01.2026\n\nDie Maklervollmacht liegt vor.\n\nMit freundlichen Grüßen\n${makler.name}`
                    }
                ],
                statusHistory: [
                    { date: createdAt.split('T')[0], from: null, to: status === 'neu' ? 'neu' : 'angefragt', note: "Anfrage erstellt" }
                ]
            };
        }

        /**
         * Workflow-Daten basierend auf Status generieren
         */
        function generateWorkflow(status, daysAgo, daysUpdated) {
            const workflow = {};

            // Mail erhalten - für alle außer 'neu' ohne Mails
            if (status !== 'neu') {
                workflow.mailReceived = randomDate(daysAgo);
            }

            // Mail hochgeladen - sobald verarbeitet
            if (['angefragt', 'in-bearbeitung', 'bestaetigt', 'abgelehnt'].includes(status)) {
                workflow.mailUploaded = randomDate(daysAgo - 1);
            }

            // Von KI erkannt - für angefragt und später
            if (['angefragt', 'in-bearbeitung', 'bestaetigt', 'abgelehnt'].includes(status)) {
                workflow.kiRecognized = randomDate(daysAgo - 1);
            }

            // Von PV validiert - für in-bearbeitung und später
            if (['in-bearbeitung', 'bestaetigt', 'abgelehnt'].includes(status)) {
                workflow.pvValidated = randomDate(daysUpdated + 2);
            }

            // Exportiert - nur für einige bestätigte/abgelehnte (ca. 30%)
            // Wird später für bestimmte Fälle gesetzt

            return workflow;
        }

        // ============================================
        // BESTÄTIGT (15 Vorgänge) - alte, abgeschlossene
        // ============================================
        for (let i = 0; i < 15; i++) {
            const c = createCase('bestaetigt', i, i, 60 + i * 3, 10 + i);
            c.statusHistory.push({ date: c.updatedAt.split('T')[0], from: 'angefragt', to: 'bestaetigt', note: 'Bestätigt durch ERGO' });
            c.messages.push({
                entryID: `msg-${c.id}-b`,
                folder: "inbox",
                subject: `AW: Bestandsübertragung ${c.kunde.name.split(',')[0]}`,
                senderEmail: "maklerservice@ergo.de",
                receivedTime: c.updatedAt,
                bodyPlain: `Sehr geehrte Damen und Herren,\n\ndie Bestandsübertragung für ${c.kunde.name} mit der VS-Nr. ${c.versicherungsnummer.value} wurde bestätigt.\n\nDie Übertragung wird zum ${c.gueltigkeitsdatum.value} wirksam.\n\nMit freundlichen Grüßen\nERGO Maklerservice`
            });

            // Einige als exportiert markieren (ca. 40%)
            if (i < 6) {
                const exportDate = randomDate(5 + i);
                c.exported = { date: exportDate, by: "Max Mustermann" };
                c.workflow.exported = exportDate;
            }

            cases[c.id] = c;
        }

        // ============================================
        // ABGELEHNT (8 Vorgänge)
        // ============================================
        for (let i = 0; i < 8; i++) {
            const c = createCase('abgelehnt', i + 2, i + 3, 50 + i * 4, 15 + i * 2);
            c.statusHistory.push({ date: c.updatedAt.split('T')[0], from: 'angefragt', to: 'abgelehnt', note: 'Abgelehnt - fehlende Vollmacht' });
            c.notes = "Vollmacht nicht eingereicht oder ungültig";
            c.messages.push({
                entryID: `msg-${c.id}-b`,
                folder: "inbox",
                subject: `AW: Bestandsübertragung ${c.kunde.name.split(',')[0]}`,
                senderEmail: "maklerservice@ergo.de",
                receivedTime: c.updatedAt,
                bodyPlain: `Sehr geehrte Damen und Herren,\n\nleider müssen wir die Bestandsübertragung für ${c.kunde.name} ablehnen.\n\nGrund: Die eingereichte Maklervollmacht ist nicht gültig oder liegt nicht vor.\n\nBitte reichen Sie eine gültige Vollmacht ein.\n\nMit freundlichen Grüßen\nERGO Maklerservice`
            });

            // Einige als exportiert markieren (ca. 25%)
            if (i < 2) {
                const exportDate = randomDate(10 + i);
                c.exported = { date: exportDate, by: "Lisa Schmidt" };
                c.workflow.exported = exportDate;
            }

            cases[c.id] = c;
        }

        // ============================================
        // NEU (10 Vorgänge) - gerade erst erstellt
        // ============================================
        for (let i = 0; i < 10; i++) {
            const c = createCase('neu', i + 1, i + 2, 3 + i, 3 + i);
            c.messages = []; // Noch keine E-Mails
            c.statusHistory = [{ date: c.createdAt.split('T')[0], from: null, to: 'neu', note: 'Manuell erstellt' }];
            cases[c.id] = c;
        }

        // ============================================
        // ANGEFRAGT (14 Vorgänge) - warten auf Antwort
        // ============================================
        for (let i = 0; i < 14; i++) {
            const c = createCase('angefragt', i + 3, i + 5, 20 + i * 2, 20 + i * 2);
            cases[c.id] = c;
        }

        // ============================================
        // IN BEARBEITUNG (3 Vorgänge) - selten
        // ============================================
        for (let i = 0; i < 3; i++) {
            const c = createCase('in-bearbeitung', i + 5, i + 7, 30 + i * 5, 5 + i);
            c.statusHistory.push({ date: c.updatedAt.split('T')[0], from: 'angefragt', to: 'in-bearbeitung', note: 'Wird geprüft' });
            c.messages.push({
                entryID: `msg-${c.id}-b`,
                folder: "inbox",
                subject: `AW: Bestandsübertragung ${c.kunde.name.split(',')[0]}`,
                senderEmail: "maklerservice@ergo.de",
                receivedTime: c.updatedAt,
                bodyPlain: "Ihre Anfrage wird derzeit geprüft."
            });
            cases[c.id] = c;
        }

        return cases;
    }

    /**
     * Demo-Daten laden (falls erster Start oder force=true)
     */
    function loadDemoData(force = false) {
        const settings = Storage.getSettings();

        if (!force && settings.demoLoaded) {
            return false;
        }

        // Generiere frische Demo-Daten
        const demoCases = generateDemoCases();

        // Speichern
        Storage.saveCases(demoCases);
        Storage.saveSettings({ demoLoaded: true });

        return true;
    }

    // Öffentliche API
    return {
        loadDemoData,
        MAKLER,
        SPARTEN
    };
})();
