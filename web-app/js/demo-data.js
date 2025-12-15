/**
 * Demo-Daten Modul - 50 Beispiel-Vorgänge für Bestandsübertragung
 * Alle Vorgänge sind ERGO, verteilt auf verschiedene Makler
 */

const DemoData = (function() {
    'use strict';

    // Liste der Demo-Makler
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

    // Status-Verteilung: 15 bestätigt, 8 abgelehnt, Rest offen
    const DEMO_CASES = {
        // ============================================
        // BESTÄTIGT (15 Vorgänge)
        // ============================================
        "case-001": {
            id: "case-001",
            createdAt: "2025-11-01T09:00:00Z",
            updatedAt: "2025-12-10T14:30:00Z",
            kunde: { name: "Müller, Thomas", source: "manual" },
            versicherungsnummer: { value: "ERG-7834521", source: "auto" },
            gueltigkeitsdatum: { value: "01.01.2026", source: "auto" },
            status: "bestaetigt",
            sparte: "KFZ",
            makler: MAKLER[0],
            notes: "",
            conversationIds: ["conv-001"],
            messageIds: ["msg-001-a", "msg-001-b", "msg-001-c"],
            messages: [
                { entryID: "msg-001-a", folder: "sent", subject: "Bestandsübertragung Müller KFZ - ERG-7834521", senderEmail: "kontakt@vb-meier.de", receivedTime: "2025-11-01T09:00:00Z", bodyPlain: "Anfrage Bestandsübertragung für Herrn Thomas Müller, VS-Nr. ERG-7834521." },
                { entryID: "msg-001-b", folder: "inbox", subject: "AW: Bestandsübertragung Müller KFZ", senderEmail: "maklerservice@ergo.de", receivedTime: "2025-11-15T11:20:00Z", bodyPlain: "Ihre Anfrage wird geprüft." },
                { entryID: "msg-001-c", folder: "inbox", subject: "AW: Bestandsübertragung Müller KFZ", senderEmail: "maklerservice@ergo.de", receivedTime: "2025-12-10T14:30:00Z", bodyPlain: "Die Bestandsübertragung wurde bestätigt. Wirksamkeit 01.01.2026." }
            ],
            statusHistory: [
                { date: "2025-11-01", from: null, to: "angefragt", note: "Anfrage gesendet" },
                { date: "2025-11-15", from: "angefragt", to: "in-bearbeitung", note: "" },
                { date: "2025-12-10", from: "in-bearbeitung", to: "bestaetigt", note: "Bestätigt" }
            ]
        },
        "case-002": {
            id: "case-002",
            createdAt: "2025-10-20T10:15:00Z",
            updatedAt: "2025-11-25T09:00:00Z",
            kunde: { name: "Schmidt, Anna", source: "auto" },
            versicherungsnummer: { value: "ERG-9876543", source: "auto" },
            gueltigkeitsdatum: { value: "01.12.2025", source: "auto" },
            status: "bestaetigt",
            sparte: "Haftpflicht",
            makler: MAKLER[1],
            notes: "Privathaftpflicht inkl. Hundehalter",
            conversationIds: ["conv-002"],
            messageIds: ["msg-002-a", "msg-002-b"],
            messages: [
                { entryID: "msg-002-a", folder: "sent", subject: "Maklervollmacht Schmidt Haftpflicht ERG-9876543", senderEmail: "info@schmidt-partner.de", receivedTime: "2025-10-20T10:15:00Z", bodyPlain: "Bestandsübertragung für Frau Anna Schmidt." },
                { entryID: "msg-002-b", folder: "inbox", subject: "AW: Maklervollmacht Schmidt Haftpflicht", senderEmail: "maklerservice@ergo.de", receivedTime: "2025-11-25T09:00:00Z", bodyPlain: "Die Übertragung wurde zum 01.12.2025 bestätigt." }
            ],
            statusHistory: [
                { date: "2025-10-20", from: null, to: "angefragt", note: "" },
                { date: "2025-11-25", from: "angefragt", to: "bestaetigt", note: "" }
            ]
        },
        "case-003": {
            id: "case-003",
            createdAt: "2025-10-15T08:30:00Z",
            updatedAt: "2025-12-05T16:00:00Z",
            kunde: { name: "Weber, Michael", source: "manual" },
            versicherungsnummer: { value: "ERG-5566778", source: "auto" },
            gueltigkeitsdatum: { value: "01.01.2026", source: "auto" },
            status: "bestaetigt",
            sparte: "Hausrat",
            makler: MAKLER[2],
            notes: "",
            conversationIds: ["conv-003"],
            messageIds: ["msg-003-a", "msg-003-b"],
            messages: [
                { entryID: "msg-003-a", folder: "sent", subject: "Bestandsübertragung Weber Hausrat ERG-5566778", senderEmail: "makler@hofmann-assekuranz.de", receivedTime: "2025-10-15T08:30:00Z", bodyPlain: "Übertragung Hausrat für Michael Weber." },
                { entryID: "msg-003-b", folder: "inbox", subject: "AW: Bestandsübertragung Weber Hausrat", senderEmail: "maklerservice@ergo.de", receivedTime: "2025-12-05T16:00:00Z", bodyPlain: "Bestätigt zum 01.01.2026." }
            ],
            statusHistory: [
                { date: "2025-10-15", from: null, to: "angefragt", note: "" },
                { date: "2025-12-05", from: "angefragt", to: "bestaetigt", note: "" }
            ]
        },
        "case-004": {
            id: "case-004",
            createdAt: "2025-09-10T14:00:00Z",
            updatedAt: "2025-10-20T11:30:00Z",
            kunde: { name: "Fischer, Sandra", source: "auto" },
            versicherungsnummer: { value: "ERG-1234567", source: "auto" },
            gueltigkeitsdatum: { value: "01.11.2025", source: "auto" },
            status: "bestaetigt",
            sparte: "Rechtsschutz",
            makler: MAKLER[3],
            notes: "Familien-Rechtsschutz",
            conversationIds: ["conv-004"],
            messageIds: ["msg-004-a", "msg-004-b"],
            messages: [
                { entryID: "msg-004-a", folder: "sent", subject: "Courtagezusage Fischer Rechtsschutz ERG-1234567", senderEmail: "beratung@fk-wagner.de", receivedTime: "2025-09-10T14:00:00Z", bodyPlain: "Anfrage Bestandsübertragung für Sandra Fischer." },
                { entryID: "msg-004-b", folder: "inbox", subject: "AW: Courtagezusage Fischer Rechtsschutz", senderEmail: "maklerservice@ergo.de", receivedTime: "2025-10-20T11:30:00Z", bodyPlain: "Courtagezusage erteilt. Wirksamkeit ab 01.11.2025." }
            ],
            statusHistory: [
                { date: "2025-09-10", from: null, to: "angefragt", note: "" },
                { date: "2025-10-20", from: "angefragt", to: "bestaetigt", note: "" }
            ]
        },
        "case-005": {
            id: "case-005",
            createdAt: "2025-10-01T09:00:00Z",
            updatedAt: "2025-11-30T10:00:00Z",
            kunde: { name: "Bauer, Klaus", source: "manual" },
            versicherungsnummer: { value: "ERG-7788990", source: "auto" },
            gueltigkeitsdatum: { value: "01.01.2026", source: "auto" },
            status: "bestaetigt",
            sparte: "Leben",
            makler: MAKLER[4],
            notes: "Risikolebensversicherung 200.000 EUR",
            conversationIds: ["conv-005"],
            messageIds: ["msg-005-a", "msg-005-b"],
            messages: [
                { entryID: "msg-005-a", folder: "sent", subject: "Bestandsübertragung Bauer Leben ERG-7788990", senderEmail: "service@makler-krause.de", receivedTime: "2025-10-01T09:00:00Z", bodyPlain: "Übertragung Risikoleben für Klaus Bauer." },
                { entryID: "msg-005-b", folder: "inbox", subject: "AW: Bestandsübertragung Bauer Leben", senderEmail: "maklerservice@ergo.de", receivedTime: "2025-11-30T10:00:00Z", bodyPlain: "Übertragung bestätigt. Wirksamkeit 01.01.2026." }
            ],
            statusHistory: [
                { date: "2025-10-01", from: null, to: "angefragt", note: "" },
                { date: "2025-11-30", from: "angefragt", to: "bestaetigt", note: "" }
            ]
        },
        "case-006": {
            id: "case-006",
            createdAt: "2025-09-15T11:00:00Z",
            updatedAt: "2025-11-10T15:00:00Z",
            kunde: { name: "Klein, Petra", source: "auto" },
            versicherungsnummer: { value: "ERG-4455667", source: "auto" },
            gueltigkeitsdatum: { value: "01.12.2025", source: "auto" },
            status: "bestaetigt",
            sparte: "Unfall",
            makler: MAKLER[5],
            notes: "",
            conversationIds: ["conv-006"],
            messageIds: ["msg-006-a", "msg-006-b"],
            messages: [
                { entryID: "msg-006-a", folder: "sent", subject: "Maklervollmacht Klein Unfall ERG-4455667", senderEmail: "team@becker-makler.de", receivedTime: "2025-09-15T11:00:00Z", bodyPlain: "Bestandsübertragung Unfallversicherung für Petra Klein." },
                { entryID: "msg-006-b", folder: "inbox", subject: "AW: Maklervollmacht Klein Unfall", senderEmail: "maklerservice@ergo.de", receivedTime: "2025-11-10T15:00:00Z", bodyPlain: "Übertragung zum 01.12.2025 bestätigt." }
            ],
            statusHistory: [
                { date: "2025-09-15", from: null, to: "angefragt", note: "" },
                { date: "2025-11-10", from: "angefragt", to: "bestaetigt", note: "" }
            ]
        },
        "case-007": {
            id: "case-007",
            createdAt: "2025-10-10T10:30:00Z",
            updatedAt: "2025-12-01T09:00:00Z",
            kunde: { name: "Hofmann, Jürgen", source: "manual" },
            versicherungsnummer: { value: "ERG-1122334", source: "auto" },
            gueltigkeitsdatum: { value: "01.01.2026", source: "auto" },
            status: "bestaetigt",
            sparte: "Kranken",
            makler: MAKLER[6],
            notes: "Krankenzusatz ambulant/stationär",
            conversationIds: ["conv-007"],
            messageIds: ["msg-007-a", "msg-007-b"],
            messages: [
                { entryID: "msg-007-a", folder: "sent", subject: "Bestandsübertragung Hofmann Kranken ERG-1122334", senderEmail: "info@finanzhaus-richter.de", receivedTime: "2025-10-10T10:30:00Z", bodyPlain: "Übertragung Krankenzusatz für Jürgen Hofmann." },
                { entryID: "msg-007-b", folder: "inbox", subject: "AW: Bestandsübertragung Hofmann Kranken", senderEmail: "maklerservice@ergo.de", receivedTime: "2025-12-01T09:00:00Z", bodyPlain: "Die Übertragung wurde bestätigt." }
            ],
            statusHistory: [
                { date: "2025-10-10", from: null, to: "angefragt", note: "" },
                { date: "2025-12-01", from: "angefragt", to: "bestaetigt", note: "" }
            ]
        },
        "case-008": {
            id: "case-008",
            createdAt: "2025-09-20T08:00:00Z",
            updatedAt: "2025-10-25T14:00:00Z",
            kunde: { name: "Schulz, Martina", source: "auto" },
            versicherungsnummer: { value: "ERG-9988776", source: "auto" },
            gueltigkeitsdatum: { value: "01.11.2025", source: "auto" },
            status: "bestaetigt",
            sparte: "BU",
            makler: MAKLER[7],
            notes: "BU-Zusatz zur bAV",
            conversationIds: ["conv-008"],
            messageIds: ["msg-008-a", "msg-008-b"],
            messages: [
                { entryID: "msg-008-a", folder: "sent", subject: "Courtagezusage Schulz BU ERG-9988776", senderEmail: "makler@weber-assekuranz.de", receivedTime: "2025-09-20T08:00:00Z", bodyPlain: "Anfrage Bestandsübertragung BU für Martina Schulz." },
                { entryID: "msg-008-b", folder: "inbox", subject: "AW: Courtagezusage Schulz BU", senderEmail: "maklerservice@ergo.de", receivedTime: "2025-10-25T14:00:00Z", bodyPlain: "Courtagezusage erteilt. Wirksamkeit ab 01.11.2025." }
            ],
            statusHistory: [
                { date: "2025-09-20", from: null, to: "angefragt", note: "" },
                { date: "2025-10-25", from: "angefragt", to: "bestaetigt", note: "" }
            ]
        },
        "case-009": {
            id: "case-009",
            createdAt: "2025-10-05T13:00:00Z",
            updatedAt: "2025-11-28T10:30:00Z",
            kunde: { name: "Richter, Frank", source: "manual" },
            versicherungsnummer: { value: "ERG-3344556", source: "auto" },
            gueltigkeitsdatum: { value: "01.01.2026", source: "auto" },
            status: "bestaetigt",
            sparte: "KFZ",
            makler: MAKLER[0],
            notes: "Zweitwagen",
            conversationIds: ["conv-009"],
            messageIds: ["msg-009-a", "msg-009-b"],
            messages: [
                { entryID: "msg-009-a", folder: "sent", subject: "Bestandsübertragung Richter KFZ ERG-3344556", senderEmail: "kontakt@vb-meier.de", receivedTime: "2025-10-05T13:00:00Z", bodyPlain: "Übertragung KFZ-Vertrag für Frank Richter." },
                { entryID: "msg-009-b", folder: "inbox", subject: "AW: Bestandsübertragung Richter KFZ", senderEmail: "maklerservice@ergo.de", receivedTime: "2025-11-28T10:30:00Z", bodyPlain: "Die Bestandsübertragung wurde bestätigt." }
            ],
            statusHistory: [
                { date: "2025-10-05", from: null, to: "angefragt", note: "" },
                { date: "2025-11-28", from: "angefragt", to: "bestaetigt", note: "" }
            ]
        },
        "case-010": {
            id: "case-010",
            createdAt: "2025-09-25T15:00:00Z",
            updatedAt: "2025-11-20T11:00:00Z",
            kunde: { name: "Wolf, Christina", source: "auto" },
            versicherungsnummer: { value: "ERG-6677889", source: "auto" },
            gueltigkeitsdatum: { value: "01.12.2025", source: "auto" },
            status: "bestaetigt",
            sparte: "Rente",
            makler: MAKLER[1],
            notes: "Riester-Rente",
            conversationIds: ["conv-010"],
            messageIds: ["msg-010-a", "msg-010-b"],
            messages: [
                { entryID: "msg-010-a", folder: "sent", subject: "Maklervollmacht Wolf Rente ERG-6677889", senderEmail: "info@schmidt-partner.de", receivedTime: "2025-09-25T15:00:00Z", bodyPlain: "Bestandsübertragung Riester-Rente für Christina Wolf." },
                { entryID: "msg-010-b", folder: "inbox", subject: "AW: Maklervollmacht Wolf Rente", senderEmail: "maklerservice@ergo.de", receivedTime: "2025-11-20T11:00:00Z", bodyPlain: "Übertragung zum 01.12.2025 bestätigt." }
            ],
            statusHistory: [
                { date: "2025-09-25", from: null, to: "angefragt", note: "" },
                { date: "2025-11-20", from: "angefragt", to: "bestaetigt", note: "" }
            ]
        },
        "case-011": {
            id: "case-011",
            createdAt: "2025-10-12T09:30:00Z",
            updatedAt: "2025-12-08T14:00:00Z",
            kunde: { name: "Braun, Stefanie", source: "manual" },
            versicherungsnummer: { value: "ERG-2233445", source: "auto" },
            gueltigkeitsdatum: { value: "01.01.2026", source: "auto" },
            status: "bestaetigt",
            sparte: "Wohngebäude",
            makler: MAKLER[2],
            notes: "Inkl. Elementarschäden",
            conversationIds: ["conv-011"],
            messageIds: ["msg-011-a", "msg-011-b"],
            messages: [
                { entryID: "msg-011-a", folder: "sent", subject: "Bestandsübertragung Braun Wohngebäude ERG-2233445", senderEmail: "makler@hofmann-assekuranz.de", receivedTime: "2025-10-12T09:30:00Z", bodyPlain: "Übertragung Wohngebäude für Stefanie Braun." },
                { entryID: "msg-011-b", folder: "inbox", subject: "AW: Bestandsübertragung Braun Wohngebäude", senderEmail: "maklerservice@ergo.de", receivedTime: "2025-12-08T14:00:00Z", bodyPlain: "Die Übertragung wurde bestätigt." }
            ],
            statusHistory: [
                { date: "2025-10-12", from: null, to: "angefragt", note: "" },
                { date: "2025-12-08", from: "angefragt", to: "bestaetigt", note: "" }
            ]
        },
        "case-012": {
            id: "case-012",
            createdAt: "2025-09-05T10:00:00Z",
            updatedAt: "2025-10-30T16:00:00Z",
            kunde: { name: "Krause, Dieter", source: "auto" },
            versicherungsnummer: { value: "ERG-5566778", source: "auto" },
            gueltigkeitsdatum: { value: "01.11.2025", source: "auto" },
            status: "bestaetigt",
            sparte: "Kranken",
            makler: MAKLER[3],
            notes: "Zahnzusatz",
            conversationIds: ["conv-012"],
            messageIds: ["msg-012-a", "msg-012-b"],
            messages: [
                { entryID: "msg-012-a", folder: "sent", subject: "Maklervollmacht Krause Kranken ERG-5566778", senderEmail: "beratung@fk-wagner.de", receivedTime: "2025-09-05T10:00:00Z", bodyPlain: "Bestandsübertragung Zahnzusatz für Dieter Krause." },
                { entryID: "msg-012-b", folder: "inbox", subject: "AW: Maklervollmacht Krause Kranken", senderEmail: "maklerservice@ergo.de", receivedTime: "2025-10-30T16:00:00Z", bodyPlain: "Übertragung zum 01.11.2025 bestätigt." }
            ],
            statusHistory: [
                { date: "2025-09-05", from: null, to: "angefragt", note: "" },
                { date: "2025-10-30", from: "angefragt", to: "bestaetigt", note: "" }
            ]
        },
        "case-013": {
            id: "case-013",
            createdAt: "2025-10-18T11:00:00Z",
            updatedAt: "2025-12-02T09:30:00Z",
            kunde: { name: "Neumann, Hans", source: "manual" },
            versicherungsnummer: { value: "ERG-8899001", source: "auto" },
            gueltigkeitsdatum: { value: "01.01.2026", source: "auto" },
            status: "bestaetigt",
            sparte: "KFZ",
            makler: MAKLER[4],
            notes: "",
            conversationIds: ["conv-013"],
            messageIds: ["msg-013-a", "msg-013-b"],
            messages: [
                { entryID: "msg-013-a", folder: "sent", subject: "Bestandsübertragung Neumann KFZ ERG-8899001", senderEmail: "service@makler-krause.de", receivedTime: "2025-10-18T11:00:00Z", bodyPlain: "Übertragung KFZ für Hans Neumann." },
                { entryID: "msg-013-b", folder: "inbox", subject: "AW: Bestandsübertragung Neumann KFZ", senderEmail: "maklerservice@ergo.de", receivedTime: "2025-12-02T09:30:00Z", bodyPlain: "Die Bestandsübertragung wurde bestätigt." }
            ],
            statusHistory: [
                { date: "2025-10-18", from: null, to: "angefragt", note: "" },
                { date: "2025-12-02", from: "angefragt", to: "bestaetigt", note: "" }
            ]
        },
        "case-014": {
            id: "case-014",
            createdAt: "2025-09-28T14:30:00Z",
            updatedAt: "2025-11-15T10:00:00Z",
            kunde: { name: "Lang, Monika", source: "auto" },
            versicherungsnummer: { value: "ERG-1100223", source: "auto" },
            gueltigkeitsdatum: { value: "01.12.2025", source: "auto" },
            status: "bestaetigt",
            sparte: "Haftpflicht",
            makler: MAKLER[5],
            notes: "Privathaftpflicht",
            conversationIds: ["conv-014"],
            messageIds: ["msg-014-a", "msg-014-b"],
            messages: [
                { entryID: "msg-014-a", folder: "sent", subject: "Courtagezusage Lang Haftpflicht ERG-1100223", senderEmail: "team@becker-makler.de", receivedTime: "2025-09-28T14:30:00Z", bodyPlain: "Anfrage Bestandsübertragung für Monika Lang." },
                { entryID: "msg-014-b", folder: "inbox", subject: "AW: Courtagezusage Lang Haftpflicht", senderEmail: "maklerservice@ergo.de", receivedTime: "2025-11-15T10:00:00Z", bodyPlain: "Courtagezusage erteilt. Wirksamkeit ab 01.12.2025." }
            ],
            statusHistory: [
                { date: "2025-09-28", from: null, to: "angefragt", note: "" },
                { date: "2025-11-15", from: "angefragt", to: "bestaetigt", note: "" }
            ]
        },
        "case-015": {
            id: "case-015",
            createdAt: "2025-10-08T09:00:00Z",
            updatedAt: "2025-12-05T11:00:00Z",
            kunde: { name: "Schwarz, Bernd", source: "manual" },
            versicherungsnummer: { value: "ERG-4433221", source: "auto" },
            gueltigkeitsdatum: { value: "01.01.2026", source: "auto" },
            status: "bestaetigt",
            sparte: "Leben",
            makler: MAKLER[6],
            notes: "Kapitallebensversicherung",
            conversationIds: ["conv-015"],
            messageIds: ["msg-015-a", "msg-015-b"],
            messages: [
                { entryID: "msg-015-a", folder: "sent", subject: "Bestandsübertragung Schwarz Leben ERG-4433221", senderEmail: "info@finanzhaus-richter.de", receivedTime: "2025-10-08T09:00:00Z", bodyPlain: "Übertragung Kapitallebensversicherung für Bernd Schwarz." },
                { entryID: "msg-015-b", folder: "inbox", subject: "AW: Bestandsübertragung Schwarz Leben", senderEmail: "maklerservice@ergo.de", receivedTime: "2025-12-05T11:00:00Z", bodyPlain: "Die Übertragung wurde bestätigt." }
            ],
            statusHistory: [
                { date: "2025-10-08", from: null, to: "angefragt", note: "" },
                { date: "2025-12-05", from: "angefragt", to: "bestaetigt", note: "" }
            ]
        },

        // ============================================
        // ABGELEHNT (8 Vorgänge)
        // ============================================
        "case-016": {
            id: "case-016",
            createdAt: "2025-10-25T10:00:00Z",
            updatedAt: "2025-12-01T14:00:00Z",
            kunde: { name: "Koch, Sabine", source: "auto" },
            versicherungsnummer: { value: "ERG-7766554", source: "auto" },
            gueltigkeitsdatum: { value: "01.01.2026", source: "auto" },
            status: "abgelehnt",
            sparte: "KFZ",
            makler: MAKLER[7],
            notes: "Kunde hat widersprochen",
            conversationIds: ["conv-016"],
            messageIds: ["msg-016-a", "msg-016-b"],
            messages: [
                { entryID: "msg-016-a", folder: "sent", subject: "Bestandsübertragung Koch KFZ ERG-7766554", senderEmail: "makler@weber-assekuranz.de", receivedTime: "2025-10-25T10:00:00Z", bodyPlain: "Anfrage Bestandsübertragung für Sabine Koch." },
                { entryID: "msg-016-b", folder: "inbox", subject: "AW: Bestandsübertragung Koch KFZ", senderEmail: "maklerservice@ergo.de", receivedTime: "2025-12-01T14:00:00Z", bodyPlain: "Der Versicherungsnehmer hat der Übertragung widersprochen." }
            ],
            statusHistory: [
                { date: "2025-10-25", from: null, to: "angefragt", note: "" },
                { date: "2025-12-01", from: "angefragt", to: "abgelehnt", note: "VN-Widerspruch" }
            ]
        },
        "case-017": {
            id: "case-017",
            createdAt: "2025-11-02T09:30:00Z",
            updatedAt: "2025-12-10T11:00:00Z",
            kunde: { name: "Jung, Werner", source: "manual" },
            versicherungsnummer: { value: "ERG-3322110", source: "auto" },
            gueltigkeitsdatum: { value: "01.02.2026", source: "auto" },
            status: "abgelehnt",
            sparte: "Leben",
            makler: MAKLER[0],
            notes: "Maklervollmacht fehlt",
            conversationIds: ["conv-017"],
            messageIds: ["msg-017-a", "msg-017-b"],
            messages: [
                { entryID: "msg-017-a", folder: "sent", subject: "Maklervollmacht Jung Leben ERG-3322110", senderEmail: "kontakt@vb-meier.de", receivedTime: "2025-11-02T09:30:00Z", bodyPlain: "Bestandsübertragung Leben für Werner Jung." },
                { entryID: "msg-017-b", folder: "inbox", subject: "AW: Maklervollmacht Jung Leben", senderEmail: "maklerservice@ergo.de", receivedTime: "2025-12-10T11:00:00Z", bodyPlain: "Die Maklervollmacht wurde nicht eingereicht. Bitte nachreichen." }
            ],
            statusHistory: [
                { date: "2025-11-02", from: null, to: "angefragt", note: "" },
                { date: "2025-12-10", from: "angefragt", to: "abgelehnt", note: "Vollmacht fehlt" }
            ]
        },
        "case-018": {
            id: "case-018",
            createdAt: "2025-10-30T14:00:00Z",
            updatedAt: "2025-12-05T09:00:00Z",
            kunde: { name: "Keller, Ursula", source: "auto" },
            versicherungsnummer: { value: "ERG-9988770", source: "auto" },
            gueltigkeitsdatum: { value: "01.01.2026", source: "auto" },
            status: "abgelehnt",
            sparte: "Hausrat",
            makler: MAKLER[1],
            notes: "Vertrag bereits gekündigt",
            conversationIds: ["conv-018"],
            messageIds: ["msg-018-a", "msg-018-b"],
            messages: [
                { entryID: "msg-018-a", folder: "sent", subject: "Bestandsübertragung Keller Hausrat ERG-9988770", senderEmail: "info@schmidt-partner.de", receivedTime: "2025-10-30T14:00:00Z", bodyPlain: "Übertragung Hausrat für Ursula Keller." },
                { entryID: "msg-018-b", folder: "inbox", subject: "AW: Bestandsübertragung Keller Hausrat", senderEmail: "maklerservice@ergo.de", receivedTime: "2025-12-05T09:00:00Z", bodyPlain: "Der Vertrag wurde bereits gekündigt. Eine Übertragung ist nicht möglich." }
            ],
            statusHistory: [
                { date: "2025-10-30", from: null, to: "angefragt", note: "" },
                { date: "2025-12-05", from: "angefragt", to: "abgelehnt", note: "Vertrag gekündigt" }
            ]
        },
        "case-019": {
            id: "case-019",
            createdAt: "2025-11-05T11:00:00Z",
            updatedAt: "2025-12-08T15:00:00Z",
            kunde: { name: "Schuster, Paul", source: "manual" },
            versicherungsnummer: { value: "ERG-2211009", source: "auto" },
            gueltigkeitsdatum: { value: "01.02.2026", source: "auto" },
            status: "abgelehnt",
            sparte: "BU",
            makler: MAKLER[2],
            notes: "Kunde nicht erreichbar",
            conversationIds: ["conv-019"],
            messageIds: ["msg-019-a", "msg-019-b"],
            messages: [
                { entryID: "msg-019-a", folder: "sent", subject: "Courtagezusage Schuster BU ERG-2211009", senderEmail: "makler@hofmann-assekuranz.de", receivedTime: "2025-11-05T11:00:00Z", bodyPlain: "Anfrage Bestandsübertragung BU für Paul Schuster." },
                { entryID: "msg-019-b", folder: "inbox", subject: "AW: Courtagezusage Schuster BU", senderEmail: "maklerservice@ergo.de", receivedTime: "2025-12-08T15:00:00Z", bodyPlain: "Der Kunde konnte nicht erreicht werden. Übertragung nicht möglich." }
            ],
            statusHistory: [
                { date: "2025-11-05", from: null, to: "angefragt", note: "" },
                { date: "2025-12-08", from: "angefragt", to: "abgelehnt", note: "Nicht erreichbar" }
            ]
        },
        "case-020": {
            id: "case-020",
            createdAt: "2025-10-22T08:30:00Z",
            updatedAt: "2025-11-28T10:00:00Z",
            kunde: { name: "Winter, Eva", source: "auto" },
            versicherungsnummer: { value: "ERG-5544332", source: "auto" },
            gueltigkeitsdatum: { value: "01.01.2026", source: "auto" },
            status: "abgelehnt",
            sparte: "Rechtsschutz",
            makler: MAKLER[3],
            notes: "VN hat anderen Makler",
            conversationIds: ["conv-020"],
            messageIds: ["msg-020-a", "msg-020-b"],
            messages: [
                { entryID: "msg-020-a", folder: "sent", subject: "Bestandsübertragung Winter Rechtsschutz ERG-5544332", senderEmail: "beratung@fk-wagner.de", receivedTime: "2025-10-22T08:30:00Z", bodyPlain: "Übertragung Rechtsschutz für Eva Winter." },
                { entryID: "msg-020-b", folder: "inbox", subject: "AW: Bestandsübertragung Winter Rechtsschutz", senderEmail: "maklerservice@ergo.de", receivedTime: "2025-11-28T10:00:00Z", bodyPlain: "Der Kunde hat bereits einen anderen Makler beauftragt." }
            ],
            statusHistory: [
                { date: "2025-10-22", from: null, to: "angefragt", note: "" },
                { date: "2025-11-28", from: "angefragt", to: "abgelehnt", note: "Anderer Makler" }
            ]
        },
        "case-021": {
            id: "case-021",
            createdAt: "2025-11-10T13:00:00Z",
            updatedAt: "2025-12-12T09:30:00Z",
            kunde: { name: "Sommer, Karl", source: "manual" },
            versicherungsnummer: { value: "ERG-8877665", source: "auto" },
            gueltigkeitsdatum: { value: "01.02.2026", source: "auto" },
            status: "abgelehnt",
            sparte: "Kranken",
            makler: MAKLER[4],
            notes: "Falsche VS-Nr",
            conversationIds: ["conv-021"],
            messageIds: ["msg-021-a", "msg-021-b"],
            messages: [
                { entryID: "msg-021-a", folder: "sent", subject: "Maklervollmacht Sommer Kranken ERG-8877665", senderEmail: "service@makler-krause.de", receivedTime: "2025-11-10T13:00:00Z", bodyPlain: "Bestandsübertragung Kranken für Karl Sommer." },
                { entryID: "msg-021-b", folder: "inbox", subject: "AW: Maklervollmacht Sommer Kranken", senderEmail: "maklerservice@ergo.de", receivedTime: "2025-12-12T09:30:00Z", bodyPlain: "Die angegebene Versicherungsnummer existiert nicht." }
            ],
            statusHistory: [
                { date: "2025-11-10", from: null, to: "angefragt", note: "" },
                { date: "2025-12-12", from: "angefragt", to: "abgelehnt", note: "VS-Nr ungültig" }
            ]
        },
        "case-022": {
            id: "case-022",
            createdAt: "2025-10-28T10:30:00Z",
            updatedAt: "2025-12-03T14:00:00Z",
            kunde: { name: "Berg, Lisa", source: "auto" },
            versicherungsnummer: { value: "ERG-1122009", source: "auto" },
            gueltigkeitsdatum: { value: "01.01.2026", source: "auto" },
            status: "abgelehnt",
            sparte: "Unfall",
            makler: MAKLER[5],
            notes: "Leistungsfall läuft",
            conversationIds: ["conv-022"],
            messageIds: ["msg-022-a", "msg-022-b"],
            messages: [
                { entryID: "msg-022-a", folder: "sent", subject: "Bestandsübertragung Berg Unfall ERG-1122009", senderEmail: "team@becker-makler.de", receivedTime: "2025-10-28T10:30:00Z", bodyPlain: "Übertragung Unfallversicherung für Lisa Berg." },
                { entryID: "msg-022-b", folder: "inbox", subject: "AW: Bestandsübertragung Berg Unfall", senderEmail: "maklerservice@ergo.de", receivedTime: "2025-12-03T14:00:00Z", bodyPlain: "Es läuft ein Leistungsfall. Übertragung derzeit nicht möglich." }
            ],
            statusHistory: [
                { date: "2025-10-28", from: null, to: "angefragt", note: "" },
                { date: "2025-12-03", from: "angefragt", to: "abgelehnt", note: "Leistungsfall" }
            ]
        },
        "case-023": {
            id: "case-023",
            createdAt: "2025-11-08T15:00:00Z",
            updatedAt: "2025-12-11T11:00:00Z",
            kunde: { name: "Stein, Robert", source: "manual" },
            versicherungsnummer: { value: "ERG-4455009", source: "auto" },
            gueltigkeitsdatum: { value: "01.02.2026", source: "auto" },
            status: "abgelehnt",
            sparte: "Wohngebäude",
            makler: MAKLER[6],
            notes: "Doppelte Anfrage",
            conversationIds: ["conv-023"],
            messageIds: ["msg-023-a", "msg-023-b"],
            messages: [
                { entryID: "msg-023-a", folder: "sent", subject: "Courtagezusage Stein Wohngebäude ERG-4455009", senderEmail: "info@finanzhaus-richter.de", receivedTime: "2025-11-08T15:00:00Z", bodyPlain: "Anfrage Bestandsübertragung für Robert Stein." },
                { entryID: "msg-023-b", folder: "inbox", subject: "AW: Courtagezusage Stein Wohngebäude", senderEmail: "maklerservice@ergo.de", receivedTime: "2025-12-11T11:00:00Z", bodyPlain: "Eine Anfrage für diesen Vertrag wurde bereits gestellt." }
            ],
            statusHistory: [
                { date: "2025-11-08", from: null, to: "angefragt", note: "" },
                { date: "2025-12-11", from: "angefragt", to: "abgelehnt", note: "Doppelt" }
            ]
        },

        // ============================================
        // OFFEN (27 Vorgänge - verschiedene Status)
        // ============================================
        "case-024": {
            id: "case-024",
            createdAt: "2025-12-10T09:00:00Z",
            updatedAt: "2025-12-10T09:00:00Z",
            kunde: { name: "Vogel, Andrea", source: "auto" },
            versicherungsnummer: { value: "ERG-7700881", source: "auto" },
            gueltigkeitsdatum: { value: "01.02.2026", source: "auto" },
            status: "neu",
            sparte: "KFZ",
            makler: MAKLER[7],
            notes: "",
            conversationIds: [],
            messageIds: [],
            messages: [],
            statusHistory: [
                { date: "2025-12-10", from: null, to: "neu", note: "Manuell erstellt" }
            ]
        },
        "case-025": {
            id: "case-025",
            createdAt: "2025-12-09T14:30:00Z",
            updatedAt: "2025-12-09T14:30:00Z",
            kunde: { name: "Fuchs, Martin", source: "manual" },
            versicherungsnummer: { value: "ERG-9900112", source: "auto" },
            gueltigkeitsdatum: { value: "01.02.2026", source: "auto" },
            status: "neu",
            sparte: "Haftpflicht",
            makler: MAKLER[0],
            notes: "Noch vorbereiten",
            conversationIds: [],
            messageIds: [],
            messages: [],
            statusHistory: [
                { date: "2025-12-09", from: null, to: "neu", note: "" }
            ]
        },
        "case-026": {
            id: "case-026",
            createdAt: "2025-12-08T10:00:00Z",
            updatedAt: "2025-12-08T10:00:00Z",
            kunde: { name: "Hahn, Brigitte", source: "auto" },
            versicherungsnummer: { value: "ERG-2200334", source: "auto" },
            gueltigkeitsdatum: { value: "01.03.2026", source: "auto" },
            status: "neu",
            sparte: "Leben",
            makler: MAKLER[1],
            notes: "",
            conversationIds: [],
            messageIds: [],
            messages: [],
            statusHistory: [
                { date: "2025-12-08", from: null, to: "neu", note: "" }
            ]
        },
        "case-027": {
            id: "case-027",
            createdAt: "2025-12-05T11:30:00Z",
            updatedAt: "2025-12-12T09:00:00Z",
            kunde: { name: "Engel, Herbert", source: "manual" },
            versicherungsnummer: { value: "ERG-3300445", source: "auto" },
            gueltigkeitsdatum: { value: "01.02.2026", source: "auto" },
            status: "angefragt",
            sparte: "Hausrat",
            makler: MAKLER[2],
            notes: "",
            conversationIds: ["conv-027"],
            messageIds: ["msg-027-a"],
            messages: [
                { entryID: "msg-027-a", folder: "sent", subject: "Bestandsübertragung Engel Hausrat ERG-3300445", senderEmail: "makler@hofmann-assekuranz.de", receivedTime: "2025-12-12T09:00:00Z", bodyPlain: "Anfrage Bestandsübertragung für Herbert Engel." }
            ],
            statusHistory: [
                { date: "2025-12-05", from: null, to: "neu", note: "" },
                { date: "2025-12-12", from: "neu", to: "angefragt", note: "Anfrage gesendet" }
            ]
        },
        "case-028": {
            id: "case-028",
            createdAt: "2025-12-03T09:00:00Z",
            updatedAt: "2025-12-10T14:00:00Z",
            kunde: { name: "Kaiser, Gisela", source: "auto" },
            versicherungsnummer: { value: "ERG-4400556", source: "auto" },
            gueltigkeitsdatum: { value: "01.02.2026", source: "auto" },
            status: "angefragt",
            sparte: "BU",
            makler: MAKLER[3],
            notes: "",
            conversationIds: ["conv-028"],
            messageIds: ["msg-028-a"],
            messages: [
                { entryID: "msg-028-a", folder: "sent", subject: "Courtagezusage Kaiser BU ERG-4400556", senderEmail: "beratung@fk-wagner.de", receivedTime: "2025-12-10T14:00:00Z", bodyPlain: "Anfrage Courtagezusage für Gisela Kaiser." }
            ],
            statusHistory: [
                { date: "2025-12-03", from: null, to: "neu", note: "" },
                { date: "2025-12-10", from: "neu", to: "angefragt", note: "" }
            ]
        },
        "case-029": {
            id: "case-029",
            createdAt: "2025-12-01T13:00:00Z",
            updatedAt: "2025-12-11T10:30:00Z",
            kunde: { name: "Roth, Heinz", source: "manual" },
            versicherungsnummer: { value: "ERG-5500667", source: "auto" },
            gueltigkeitsdatum: { value: "01.02.2026", source: "auto" },
            status: "angefragt",
            sparte: "Rechtsschutz",
            makler: MAKLER[4],
            notes: "",
            conversationIds: ["conv-029"],
            messageIds: ["msg-029-a"],
            messages: [
                { entryID: "msg-029-a", folder: "sent", subject: "Maklervollmacht Roth Rechtsschutz ERG-5500667", senderEmail: "service@makler-krause.de", receivedTime: "2025-12-11T10:30:00Z", bodyPlain: "Bestandsübertragung Rechtsschutz für Heinz Roth." }
            ],
            statusHistory: [
                { date: "2025-12-01", from: null, to: "neu", note: "" },
                { date: "2025-12-11", from: "neu", to: "angefragt", note: "" }
            ]
        },
        "case-030": {
            id: "case-030",
            createdAt: "2025-11-28T10:00:00Z",
            updatedAt: "2025-12-12T15:00:00Z",
            kunde: { name: "Franke, Ingrid", source: "auto" },
            versicherungsnummer: { value: "ERG-6600778", source: "auto" },
            gueltigkeitsdatum: { value: "01.02.2026", source: "auto" },
            status: "in-bearbeitung",
            sparte: "Kranken",
            makler: MAKLER[5],
            notes: "Warte auf Kundenbestätigung",
            conversationIds: ["conv-030"],
            messageIds: ["msg-030-a", "msg-030-b"],
            messages: [
                { entryID: "msg-030-a", folder: "sent", subject: "Bestandsübertragung Franke Kranken ERG-6600778", senderEmail: "team@becker-makler.de", receivedTime: "2025-12-05T10:00:00Z", bodyPlain: "Übertragung Krankenzusatz für Ingrid Franke." },
                { entryID: "msg-030-b", folder: "inbox", subject: "AW: Bestandsübertragung Franke Kranken", senderEmail: "maklerservice@ergo.de", receivedTime: "2025-12-12T15:00:00Z", bodyPlain: "Der Kunde wird angeschrieben." }
            ],
            statusHistory: [
                { date: "2025-11-28", from: null, to: "neu", note: "" },
                { date: "2025-12-05", from: "neu", to: "angefragt", note: "" },
                { date: "2025-12-12", from: "angefragt", to: "in-bearbeitung", note: "" }
            ]
        },
        "case-031": {
            id: "case-031",
            createdAt: "2025-11-25T14:30:00Z",
            updatedAt: "2025-12-10T11:00:00Z",
            kunde: { name: "Otto, Wolfgang", source: "manual" },
            versicherungsnummer: { value: "ERG-7700889", source: "auto" },
            gueltigkeitsdatum: { value: "01.02.2026", source: "auto" },
            status: "in-bearbeitung",
            sparte: "Unfall",
            makler: MAKLER[6],
            notes: "",
            conversationIds: ["conv-031"],
            messageIds: ["msg-031-a", "msg-031-b"],
            messages: [
                { entryID: "msg-031-a", folder: "sent", subject: "Courtagezusage Otto Unfall ERG-7700889", senderEmail: "info@finanzhaus-richter.de", receivedTime: "2025-12-01T14:30:00Z", bodyPlain: "Anfrage Courtagezusage für Wolfgang Otto." },
                { entryID: "msg-031-b", folder: "inbox", subject: "AW: Courtagezusage Otto Unfall", senderEmail: "maklerservice@ergo.de", receivedTime: "2025-12-10T11:00:00Z", bodyPlain: "Ihre Anfrage wird geprüft." }
            ],
            statusHistory: [
                { date: "2025-11-25", from: null, to: "neu", note: "" },
                { date: "2025-12-01", from: "neu", to: "angefragt", note: "" },
                { date: "2025-12-10", from: "angefragt", to: "in-bearbeitung", note: "" }
            ]
        },
        "case-032": {
            id: "case-032",
            createdAt: "2025-11-20T09:00:00Z",
            updatedAt: "2025-12-08T16:00:00Z",
            kunde: { name: "Simon, Christine", source: "auto" },
            versicherungsnummer: { value: "ERG-8800990", source: "auto" },
            gueltigkeitsdatum: { value: "01.02.2026", source: "auto" },
            status: "in-bearbeitung",
            sparte: "Rente",
            makler: MAKLER[7],
            notes: "Unterlagen nachgereicht",
            conversationIds: ["conv-032"],
            messageIds: ["msg-032-a", "msg-032-b"],
            messages: [
                { entryID: "msg-032-a", folder: "sent", subject: "Bestandsübertragung Simon Rente ERG-8800990", senderEmail: "makler@weber-assekuranz.de", receivedTime: "2025-11-28T09:00:00Z", bodyPlain: "Übertragung Rente für Christine Simon." },
                { entryID: "msg-032-b", folder: "inbox", subject: "AW: Bestandsübertragung Simon Rente", senderEmail: "maklerservice@ergo.de", receivedTime: "2025-12-08T16:00:00Z", bodyPlain: "Bitte reichen Sie die unterschriebene Vollmacht nach." }
            ],
            statusHistory: [
                { date: "2025-11-20", from: null, to: "neu", note: "" },
                { date: "2025-11-28", from: "neu", to: "angefragt", note: "" },
                { date: "2025-12-08", from: "angefragt", to: "in-bearbeitung", note: "" }
            ]
        },
        "case-033": {
            id: "case-033",
            createdAt: "2025-11-18T11:00:00Z",
            updatedAt: "2025-12-06T09:30:00Z",
            kunde: { name: "Peters, Renate", source: "manual" },
            versicherungsnummer: { value: "ERG-9900001", source: "auto" },
            gueltigkeitsdatum: { value: "01.02.2026", source: "auto" },
            status: "in-bearbeitung",
            sparte: "Wohngebäude",
            makler: MAKLER[0],
            notes: "",
            conversationIds: ["conv-033"],
            messageIds: ["msg-033-a", "msg-033-b"],
            messages: [
                { entryID: "msg-033-a", folder: "sent", subject: "Maklervollmacht Peters Wohngebäude ERG-9900001", senderEmail: "kontakt@vb-meier.de", receivedTime: "2025-11-25T11:00:00Z", bodyPlain: "Bestandsübertragung Wohngebäude für Renate Peters." },
                { entryID: "msg-033-b", folder: "inbox", subject: "AW: Maklervollmacht Peters Wohngebäude", senderEmail: "maklerservice@ergo.de", receivedTime: "2025-12-06T09:30:00Z", bodyPlain: "Der Antrag ist in Bearbeitung." }
            ],
            statusHistory: [
                { date: "2025-11-18", from: null, to: "neu", note: "" },
                { date: "2025-11-25", from: "neu", to: "angefragt", note: "" },
                { date: "2025-12-06", from: "angefragt", to: "in-bearbeitung", note: "" }
            ]
        },
        "case-034": {
            id: "case-034",
            createdAt: "2025-12-11T08:00:00Z",
            updatedAt: "2025-12-11T08:00:00Z",
            kunde: { name: "Graf, Manfred", source: "auto" },
            versicherungsnummer: { value: "ERG-1100112", source: "auto" },
            gueltigkeitsdatum: { value: "01.03.2026", source: "auto" },
            status: "neu",
            sparte: "KFZ",
            makler: MAKLER[1],
            notes: "",
            conversationIds: [],
            messageIds: [],
            messages: [],
            statusHistory: [
                { date: "2025-12-11", from: null, to: "neu", note: "" }
            ]
        },
        "case-035": {
            id: "case-035",
            createdAt: "2025-12-10T15:00:00Z",
            updatedAt: "2025-12-14T10:00:00Z",
            kunde: { name: "Lorenz, Erika", source: "manual" },
            versicherungsnummer: { value: "ERG-2200223", source: "auto" },
            gueltigkeitsdatum: { value: "01.02.2026", source: "auto" },
            status: "angefragt",
            sparte: "Leben",
            makler: MAKLER[2],
            notes: "",
            conversationIds: ["conv-035"],
            messageIds: ["msg-035-a"],
            messages: [
                { entryID: "msg-035-a", folder: "sent", subject: "Bestandsübertragung Lorenz Leben ERG-2200223", senderEmail: "makler@hofmann-assekuranz.de", receivedTime: "2025-12-14T10:00:00Z", bodyPlain: "Anfrage Bestandsübertragung für Erika Lorenz." }
            ],
            statusHistory: [
                { date: "2025-12-10", from: null, to: "neu", note: "" },
                { date: "2025-12-14", from: "neu", to: "angefragt", note: "" }
            ]
        },
        "case-036": {
            id: "case-036",
            createdAt: "2025-12-09T09:30:00Z",
            updatedAt: "2025-12-09T09:30:00Z",
            kunde: { name: "Heinrich, Gerhard", source: "auto" },
            versicherungsnummer: { value: "ERG-3300334", source: "auto" },
            gueltigkeitsdatum: { value: "01.03.2026", source: "auto" },
            status: "neu",
            sparte: "Haftpflicht",
            makler: MAKLER[3],
            notes: "Termin vereinbaren",
            conversationIds: [],
            messageIds: [],
            messages: [],
            statusHistory: [
                { date: "2025-12-09", from: null, to: "neu", note: "" }
            ]
        },
        "case-037": {
            id: "case-037",
            createdAt: "2025-12-07T14:00:00Z",
            updatedAt: "2025-12-13T11:00:00Z",
            kunde: { name: "Walter, Helga", source: "manual" },
            versicherungsnummer: { value: "ERG-4400445", source: "auto" },
            gueltigkeitsdatum: { value: "01.02.2026", source: "auto" },
            status: "angefragt",
            sparte: "Hausrat",
            makler: MAKLER[4],
            notes: "",
            conversationIds: ["conv-037"],
            messageIds: ["msg-037-a"],
            messages: [
                { entryID: "msg-037-a", folder: "sent", subject: "Courtagezusage Walter Hausrat ERG-4400445", senderEmail: "service@makler-krause.de", receivedTime: "2025-12-13T11:00:00Z", bodyPlain: "Anfrage Courtagezusage für Helga Walter." }
            ],
            statusHistory: [
                { date: "2025-12-07", from: null, to: "neu", note: "" },
                { date: "2025-12-13", from: "neu", to: "angefragt", note: "" }
            ]
        },
        "case-038": {
            id: "case-038",
            createdAt: "2025-12-06T10:00:00Z",
            updatedAt: "2025-12-06T10:00:00Z",
            kunde: { name: "Brandt, Norbert", source: "auto" },
            versicherungsnummer: { value: "ERG-5500556", source: "auto" },
            gueltigkeitsdatum: { value: "01.03.2026", source: "auto" },
            status: "neu",
            sparte: "BU",
            makler: MAKLER[5],
            notes: "",
            conversationIds: [],
            messageIds: [],
            messages: [],
            statusHistory: [
                { date: "2025-12-06", from: null, to: "neu", note: "" }
            ]
        },
        "case-039": {
            id: "case-039",
            createdAt: "2025-12-04T11:30:00Z",
            updatedAt: "2025-12-12T14:00:00Z",
            kunde: { name: "Hartmann, Ilse", source: "manual" },
            versicherungsnummer: { value: "ERG-6600667", source: "auto" },
            gueltigkeitsdatum: { value: "01.02.2026", source: "auto" },
            status: "angefragt",
            sparte: "Rechtsschutz",
            makler: MAKLER[6],
            notes: "",
            conversationIds: ["conv-039"],
            messageIds: ["msg-039-a"],
            messages: [
                { entryID: "msg-039-a", folder: "sent", subject: "Maklervollmacht Hartmann Rechtsschutz ERG-6600667", senderEmail: "info@finanzhaus-richter.de", receivedTime: "2025-12-12T14:00:00Z", bodyPlain: "Bestandsübertragung Rechtsschutz für Ilse Hartmann." }
            ],
            statusHistory: [
                { date: "2025-12-04", from: null, to: "neu", note: "" },
                { date: "2025-12-12", from: "neu", to: "angefragt", note: "" }
            ]
        },
        "case-040": {
            id: "case-040",
            createdAt: "2025-12-02T09:00:00Z",
            updatedAt: "2025-12-14T09:30:00Z",
            kunde: { name: "Krüger, Helmut", source: "auto" },
            versicherungsnummer: { value: "ERG-7700778", source: "auto" },
            gueltigkeitsdatum: { value: "01.02.2026", source: "auto" },
            status: "in-bearbeitung",
            sparte: "Kranken",
            makler: MAKLER[7],
            notes: "",
            conversationIds: ["conv-040"],
            messageIds: ["msg-040-a", "msg-040-b"],
            messages: [
                { entryID: "msg-040-a", folder: "sent", subject: "Bestandsübertragung Krüger Kranken ERG-7700778", senderEmail: "makler@weber-assekuranz.de", receivedTime: "2025-12-09T09:00:00Z", bodyPlain: "Übertragung Kranken für Helmut Krüger." },
                { entryID: "msg-040-b", folder: "inbox", subject: "AW: Bestandsübertragung Krüger Kranken", senderEmail: "maklerservice@ergo.de", receivedTime: "2025-12-14T09:30:00Z", bodyPlain: "Der Antrag wird bearbeitet." }
            ],
            statusHistory: [
                { date: "2025-12-02", from: null, to: "neu", note: "" },
                { date: "2025-12-09", from: "neu", to: "angefragt", note: "" },
                { date: "2025-12-14", from: "angefragt", to: "in-bearbeitung", note: "" }
            ]
        },
        "case-041": {
            id: "case-041",
            createdAt: "2025-12-12T10:00:00Z",
            updatedAt: "2025-12-12T10:00:00Z",
            kunde: { name: "Maier, Gabriele", source: "manual" },
            versicherungsnummer: { value: "ERG-8800889", source: "auto" },
            gueltigkeitsdatum: { value: "01.03.2026", source: "auto" },
            status: "neu",
            sparte: "Unfall",
            makler: MAKLER[0],
            notes: "",
            conversationIds: [],
            messageIds: [],
            messages: [],
            statusHistory: [
                { date: "2025-12-12", from: null, to: "neu", note: "" }
            ]
        },
        "case-042": {
            id: "case-042",
            createdAt: "2025-12-11T14:30:00Z",
            updatedAt: "2025-12-14T11:00:00Z",
            kunde: { name: "Huber, Friedrich", source: "auto" },
            versicherungsnummer: { value: "ERG-9900990", source: "auto" },
            gueltigkeitsdatum: { value: "01.02.2026", source: "auto" },
            status: "angefragt",
            sparte: "Rente",
            makler: MAKLER[1],
            notes: "",
            conversationIds: ["conv-042"],
            messageIds: ["msg-042-a"],
            messages: [
                { entryID: "msg-042-a", folder: "sent", subject: "Courtagezusage Huber Rente ERG-9900990", senderEmail: "info@schmidt-partner.de", receivedTime: "2025-12-14T11:00:00Z", bodyPlain: "Anfrage Courtagezusage für Friedrich Huber." }
            ],
            statusHistory: [
                { date: "2025-12-11", from: null, to: "neu", note: "" },
                { date: "2025-12-14", from: "neu", to: "angefragt", note: "" }
            ]
        },
        "case-043": {
            id: "case-043",
            createdAt: "2025-12-10T08:00:00Z",
            updatedAt: "2025-12-10T08:00:00Z",
            kunde: { name: "Berger, Rosemarie", source: "manual" },
            versicherungsnummer: { value: "ERG-1011121", source: "auto" },
            gueltigkeitsdatum: { value: "01.03.2026", source: "auto" },
            status: "neu",
            sparte: "Wohngebäude",
            makler: MAKLER[2],
            notes: "Warten auf Unterlagen",
            conversationIds: [],
            messageIds: [],
            messages: [],
            statusHistory: [
                { date: "2025-12-10", from: null, to: "neu", note: "" }
            ]
        },
        "case-044": {
            id: "case-044",
            createdAt: "2025-12-08T13:00:00Z",
            updatedAt: "2025-12-13T16:00:00Z",
            kunde: { name: "Zimmermann, Erwin", source: "auto" },
            versicherungsnummer: { value: "ERG-2022232", source: "auto" },
            gueltigkeitsdatum: { value: "01.02.2026", source: "auto" },
            status: "angefragt",
            sparte: "KFZ",
            makler: MAKLER[3],
            notes: "",
            conversationIds: ["conv-044"],
            messageIds: ["msg-044-a"],
            messages: [
                { entryID: "msg-044-a", folder: "sent", subject: "Bestandsübertragung Zimmermann KFZ ERG-2022232", senderEmail: "beratung@fk-wagner.de", receivedTime: "2025-12-13T16:00:00Z", bodyPlain: "Anfrage Bestandsübertragung für Erwin Zimmermann." }
            ],
            statusHistory: [
                { date: "2025-12-08", from: null, to: "neu", note: "" },
                { date: "2025-12-13", from: "neu", to: "angefragt", note: "" }
            ]
        },
        "case-045": {
            id: "case-045",
            createdAt: "2025-12-07T09:30:00Z",
            updatedAt: "2025-12-07T09:30:00Z",
            kunde: { name: "Arnold, Marianne", source: "manual" },
            versicherungsnummer: { value: "ERG-3033343", source: "auto" },
            gueltigkeitsdatum: { value: "01.03.2026", source: "auto" },
            status: "neu",
            sparte: "Leben",
            makler: MAKLER[4],
            notes: "",
            conversationIds: [],
            messageIds: [],
            messages: [],
            statusHistory: [
                { date: "2025-12-07", from: null, to: "neu", note: "" }
            ]
        },
        "case-046": {
            id: "case-046",
            createdAt: "2025-12-05T15:00:00Z",
            updatedAt: "2025-12-12T10:00:00Z",
            kunde: { name: "Friedrich, Kurt", source: "auto" },
            versicherungsnummer: { value: "ERG-4044454", source: "auto" },
            gueltigkeitsdatum: { value: "01.02.2026", source: "auto" },
            status: "angefragt",
            sparte: "Haftpflicht",
            makler: MAKLER[5],
            notes: "",
            conversationIds: ["conv-046"],
            messageIds: ["msg-046-a"],
            messages: [
                { entryID: "msg-046-a", folder: "sent", subject: "Maklervollmacht Friedrich Haftpflicht ERG-4044454", senderEmail: "team@becker-makler.de", receivedTime: "2025-12-12T10:00:00Z", bodyPlain: "Bestandsübertragung Haftpflicht für Kurt Friedrich." }
            ],
            statusHistory: [
                { date: "2025-12-05", from: null, to: "neu", note: "" },
                { date: "2025-12-12", from: "neu", to: "angefragt", note: "" }
            ]
        },
        "case-047": {
            id: "case-047",
            createdAt: "2025-12-04T10:30:00Z",
            updatedAt: "2025-12-04T10:30:00Z",
            kunde: { name: "Scholz, Elfriede", source: "manual" },
            versicherungsnummer: { value: "ERG-5055565", source: "auto" },
            gueltigkeitsdatum: { value: "01.03.2026", source: "auto" },
            status: "neu",
            sparte: "Hausrat",
            makler: MAKLER[6],
            notes: "",
            conversationIds: [],
            messageIds: [],
            messages: [],
            statusHistory: [
                { date: "2025-12-04", from: null, to: "neu", note: "" }
            ]
        },
        "case-048": {
            id: "case-048",
            createdAt: "2025-12-03T11:00:00Z",
            updatedAt: "2025-12-11T15:00:00Z",
            kunde: { name: "Hansen, Rudolf", source: "auto" },
            versicherungsnummer: { value: "ERG-6066676", source: "auto" },
            gueltigkeitsdatum: { value: "01.02.2026", source: "auto" },
            status: "angefragt",
            sparte: "BU",
            makler: MAKLER[7],
            notes: "",
            conversationIds: ["conv-048"],
            messageIds: ["msg-048-a"],
            messages: [
                { entryID: "msg-048-a", folder: "sent", subject: "Courtagezusage Hansen BU ERG-6066676", senderEmail: "makler@weber-assekuranz.de", receivedTime: "2025-12-11T15:00:00Z", bodyPlain: "Anfrage Courtagezusage für Rudolf Hansen." }
            ],
            statusHistory: [
                { date: "2025-12-03", from: null, to: "neu", note: "" },
                { date: "2025-12-11", from: "neu", to: "angefragt", note: "" }
            ]
        },
        "case-049": {
            id: "case-049",
            createdAt: "2025-12-02T14:00:00Z",
            updatedAt: "2025-12-02T14:00:00Z",
            kunde: { name: "Winkler, Anneliese", source: "manual" },
            versicherungsnummer: { value: "ERG-7077787", source: "auto" },
            gueltigkeitsdatum: { value: "01.03.2026", source: "auto" },
            status: "neu",
            sparte: "Rechtsschutz",
            makler: MAKLER[0],
            notes: "Kundenrückruf ausstehend",
            conversationIds: [],
            messageIds: [],
            messages: [],
            statusHistory: [
                { date: "2025-12-02", from: null, to: "neu", note: "" }
            ]
        },
        "case-050": {
            id: "case-050",
            createdAt: "2025-12-01T09:00:00Z",
            updatedAt: "2025-12-10T09:00:00Z",
            kunde: { name: "Schubert, Gertrude", source: "auto" },
            versicherungsnummer: { value: "ERG-8088898", source: "auto" },
            gueltigkeitsdatum: { value: "01.02.2026", source: "auto" },
            status: "angefragt",
            sparte: "Kranken",
            makler: MAKLER[1],
            notes: "",
            conversationIds: ["conv-050"],
            messageIds: ["msg-050-a"],
            messages: [
                { entryID: "msg-050-a", folder: "sent", subject: "Bestandsübertragung Schubert Kranken ERG-8088898", senderEmail: "info@schmidt-partner.de", receivedTime: "2025-12-10T09:00:00Z", bodyPlain: "Übertragung Kranken für Gertrude Schubert." }
            ],
            statusHistory: [
                { date: "2025-12-01", from: null, to: "neu", note: "" },
                { date: "2025-12-10", from: "neu", to: "angefragt", note: "" }
            ]
        }
    };

    /**
     * Demo-Daten laden (falls erster Start)
     */
    function loadDemoData() {
        const settings = Storage.getSettings();

        if (settings.demoLoaded) {
            return false;
        }

        // Demo-Daten in Storage speichern
        Storage.saveCases(DEMO_CASES);
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
    }

    // Öffentliche API
    return {
        loadDemoData,
        resetDemoData,
        DEMO_CASES
    };
})();
