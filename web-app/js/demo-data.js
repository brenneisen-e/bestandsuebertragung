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

            return {
                id,
                createdAt,
                updatedAt,
                kunde: { name: kunde, source: "manual" },
                versicherungsnummer: { value: vsNr, source: "auto" },
                gueltigkeitsdatum: { value: "01.01.2026", source: "auto" },
                status,
                sparte,
                makler,
                notes: "",
                conversationIds: [`conv-${id}`],
                messageIds: [`msg-${id}-a`],
                messages: [
                    {
                        entryID: `msg-${id}-a`,
                        folder: "sent",
                        subject: `Bestandsübertragung ${kunde.split(',')[0]} ${sparte} - ${vsNr}`,
                        senderEmail: makler.email,
                        receivedTime: createdAt,
                        bodyPlain: `Anfrage Bestandsübertragung für ${kunde}, VS-Nr. ${vsNr}.`
                    }
                ],
                statusHistory: [
                    { date: createdAt.split('T')[0], from: null, to: status === 'neu' ? 'neu' : 'angefragt', note: "Anfrage erstellt" }
                ]
            };
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
                bodyPlain: "Die Bestandsübertragung wurde bestätigt."
            });
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
                bodyPlain: "Leider müssen wir die Bestandsübertragung ablehnen. Die eingereichte Vollmacht ist nicht gültig."
            });
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
