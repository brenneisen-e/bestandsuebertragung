/**
 * Storage Modul - localStorage Persistenz für Bestandsübertragung
 * Verwaltet Vorgänge, verarbeitete Nachrichten und Einstellungen
 */

const Storage = (function() {
    'use strict';

    // localStorage Keys
    const KEYS = {
        CASES: 'bestandsuebertragung_cases',
        PROCESSED: 'bestandsuebertragung_processed',
        SETTINGS: 'bestandsuebertragung_settings',
        UNASSIGNED: 'bestandsuebertragung_unassigned'
    };

    // Standard-Einstellungen
    const DEFAULT_SETTINGS = {
        autoMatch: true,
        showConfidence: true,
        confirmDelete: true,
        demoLoaded: false
    };

    /**
     * Hilfsfunktion zum sicheren JSON-Parsing
     */
    function safeJSONParse(str, fallback) {
        try {
            return JSON.parse(str) || fallback;
        } catch (e) {
            console.warn('JSON Parse Error:', e);
            return fallback;
        }
    }

    /**
     * Alle Vorgänge laden
     */
    function getCases() {
        const data = localStorage.getItem(KEYS.CASES);
        return safeJSONParse(data, {});
    }

    /**
     * Alle Vorgänge speichern
     */
    function saveCases(cases) {
        try {
            localStorage.setItem(KEYS.CASES, JSON.stringify(cases));
            return true;
        } catch (e) {
            console.error('Fehler beim Speichern:', e);
            return false;
        }
    }

    /**
     * Einzelnen Vorgang laden
     */
    function getCase(id) {
        const cases = getCases();
        return cases[id] || null;
    }

    /**
     * Einzelnen Vorgang speichern oder aktualisieren
     */
    function saveCase(caseData) {
        const cases = getCases();
        const now = new Date().toISOString();

        if (!caseData.id) {
            caseData.id = generateId();
            caseData.createdAt = now;
        }
        caseData.updatedAt = now;

        cases[caseData.id] = caseData;
        return saveCases(cases) ? caseData : null;
    }

    /**
     * Vorgang löschen
     */
    function deleteCase(id) {
        const cases = getCases();
        if (cases[id]) {
            delete cases[id];
            return saveCases(cases);
        }
        return false;
    }

    /**
     * Vorgänge als Array (für Filterung/Sortierung)
     */
    function getCasesArray() {
        const cases = getCases();
        return Object.values(cases);
    }

    /**
     * Verarbeitete Message-IDs laden
     */
    function getProcessedMessageIds() {
        const data = localStorage.getItem(KEYS.PROCESSED);
        return safeJSONParse(data, []);
    }

    /**
     * Message-ID als verarbeitet markieren
     */
    function markMessageProcessed(messageId) {
        const processed = getProcessedMessageIds();
        if (!processed.includes(messageId)) {
            processed.push(messageId);
            localStorage.setItem(KEYS.PROCESSED, JSON.stringify(processed));
        }
    }

    /**
     * Mehrere Message-IDs als verarbeitet markieren
     */
    function markMessagesProcessed(messageIds) {
        const processed = getProcessedMessageIds();
        let changed = false;
        messageIds.forEach(id => {
            if (!processed.includes(id)) {
                processed.push(id);
                changed = true;
            }
        });
        if (changed) {
            localStorage.setItem(KEYS.PROCESSED, JSON.stringify(processed));
        }
    }

    /**
     * Prüfen ob Message bereits verarbeitet
     */
    function isMessageProcessed(messageId) {
        const processed = getProcessedMessageIds();
        return processed.includes(messageId);
    }

    /**
     * Nicht zugeordnete Mails laden
     */
    function getUnassignedMails() {
        const data = localStorage.getItem(KEYS.UNASSIGNED);
        return safeJSONParse(data, []);
    }

    /**
     * Nicht zugeordnete Mail hinzufügen
     */
    function addUnassignedMail(mail) {
        const mails = getUnassignedMails();
        // Keine Duplikate
        if (!mails.find(m => m.entryID === mail.entryID)) {
            mails.push(mail);
            localStorage.setItem(KEYS.UNASSIGNED, JSON.stringify(mails));
        }
    }

    /**
     * Nicht zugeordnete Mail entfernen
     */
    function removeUnassignedMail(entryID) {
        let mails = getUnassignedMails();
        mails = mails.filter(m => m.entryID !== entryID);
        localStorage.setItem(KEYS.UNASSIGNED, JSON.stringify(mails));
    }

    /**
     * Alle nicht zugeordneten Mails löschen
     */
    function clearUnassignedMails() {
        localStorage.setItem(KEYS.UNASSIGNED, JSON.stringify([]));
    }

    /**
     * Einstellungen laden
     */
    function getSettings() {
        const data = localStorage.getItem(KEYS.SETTINGS);
        return { ...DEFAULT_SETTINGS, ...safeJSONParse(data, {}) };
    }

    /**
     * Einstellungen speichern
     */
    function saveSettings(settings) {
        const current = getSettings();
        const updated = { ...current, ...settings };
        localStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
        return updated;
    }

    /**
     * Alle Daten löschen (für Reset)
     */
    function clearAll() {
        localStorage.removeItem(KEYS.CASES);
        localStorage.removeItem(KEYS.PROCESSED);
        localStorage.removeItem(KEYS.UNASSIGNED);
        // Settings behalten, aber demoLoaded zurücksetzen
        const settings = getSettings();
        settings.demoLoaded = false;
        localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    }

    /**
     * UUID generieren
     */
    function generateId() {
        return 'case-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Statistiken berechnen
     */
    function getStats() {
        const cases = getCasesArray();
        const stats = {
            total: cases.length,
            neu: 0,
            angefragt: 0,
            'in-bearbeitung': 0,
            bestaetigt: 0,
            abgelehnt: 0,
            erledigt: 0,
            flagged: 0
        };

        cases.forEach(c => {
            if (stats[c.status] !== undefined) {
                stats[c.status]++;
            }
            if (c.flagged) {
                stats.flagged++;
            }
        });

        return stats;
    }

    /**
     * Vorgang nach ConversationID finden
     */
    function findCaseByConversationId(conversationId) {
        const cases = getCasesArray();
        return cases.find(c =>
            c.conversationIds && c.conversationIds.includes(conversationId)
        );
    }

    /**
     * Vorgang nach Versicherungsnummer finden
     */
    function findCaseByVsNr(vsNr) {
        if (!vsNr) return null;
        const cases = getCasesArray();
        const normalizedVsNr = vsNr.replace(/[-\s]/g, '').toUpperCase();
        return cases.find(c => {
            if (!c.versicherungsnummer || !c.versicherungsnummer.value) return false;
            const caseVsNr = c.versicherungsnummer.value.replace(/[-\s]/g, '').toUpperCase();
            return caseVsNr === normalizedVsNr;
        });
    }

    /**
     * Vorgänge nach Kundenname finden
     */
    function findCasesByKunde(name) {
        if (!name) return [];
        const cases = getCasesArray();
        const normalizedName = name.toLowerCase();
        return cases.filter(c => {
            if (!c.kunde || !c.kunde.name) return false;
            return c.kunde.name.toLowerCase().includes(normalizedName);
        });
    }

    /**
     * Nachrichten zu einem Vorgang hinzufügen
     */
    function addMessagesToCase(caseId, messages) {
        const caseData = getCase(caseId);
        if (!caseData) return false;

        if (!caseData.messages) caseData.messages = [];
        if (!caseData.messageIds) caseData.messageIds = [];
        if (!caseData.conversationIds) caseData.conversationIds = [];

        messages.forEach(msg => {
            // Prüfen ob Nachricht bereits vorhanden
            if (!caseData.messageIds.includes(msg.entryID)) {
                caseData.messages.push(msg);
                caseData.messageIds.push(msg.entryID);

                // ConversationID hinzufügen falls vorhanden
                if (msg.conversationID && !caseData.conversationIds.includes(msg.conversationID)) {
                    caseData.conversationIds.push(msg.conversationID);
                }
            }
        });

        return saveCase(caseData);
    }

    /**
     * Status-Historie Eintrag hinzufügen
     */
    function addStatusHistory(caseId, fromStatus, toStatus, note) {
        const caseData = getCase(caseId);
        if (!caseData) return false;

        if (!caseData.statusHistory) caseData.statusHistory = [];

        caseData.statusHistory.push({
            date: new Date().toISOString().split('T')[0],
            from: fromStatus,
            to: toStatus,
            note: note || ''
        });

        return saveCase(caseData);
    }

    /**
     * Speicherplatz-Info
     */
    function getStorageInfo() {
        let total = 0;
        for (let key of Object.values(KEYS)) {
            const item = localStorage.getItem(key);
            if (item) {
                total += item.length * 2; // UTF-16 = 2 bytes per char
            }
        }
        return {
            used: total,
            usedKB: (total / 1024).toFixed(2),
            usedMB: (total / 1024 / 1024).toFixed(2),
            limit: '5MB (ca.)'
        };
    }

    /**
     * Export aller Daten (Backup)
     */
    function exportData() {
        return {
            exportDate: new Date().toISOString(),
            cases: getCases(),
            processed: getProcessedMessageIds(),
            unassigned: getUnassignedMails(),
            settings: getSettings()
        };
    }

    /**
     * Import von Backup-Daten
     */
    function importData(data) {
        try {
            if (data.cases) {
                localStorage.setItem(KEYS.CASES, JSON.stringify(data.cases));
            }
            if (data.processed) {
                localStorage.setItem(KEYS.PROCESSED, JSON.stringify(data.processed));
            }
            if (data.unassigned) {
                localStorage.setItem(KEYS.UNASSIGNED, JSON.stringify(data.unassigned));
            }
            if (data.settings) {
                localStorage.setItem(KEYS.SETTINGS, JSON.stringify(data.settings));
            }
            return true;
        } catch (e) {
            console.error('Import fehlgeschlagen:', e);
            return false;
        }
    }

    // Öffentliche API
    return {
        // Vorgänge
        getCases,
        saveCases,
        getCase,
        saveCase,
        deleteCase,
        getCasesArray,
        findCaseByConversationId,
        findCaseByVsNr,
        findCasesByKunde,
        addMessagesToCase,
        addStatusHistory,

        // Verarbeitete Nachrichten
        getProcessedMessageIds,
        markMessageProcessed,
        markMessagesProcessed,
        isMessageProcessed,

        // Nicht zugeordnete Mails
        getUnassignedMails,
        addUnassignedMail,
        removeUnassignedMail,
        clearUnassignedMails,

        // Einstellungen
        getSettings,
        saveSettings,

        // Statistiken
        getStats,

        // Utilities
        generateId,
        clearAll,
        getStorageInfo,
        exportData,
        importData
    };
})();
