/**
 * Demo-Daten Modul - 50 Beispiel-Vorgänge für Bestandsübertragung
 * Wird beim ersten Start automatisch geladen
 */

const DemoData = (function() {
    'use strict';

    // 50 Demo-Vorgänge
    const DEMO_CASES = {
        // ============================================
        // BESTÄTIGT (15 Vorgänge: case-001 bis case-015)
        // ============================================
        "case-001": {
            id: "case-001",
            createdAt: "2025-11-01T09:00:00Z",
            updatedAt: "2025-11-15T14:30:00Z",
            kunde: { name: "Müller, Thomas", confidence: 1.0, source: "manual" },
            versicherungsnummer: { value: "ERG-7834521", confidence: 1.0, source: "auto" },
            versicherer: { name: "ERGO", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: { value: "01.01.2026", confidence: 0.95, source: "auto" },
            status: "bestaetigt",
            sparte: "KFZ",
            notes: "",
            flagged: false,
            conversationIds: ["conv-001"],
            messageIds: ["msg-001-a", "msg-001-b", "msg-001-c"],
            messages: [
                {
                    entryID: "msg-001-a",
                    folder: "sent",
                    subject: "Bestandsübertragung Müller, Thomas - ERG-7834521",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-11-01T09:00:00Z",
                    bodyPlain: "Sehr geehrte Damen und Herren,\n\nhiermit beantrage ich die Übertragung des KFZ-Vertrags mit der VS-Nr. ERG-7834521 für meinen Kunden Herrn Thomas Müller in meinen Bestand.\n\nMit freundlichen Grüßen"
                },
                {
                    entryID: "msg-001-b",
                    folder: "inbox",
                    subject: "AW: Bestandsübertragung Müller, Thomas - ERG-7834521",
                    senderEmail: "maklerservice@ergo.de",
                    receivedTime: "2025-11-05T11:20:00Z",
                    bodyPlain: "Sehr geehrter Makler,\n\nIhre Anfrage zur Bestandsübertragung ist eingegangen und wird geprüft.\n\nMit freundlichen Grüßen\nERGO Maklerservice"
                },
                {
                    entryID: "msg-001-c",
                    folder: "inbox",
                    subject: "AW: Bestandsübertragung Müller, Thomas - ERG-7834521",
                    senderEmail: "maklerservice@ergo.de",
                    receivedTime: "2025-11-15T14:30:00Z",
                    bodyPlain: "Sehr geehrter Makler,\n\ndie Bestandsübertragung wurde bestätigt. Der Vertrag wird zum 01.01.2026 in Ihren Bestand übertragen.\n\nMit freundlichen Grüßen\nERGO Maklerservice"
                }
            ],
            statusHistory: [
                { date: "2025-11-01", from: null, to: "angefragt", note: "Anfrage gesendet" },
                { date: "2025-11-05", from: "angefragt", to: "in-bearbeitung", note: "Bestätigung eingegangen" },
                { date: "2025-11-15", from: "in-bearbeitung", to: "bestaetigt", note: "Übertragung bestätigt" }
            ]
        },

        "case-002": {
            id: "case-002",
            createdAt: "2025-10-20T10:15:00Z",
            updatedAt: "2025-11-10T09:00:00Z",
            kunde: { name: "Schmidt, Anna", confidence: 1.0, source: "auto" },
            versicherungsnummer: { value: "HDI-98765432", confidence: 1.0, source: "auto" },
            versicherer: { name: "HDI", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: { value: "01.12.2025", confidence: 0.95, source: "auto" },
            status: "bestaetigt",
            sparte: "Haftpflicht",
            notes: "Privathaftpflicht inkl. Hundehalter",
            flagged: false,
            conversationIds: ["conv-002"],
            messageIds: ["msg-002-a", "msg-002-b"],
            messages: [
                {
                    entryID: "msg-002-a",
                    folder: "sent",
                    subject: "Maklervollmacht Schmidt - Privathaftpflicht HDI-98765432",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-10-20T10:15:00Z",
                    bodyPlain: "Bestandsübertragung für Frau Anna Schmidt, Vertragsnummer HDI-98765432."
                },
                {
                    entryID: "msg-002-b",
                    folder: "inbox",
                    subject: "AW: Maklervollmacht Schmidt - Privathaftpflicht HDI-98765432",
                    senderEmail: "maklerbetreuung@hdi.de",
                    receivedTime: "2025-11-10T09:00:00Z",
                    bodyPlain: "Die Übertragung ist erfolgt. Wirksamkeit ab 01.12.2025."
                }
            ],
            statusHistory: [
                { date: "2025-10-20", from: null, to: "angefragt", note: "" },
                { date: "2025-11-10", from: "angefragt", to: "bestaetigt", note: "Direkt bestätigt" }
            ]
        },

        "case-003": {
            id: "case-003",
            createdAt: "2025-10-15T08:30:00Z",
            updatedAt: "2025-11-20T16:00:00Z",
            kunde: { name: "Weber, Michael", confidence: 1.0, source: "manual" },
            versicherungsnummer: { value: "AZ-556677", confidence: 1.0, source: "auto" },
            versicherer: { name: "Allianz", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: { value: "01.01.2026", confidence: 0.90, source: "auto" },
            status: "bestaetigt",
            sparte: "Hausrat",
            notes: "",
            flagged: false,
            conversationIds: ["conv-003"],
            messageIds: ["msg-003-a", "msg-003-b", "msg-003-c"],
            messages: [
                {
                    entryID: "msg-003-a",
                    folder: "sent",
                    subject: "Bestandsübertragung Weber Hausrat AZ-556677",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-10-15T08:30:00Z",
                    bodyPlain: "Übertragung Hausrat für Michael Weber, VS-Nr AZ-556677."
                },
                {
                    entryID: "msg-003-b",
                    folder: "inbox",
                    subject: "AW: Bestandsübertragung Weber Hausrat AZ-556677",
                    senderEmail: "maklerservice@allianz.de",
                    receivedTime: "2025-10-25T10:00:00Z",
                    bodyPlain: "Wir prüfen Ihre Anfrage."
                },
                {
                    entryID: "msg-003-c",
                    folder: "inbox",
                    subject: "AW: Bestandsübertragung Weber Hausrat AZ-556677",
                    senderEmail: "maklerservice@allianz.de",
                    receivedTime: "2025-11-20T16:00:00Z",
                    bodyPlain: "Die Bestandsübertragung wurde bestätigt. Wirksamkeit zum 01.01.2026."
                }
            ],
            statusHistory: [
                { date: "2025-10-15", from: null, to: "angefragt", note: "" },
                { date: "2025-10-25", from: "angefragt", to: "in-bearbeitung", note: "" },
                { date: "2025-11-20", from: "in-bearbeitung", to: "bestaetigt", note: "" }
            ]
        },

        "case-004": {
            id: "case-004",
            createdAt: "2025-09-10T14:00:00Z",
            updatedAt: "2025-10-05T11:30:00Z",
            kunde: { name: "Fischer, Sandra", confidence: 1.0, source: "auto" },
            versicherungsnummer: { value: "AXA-123456", confidence: 1.0, source: "auto" },
            versicherer: { name: "AXA", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: { value: "01.11.2025", confidence: 1.0, source: "auto" },
            status: "bestaetigt",
            sparte: "Rechtsschutz",
            notes: "Familien-Rechtsschutz",
            flagged: false,
            conversationIds: ["conv-004"],
            messageIds: ["msg-004-a", "msg-004-b"],
            messages: [
                {
                    entryID: "msg-004-a",
                    folder: "sent",
                    subject: "Courtagezusage Fischer Rechtsschutz AXA-123456",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-09-10T14:00:00Z",
                    bodyPlain: "Anfrage Bestandsübertragung für Sandra Fischer."
                },
                {
                    entryID: "msg-004-b",
                    folder: "inbox",
                    subject: "AW: Courtagezusage Fischer Rechtsschutz AXA-123456",
                    senderEmail: "makler@axa.de",
                    receivedTime: "2025-10-05T11:30:00Z",
                    bodyPlain: "Die Courtagezusage wurde erteilt. Wirksamkeit ab 01.11.2025."
                }
            ],
            statusHistory: [
                { date: "2025-09-10", from: null, to: "angefragt", note: "" },
                { date: "2025-10-05", from: "angefragt", to: "bestaetigt", note: "" }
            ]
        },

        "case-005": {
            id: "case-005",
            createdAt: "2025-10-01T09:00:00Z",
            updatedAt: "2025-11-25T10:00:00Z",
            kunde: { name: "Bauer, Klaus", confidence: 1.0, source: "manual" },
            versicherungsnummer: { value: "ZUR-778899", confidence: 1.0, source: "auto" },
            versicherer: { name: "Zurich", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: { value: "01.01.2026", confidence: 0.95, source: "auto" },
            status: "bestaetigt",
            sparte: "Leben",
            notes: "Risikolebensversicherung 200.000€",
            flagged: false,
            conversationIds: ["conv-005"],
            messageIds: ["msg-005-a", "msg-005-b", "msg-005-c"],
            messages: [
                {
                    entryID: "msg-005-a",
                    folder: "sent",
                    subject: "Bestandsübertragung Bauer Leben ZUR-778899",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-10-01T09:00:00Z",
                    bodyPlain: "Übertragung Risikoleben für Klaus Bauer."
                },
                {
                    entryID: "msg-005-b",
                    folder: "inbox",
                    subject: "AW: Bestandsübertragung Bauer Leben ZUR-778899",
                    senderEmail: "maklerservice@zurich.de",
                    receivedTime: "2025-10-20T14:00:00Z",
                    bodyPlain: "Ihre Anfrage wird geprüft."
                },
                {
                    entryID: "msg-005-c",
                    folder: "inbox",
                    subject: "AW: Bestandsübertragung Bauer Leben ZUR-778899",
                    senderEmail: "maklerservice@zurich.de",
                    receivedTime: "2025-11-25T10:00:00Z",
                    bodyPlain: "Die Übertragung wurde bestätigt. Wirksamkeit 01.01.2026."
                }
            ],
            statusHistory: [
                { date: "2025-10-01", from: null, to: "angefragt", note: "" },
                { date: "2025-10-20", from: "angefragt", to: "in-bearbeitung", note: "" },
                { date: "2025-11-25", from: "in-bearbeitung", to: "bestaetigt", note: "" }
            ]
        },

        "case-006": {
            id: "case-006",
            createdAt: "2025-09-15T11:00:00Z",
            updatedAt: "2025-10-30T15:00:00Z",
            kunde: { name: "Klein, Petra", confidence: 1.0, source: "auto" },
            versicherungsnummer: { value: "GEN-445566", confidence: 1.0, source: "auto" },
            versicherer: { name: "Generali", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: { value: "01.12.2025", confidence: 0.90, source: "auto" },
            status: "bestaetigt",
            sparte: "Unfall",
            notes: "",
            flagged: false,
            conversationIds: ["conv-006"],
            messageIds: ["msg-006-a", "msg-006-b"],
            messages: [
                {
                    entryID: "msg-006-a",
                    folder: "sent",
                    subject: "Maklervollmacht Klein Unfall GEN-445566",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-09-15T11:00:00Z",
                    bodyPlain: "Bestandsübertragung Unfallversicherung für Petra Klein."
                },
                {
                    entryID: "msg-006-b",
                    folder: "inbox",
                    subject: "AW: Maklervollmacht Klein Unfall GEN-445566",
                    senderEmail: "vertrieb@generali.de",
                    receivedTime: "2025-10-30T15:00:00Z",
                    bodyPlain: "Die Übertragung wurde zum 01.12.2025 bestätigt."
                }
            ],
            statusHistory: [
                { date: "2025-09-15", from: null, to: "angefragt", note: "" },
                { date: "2025-10-30", from: "angefragt", to: "bestaetigt", note: "" }
            ]
        },

        "case-007": {
            id: "case-007",
            createdAt: "2025-10-10T10:30:00Z",
            updatedAt: "2025-11-28T09:00:00Z",
            kunde: { name: "Hofmann, Jürgen", confidence: 1.0, source: "manual" },
            versicherungsnummer: { value: "DEB-112233", confidence: 1.0, source: "auto" },
            versicherer: { name: "Debeka", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: { value: "01.01.2026", confidence: 0.95, source: "auto" },
            status: "bestaetigt",
            sparte: "Kranken",
            notes: "Krankenzusatz ambulant/stationär",
            flagged: false,
            conversationIds: ["conv-007"],
            messageIds: ["msg-007-a", "msg-007-b", "msg-007-c"],
            messages: [
                {
                    entryID: "msg-007-a",
                    folder: "sent",
                    subject: "Bestandsübertragung Hofmann Kranken DEB-112233",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-10-10T10:30:00Z",
                    bodyPlain: "Übertragung Krankenzusatz für Jürgen Hofmann."
                },
                {
                    entryID: "msg-007-b",
                    folder: "inbox",
                    subject: "AW: Bestandsübertragung Hofmann Kranken DEB-112233",
                    senderEmail: "maklerservice@debeka.de",
                    receivedTime: "2025-11-01T11:00:00Z",
                    bodyPlain: "Ihre Anfrage wird bearbeitet."
                },
                {
                    entryID: "msg-007-c",
                    folder: "inbox",
                    subject: "AW: Bestandsübertragung Hofmann Kranken DEB-112233",
                    senderEmail: "maklerservice@debeka.de",
                    receivedTime: "2025-11-28T09:00:00Z",
                    bodyPlain: "Die Übertragung wurde bestätigt."
                }
            ],
            statusHistory: [
                { date: "2025-10-10", from: null, to: "angefragt", note: "" },
                { date: "2025-11-01", from: "angefragt", to: "in-bearbeitung", note: "" },
                { date: "2025-11-28", from: "in-bearbeitung", to: "bestaetigt", note: "" }
            ]
        },

        "case-008": {
            id: "case-008",
            createdAt: "2025-09-20T08:00:00Z",
            updatedAt: "2025-10-25T14:00:00Z",
            kunde: { name: "Schulz, Martina", confidence: 1.0, source: "auto" },
            versicherungsnummer: { value: "SI-998877", confidence: 1.0, source: "auto" },
            versicherer: { name: "Signal Iduna", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: { value: "01.11.2025", confidence: 0.90, source: "auto" },
            status: "bestaetigt",
            sparte: "BU",
            notes: "BU-Zusatz zur bAV",
            flagged: false,
            conversationIds: ["conv-008"],
            messageIds: ["msg-008-a", "msg-008-b"],
            messages: [
                {
                    entryID: "msg-008-a",
                    folder: "sent",
                    subject: "Courtagezusage Schulz BU SI-998877",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-09-20T08:00:00Z",
                    bodyPlain: "Anfrage Bestandsübertragung BU für Martina Schulz."
                },
                {
                    entryID: "msg-008-b",
                    folder: "inbox",
                    subject: "AW: Courtagezusage Schulz BU SI-998877",
                    senderEmail: "maklerbetreuung@signal-iduna.de",
                    receivedTime: "2025-10-25T14:00:00Z",
                    bodyPlain: "Die Courtagezusage wurde erteilt. Wirksamkeit ab 01.11.2025."
                }
            ],
            statusHistory: [
                { date: "2025-09-20", from: null, to: "angefragt", note: "" },
                { date: "2025-10-25", from: "angefragt", to: "bestaetigt", note: "" }
            ]
        },

        "case-009": {
            id: "case-009",
            createdAt: "2025-10-05T13:00:00Z",
            updatedAt: "2025-11-22T10:30:00Z",
            kunde: { name: "Richter, Frank", confidence: 1.0, source: "manual" },
            versicherungsnummer: { value: "HUK-334455", confidence: 1.0, source: "auto" },
            versicherer: { name: "HUK-Coburg", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: { value: "01.01.2026", confidence: 0.95, source: "auto" },
            status: "bestaetigt",
            sparte: "KFZ",
            notes: "Zweitwagen",
            flagged: false,
            conversationIds: ["conv-009"],
            messageIds: ["msg-009-a", "msg-009-b", "msg-009-c"],
            messages: [
                {
                    entryID: "msg-009-a",
                    folder: "sent",
                    subject: "Bestandsübertragung Richter KFZ HUK-334455",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-10-05T13:00:00Z",
                    bodyPlain: "Übertragung KFZ-Vertrag für Frank Richter."
                },
                {
                    entryID: "msg-009-b",
                    folder: "inbox",
                    subject: "AW: Bestandsübertragung Richter KFZ HUK-334455",
                    senderEmail: "maklerservice@huk-coburg.de",
                    receivedTime: "2025-10-20T09:00:00Z",
                    bodyPlain: "Ihre Anfrage wird geprüft."
                },
                {
                    entryID: "msg-009-c",
                    folder: "inbox",
                    subject: "AW: Bestandsübertragung Richter KFZ HUK-334455",
                    senderEmail: "maklerservice@huk-coburg.de",
                    receivedTime: "2025-11-22T10:30:00Z",
                    bodyPlain: "Die Bestandsübertragung wurde bestätigt."
                }
            ],
            statusHistory: [
                { date: "2025-10-05", from: null, to: "angefragt", note: "" },
                { date: "2025-10-20", from: "angefragt", to: "in-bearbeitung", note: "" },
                { date: "2025-11-22", from: "in-bearbeitung", to: "bestaetigt", note: "" }
            ]
        },

        "case-010": {
            id: "case-010",
            createdAt: "2025-09-25T15:00:00Z",
            updatedAt: "2025-11-05T11:00:00Z",
            kunde: { name: "Wolf, Christina", confidence: 1.0, source: "auto" },
            versicherungsnummer: { value: "NUE-667788", confidence: 1.0, source: "auto" },
            versicherer: { name: "Nürnberger", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: { value: "01.12.2025", confidence: 0.90, source: "auto" },
            status: "bestaetigt",
            sparte: "Rente",
            notes: "Riester-Rente",
            flagged: false,
            conversationIds: ["conv-010"],
            messageIds: ["msg-010-a", "msg-010-b"],
            messages: [
                {
                    entryID: "msg-010-a",
                    folder: "sent",
                    subject: "Maklervollmacht Wolf Rente NUE-667788",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-09-25T15:00:00Z",
                    bodyPlain: "Bestandsübertragung Riester-Rente für Christina Wolf."
                },
                {
                    entryID: "msg-010-b",
                    folder: "inbox",
                    subject: "AW: Maklervollmacht Wolf Rente NUE-667788",
                    senderEmail: "maklerservice@nuernberger.de",
                    receivedTime: "2025-11-05T11:00:00Z",
                    bodyPlain: "Die Übertragung wurde zum 01.12.2025 bestätigt."
                }
            ],
            statusHistory: [
                { date: "2025-09-25", from: null, to: "angefragt", note: "" },
                { date: "2025-11-05", from: "angefragt", to: "bestaetigt", note: "" }
            ]
        },

        "case-011": {
            id: "case-011",
            createdAt: "2025-10-12T09:30:00Z",
            updatedAt: "2025-11-30T14:00:00Z",
            kunde: { name: "Braun, Stefanie", confidence: 1.0, source: "manual" },
            versicherungsnummer: { value: "GOT-223344", confidence: 1.0, source: "auto" },
            versicherer: { name: "Gothaer", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: { value: "01.01.2026", confidence: 0.95, source: "auto" },
            status: "bestaetigt",
            sparte: "Wohngebäude",
            notes: "Inkl. Elementarschäden",
            flagged: false,
            conversationIds: ["conv-011"],
            messageIds: ["msg-011-a", "msg-011-b", "msg-011-c"],
            messages: [
                {
                    entryID: "msg-011-a",
                    folder: "sent",
                    subject: "Bestandsübertragung Braun Wohngebäude GOT-223344",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-10-12T09:30:00Z",
                    bodyPlain: "Übertragung Wohngebäude für Stefanie Braun."
                },
                {
                    entryID: "msg-011-b",
                    folder: "inbox",
                    subject: "AW: Bestandsübertragung Braun Wohngebäude GOT-223344",
                    senderEmail: "makler@gothaer.de",
                    receivedTime: "2025-11-10T10:00:00Z",
                    bodyPlain: "Ihre Anfrage wird bearbeitet."
                },
                {
                    entryID: "msg-011-c",
                    folder: "inbox",
                    subject: "AW: Bestandsübertragung Braun Wohngebäude GOT-223344",
                    senderEmail: "makler@gothaer.de",
                    receivedTime: "2025-11-30T14:00:00Z",
                    bodyPlain: "Die Übertragung wurde bestätigt."
                }
            ],
            statusHistory: [
                { date: "2025-10-12", from: null, to: "angefragt", note: "" },
                { date: "2025-11-10", from: "angefragt", to: "in-bearbeitung", note: "" },
                { date: "2025-11-30", from: "in-bearbeitung", to: "bestaetigt", note: "" }
            ]
        },

        "case-012": {
            id: "case-012",
            createdAt: "2025-09-05T10:00:00Z",
            updatedAt: "2025-10-15T16:00:00Z",
            kunde: { name: "Krause, Dieter", confidence: 1.0, source: "auto" },
            versicherungsnummer: { value: "BAR-556677", confidence: 1.0, source: "auto" },
            versicherer: { name: "Barmenia", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: { value: "01.11.2025", confidence: 0.90, source: "auto" },
            status: "bestaetigt",
            sparte: "Kranken",
            notes: "Zahnzusatz",
            flagged: false,
            conversationIds: ["conv-012"],
            messageIds: ["msg-012-a", "msg-012-b"],
            messages: [
                {
                    entryID: "msg-012-a",
                    folder: "sent",
                    subject: "Courtagezusage Krause Kranken BAR-556677",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-09-05T10:00:00Z",
                    bodyPlain: "Anfrage Bestandsübertragung Zahnzusatz für Dieter Krause."
                },
                {
                    entryID: "msg-012-b",
                    folder: "inbox",
                    subject: "AW: Courtagezusage Krause Kranken BAR-556677",
                    senderEmail: "maklerservice@barmenia.de",
                    receivedTime: "2025-10-15T16:00:00Z",
                    bodyPlain: "Die Courtagezusage wurde erteilt."
                }
            ],
            statusHistory: [
                { date: "2025-09-05", from: null, to: "angefragt", note: "" },
                { date: "2025-10-15", from: "angefragt", to: "bestaetigt", note: "" }
            ]
        },

        "case-013": {
            id: "case-013",
            createdAt: "2025-10-08T11:30:00Z",
            updatedAt: "2025-12-01T09:00:00Z",
            kunde: { name: "Neumann, Heike", confidence: 1.0, source: "manual" },
            versicherungsnummer: { value: "RV-889900", confidence: 1.0, source: "auto" },
            versicherer: { name: "R+V", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: { value: "01.01.2026", confidence: 0.95, source: "auto" },
            status: "bestaetigt",
            sparte: "Haftpflicht",
            notes: "",
            flagged: false,
            conversationIds: ["conv-013"],
            messageIds: ["msg-013-a", "msg-013-b", "msg-013-c"],
            messages: [
                {
                    entryID: "msg-013-a",
                    folder: "sent",
                    subject: "Bestandsübertragung Neumann Haftpflicht RV-889900",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-10-08T11:30:00Z",
                    bodyPlain: "Übertragung Privathaftpflicht für Heike Neumann."
                },
                {
                    entryID: "msg-013-b",
                    folder: "inbox",
                    subject: "AW: Bestandsübertragung Neumann Haftpflicht RV-889900",
                    senderEmail: "maklerservice@r-v.de",
                    receivedTime: "2025-10-28T14:00:00Z",
                    bodyPlain: "Ihre Anfrage wird geprüft."
                },
                {
                    entryID: "msg-013-c",
                    folder: "inbox",
                    subject: "AW: Bestandsübertragung Neumann Haftpflicht RV-889900",
                    senderEmail: "maklerservice@r-v.de",
                    receivedTime: "2025-12-01T09:00:00Z",
                    bodyPlain: "Die Bestandsübertragung wurde bestätigt."
                }
            ],
            statusHistory: [
                { date: "2025-10-08", from: null, to: "angefragt", note: "" },
                { date: "2025-10-28", from: "angefragt", to: "in-bearbeitung", note: "" },
                { date: "2025-12-01", from: "in-bearbeitung", to: "bestaetigt", note: "" }
            ]
        },

        "case-014": {
            id: "case-014",
            createdAt: "2025-09-30T14:30:00Z",
            updatedAt: "2025-11-12T10:00:00Z",
            kunde: { name: "Hartmann, Uwe", confidence: 1.0, source: "auto" },
            versicherungsnummer: { value: "LVM-112233", confidence: 1.0, source: "auto" },
            versicherer: { name: "LVM", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: { value: "01.12.2025", confidence: 0.90, source: "auto" },
            status: "bestaetigt",
            sparte: "KFZ",
            notes: "Motorrad",
            flagged: false,
            conversationIds: ["conv-014"],
            messageIds: ["msg-014-a", "msg-014-b"],
            messages: [
                {
                    entryID: "msg-014-a",
                    folder: "sent",
                    subject: "Maklervollmacht Hartmann KFZ LVM-112233",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-09-30T14:30:00Z",
                    bodyPlain: "Bestandsübertragung KFZ Motorrad für Uwe Hartmann."
                },
                {
                    entryID: "msg-014-b",
                    folder: "inbox",
                    subject: "AW: Maklervollmacht Hartmann KFZ LVM-112233",
                    senderEmail: "maklerservice@lvm.de",
                    receivedTime: "2025-11-12T10:00:00Z",
                    bodyPlain: "Die Übertragung wurde zum 01.12.2025 bestätigt."
                }
            ],
            statusHistory: [
                { date: "2025-09-30", from: null, to: "angefragt", note: "" },
                { date: "2025-11-12", from: "angefragt", to: "bestaetigt", note: "" }
            ]
        },

        "case-015": {
            id: "case-015",
            createdAt: "2025-10-18T08:00:00Z",
            updatedAt: "2025-12-05T15:30:00Z",
            kunde: { name: "Zimmermann, Karin", confidence: 1.0, source: "manual" },
            versicherungsnummer: { value: "DEVK-445566", confidence: 1.0, source: "auto" },
            versicherer: { name: "DEVK", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: { value: "01.01.2026", confidence: 0.95, source: "auto" },
            status: "bestaetigt",
            sparte: "Hausrat",
            notes: "",
            flagged: false,
            conversationIds: ["conv-015"],
            messageIds: ["msg-015-a", "msg-015-b", "msg-015-c"],
            messages: [
                {
                    entryID: "msg-015-a",
                    folder: "sent",
                    subject: "Bestandsübertragung Zimmermann Hausrat DEVK-445566",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-10-18T08:00:00Z",
                    bodyPlain: "Übertragung Hausrat für Karin Zimmermann."
                },
                {
                    entryID: "msg-015-b",
                    folder: "inbox",
                    subject: "AW: Bestandsübertragung Zimmermann Hausrat DEVK-445566",
                    senderEmail: "makler@devk.de",
                    receivedTime: "2025-11-15T11:00:00Z",
                    bodyPlain: "Ihre Anfrage wird bearbeitet."
                },
                {
                    entryID: "msg-015-c",
                    folder: "inbox",
                    subject: "AW: Bestandsübertragung Zimmermann Hausrat DEVK-445566",
                    senderEmail: "makler@devk.de",
                    receivedTime: "2025-12-05T15:30:00Z",
                    bodyPlain: "Die Übertragung wurde bestätigt."
                }
            ],
            statusHistory: [
                { date: "2025-10-18", from: null, to: "angefragt", note: "" },
                { date: "2025-11-15", from: "angefragt", to: "in-bearbeitung", note: "" },
                { date: "2025-12-05", from: "in-bearbeitung", to: "bestaetigt", note: "" }
            ]
        },

        // ============================================
        // ABGELEHNT (8 Vorgänge: case-016 bis case-023)
        // ============================================
        "case-016": {
            id: "case-016",
            createdAt: "2025-10-05T11:00:00Z",
            updatedAt: "2025-11-02T09:45:00Z",
            kunde: { name: "Vogel, Herbert", confidence: 1.0, source: "auto" },
            versicherungsnummer: { value: "AZ-443322", confidence: 1.0, source: "auto" },
            versicherer: { name: "Allianz", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: null,
            status: "abgelehnt",
            sparte: "Leben",
            notes: "Kunde hat widersprochen - möchte bei bisherigem Vermittler bleiben",
            flagged: true,
            conversationIds: ["conv-016"],
            messageIds: ["msg-016-a", "msg-016-b", "msg-016-c"],
            messages: [
                {
                    entryID: "msg-016-a",
                    folder: "sent",
                    subject: "Bestandsübertragung Vogel Leben AZ-443322",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-10-05T11:00:00Z",
                    bodyPlain: "Übertragung Leben AZ-443322 für Herbert Vogel."
                },
                {
                    entryID: "msg-016-b",
                    folder: "inbox",
                    subject: "AW: Bestandsübertragung Vogel Leben AZ-443322",
                    senderEmail: "maklerservice@allianz.de",
                    receivedTime: "2025-10-15T14:00:00Z",
                    bodyPlain: "Kunde wird angeschrieben zur Bestätigung."
                },
                {
                    entryID: "msg-016-c",
                    folder: "inbox",
                    subject: "AW: Bestandsübertragung Vogel Leben AZ-443322",
                    senderEmail: "maklerservice@allianz.de",
                    receivedTime: "2025-11-02T09:45:00Z",
                    bodyPlain: "Der Versicherungsnehmer hat der Übertragung widersprochen."
                }
            ],
            statusHistory: [
                { date: "2025-10-05", from: null, to: "angefragt", note: "" },
                { date: "2025-10-15", from: "angefragt", to: "in-bearbeitung", note: "" },
                { date: "2025-11-02", from: "in-bearbeitung", to: "abgelehnt", note: "Widerspruch vom Kunden" }
            ]
        },

        "case-017": {
            id: "case-017",
            createdAt: "2025-09-28T09:00:00Z",
            updatedAt: "2025-10-20T11:30:00Z",
            kunde: { name: "Lehmann, Gisela", confidence: 1.0, source: "manual" },
            versicherungsnummer: { value: "ERG-998877", confidence: 1.0, source: "auto" },
            versicherer: { name: "ERGO", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: null,
            status: "abgelehnt",
            sparte: "Kranken",
            notes: "Keine Maklervollmacht vom Kunden erhalten",
            flagged: false,
            conversationIds: ["conv-017"],
            messageIds: ["msg-017-a", "msg-017-b"],
            messages: [
                {
                    entryID: "msg-017-a",
                    folder: "sent",
                    subject: "Courtagezusage Lehmann Kranken ERG-998877",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-09-28T09:00:00Z",
                    bodyPlain: "Anfrage Bestandsübertragung für Gisela Lehmann."
                },
                {
                    entryID: "msg-017-b",
                    folder: "inbox",
                    subject: "AW: Courtagezusage Lehmann Kranken ERG-998877",
                    senderEmail: "maklerservice@ergo.de",
                    receivedTime: "2025-10-20T11:30:00Z",
                    bodyPlain: "Die Anfrage wurde abgelehnt. Keine gültige Maklervollmacht vorhanden."
                }
            ],
            statusHistory: [
                { date: "2025-09-28", from: null, to: "angefragt", note: "" },
                { date: "2025-10-20", from: "angefragt", to: "abgelehnt", note: "Keine Vollmacht" }
            ]
        },

        "case-018": {
            id: "case-018",
            createdAt: "2025-10-02T14:00:00Z",
            updatedAt: "2025-11-08T10:00:00Z",
            kunde: { name: "Schröder, Wolfgang", confidence: 1.0, source: "auto" },
            versicherungsnummer: { value: "HDI-667788", confidence: 1.0, source: "auto" },
            versicherer: { name: "HDI", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: null,
            status: "abgelehnt",
            sparte: "KFZ",
            notes: "Vertrag wurde bereits gekündigt",
            flagged: false,
            conversationIds: ["conv-018"],
            messageIds: ["msg-018-a", "msg-018-b", "msg-018-c"],
            messages: [
                {
                    entryID: "msg-018-a",
                    folder: "sent",
                    subject: "Bestandsübertragung Schröder KFZ HDI-667788",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-10-02T14:00:00Z",
                    bodyPlain: "Übertragung KFZ für Wolfgang Schröder."
                },
                {
                    entryID: "msg-018-b",
                    folder: "inbox",
                    subject: "AW: Bestandsübertragung Schröder KFZ HDI-667788",
                    senderEmail: "maklerbetreuung@hdi.de",
                    receivedTime: "2025-10-15T09:00:00Z",
                    bodyPlain: "Ihre Anfrage wird geprüft."
                },
                {
                    entryID: "msg-018-c",
                    folder: "inbox",
                    subject: "AW: Bestandsübertragung Schröder KFZ HDI-667788",
                    senderEmail: "maklerbetreuung@hdi.de",
                    receivedTime: "2025-11-08T10:00:00Z",
                    bodyPlain: "Übertragung nicht möglich. Der Vertrag wurde bereits gekündigt."
                }
            ],
            statusHistory: [
                { date: "2025-10-02", from: null, to: "angefragt", note: "" },
                { date: "2025-10-15", from: "angefragt", to: "in-bearbeitung", note: "" },
                { date: "2025-11-08", from: "in-bearbeitung", to: "abgelehnt", note: "Vertrag gekündigt" }
            ]
        },

        "case-019": {
            id: "case-019",
            createdAt: "2025-09-18T10:30:00Z",
            updatedAt: "2025-10-28T14:00:00Z",
            kunde: { name: "König, Renate", confidence: 1.0, source: "manual" },
            versicherungsnummer: { value: "AXA-334455", confidence: 1.0, source: "auto" },
            versicherer: { name: "AXA", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: null,
            status: "abgelehnt",
            sparte: "Unfall",
            notes: "Ausschließlichkeitsvermittler hat widersprochen",
            flagged: true,
            conversationIds: ["conv-019"],
            messageIds: ["msg-019-a", "msg-019-b"],
            messages: [
                {
                    entryID: "msg-019-a",
                    folder: "sent",
                    subject: "Maklervollmacht König Unfall AXA-334455",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-09-18T10:30:00Z",
                    bodyPlain: "Bestandsübertragung Unfallversicherung für Renate König."
                },
                {
                    entryID: "msg-019-b",
                    folder: "inbox",
                    subject: "AW: Maklervollmacht König Unfall AXA-334455",
                    senderEmail: "makler@axa.de",
                    receivedTime: "2025-10-28T14:00:00Z",
                    bodyPlain: "Die Übertragung wurde vom bisherigen Vermittler abgelehnt."
                }
            ],
            statusHistory: [
                { date: "2025-09-18", from: null, to: "angefragt", note: "" },
                { date: "2025-10-28", from: "angefragt", to: "abgelehnt", note: "Vermittler-Widerspruch" }
            ]
        },

        "case-020": {
            id: "case-020",
            createdAt: "2025-10-10T08:00:00Z",
            updatedAt: "2025-11-18T16:00:00Z",
            kunde: { name: "Lang, Bernd", confidence: 1.0, source: "auto" },
            versicherungsnummer: { value: "ZUR-112233", confidence: 1.0, source: "auto" },
            versicherer: { name: "Zurich", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: null,
            status: "abgelehnt",
            sparte: "BU",
            notes: "Vertrag ist beitragsfrei gestellt",
            flagged: false,
            conversationIds: ["conv-020"],
            messageIds: ["msg-020-a", "msg-020-b", "msg-020-c"],
            messages: [
                {
                    entryID: "msg-020-a",
                    folder: "sent",
                    subject: "Bestandsübertragung Lang BU ZUR-112233",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-10-10T08:00:00Z",
                    bodyPlain: "Übertragung BU für Bernd Lang."
                },
                {
                    entryID: "msg-020-b",
                    folder: "inbox",
                    subject: "AW: Bestandsübertragung Lang BU ZUR-112233",
                    senderEmail: "maklerservice@zurich.de",
                    receivedTime: "2025-10-25T11:00:00Z",
                    bodyPlain: "Ihre Anfrage wird geprüft."
                },
                {
                    entryID: "msg-020-c",
                    folder: "inbox",
                    subject: "AW: Bestandsübertragung Lang BU ZUR-112233",
                    senderEmail: "maklerservice@zurich.de",
                    receivedTime: "2025-11-18T16:00:00Z",
                    bodyPlain: "Die Übertragung ist nicht möglich. Vertrag ist beitragsfrei gestellt."
                }
            ],
            statusHistory: [
                { date: "2025-10-10", from: null, to: "angefragt", note: "" },
                { date: "2025-10-25", from: "angefragt", to: "in-bearbeitung", note: "" },
                { date: "2025-11-18", from: "in-bearbeitung", to: "abgelehnt", note: "Beitragsfrei" }
            ]
        },

        "case-021": {
            id: "case-021",
            createdAt: "2025-09-22T13:00:00Z",
            updatedAt: "2025-10-30T09:30:00Z",
            kunde: { name: "Beck, Ingrid", confidence: 1.0, source: "manual" },
            versicherungsnummer: { value: "GEN-889900", confidence: 1.0, source: "auto" },
            versicherer: { name: "Generali", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: null,
            status: "abgelehnt",
            sparte: "Leben",
            notes: "Direktvertrag - keine Vermittlerumschreibung möglich",
            flagged: false,
            conversationIds: ["conv-021"],
            messageIds: ["msg-021-a", "msg-021-b"],
            messages: [
                {
                    entryID: "msg-021-a",
                    folder: "sent",
                    subject: "Courtagezusage Beck Leben GEN-889900",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-09-22T13:00:00Z",
                    bodyPlain: "Anfrage Bestandsübertragung Leben für Ingrid Beck."
                },
                {
                    entryID: "msg-021-b",
                    folder: "inbox",
                    subject: "AW: Courtagezusage Beck Leben GEN-889900",
                    senderEmail: "vertrieb@generali.de",
                    receivedTime: "2025-10-30T09:30:00Z",
                    bodyPlain: "Bei diesem Direktvertrag ist keine Vermittlerumschreibung möglich."
                }
            ],
            statusHistory: [
                { date: "2025-09-22", from: null, to: "angefragt", note: "" },
                { date: "2025-10-30", from: "angefragt", to: "abgelehnt", note: "Direktvertrag" }
            ]
        },

        "case-022": {
            id: "case-022",
            createdAt: "2025-10-15T15:00:00Z",
            updatedAt: "2025-11-25T11:00:00Z",
            kunde: { name: "Seidel, Horst", confidence: 1.0, source: "auto" },
            versicherungsnummer: { value: "CON-556677", confidence: 1.0, source: "auto" },
            versicherer: { name: "Continentale", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: null,
            status: "abgelehnt",
            sparte: "Kranken",
            notes: "Kunde hat sich für anderen Makler entschieden",
            flagged: true,
            conversationIds: ["conv-022"],
            messageIds: ["msg-022-a", "msg-022-b", "msg-022-c"],
            messages: [
                {
                    entryID: "msg-022-a",
                    folder: "sent",
                    subject: "Bestandsübertragung Seidel Kranken CON-556677",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-10-15T15:00:00Z",
                    bodyPlain: "Übertragung Kranken für Horst Seidel."
                },
                {
                    entryID: "msg-022-b",
                    folder: "inbox",
                    subject: "AW: Bestandsübertragung Seidel Kranken CON-556677",
                    senderEmail: "maklerservice@continentale.de",
                    receivedTime: "2025-11-05T14:00:00Z",
                    bodyPlain: "Ihre Anfrage wird geprüft."
                },
                {
                    entryID: "msg-022-c",
                    folder: "inbox",
                    subject: "AW: Bestandsübertragung Seidel Kranken CON-556677",
                    senderEmail: "maklerservice@continentale.de",
                    receivedTime: "2025-11-25T11:00:00Z",
                    bodyPlain: "Der Kunde hat sich für einen anderen Makler entschieden."
                }
            ],
            statusHistory: [
                { date: "2025-10-15", from: null, to: "angefragt", note: "" },
                { date: "2025-11-05", from: "angefragt", to: "in-bearbeitung", note: "" },
                { date: "2025-11-25", from: "in-bearbeitung", to: "abgelehnt", note: "Anderer Makler gewählt" }
            ]
        },

        "case-023": {
            id: "case-023",
            createdAt: "2025-09-12T09:30:00Z",
            updatedAt: "2025-10-22T15:00:00Z",
            kunde: { name: "Mayer, Gudrun", confidence: 1.0, source: "manual" },
            versicherungsnummer: { value: "WWK-223344", confidence: 1.0, source: "auto" },
            versicherer: { name: "WWK", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: null,
            status: "abgelehnt",
            sparte: "Rente",
            notes: "Sperrfrist noch nicht abgelaufen",
            flagged: false,
            conversationIds: ["conv-023"],
            messageIds: ["msg-023-a", "msg-023-b"],
            messages: [
                {
                    entryID: "msg-023-a",
                    folder: "sent",
                    subject: "Maklervollmacht Mayer Rente WWK-223344",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-09-12T09:30:00Z",
                    bodyPlain: "Bestandsübertragung Rente für Gudrun Mayer."
                },
                {
                    entryID: "msg-023-b",
                    folder: "inbox",
                    subject: "AW: Maklervollmacht Mayer Rente WWK-223344",
                    senderEmail: "maklerservice@wwk.de",
                    receivedTime: "2025-10-22T15:00:00Z",
                    bodyPlain: "Übertragung zurückgewiesen. Die Sperrfrist ist noch nicht abgelaufen."
                }
            ],
            statusHistory: [
                { date: "2025-09-12", from: null, to: "angefragt", note: "" },
                { date: "2025-10-22", from: "angefragt", to: "abgelehnt", note: "Sperrfrist" }
            ]
        },

        // ============================================
        // IN BEARBEITUNG (12 Vorgänge: case-024 bis case-035)
        // ============================================
        "case-024": {
            id: "case-024",
            createdAt: "2025-12-01T09:00:00Z",
            updatedAt: "2025-12-08T14:30:00Z",
            kunde: { name: "Lorenz, Sabine", confidence: 1.0, source: "auto" },
            versicherungsnummer: { value: "AZ-112233", confidence: 1.0, source: "auto" },
            versicherer: { name: "Allianz", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: null,
            status: "in-bearbeitung",
            sparte: "KFZ",
            notes: "Wartet auf Kundenbestätigung",
            flagged: false,
            conversationIds: ["conv-024"],
            messageIds: ["msg-024-a", "msg-024-b"],
            messages: [
                {
                    entryID: "msg-024-a",
                    folder: "sent",
                    subject: "Bestandsübertragung Lorenz KFZ AZ-112233",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-12-01T09:00:00Z",
                    bodyPlain: "Übertragung KFZ AZ-112233 für Sabine Lorenz."
                },
                {
                    entryID: "msg-024-b",
                    folder: "inbox",
                    subject: "AW: Bestandsübertragung Lorenz KFZ AZ-112233",
                    senderEmail: "maklerservice@allianz.de",
                    receivedTime: "2025-12-08T14:30:00Z",
                    bodyPlain: "Ihre Anfrage wird geprüft. Der Kunde wird zur Bestätigung angeschrieben."
                }
            ],
            statusHistory: [
                { date: "2025-12-01", from: null, to: "angefragt", note: "" },
                { date: "2025-12-08", from: "angefragt", to: "in-bearbeitung", note: "" }
            ]
        },

        "case-025": {
            id: "case-025",
            createdAt: "2025-11-25T10:00:00Z",
            updatedAt: "2025-12-05T11:00:00Z",
            kunde: { name: "Franke, Matthias", confidence: 1.0, source: "manual" },
            versicherungsnummer: { value: "ERG-445566", confidence: 1.0, source: "auto" },
            versicherer: { name: "ERGO", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: null,
            status: "in-bearbeitung",
            sparte: "Leben",
            notes: "Unterlagen werden geprüft",
            flagged: false,
            conversationIds: ["conv-025"],
            messageIds: ["msg-025-a", "msg-025-b"],
            messages: [
                {
                    entryID: "msg-025-a",
                    folder: "sent",
                    subject: "Courtagezusage Franke Leben ERG-445566",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-11-25T10:00:00Z",
                    bodyPlain: "Anfrage Bestandsübertragung Leben für Matthias Franke."
                },
                {
                    entryID: "msg-025-b",
                    folder: "inbox",
                    subject: "AW: Courtagezusage Franke Leben ERG-445566",
                    senderEmail: "maklerservice@ergo.de",
                    receivedTime: "2025-12-05T11:00:00Z",
                    bodyPlain: "Ihre Unterlagen werden geprüft. Wir melden uns."
                }
            ],
            statusHistory: [
                { date: "2025-11-25", from: null, to: "angefragt", note: "" },
                { date: "2025-12-05", from: "angefragt", to: "in-bearbeitung", note: "" }
            ]
        },

        "case-026": {
            id: "case-026",
            createdAt: "2025-11-28T14:00:00Z",
            updatedAt: "2025-12-10T09:00:00Z",
            kunde: { name: "Engel, Susanne", confidence: 1.0, source: "auto" },
            versicherungsnummer: { value: "HDI-778899", confidence: 1.0, source: "auto" },
            versicherer: { name: "HDI", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: null,
            status: "in-bearbeitung",
            sparte: "Haftpflicht",
            notes: "",
            flagged: false,
            conversationIds: ["conv-026"],
            messageIds: ["msg-026-a", "msg-026-b"],
            messages: [
                {
                    entryID: "msg-026-a",
                    folder: "sent",
                    subject: "Bestandsübertragung Engel Haftpflicht HDI-778899",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-11-28T14:00:00Z",
                    bodyPlain: "Übertragung Haftpflicht für Susanne Engel."
                },
                {
                    entryID: "msg-026-b",
                    folder: "inbox",
                    subject: "AW: Bestandsübertragung Engel Haftpflicht HDI-778899",
                    senderEmail: "maklerbetreuung@hdi.de",
                    receivedTime: "2025-12-10T09:00:00Z",
                    bodyPlain: "Ihre Anfrage ist in Bearbeitung."
                }
            ],
            statusHistory: [
                { date: "2025-11-28", from: null, to: "angefragt", note: "" },
                { date: "2025-12-10", from: "angefragt", to: "in-bearbeitung", note: "" }
            ]
        },

        "case-027": {
            id: "case-027",
            createdAt: "2025-11-20T08:30:00Z",
            updatedAt: "2025-12-02T15:00:00Z",
            kunde: { name: "Arnold, Ralf", confidence: 1.0, source: "manual" },
            versicherungsnummer: { value: "AXA-667788", confidence: 1.0, source: "auto" },
            versicherer: { name: "AXA", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: null,
            status: "in-bearbeitung",
            sparte: "Hausrat",
            notes: "Rückfrage zu Vorschäden",
            flagged: true,
            conversationIds: ["conv-027"],
            messageIds: ["msg-027-a", "msg-027-b"],
            messages: [
                {
                    entryID: "msg-027-a",
                    folder: "sent",
                    subject: "Maklervollmacht Arnold Hausrat AXA-667788",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-11-20T08:30:00Z",
                    bodyPlain: "Bestandsübertragung Hausrat für Ralf Arnold."
                },
                {
                    entryID: "msg-027-b",
                    folder: "inbox",
                    subject: "AW: Maklervollmacht Arnold Hausrat AXA-667788",
                    senderEmail: "makler@axa.de",
                    receivedTime: "2025-12-02T15:00:00Z",
                    bodyPlain: "Rückfrage: Gab es Vorschäden in den letzten 5 Jahren?"
                }
            ],
            statusHistory: [
                { date: "2025-11-20", from: null, to: "angefragt", note: "" },
                { date: "2025-12-02", from: "angefragt", to: "in-bearbeitung", note: "Rückfrage erhalten" }
            ]
        },

        "case-028": {
            id: "case-028",
            createdAt: "2025-12-02T11:00:00Z",
            updatedAt: "2025-12-12T10:30:00Z",
            kunde: { name: "Dietrich, Monika", confidence: 1.0, source: "auto" },
            versicherungsnummer: { value: "ZUR-334455", confidence: 1.0, source: "auto" },
            versicherer: { name: "Zurich", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: null,
            status: "in-bearbeitung",
            sparte: "Rechtsschutz",
            notes: "",
            flagged: false,
            conversationIds: ["conv-028"],
            messageIds: ["msg-028-a", "msg-028-b"],
            messages: [
                {
                    entryID: "msg-028-a",
                    folder: "sent",
                    subject: "Bestandsübertragung Dietrich Rechtsschutz ZUR-334455",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-12-02T11:00:00Z",
                    bodyPlain: "Übertragung Rechtsschutz für Monika Dietrich."
                },
                {
                    entryID: "msg-028-b",
                    folder: "inbox",
                    subject: "AW: Bestandsübertragung Dietrich Rechtsschutz ZUR-334455",
                    senderEmail: "maklerservice@zurich.de",
                    receivedTime: "2025-12-12T10:30:00Z",
                    bodyPlain: "Ihre Anfrage wird bearbeitet."
                }
            ],
            statusHistory: [
                { date: "2025-12-02", from: null, to: "angefragt", note: "" },
                { date: "2025-12-12", from: "angefragt", to: "in-bearbeitung", note: "" }
            ]
        },

        "case-029": {
            id: "case-029",
            createdAt: "2025-11-22T09:00:00Z",
            updatedAt: "2025-12-06T14:00:00Z",
            kunde: { name: "Hahn, Erika", confidence: 1.0, source: "manual" },
            versicherungsnummer: { value: "GEN-112233", confidence: 1.0, source: "auto" },
            versicherer: { name: "Generali", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: null,
            status: "in-bearbeitung",
            sparte: "Unfall",
            notes: "Kundenanschreiben versendet",
            flagged: false,
            conversationIds: ["conv-029"],
            messageIds: ["msg-029-a", "msg-029-b"],
            messages: [
                {
                    entryID: "msg-029-a",
                    folder: "sent",
                    subject: "Courtagezusage Hahn Unfall GEN-112233",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-11-22T09:00:00Z",
                    bodyPlain: "Anfrage Bestandsübertragung Unfall für Erika Hahn."
                },
                {
                    entryID: "msg-029-b",
                    folder: "inbox",
                    subject: "AW: Courtagezusage Hahn Unfall GEN-112233",
                    senderEmail: "vertrieb@generali.de",
                    receivedTime: "2025-12-06T14:00:00Z",
                    bodyPlain: "Kundenanschreiben wurde versendet."
                }
            ],
            statusHistory: [
                { date: "2025-11-22", from: null, to: "angefragt", note: "" },
                { date: "2025-12-06", from: "angefragt", to: "in-bearbeitung", note: "" }
            ]
        },

        "case-030": {
            id: "case-030",
            createdAt: "2025-11-30T13:30:00Z",
            updatedAt: "2025-12-11T11:00:00Z",
            kunde: { name: "Jäger, Oliver", confidence: 1.0, source: "auto" },
            versicherungsnummer: { value: "DEB-445566", confidence: 1.0, source: "auto" },
            versicherer: { name: "Debeka", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: null,
            status: "in-bearbeitung",
            sparte: "Kranken",
            notes: "",
            flagged: false,
            conversationIds: ["conv-030"],
            messageIds: ["msg-030-a", "msg-030-b"],
            messages: [
                {
                    entryID: "msg-030-a",
                    folder: "sent",
                    subject: "Bestandsübertragung Jäger Kranken DEB-445566",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-11-30T13:30:00Z",
                    bodyPlain: "Übertragung Kranken für Oliver Jäger."
                },
                {
                    entryID: "msg-030-b",
                    folder: "inbox",
                    subject: "AW: Bestandsübertragung Jäger Kranken DEB-445566",
                    senderEmail: "maklerservice@debeka.de",
                    receivedTime: "2025-12-11T11:00:00Z",
                    bodyPlain: "Ihre Anfrage ist in Bearbeitung."
                }
            ],
            statusHistory: [
                { date: "2025-11-30", from: null, to: "angefragt", note: "" },
                { date: "2025-12-11", from: "angefragt", to: "in-bearbeitung", note: "" }
            ]
        },

        "case-031": {
            id: "case-031",
            createdAt: "2025-11-18T10:00:00Z",
            updatedAt: "2025-12-03T16:00:00Z",
            kunde: { name: "Kaiser, Brigitte", confidence: 1.0, source: "manual" },
            versicherungsnummer: { value: "SI-223344", confidence: 1.0, source: "auto" },
            versicherer: { name: "Signal Iduna", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: null,
            status: "in-bearbeitung",
            sparte: "Wohngebäude",
            notes: "Fehlende Unterlagen angefordert",
            flagged: true,
            conversationIds: ["conv-031"],
            messageIds: ["msg-031-a", "msg-031-b"],
            messages: [
                {
                    entryID: "msg-031-a",
                    folder: "sent",
                    subject: "Maklervollmacht Kaiser Wohngebäude SI-223344",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-11-18T10:00:00Z",
                    bodyPlain: "Bestandsübertragung Wohngebäude für Brigitte Kaiser."
                },
                {
                    entryID: "msg-031-b",
                    folder: "inbox",
                    subject: "AW: Maklervollmacht Kaiser Wohngebäude SI-223344",
                    senderEmail: "maklerbetreuung@signal-iduna.de",
                    receivedTime: "2025-12-03T16:00:00Z",
                    bodyPlain: "Es fehlen noch Unterlagen. Bitte reichen Sie die Maklervollmacht nach."
                }
            ],
            statusHistory: [
                { date: "2025-11-18", from: null, to: "angefragt", note: "" },
                { date: "2025-12-03", from: "angefragt", to: "in-bearbeitung", note: "Unterlagen fehlen" }
            ]
        },

        "case-032": {
            id: "case-032",
            createdAt: "2025-12-03T08:00:00Z",
            updatedAt: "2025-12-13T09:30:00Z",
            kunde: { name: "Langer, Werner", confidence: 1.0, source: "auto" },
            versicherungsnummer: { value: "HUK-556677", confidence: 1.0, source: "auto" },
            versicherer: { name: "HUK-Coburg", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: null,
            status: "in-bearbeitung",
            sparte: "KFZ",
            notes: "",
            flagged: false,
            conversationIds: ["conv-032"],
            messageIds: ["msg-032-a", "msg-032-b"],
            messages: [
                {
                    entryID: "msg-032-a",
                    folder: "sent",
                    subject: "Bestandsübertragung Langer KFZ HUK-556677",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-12-03T08:00:00Z",
                    bodyPlain: "Übertragung KFZ für Werner Langer."
                },
                {
                    entryID: "msg-032-b",
                    folder: "inbox",
                    subject: "AW: Bestandsübertragung Langer KFZ HUK-556677",
                    senderEmail: "maklerservice@huk-coburg.de",
                    receivedTime: "2025-12-13T09:30:00Z",
                    bodyPlain: "Ihre Anfrage wird geprüft."
                }
            ],
            statusHistory: [
                { date: "2025-12-03", from: null, to: "angefragt", note: "" },
                { date: "2025-12-13", from: "angefragt", to: "in-bearbeitung", note: "" }
            ]
        },

        "case-033": {
            id: "case-033",
            createdAt: "2025-11-26T14:30:00Z",
            updatedAt: "2025-12-09T10:00:00Z",
            kunde: { name: "Merkel, Andrea", confidence: 1.0, source: "manual" },
            versicherungsnummer: { value: "NUE-889900", confidence: 1.0, source: "auto" },
            versicherer: { name: "Nürnberger", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: null,
            status: "in-bearbeitung",
            sparte: "BU",
            notes: "",
            flagged: false,
            conversationIds: ["conv-033"],
            messageIds: ["msg-033-a", "msg-033-b"],
            messages: [
                {
                    entryID: "msg-033-a",
                    folder: "sent",
                    subject: "Courtagezusage Merkel BU NUE-889900",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-11-26T14:30:00Z",
                    bodyPlain: "Anfrage Bestandsübertragung BU für Andrea Merkel."
                },
                {
                    entryID: "msg-033-b",
                    folder: "inbox",
                    subject: "AW: Courtagezusage Merkel BU NUE-889900",
                    senderEmail: "maklerservice@nuernberger.de",
                    receivedTime: "2025-12-09T10:00:00Z",
                    bodyPlain: "Ihre Anfrage ist in Bearbeitung."
                }
            ],
            statusHistory: [
                { date: "2025-11-26", from: null, to: "angefragt", note: "" },
                { date: "2025-12-09", from: "angefragt", to: "in-bearbeitung", note: "" }
            ]
        },

        "case-034": {
            id: "case-034",
            createdAt: "2025-12-04T09:00:00Z",
            updatedAt: "2025-12-14T11:30:00Z",
            kunde: { name: "Naumann, Dirk", confidence: 1.0, source: "auto" },
            versicherungsnummer: { value: "GOT-667788", confidence: 1.0, source: "auto" },
            versicherer: { name: "Gothaer", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: null,
            status: "in-bearbeitung",
            sparte: "Haftpflicht",
            notes: "",
            flagged: false,
            conversationIds: ["conv-034"],
            messageIds: ["msg-034-a", "msg-034-b"],
            messages: [
                {
                    entryID: "msg-034-a",
                    folder: "sent",
                    subject: "Bestandsübertragung Naumann Haftpflicht GOT-667788",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-12-04T09:00:00Z",
                    bodyPlain: "Übertragung Haftpflicht für Dirk Naumann."
                },
                {
                    entryID: "msg-034-b",
                    folder: "inbox",
                    subject: "AW: Bestandsübertragung Naumann Haftpflicht GOT-667788",
                    senderEmail: "makler@gothaer.de",
                    receivedTime: "2025-12-14T11:30:00Z",
                    bodyPlain: "Ihre Anfrage wird bearbeitet."
                }
            ],
            statusHistory: [
                { date: "2025-12-04", from: null, to: "angefragt", note: "" },
                { date: "2025-12-14", from: "angefragt", to: "in-bearbeitung", note: "" }
            ]
        },

        "case-035": {
            id: "case-035",
            createdAt: "2025-11-24T11:00:00Z",
            updatedAt: "2025-12-07T15:30:00Z",
            kunde: { name: "Otto, Gabriele", confidence: 1.0, source: "manual" },
            versicherungsnummer: { value: "BAR-112233", confidence: 1.0, source: "auto" },
            versicherer: { name: "Barmenia", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: null,
            status: "in-bearbeitung",
            sparte: "Kranken",
            notes: "Wartet auf Rückmeldung",
            flagged: false,
            conversationIds: ["conv-035"],
            messageIds: ["msg-035-a", "msg-035-b"],
            messages: [
                {
                    entryID: "msg-035-a",
                    folder: "sent",
                    subject: "Maklervollmacht Otto Kranken BAR-112233",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-11-24T11:00:00Z",
                    bodyPlain: "Bestandsübertragung Kranken für Gabriele Otto."
                },
                {
                    entryID: "msg-035-b",
                    folder: "inbox",
                    subject: "AW: Maklervollmacht Otto Kranken BAR-112233",
                    senderEmail: "maklerservice@barmenia.de",
                    receivedTime: "2025-12-07T15:30:00Z",
                    bodyPlain: "Ihre Anfrage ist in Bearbeitung."
                }
            ],
            statusHistory: [
                { date: "2025-11-24", from: null, to: "angefragt", note: "" },
                { date: "2025-12-07", from: "angefragt", to: "in-bearbeitung", note: "" }
            ]
        },

        // ============================================
        // ANGEFRAGT (10 Vorgänge: case-036 bis case-045)
        // ============================================
        "case-036": {
            id: "case-036",
            createdAt: "2025-12-10T08:00:00Z",
            updatedAt: "2025-12-10T08:00:00Z",
            kunde: { name: "Peters, Helga", confidence: 1.0, source: "auto" },
            versicherungsnummer: { value: "AZ-778899", confidence: 1.0, source: "auto" },
            versicherer: { name: "Allianz", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: null,
            status: "angefragt",
            sparte: "Hausrat",
            notes: "",
            flagged: false,
            conversationIds: ["conv-036"],
            messageIds: ["msg-036-a"],
            messages: [
                {
                    entryID: "msg-036-a",
                    folder: "sent",
                    subject: "Bestandsübertragung Peters Hausrat AZ-778899",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-12-10T08:00:00Z",
                    bodyPlain: "Übertragung Hausrat AZ-778899 für Helga Peters."
                }
            ],
            statusHistory: [
                { date: "2025-12-10", from: null, to: "angefragt", note: "" }
            ]
        },

        "case-037": {
            id: "case-037",
            createdAt: "2025-12-11T09:30:00Z",
            updatedAt: "2025-12-11T09:30:00Z",
            kunde: { name: "Quandt, Joachim", confidence: 1.0, source: "manual" },
            versicherungsnummer: { value: "ERG-556677", confidence: 1.0, source: "auto" },
            versicherer: { name: "ERGO", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: null,
            status: "angefragt",
            sparte: "KFZ",
            notes: "",
            flagged: false,
            conversationIds: ["conv-037"],
            messageIds: ["msg-037-a"],
            messages: [
                {
                    entryID: "msg-037-a",
                    folder: "sent",
                    subject: "Courtagezusage Quandt KFZ ERG-556677",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-12-11T09:30:00Z",
                    bodyPlain: "Anfrage Bestandsübertragung KFZ für Joachim Quandt."
                }
            ],
            statusHistory: [
                { date: "2025-12-11", from: null, to: "angefragt", note: "" }
            ]
        },

        "case-038": {
            id: "case-038",
            createdAt: "2025-12-09T14:00:00Z",
            updatedAt: "2025-12-09T14:00:00Z",
            kunde: { name: "Ritter, Inge", confidence: 1.0, source: "auto" },
            versicherungsnummer: { value: "HDI-334455", confidence: 1.0, source: "auto" },
            versicherer: { name: "HDI", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: null,
            status: "angefragt",
            sparte: "Leben",
            notes: "",
            flagged: false,
            conversationIds: ["conv-038"],
            messageIds: ["msg-038-a"],
            messages: [
                {
                    entryID: "msg-038-a",
                    folder: "sent",
                    subject: "Bestandsübertragung Ritter Leben HDI-334455",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-12-09T14:00:00Z",
                    bodyPlain: "Übertragung Leben für Inge Ritter."
                }
            ],
            statusHistory: [
                { date: "2025-12-09", from: null, to: "angefragt", note: "" }
            ]
        },

        "case-039": {
            id: "case-039",
            createdAt: "2025-12-12T10:00:00Z",
            updatedAt: "2025-12-12T10:00:00Z",
            kunde: { name: "Schuster, Karl-Heinz", confidence: 1.0, source: "manual" },
            versicherungsnummer: { value: "AXA-889900", confidence: 1.0, source: "auto" },
            versicherer: { name: "AXA", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: null,
            status: "angefragt",
            sparte: "Wohngebäude",
            notes: "",
            flagged: false,
            conversationIds: ["conv-039"],
            messageIds: ["msg-039-a"],
            messages: [
                {
                    entryID: "msg-039-a",
                    folder: "sent",
                    subject: "Maklervollmacht Schuster Wohngebäude AXA-889900",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-12-12T10:00:00Z",
                    bodyPlain: "Bestandsübertragung Wohngebäude für Karl-Heinz Schuster."
                }
            ],
            statusHistory: [
                { date: "2025-12-12", from: null, to: "angefragt", note: "" }
            ]
        },

        "case-040": {
            id: "case-040",
            createdAt: "2025-12-08T11:30:00Z",
            updatedAt: "2025-12-08T11:30:00Z",
            kunde: { name: "Thiele, Hannelore", confidence: 1.0, source: "auto" },
            versicherungsnummer: { value: "ZUR-667788", confidence: 1.0, source: "auto" },
            versicherer: { name: "Zurich", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: null,
            status: "angefragt",
            sparte: "Unfall",
            notes: "",
            flagged: false,
            conversationIds: ["conv-040"],
            messageIds: ["msg-040-a"],
            messages: [
                {
                    entryID: "msg-040-a",
                    folder: "sent",
                    subject: "Bestandsübertragung Thiele Unfall ZUR-667788",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-12-08T11:30:00Z",
                    bodyPlain: "Übertragung Unfall für Hannelore Thiele."
                }
            ],
            statusHistory: [
                { date: "2025-12-08", from: null, to: "angefragt", note: "" }
            ]
        },

        "case-041": {
            id: "case-041",
            createdAt: "2025-12-13T08:00:00Z",
            updatedAt: "2025-12-13T08:00:00Z",
            kunde: { name: "Ulrich, Manfred", confidence: 1.0, source: "manual" },
            versicherungsnummer: { value: "GEN-334455", confidence: 1.0, source: "auto" },
            versicherer: { name: "Generali", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: null,
            status: "angefragt",
            sparte: "Rechtsschutz",
            notes: "",
            flagged: false,
            conversationIds: ["conv-041"],
            messageIds: ["msg-041-a"],
            messages: [
                {
                    entryID: "msg-041-a",
                    folder: "sent",
                    subject: "Courtagezusage Ulrich Rechtsschutz GEN-334455",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-12-13T08:00:00Z",
                    bodyPlain: "Anfrage Bestandsübertragung Rechtsschutz für Manfred Ulrich."
                }
            ],
            statusHistory: [
                { date: "2025-12-13", from: null, to: "angefragt", note: "" }
            ]
        },

        "case-042": {
            id: "case-042",
            createdAt: "2025-12-07T15:00:00Z",
            updatedAt: "2025-12-07T15:00:00Z",
            kunde: { name: "Voigt, Elfriede", confidence: 1.0, source: "auto" },
            versicherungsnummer: { value: "DEB-667788", confidence: 1.0, source: "auto" },
            versicherer: { name: "Debeka", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: null,
            status: "angefragt",
            sparte: "Kranken",
            notes: "",
            flagged: false,
            conversationIds: ["conv-042"],
            messageIds: ["msg-042-a"],
            messages: [
                {
                    entryID: "msg-042-a",
                    folder: "sent",
                    subject: "Bestandsübertragung Voigt Kranken DEB-667788",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-12-07T15:00:00Z",
                    bodyPlain: "Übertragung Kranken für Elfriede Voigt."
                }
            ],
            statusHistory: [
                { date: "2025-12-07", from: null, to: "angefragt", note: "" }
            ]
        },

        "case-043": {
            id: "case-043",
            createdAt: "2025-12-14T09:00:00Z",
            updatedAt: "2025-12-14T09:00:00Z",
            kunde: { name: "Winkler, Gerhard", confidence: 1.0, source: "manual" },
            versicherungsnummer: { value: "RV-445566", confidence: 1.0, source: "auto" },
            versicherer: { name: "R+V", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: null,
            status: "angefragt",
            sparte: "Rente",
            notes: "",
            flagged: false,
            conversationIds: ["conv-043"],
            messageIds: ["msg-043-a"],
            messages: [
                {
                    entryID: "msg-043-a",
                    folder: "sent",
                    subject: "Maklervollmacht Winkler Rente RV-445566",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-12-14T09:00:00Z",
                    bodyPlain: "Bestandsübertragung Rente für Gerhard Winkler."
                }
            ],
            statusHistory: [
                { date: "2025-12-14", from: null, to: "angefragt", note: "" }
            ]
        },

        "case-044": {
            id: "case-044",
            createdAt: "2025-12-06T10:30:00Z",
            updatedAt: "2025-12-06T10:30:00Z",
            kunde: { name: "Xaver, Elisabeth", confidence: 1.0, source: "auto" },
            versicherungsnummer: { value: "LVM-889900", confidence: 1.0, source: "auto" },
            versicherer: { name: "LVM", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: null,
            status: "angefragt",
            sparte: "Haftpflicht",
            notes: "",
            flagged: false,
            conversationIds: ["conv-044"],
            messageIds: ["msg-044-a"],
            messages: [
                {
                    entryID: "msg-044-a",
                    folder: "sent",
                    subject: "Bestandsübertragung Xaver Haftpflicht LVM-889900",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-12-06T10:30:00Z",
                    bodyPlain: "Übertragung Haftpflicht für Elisabeth Xaver."
                }
            ],
            statusHistory: [
                { date: "2025-12-06", from: null, to: "angefragt", note: "" }
            ]
        },

        "case-045": {
            id: "case-045",
            createdAt: "2025-12-05T13:00:00Z",
            updatedAt: "2025-12-05T13:00:00Z",
            kunde: { name: "Yilmaz, Fatma", confidence: 1.0, source: "manual" },
            versicherungsnummer: { value: "DEVK-778899", confidence: 1.0, source: "auto" },
            versicherer: { name: "DEVK", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: null,
            status: "angefragt",
            sparte: "KFZ",
            notes: "",
            flagged: false,
            conversationIds: ["conv-045"],
            messageIds: ["msg-045-a"],
            messages: [
                {
                    entryID: "msg-045-a",
                    folder: "sent",
                    subject: "Courtagezusage Yilmaz KFZ DEVK-778899",
                    senderEmail: "makler@meinbuero.de",
                    receivedTime: "2025-12-05T13:00:00Z",
                    bodyPlain: "Anfrage Bestandsübertragung KFZ für Fatma Yilmaz."
                }
            ],
            statusHistory: [
                { date: "2025-12-05", from: null, to: "angefragt", note: "" }
            ]
        },

        // ============================================
        // NEU (5 Vorgänge: case-046 bis case-050)
        // ============================================
        "case-046": {
            id: "case-046",
            createdAt: "2025-12-14T16:00:00Z",
            updatedAt: "2025-12-14T16:00:00Z",
            kunde: { name: "Zander, Heinz", confidence: 0.8, source: "auto" },
            versicherungsnummer: { value: "INTER-778899", confidence: 0.9, source: "auto" },
            versicherer: { name: "INTER", confidence: 1.0, source: "email-domain" },
            gueltigkeitsdatum: null,
            status: "neu",
            sparte: "Kranken",
            notes: "Kunde hat angerufen, Vollmacht wird noch unterschrieben",
            flagged: false,
            conversationIds: [],
            messageIds: [],
            messages: [],
            statusHistory: [
                { date: "2025-12-14", from: null, to: "neu", note: "Kunde hat angerufen" }
            ]
        },

        "case-047": {
            id: "case-047",
            createdAt: "2025-12-15T08:00:00Z",
            updatedAt: "2025-12-15T08:00:00Z",
            kunde: { name: "Albrecht, Gerd", confidence: 1.0, source: "manual" },
            versicherungsnummer: { value: "VWB-112233", confidence: 0.9, source: "auto" },
            versicherer: { name: "Volkswohl Bund", confidence: 1.0, source: "manual" },
            gueltigkeitsdatum: null,
            status: "neu",
            sparte: "Leben",
            notes: "Vollmacht liegt vor, muss noch versandt werden",
            flagged: false,
            conversationIds: [],
            messageIds: [],
            messages: [],
            statusHistory: [
                { date: "2025-12-15", from: null, to: "neu", note: "Vollmacht erhalten" }
            ]
        },

        "case-048": {
            id: "case-048",
            createdAt: "2025-12-15T09:30:00Z",
            updatedAt: "2025-12-15T09:30:00Z",
            kunde: { name: "Bender, Christa", confidence: 1.0, source: "manual" },
            versicherungsnummer: { value: "SL-445566", confidence: 0.85, source: "auto" },
            versicherer: { name: "Swiss Life", confidence: 1.0, source: "manual" },
            gueltigkeitsdatum: null,
            status: "neu",
            sparte: "BU",
            notes: "",
            flagged: false,
            conversationIds: [],
            messageIds: [],
            messages: [],
            statusHistory: [
                { date: "2025-12-15", from: null, to: "neu", note: "" }
            ]
        },

        "case-049": {
            id: "case-049",
            createdAt: "2025-12-15T10:00:00Z",
            updatedAt: "2025-12-15T10:00:00Z",
            kunde: { name: "Conrad, Ulrike", confidence: 0.9, source: "auto" },
            versicherungsnummer: { value: "CL-667788", confidence: 0.9, source: "auto" },
            versicherer: { name: "Canada Life", confidence: 1.0, source: "manual" },
            gueltigkeitsdatum: null,
            status: "neu",
            sparte: "Rente",
            notes: "Basisrente",
            flagged: true,
            conversationIds: [],
            messageIds: [],
            messages: [],
            statusHistory: [
                { date: "2025-12-15", from: null, to: "neu", note: "Dringend - Jahresende" }
            ]
        },

        "case-050": {
            id: "case-050",
            createdAt: "2025-12-15T11:30:00Z",
            updatedAt: "2025-12-15T11:30:00Z",
            kunde: { name: "Daum, Heinrich", confidence: 1.0, source: "manual" },
            versicherungsnummer: { value: "CON-889900", confidence: 0.95, source: "auto" },
            versicherer: { name: "Condor", confidence: 1.0, source: "manual" },
            gueltigkeitsdatum: null,
            status: "neu",
            sparte: "KFZ",
            notes: "Neukunde, kommt von Empfehlung",
            flagged: false,
            conversationIds: [],
            messageIds: [],
            messages: [],
            statusHistory: [
                { date: "2025-12-15", from: null, to: "neu", note: "Empfehlung von Kunde Müller" }
            ]
        }
    };

    /**
     * Demo-Daten in localStorage laden
     */
    function loadDemoData() {
        const settings = Storage.getSettings();

        // Nur laden wenn noch nicht geschehen
        if (settings.demoLoaded) {
            return false;
        }

        // Vorgänge speichern
        Storage.saveCases(DEMO_CASES);

        // Als geladen markieren
        Storage.saveSettings({ demoLoaded: true });

        return true;
    }

    /**
     * Demo-Daten zurücksetzen
     */
    function resetDemoData() {
        Storage.clearAll();
        Storage.saveCases(DEMO_CASES);
        Storage.saveSettings({ demoLoaded: true });
        return true;
    }

    /**
     * Prüfen ob Demo-Daten vorhanden sind
     */
    function hasDemoData() {
        const cases = Storage.getCases();
        return Object.keys(cases).length > 0;
    }

    // Öffentliche API
    return {
        DEMO_CASES,
        loadDemoData,
        resetDemoData,
        hasDemoData
    };
})();
