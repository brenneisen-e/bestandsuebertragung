/**
 * Demo-Daten Modul - 20 realistische Beispiel-Vorgänge für Bestandsübertragung
 * Jeder Fall ist E2E durchdacht mit korrekten Schlagwörtern in den E-Mails
 */

const DemoData = (function() {
    'use strict';

    // 20 Einzelmakler (individuelle Versicherungsmakler)
    const MAKLER = [
        { name: "Thomas Meier", email: "t.meier@makler-meier.de" },
        { name: "Sandra Schmidt", email: "s.schmidt@schmidt-versicherungen.de" },
        { name: "Michael Hofmann", email: "m.hofmann@hofmann-makler.de" },
        { name: "Julia Wagner", email: "j.wagner@wagner-finanz.de" },
        { name: "Andreas Krause", email: "a.krause@krause-makler.de" },
        { name: "Petra Becker", email: "p.becker@becker-versicherung.de" },
        { name: "Frank Richter", email: "f.richter@richter-makler.de" },
        { name: "Claudia Wolf", email: "c.wolf@wolf-versicherungen.de" },
        { name: "Martin Neumann", email: "m.neumann@neumann-finanz.de" },
        { name: "Anna Schwarz", email: "a.schwarz@schwarz-makler.de" },
        { name: "Stefan Zimmermann", email: "s.zimmermann@zimmermann-versicherung.de" },
        { name: "Martina Koch", email: "m.koch@koch-makler.de" },
        { name: "Nicole Krüger", email: "n.krueger@krueger-finanz.de" },
        { name: "Daniel Hartmann", email: "d.hartmann@hartmann-makler.de" },
        { name: "Karin Schulz", email: "k.schulz@schulz-versicherungen.de" },
        { name: "Christian Bauer", email: "c.bauer@bauer-makler.de" },
        { name: "Susanne Lang", email: "s.lang@lang-finanz.de" },
        { name: "Markus Friedrich", email: "m.friedrich@friedrich-makler.de" },
        { name: "Elisabeth Vogt", email: "e.vogt@vogt-versicherung.de" },
        { name: "Robert Lehmann", email: "r.lehmann@lehmann-makler.de" }
    ];

    const SPARTEN = ["KFZ", "Leben", "Kranken", "Haftpflicht", "Hausrat", "Rechtsschutz", "Unfall", "BU", "Wohngebäude", "Rente"];

    /**
     * 20 konkrete Demo-Fälle generieren
     */
    function generateDemoCases() {
        const cases = {};
        const now = new Date();

        function daysAgo(days) {
            const date = new Date(now);
            date.setDate(date.getDate() - days);
            return date.toISOString();
        }

        function formatDateGerman(isoDate) {
            const d = new Date(isoDate);
            return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }

        // ============================================
        // FALL 1: Bestätigt & Exportiert - KFZ
        // ============================================
        cases['case-001'] = {
            id: 'case-001',
            createdAt: daysAgo(45),
            updatedAt: daysAgo(30),
            kunde: { name: "Müller, Hans", source: "auto", confidence: 0.98 },
            versicherungsnummer: { value: "ERG-7823456", source: "auto", confidence: 0.99 },
            gueltigkeitsdatum: { value: "01.01.2026", source: "auto", confidence: 0.95 },
            status: 'bestaetigt',
            sparte: 'KFZ',
            makler: MAKLER[0],
            notes: "",
            workflow: {
                mailReceived: daysAgo(45),
                mailUploaded: daysAgo(44),
                kiRecognized: daysAgo(44),
                pvValidated: daysAgo(35),
                exported: daysAgo(25)
            },
            exported: { date: daysAgo(25), by: "Max Mustermann" },
            messages: [
                {
                    entryID: 'msg-001-a',
                    folder: 'sent',
                    subject: 'Bestandsübertragung Müller KFZ - ERG-7823456',
                    senderEmail: MAKLER[0].email,
                    receivedTime: daysAgo(45),
                    bodyPlain: `Sehr geehrte Damen und Herren,

hiermit beantragen wir die Bestandsübertragung für unseren Kunden Hans Müller.

Versicherungsnummer: ERG-7823456
Sparte: KFZ
Gewünschter Übertragungstermin: 01.01.2026

Die unterschriebene Maklervollmacht liegt vor und ist diesem Schreiben beigefügt.

Mit freundlichen Grüßen
Thomas Meier
Versicherungsmakler`
                },
                {
                    entryID: 'msg-001-b',
                    folder: 'inbox',
                    subject: 'AW: Bestandsübertragung Müller KFZ - ERG-7823456',
                    senderEmail: 'maklerservice@ergo.de',
                    receivedTime: daysAgo(35),
                    bodyPlain: `Sehr geehrter Herr Meier,

wir bestätigen die Bestandsübertragung für den Vertrag ERG-7823456 des Kunden Hans Müller.

Die Übertragung wird zum 01.01.2026 wirksam. Ab diesem Datum sind Sie als betreuender Makler hinterlegt.

Mit freundlichen Grüßen
ERGO Maklerservice`
                }
            ],
            statusHistory: [
                { date: daysAgo(45).split('T')[0], from: null, to: 'angefragt', note: 'Anfrage erstellt' },
                { date: daysAgo(35).split('T')[0], from: 'angefragt', to: 'bestaetigt', note: 'Bestätigt durch ERGO' }
            ]
        };

        // ============================================
        // FALL 2: Bestätigt & Exportiert - Leben
        // ============================================
        cases['case-002'] = {
            id: 'case-002',
            createdAt: daysAgo(60),
            updatedAt: daysAgo(40),
            kunde: { name: "Weber, Christine", source: "auto", confidence: 0.97 },
            versicherungsnummer: { value: "ERG-4512378", source: "auto", confidence: 0.99 },
            gueltigkeitsdatum: { value: "01.02.2026", source: "auto", confidence: 0.92 },
            status: 'bestaetigt',
            sparte: 'Leben',
            makler: MAKLER[1],
            notes: "",
            workflow: {
                mailReceived: daysAgo(60),
                mailUploaded: daysAgo(59),
                kiRecognized: daysAgo(59),
                pvValidated: daysAgo(45),
                exported: daysAgo(30)
            },
            exported: { date: daysAgo(30), by: "Lisa Schmidt" },
            messages: [
                {
                    entryID: 'msg-002-a',
                    folder: 'sent',
                    subject: 'Antrag Bestandsübertragung Weber - Lebensversicherung',
                    senderEmail: MAKLER[1].email,
                    receivedTime: daysAgo(60),
                    bodyPlain: `Sehr geehrte Damen und Herren,

für unsere Kundin Christine Weber beantragen wir die Übertragung der Lebensversicherung.

Vertragsnummer: ERG-4512378
Übertragung zum: 01.02.2026

Vollmacht anbei.

Mit freundlichen Grüßen
Sandra Schmidt
Versicherungsmaklerin`
                },
                {
                    entryID: 'msg-002-b',
                    folder: 'inbox',
                    subject: 'AW: Antrag Bestandsübertragung Weber',
                    senderEmail: 'maklerservice@ergo.de',
                    receivedTime: daysAgo(45),
                    bodyPlain: `Sehr geehrte Frau Schmidt,

die Bestandsübertragung für Christine Weber, Vertrag ERG-4512378, wurde genehmigt.

Wirksamkeitsdatum: 01.02.2026

Mit freundlichen Grüßen
ERGO Maklerservice`
                }
            ],
            statusHistory: [
                { date: daysAgo(60).split('T')[0], from: null, to: 'angefragt', note: 'Anfrage erstellt' },
                { date: daysAgo(45).split('T')[0], from: 'angefragt', to: 'bestaetigt', note: 'Bestätigt durch ERGO' }
            ]
        };

        // ============================================
        // FALL 3: Bestätigt - nicht exportiert - Hausrat
        // ============================================
        cases['case-003'] = {
            id: 'case-003',
            createdAt: daysAgo(25),
            updatedAt: daysAgo(10),
            kunde: { name: "Fischer, Maria", source: "auto", confidence: 0.96 },
            versicherungsnummer: { value: "ERG-9087654", source: "auto", confidence: 0.98 },
            gueltigkeitsdatum: { value: "15.01.2026", source: "auto", confidence: 0.90 },
            status: 'bestaetigt',
            sparte: 'Hausrat',
            makler: MAKLER[2],
            notes: "",
            workflow: {
                mailReceived: daysAgo(25),
                mailUploaded: daysAgo(24),
                kiRecognized: daysAgo(24),
                pvValidated: daysAgo(12)
            },
            messages: [
                {
                    entryID: 'msg-003-a',
                    folder: 'sent',
                    subject: 'Bestandsübertragung Fischer Hausrat ERG-9087654',
                    senderEmail: MAKLER[2].email,
                    receivedTime: daysAgo(25),
                    bodyPlain: `Guten Tag,

bitte übertragen Sie den Hausratvertrag ERG-9087654 der Kundin Maria Fischer in unseren Bestand.

Gewünschter Termin: 15.01.2026

Maklervollmacht liegt bei.

Freundliche Grüße
Michael Hofmann
Versicherungsmakler`
                },
                {
                    entryID: 'msg-003-b',
                    folder: 'inbox',
                    subject: 'Bestätigung Bestandsübertragung Fischer',
                    senderEmail: 'maklerservice@ergo.de',
                    receivedTime: daysAgo(12),
                    bodyPlain: `Sehr geehrter Herr Hofmann,

die Bestandsübertragung für Maria Fischer (ERG-9087654) wurde durchgeführt.

Wirksam ab: 15.01.2026

Mit freundlichen Grüßen
ERGO Maklerservice`
                }
            ],
            statusHistory: [
                { date: daysAgo(25).split('T')[0], from: null, to: 'angefragt', note: 'Anfrage erstellt' },
                { date: daysAgo(12).split('T')[0], from: 'angefragt', to: 'bestaetigt', note: 'Bestätigt durch ERGO' }
            ]
        };

        // ============================================
        // FALL 4: Abgelehnt & Exportiert - Kranken
        // ============================================
        cases['case-004'] = {
            id: 'case-004',
            createdAt: daysAgo(50),
            updatedAt: daysAgo(35),
            kunde: { name: "Schneider, Peter", source: "auto", confidence: 0.94 },
            versicherungsnummer: { value: "ERG-3345678", source: "auto", confidence: 0.97 },
            gueltigkeitsdatum: { value: "01.03.2026", source: "auto", confidence: 0.88 },
            status: 'abgelehnt',
            sparte: 'Kranken',
            makler: MAKLER[3],
            notes: "Vollmacht fehlerhaft - falsches Datum",
            workflow: {
                mailReceived: daysAgo(50),
                mailUploaded: daysAgo(49),
                kiRecognized: daysAgo(49),
                pvValidated: daysAgo(38),
                exported: daysAgo(20)
            },
            exported: { date: daysAgo(20), by: "Max Mustermann" },
            messages: [
                {
                    entryID: 'msg-004-a',
                    folder: 'sent',
                    subject: 'Übertragungsantrag Schneider Krankenversicherung',
                    senderEmail: MAKLER[3].email,
                    receivedTime: daysAgo(50),
                    bodyPlain: `Sehr geehrte Damen und Herren,

hiermit beantrage ich die Bestandsübertragung für Peter Schneider.

VS-Nr: ERG-3345678
Sparte: Kranken
Übertragung zum: 01.03.2026

Vollmacht anbei.

Julia Wagner
Versicherungsmaklerin`
                },
                {
                    entryID: 'msg-004-b',
                    folder: 'inbox',
                    subject: 'Ablehnung Bestandsübertragung Schneider',
                    senderEmail: 'maklerservice@ergo.de',
                    receivedTime: daysAgo(38),
                    bodyPlain: `Sehr geehrte Frau Wagner,

leider müssen wir die Bestandsübertragung für Peter Schneider, Vertrag ERG-3345678, ablehnen.

Grund: Die eingereichte Maklervollmacht ist auf ein falsches Datum ausgestellt und daher ungültig.

Bitte reichen Sie eine korrigierte Vollmacht ein.

Mit freundlichen Grüßen
ERGO Maklerservice`
                }
            ],
            statusHistory: [
                { date: daysAgo(50).split('T')[0], from: null, to: 'angefragt', note: 'Anfrage erstellt' },
                { date: daysAgo(38).split('T')[0], from: 'angefragt', to: 'abgelehnt', note: 'Abgelehnt - Vollmacht fehlerhaft' }
            ]
        };

        // ============================================
        // FALL 5: Abgelehnt - nicht exportiert - Haftpflicht
        // ============================================
        cases['case-005'] = {
            id: 'case-005',
            createdAt: daysAgo(20),
            updatedAt: daysAgo(8),
            kunde: { name: "Braun, Sabine", source: "auto", confidence: 0.95 },
            versicherungsnummer: { value: "ERG-6654321", source: "auto", confidence: 0.99 },
            gueltigkeitsdatum: { value: "01.04.2026", source: "auto", confidence: 0.91 },
            status: 'abgelehnt',
            sparte: 'Haftpflicht',
            makler: MAKLER[4],
            notes: "Keine Vollmacht eingereicht",
            workflow: {
                mailReceived: daysAgo(20),
                mailUploaded: daysAgo(19),
                kiRecognized: daysAgo(19),
                pvValidated: daysAgo(10)
            },
            messages: [
                {
                    entryID: 'msg-005-a',
                    folder: 'sent',
                    subject: 'Bestandsübertragung Braun Haftpflicht',
                    senderEmail: MAKLER[4].email,
                    receivedTime: daysAgo(20),
                    bodyPlain: `Sehr geehrte Damen und Herren,

für die Kundin Sabine Braun beantragen wir die Übertragung der Haftpflichtversicherung ERG-6654321.

Übertragungsdatum: 01.04.2026

Vollmacht folgt per Post.

Mit freundlichen Grüßen
Andreas Krause
Versicherungsmakler`
                },
                {
                    entryID: 'msg-005-b',
                    folder: 'inbox',
                    subject: 'AW: Bestandsübertragung Braun - Ablehnung',
                    senderEmail: 'maklerservice@ergo.de',
                    receivedTime: daysAgo(10),
                    bodyPlain: `Sehr geehrter Herr Krause,

die Bestandsübertragung für Sabine Braun (ERG-6654321) kann nicht durchgeführt werden.

Grund: Es liegt keine unterschriebene Maklervollmacht vor.

Bitte reichen Sie die Vollmacht nach.

Mit freundlichen Grüßen
ERGO Maklerservice`
                }
            ],
            statusHistory: [
                { date: daysAgo(20).split('T')[0], from: null, to: 'angefragt', note: 'Anfrage erstellt' },
                { date: daysAgo(10).split('T')[0], from: 'angefragt', to: 'abgelehnt', note: 'Abgelehnt - keine Vollmacht' }
            ]
        };

        // ============================================
        // FALL 6: In Bearbeitung - Rechtsschutz
        // ============================================
        cases['case-006'] = {
            id: 'case-006',
            createdAt: daysAgo(15),
            updatedAt: daysAgo(5),
            kunde: { name: "Klein, Thomas", source: "auto", confidence: 0.97 },
            versicherungsnummer: { value: "ERG-2234567", source: "auto", confidence: 0.98 },
            gueltigkeitsdatum: { value: "01.02.2026", source: "auto", confidence: 0.93 },
            status: 'in-bearbeitung',
            sparte: 'Rechtsschutz',
            makler: MAKLER[5],
            notes: "Rückfrage zu Vollmachtsdatum",
            workflow: {
                mailReceived: daysAgo(15),
                mailUploaded: daysAgo(14),
                kiRecognized: daysAgo(14),
                pvValidated: daysAgo(7)
            },
            messages: [
                {
                    entryID: 'msg-006-a',
                    folder: 'sent',
                    subject: 'Bestandsübertragung Klein Rechtsschutz ERG-2234567',
                    senderEmail: MAKLER[5].email,
                    receivedTime: daysAgo(15),
                    bodyPlain: `Sehr geehrte Damen und Herren,

wir beantragen die Bestandsübertragung für Thomas Klein.

Vertrag: ERG-2234567
Sparte: Rechtsschutz
Wirksam ab: 01.02.2026

Vollmacht im Anhang.

Petra Becker
Versicherungsmaklerin`
                },
                {
                    entryID: 'msg-006-b',
                    folder: 'inbox',
                    subject: 'Rückfrage zu Bestandsübertragung Klein',
                    senderEmail: 'maklerservice@ergo.de',
                    receivedTime: daysAgo(7),
                    bodyPlain: `Sehr geehrte Frau Becker,

zu Ihrem Antrag für Thomas Klein, Vertrag ERG-2234567, haben wir eine Rückfrage:

Das Vollmachtsdatum liegt vor dem Vertragsbeginn. Bitte bestätigen Sie, dass dies korrekt ist.

Mit freundlichen Grüßen
ERGO Maklerservice`
                }
            ],
            statusHistory: [
                { date: daysAgo(15).split('T')[0], from: null, to: 'angefragt', note: 'Anfrage erstellt' },
                { date: daysAgo(7).split('T')[0], from: 'angefragt', to: 'in-bearbeitung', note: 'Rückfrage ERGO' }
            ]
        };

        // ============================================
        // FALL 7: Angefragt - BU
        // ============================================
        cases['case-007'] = {
            id: 'case-007',
            createdAt: daysAgo(10),
            updatedAt: daysAgo(10),
            kunde: { name: "Hoffmann, Laura", source: "auto", confidence: 0.96 },
            versicherungsnummer: { value: "ERG-8876543", source: "auto", confidence: 0.99 },
            gueltigkeitsdatum: { value: "01.05.2026", source: "auto", confidence: 0.94 },
            status: 'angefragt',
            sparte: 'BU',
            makler: MAKLER[6],
            notes: "",
            workflow: {
                mailReceived: daysAgo(10),
                mailUploaded: daysAgo(9),
                kiRecognized: daysAgo(9)
            },
            messages: [
                {
                    entryID: 'msg-007-a',
                    folder: 'sent',
                    subject: 'Bestandsübertragung Hoffmann BU-Versicherung',
                    senderEmail: MAKLER[6].email,
                    receivedTime: daysAgo(10),
                    bodyPlain: `Sehr geehrte Damen und Herren,

ich beantrage die Bestandsübertragung für Laura Hoffmann.

VS-Nr: ERG-8876543
Sparte: Berufsunfähigkeit
Übertragung zum: 01.05.2026

Maklervollmacht liegt bei.

Mit freundlichen Grüßen
Frank Richter
Versicherungsmakler`
                }
            ],
            statusHistory: [
                { date: daysAgo(10).split('T')[0], from: null, to: 'angefragt', note: 'Anfrage erstellt' }
            ]
        };

        // ============================================
        // FALL 8: Angefragt - Wohngebäude
        // ============================================
        cases['case-008'] = {
            id: 'case-008',
            createdAt: daysAgo(8),
            updatedAt: daysAgo(8),
            kunde: { name: "Berger, Thorsten", source: "auto", confidence: 0.98 },
            versicherungsnummer: { value: "ERG-1123456", source: "auto", confidence: 0.97 },
            gueltigkeitsdatum: { value: "01.03.2026", source: "auto", confidence: 0.92 },
            status: 'angefragt',
            sparte: 'Wohngebäude',
            makler: MAKLER[7],
            notes: "",
            workflow: {
                mailReceived: daysAgo(8),
                mailUploaded: daysAgo(7),
                kiRecognized: daysAgo(7)
            },
            messages: [
                {
                    entryID: 'msg-008-a',
                    folder: 'sent',
                    subject: 'Übertragung Wohngebäudeversicherung Berger',
                    senderEmail: MAKLER[7].email,
                    receivedTime: daysAgo(8),
                    bodyPlain: `Guten Tag,

für meinen Kunden Thorsten Berger beantrage ich die Übertragung der Wohngebäudeversicherung.

Vertragsnummer: ERG-1123456
Gewünschtes Übertragungsdatum: 01.03.2026

Vollmacht anbei.

Claudia Wolf
Versicherungsmaklerin`
                }
            ],
            statusHistory: [
                { date: daysAgo(8).split('T')[0], from: null, to: 'angefragt', note: 'Anfrage erstellt' }
            ]
        };

        // ============================================
        // FALL 9: Angefragt - Unfall
        // ============================================
        cases['case-009'] = {
            id: 'case-009',
            createdAt: daysAgo(6),
            updatedAt: daysAgo(6),
            kunde: { name: "Lorenz, Simone", source: "auto", confidence: 0.95 },
            versicherungsnummer: { value: "ERG-5543210", source: "auto", confidence: 0.98 },
            gueltigkeitsdatum: { value: "15.02.2026", source: "auto", confidence: 0.90 },
            status: 'angefragt',
            sparte: 'Unfall',
            makler: MAKLER[8],
            notes: "",
            workflow: {
                mailReceived: daysAgo(6),
                mailUploaded: daysAgo(5),
                kiRecognized: daysAgo(5)
            },
            messages: [
                {
                    entryID: 'msg-009-a',
                    folder: 'sent',
                    subject: 'Bestandsübertragung Lorenz Unfallversicherung',
                    senderEmail: MAKLER[8].email,
                    receivedTime: daysAgo(6),
                    bodyPlain: `Sehr geehrte Damen und Herren,

ich beantrage die Übertragung der Unfallversicherung für Simone Lorenz.

Versicherungsnummer: ERG-5543210
Übertragung zum: 15.02.2026

Maklervollmacht im Anhang.

Martin Neumann
Versicherungsmakler`
                }
            ],
            statusHistory: [
                { date: daysAgo(6).split('T')[0], from: null, to: 'angefragt', note: 'Anfrage erstellt' }
            ]
        };

        // ============================================
        // FALL 10: Angefragt - Rente
        // ============================================
        cases['case-010'] = {
            id: 'case-010',
            createdAt: daysAgo(5),
            updatedAt: daysAgo(5),
            kunde: { name: "Werner, Patrick", source: "auto", confidence: 0.97 },
            versicherungsnummer: { value: "ERG-7765432", source: "auto", confidence: 0.99 },
            gueltigkeitsdatum: { value: "01.04.2026", source: "auto", confidence: 0.93 },
            status: 'angefragt',
            sparte: 'Rente',
            makler: MAKLER[9],
            notes: "",
            workflow: {
                mailReceived: daysAgo(5),
                mailUploaded: daysAgo(4),
                kiRecognized: daysAgo(4)
            },
            messages: [
                {
                    entryID: 'msg-010-a',
                    folder: 'sent',
                    subject: 'Antrag Bestandsübertragung Werner Rentenversicherung',
                    senderEmail: MAKLER[9].email,
                    receivedTime: daysAgo(5),
                    bodyPlain: `Sehr geehrte Damen und Herren,

hiermit beantrage ich die Bestandsübertragung für Patrick Werner.

VS-Nr: ERG-7765432
Produkt: Rentenversicherung
Übertragungstermin: 01.04.2026

Die Vollmacht ist beigefügt.

Anna Schwarz
Versicherungsmaklerin`
                }
            ],
            statusHistory: [
                { date: daysAgo(5).split('T')[0], from: null, to: 'angefragt', note: 'Anfrage erstellt' }
            ]
        };

        // ============================================
        // FALL 11: Neu - KFZ (noch nicht versendet)
        // ============================================
        cases['case-011'] = {
            id: 'case-011',
            createdAt: daysAgo(2),
            updatedAt: daysAgo(2),
            kunde: { name: "Franke, Birgit", source: "manual", confidence: 1.0 },
            versicherungsnummer: { value: "ERG-4432109", source: "manual", confidence: 1.0 },
            gueltigkeitsdatum: { value: "01.06.2026", source: "manual", confidence: 1.0 },
            status: 'neu',
            sparte: 'KFZ',
            makler: MAKLER[10],
            notes: "Kunde muss Vollmacht noch unterschreiben",
            workflow: {},
            messages: [],
            statusHistory: [
                { date: daysAgo(2).split('T')[0], from: null, to: 'neu', note: 'Manuell erstellt' }
            ]
        };

        // ============================================
        // FALL 12: Neu - Leben
        // ============================================
        cases['case-012'] = {
            id: 'case-012',
            createdAt: daysAgo(1),
            updatedAt: daysAgo(1),
            kunde: { name: "Seidel, Ralf", source: "manual", confidence: 1.0 },
            versicherungsnummer: { value: "ERG-9912345", source: "manual", confidence: 1.0 },
            gueltigkeitsdatum: { value: "01.07.2026", source: "manual", confidence: 1.0 },
            status: 'neu',
            sparte: 'Leben',
            makler: MAKLER[11],
            notes: "",
            workflow: {},
            messages: [],
            statusHistory: [
                { date: daysAgo(1).split('T')[0], from: null, to: 'neu', note: 'Manuell erstellt' }
            ]
        };

        // ============================================
        // FALL 13: Bestätigt - Kranken
        // ============================================
        cases['case-013'] = {
            id: 'case-013',
            createdAt: daysAgo(35),
            updatedAt: daysAgo(18),
            kunde: { name: "Koch, Martina", source: "auto", confidence: 0.96 },
            versicherungsnummer: { value: "ERG-6678901", source: "auto", confidence: 0.98 },
            gueltigkeitsdatum: { value: "01.01.2026", source: "auto", confidence: 0.95 },
            status: 'bestaetigt',
            sparte: 'Kranken',
            makler: MAKLER[12],
            notes: "",
            workflow: {
                mailReceived: daysAgo(35),
                mailUploaded: daysAgo(34),
                kiRecognized: daysAgo(34),
                pvValidated: daysAgo(22)
            },
            messages: [
                {
                    entryID: 'msg-013-a',
                    folder: 'sent',
                    subject: 'Übertragung Krankenversicherung Koch',
                    senderEmail: MAKLER[12].email,
                    receivedTime: daysAgo(35),
                    bodyPlain: `Sehr geehrte Damen und Herren,

bitte übertragen Sie die Krankenversicherung ERG-6678901 von Martina Koch in meinen Bestand.

Gewünschter Termin: 01.01.2026

Vollmacht anbei.

Martina Koch
Versicherungsmaklerin`
                },
                {
                    entryID: 'msg-013-b',
                    folder: 'inbox',
                    subject: 'Bestätigung: Übertragung Koch',
                    senderEmail: 'maklerservice@ergo.de',
                    receivedTime: daysAgo(22),
                    bodyPlain: `Sehr geehrte Frau Koch,

die Bestandsübertragung für Martina Koch (ERG-6678901) wurde bestätigt.

Wirksam ab 01.01.2026.

ERGO Maklerservice`
                }
            ],
            statusHistory: [
                { date: daysAgo(35).split('T')[0], from: null, to: 'angefragt', note: 'Anfrage erstellt' },
                { date: daysAgo(22).split('T')[0], from: 'angefragt', to: 'bestaetigt', note: 'Bestätigt durch ERGO' }
            ]
        };

        // ============================================
        // FALL 14: Angefragt - KFZ
        // ============================================
        cases['case-014'] = {
            id: 'case-014',
            createdAt: daysAgo(4),
            updatedAt: daysAgo(4),
            kunde: { name: "Krüger, Nicole", source: "auto", confidence: 0.94 },
            versicherungsnummer: { value: "ERG-3321098", source: "auto", confidence: 0.97 },
            gueltigkeitsdatum: { value: "01.03.2026", source: "auto", confidence: 0.91 },
            status: 'angefragt',
            sparte: 'KFZ',
            makler: MAKLER[13],
            notes: "",
            workflow: {
                mailReceived: daysAgo(4),
                mailUploaded: daysAgo(3),
                kiRecognized: daysAgo(3)
            },
            messages: [
                {
                    entryID: 'msg-014-a',
                    folder: 'sent',
                    subject: 'Bestandsübertragung KFZ Krüger ERG-3321098',
                    senderEmail: MAKLER[13].email,
                    receivedTime: daysAgo(4),
                    bodyPlain: `Guten Tag,

ich beantrage die Übertragung des KFZ-Vertrags ERG-3321098 für Nicole Krüger.

Übertragung zum 01.03.2026.

Vollmacht im Anhang.

Daniel Hartmann
Versicherungsmakler`
                }
            ],
            statusHistory: [
                { date: daysAgo(4).split('T')[0], from: null, to: 'angefragt', note: 'Anfrage erstellt' }
            ]
        };

        // ============================================
        // FALL 15: In Bearbeitung - Hausrat
        // ============================================
        cases['case-015'] = {
            id: 'case-015',
            createdAt: daysAgo(18),
            updatedAt: daysAgo(6),
            kunde: { name: "Roth, Alexander", source: "auto", confidence: 0.97 },
            versicherungsnummer: { value: "ERG-2210987", source: "auto", confidence: 0.99 },
            gueltigkeitsdatum: { value: "15.01.2026", source: "auto", confidence: 0.94 },
            status: 'in-bearbeitung',
            sparte: 'Hausrat',
            makler: MAKLER[14],
            notes: "Prüfung der Vollmacht läuft",
            workflow: {
                mailReceived: daysAgo(18),
                mailUploaded: daysAgo(17),
                kiRecognized: daysAgo(17),
                pvValidated: daysAgo(8)
            },
            messages: [
                {
                    entryID: 'msg-015-a',
                    folder: 'sent',
                    subject: 'Antrag Bestandsübertragung Roth',
                    senderEmail: MAKLER[14].email,
                    receivedTime: daysAgo(18),
                    bodyPlain: `Sehr geehrte Damen und Herren,

für Alexander Roth beantrage ich die Übertragung der Hausratversicherung.

Vertrag: ERG-2210987
Datum: 15.01.2026

Vollmacht liegt bei.

Karin Schulz
Versicherungsmaklerin`
                },
                {
                    entryID: 'msg-015-b',
                    folder: 'inbox',
                    subject: 'Bearbeitung Bestandsübertragung Roth',
                    senderEmail: 'maklerservice@ergo.de',
                    receivedTime: daysAgo(8),
                    bodyPlain: `Sehr geehrte Frau Schulz,

Ihr Antrag für Alexander Roth (ERG-2210987) wird derzeit geprüft.

Wir melden uns bei Rückfragen.

ERGO Maklerservice`
                }
            ],
            statusHistory: [
                { date: daysAgo(18).split('T')[0], from: null, to: 'angefragt', note: 'Anfrage erstellt' },
                { date: daysAgo(8).split('T')[0], from: 'angefragt', to: 'in-bearbeitung', note: 'In Prüfung' }
            ]
        };

        // ============================================
        // FALL 16: Bestätigt - Haftpflicht
        // ============================================
        cases['case-016'] = {
            id: 'case-016',
            createdAt: daysAgo(40),
            updatedAt: daysAgo(25),
            kunde: { name: "Schenk, Oliver", source: "auto", confidence: 0.98 },
            versicherungsnummer: { value: "ERG-8809876", source: "auto", confidence: 0.99 },
            gueltigkeitsdatum: { value: "01.12.2025", source: "auto", confidence: 0.96 },
            status: 'bestaetigt',
            sparte: 'Haftpflicht',
            makler: MAKLER[15],
            notes: "",
            workflow: {
                mailReceived: daysAgo(40),
                mailUploaded: daysAgo(39),
                kiRecognized: daysAgo(39),
                pvValidated: daysAgo(28),
                exported: daysAgo(15)
            },
            exported: { date: daysAgo(15), by: "Lisa Schmidt" },
            messages: [
                {
                    entryID: 'msg-016-a',
                    folder: 'sent',
                    subject: 'Übertragung Haftpflicht Schenk',
                    senderEmail: MAKLER[15].email,
                    receivedTime: daysAgo(40),
                    bodyPlain: `Sehr geehrte Damen und Herren,

ich beantrage die Bestandsübertragung für Oliver Schenk.

VS-Nr: ERG-8809876
Sparte: Haftpflicht
Übertragung: 01.12.2025

Vollmacht anbei.

Christian Bauer
Versicherungsmakler`
                },
                {
                    entryID: 'msg-016-b',
                    folder: 'inbox',
                    subject: 'AW: Übertragung Haftpflicht Schenk',
                    senderEmail: 'maklerservice@ergo.de',
                    receivedTime: daysAgo(28),
                    bodyPlain: `Sehr geehrter Herr Bauer,

die Bestandsübertragung für Oliver Schenk, Vertrag ERG-8809876, wurde genehmigt.

Wirksam ab: 01.12.2025

ERGO Maklerservice`
                }
            ],
            statusHistory: [
                { date: daysAgo(40).split('T')[0], from: null, to: 'angefragt', note: 'Anfrage erstellt' },
                { date: daysAgo(28).split('T')[0], from: 'angefragt', to: 'bestaetigt', note: 'Bestätigt durch ERGO' }
            ]
        };

        // ============================================
        // FALL 17: Angefragt - Leben
        // ============================================
        cases['case-017'] = {
            id: 'case-017',
            createdAt: daysAgo(3),
            updatedAt: daysAgo(3),
            kunde: { name: "Bauer, Christian", source: "auto", confidence: 0.95 },
            versicherungsnummer: { value: "ERG-1198765", source: "auto", confidence: 0.98 },
            gueltigkeitsdatum: { value: "01.05.2026", source: "auto", confidence: 0.92 },
            status: 'angefragt',
            sparte: 'Leben',
            makler: MAKLER[16],
            notes: "",
            workflow: {
                mailReceived: daysAgo(3),
                mailUploaded: daysAgo(2),
                kiRecognized: daysAgo(2)
            },
            messages: [
                {
                    entryID: 'msg-017-a',
                    folder: 'sent',
                    subject: 'Bestandsübertragung Bauer Lebensversicherung',
                    senderEmail: MAKLER[16].email,
                    receivedTime: daysAgo(3),
                    bodyPlain: `Sehr geehrte Damen und Herren,

ich beantrage die Übertragung der Lebensversicherung ERG-1198765 für Christian Bauer.

Termin: 01.05.2026

Maklervollmacht anbei.

Susanne Lang
Versicherungsmaklerin`
                }
            ],
            statusHistory: [
                { date: daysAgo(3).split('T')[0], from: null, to: 'angefragt', note: 'Anfrage erstellt' }
            ]
        };

        // ============================================
        // FALL 18: Abgelehnt - Unfall
        // ============================================
        cases['case-018'] = {
            id: 'case-018',
            createdAt: daysAgo(30),
            updatedAt: daysAgo(15),
            kunde: { name: "Kraft, Melanie", source: "auto", confidence: 0.93 },
            versicherungsnummer: { value: "ERG-4487654", source: "auto", confidence: 0.96 },
            gueltigkeitsdatum: { value: "01.02.2026", source: "auto", confidence: 0.89 },
            status: 'abgelehnt',
            sparte: 'Unfall',
            makler: MAKLER[17],
            notes: "Kunde hat Übertragung widerrufen",
            workflow: {
                mailReceived: daysAgo(30),
                mailUploaded: daysAgo(29),
                kiRecognized: daysAgo(29),
                pvValidated: daysAgo(18)
            },
            messages: [
                {
                    entryID: 'msg-018-a',
                    folder: 'sent',
                    subject: 'Übertragungsantrag Kraft Unfallversicherung',
                    senderEmail: MAKLER[17].email,
                    receivedTime: daysAgo(30),
                    bodyPlain: `Sehr geehrte Damen und Herren,

für Melanie Kraft beantrage ich die Übertragung der Unfallversicherung.

VS-Nr: ERG-4487654
Termin: 01.02.2026

Vollmacht liegt bei.

Markus Friedrich
Versicherungsmakler`
                },
                {
                    entryID: 'msg-018-b',
                    folder: 'inbox',
                    subject: 'Stornierung Bestandsübertragung Kraft',
                    senderEmail: 'maklerservice@ergo.de',
                    receivedTime: daysAgo(18),
                    bodyPlain: `Sehr geehrter Herr Friedrich,

die Bestandsübertragung für Melanie Kraft (ERG-4487654) wurde auf Wunsch der Kundin storniert.

Die Kundin hat ihre Maklervollmacht widerrufen.

ERGO Maklerservice`
                }
            ],
            statusHistory: [
                { date: daysAgo(30).split('T')[0], from: null, to: 'angefragt', note: 'Anfrage erstellt' },
                { date: daysAgo(18).split('T')[0], from: 'angefragt', to: 'abgelehnt', note: 'Storniert durch Kunde' }
            ]
        };

        // ============================================
        // FALL 19: Neu - Rechtsschutz
        // ============================================
        cases['case-019'] = {
            id: 'case-019',
            createdAt: daysAgo(1),
            updatedAt: daysAgo(1),
            kunde: { name: "Engel, Tanja", source: "manual", confidence: 1.0 },
            versicherungsnummer: { value: "ERG-7776543", source: "manual", confidence: 1.0 },
            gueltigkeitsdatum: { value: "01.08.2026", source: "manual", confidence: 1.0 },
            status: 'neu',
            sparte: 'Rechtsschutz',
            makler: MAKLER[18],
            notes: "Vollmacht wird per Post erwartet",
            workflow: {},
            messages: [],
            statusHistory: [
                { date: daysAgo(1).split('T')[0], from: null, to: 'neu', note: 'Manuell erstellt' }
            ]
        };

        // ============================================
        // FALL 20: Angefragt - Wohngebäude
        // ============================================
        cases['case-020'] = {
            id: 'case-020',
            createdAt: daysAgo(7),
            updatedAt: daysAgo(7),
            kunde: { name: "Vogt, Elisabeth", source: "auto", confidence: 0.96 },
            versicherungsnummer: { value: "ERG-5565432", source: "auto", confidence: 0.99 },
            gueltigkeitsdatum: { value: "01.04.2026", source: "auto", confidence: 0.93 },
            status: 'angefragt',
            sparte: 'Wohngebäude',
            makler: MAKLER[19],
            notes: "",
            workflow: {
                mailReceived: daysAgo(7),
                mailUploaded: daysAgo(6),
                kiRecognized: daysAgo(6)
            },
            messages: [
                {
                    entryID: 'msg-020-a',
                    folder: 'sent',
                    subject: 'Antrag Bestandsübertragung Vogt Wohngebäude',
                    senderEmail: MAKLER[19].email,
                    receivedTime: daysAgo(7),
                    bodyPlain: `Sehr geehrte Damen und Herren,

hiermit beantrage ich die Übertragung der Wohngebäudeversicherung für Elisabeth Vogt.

Vertragsnummer: ERG-5565432
Übertragung zum: 01.04.2026

Die Maklervollmacht ist beigefügt.

Mit freundlichen Grüßen
Robert Lehmann
Versicherungsmakler`
                }
            ],
            statusHistory: [
                { date: daysAgo(7).split('T')[0], from: null, to: 'angefragt', note: 'Anfrage erstellt' }
            ]
        };

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
