/**
 * App Modul - Hauptapplikation für Bestandsübertragung Tool
 * Initialisiert die Anwendung und verbindet alle Module
 */

const App = (function() {
    'use strict';

    // Aktueller Zustand
    let currentCases = [];
    let currentUnassigned = [];
    let selectedAssignCaseId = null;
    let currentAssignMailId = null;

    /**
     * Anwendung initialisieren
     */
    function init() {
        console.log('Bestandsübertragung Tool wird initialisiert...');

        // UI initialisieren
        UI.init();

        // Demo-Daten laden (falls erster Start)
        if (DemoData.loadDemoData()) {
            console.log('Demo-Daten wurden geladen');
            UI.showToast('50 Demo-Vorgänge wurden geladen', 'success');
        }

        // Event-Listener registrieren
        setupEventListeners();

        // Initiale Daten laden
        refreshData();

        console.log('Initialisierung abgeschlossen');
    }

    /**
     * Event-Listener einrichten
     */
    function setupEventListeners() {
        // Header Buttons
        document.getElementById('fileInput')?.addEventListener('change', handleFileImport);
        document.getElementById('exportCsvBtn')?.addEventListener('click', handleCsvExport);
        document.getElementById('resetDemoBtn')?.addEventListener('click', handleDemoReset);
        document.getElementById('newCaseBtn')?.addEventListener('click', () => openCaseModal(null));

        // Filter
        document.getElementById('searchInput')?.addEventListener('input', debounce(refreshCasesList, 300));
        document.getElementById('filterStatus')?.addEventListener('change', refreshCasesList);
        document.getElementById('filterVersicherer')?.addEventListener('change', refreshCasesList);
        document.getElementById('filterSparte')?.addEventListener('change', refreshCasesList);
        document.getElementById('filterFlagged')?.addEventListener('change', refreshCasesList);
        document.getElementById('filterOpen')?.addEventListener('change', refreshCasesList);
        document.getElementById('sortSelect')?.addEventListener('change', refreshCasesList);

        // Case Modal
        document.getElementById('modalClose')?.addEventListener('click', () => UI.closeCaseModal());
        document.getElementById('cancelCase')?.addEventListener('click', () => UI.closeCaseModal());
        document.getElementById('saveCase')?.addEventListener('click', handleSaveCase);
        document.getElementById('deleteCase')?.addEventListener('click', handleDeleteCase);

        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => UI.switchTab(btn.dataset.tab));
        });

        // Assign Modal
        document.getElementById('assignModalClose')?.addEventListener('click', () => UI.closeAssignModal());
        document.getElementById('assignCancel')?.addEventListener('click', () => UI.closeAssignModal());
        document.getElementById('assignSearch')?.addEventListener('input', debounce(handleAssignSearch, 300));
        document.getElementById('assignConfirm')?.addEventListener('click', handleAssignConfirm);

        // Cases Liste - Klick auf Karte
        document.getElementById('casesList')?.addEventListener('click', handleCaseCardClick);

        // Assign Results - Klick auf Ergebnis
        document.getElementById('assignResults')?.addEventListener('click', handleAssignResultClick);

        // Drag & Drop
        setupDragAndDrop();

        // Modal schließen bei Klick außerhalb
        document.getElementById('caseModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'caseModal') UI.closeCaseModal();
        });
        document.getElementById('assignModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'assignModal') UI.closeAssignModal();
        });

        // Keyboard Shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                UI.closeCaseModal();
                UI.closeAssignModal();
            }
        });
    }

    /**
     * Drag & Drop für JSON-Import
     */
    function setupDragAndDrop() {
        const body = document.body;

        body.addEventListener('dragenter', (e) => {
            e.preventDefault();
            UI.showDropOverlay(true);
        });

        body.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        body.addEventListener('dragleave', (e) => {
            if (e.target === document.getElementById('dropOverlay')) {
                UI.showDropOverlay(false);
            }
        });

        body.addEventListener('drop', (e) => {
            e.preventDefault();
            UI.showDropOverlay(false);

            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type === 'application/json') {
                processImportFile(files[0]);
            } else {
                UI.showToast('Bitte nur JSON-Dateien importieren', 'warning');
            }
        });
    }

    /**
     * Daten aktualisieren
     */
    function refreshData() {
        // Statistiken aktualisieren
        const stats = Storage.getStats();
        UI.renderStats(stats);

        // Versicherer-Filter befüllen
        currentCases = Storage.getCasesArray();
        UI.populateVersichererFilter(currentCases);

        // Vorgangsliste aktualisieren
        refreshCasesList();

        // Nicht zugeordnete Mails aktualisieren
        refreshUnassigned();
    }

    /**
     * Vorgangsliste aktualisieren (mit Filter/Sortierung)
     */
    function refreshCasesList() {
        const filters = UI.getFilterValues();
        let cases = Storage.getCasesArray();

        // Filtern
        cases = filterCases(cases, filters);

        // Sortieren
        cases = sortCases(cases, filters.sort);

        // Rendern
        currentCases = cases;
        UI.renderCasesList(cases);

        // Statistiken aktualisieren
        const stats = Storage.getStats();
        UI.renderStats(stats);
    }

    /**
     * Vorgänge filtern
     */
    function filterCases(cases, filters) {
        return cases.filter(c => {
            // Textsuche
            if (filters.search) {
                const searchText = filters.search.toLowerCase();
                const searchFields = [
                    c.kunde?.name,
                    c.versicherungsnummer?.value,
                    c.versicherer?.name,
                    c.sparte,
                    c.notes
                ].filter(Boolean).join(' ').toLowerCase();

                if (!searchFields.includes(searchText)) {
                    return false;
                }
            }

            // Status
            if (filters.status && c.status !== filters.status) {
                return false;
            }

            // Versicherer
            if (filters.versicherer && c.versicherer?.name !== filters.versicherer) {
                return false;
            }

            // Sparte
            if (filters.sparte && c.sparte !== filters.sparte) {
                return false;
            }

            // Nur geflaggte
            if (filters.flaggedOnly && !c.flagged) {
                return false;
            }

            // Nur offene (nicht erledigt, nicht bestätigt, nicht abgelehnt)
            if (filters.openOnly) {
                const closedStates = ['erledigt', 'bestaetigt', 'abgelehnt'];
                if (closedStates.includes(c.status)) {
                    return false;
                }
            }

            return true;
        });
    }

    /**
     * Vorgänge sortieren
     */
    function sortCases(cases, sortOption) {
        const [field, direction] = sortOption.split('-');
        const multiplier = direction === 'desc' ? -1 : 1;

        return cases.sort((a, b) => {
            let valueA, valueB;

            switch (field) {
                case 'updatedAt':
                    valueA = new Date(a.updatedAt || 0);
                    valueB = new Date(b.updatedAt || 0);
                    break;
                case 'createdAt':
                    valueA = new Date(a.createdAt || 0);
                    valueB = new Date(b.createdAt || 0);
                    break;
                case 'kunde':
                    valueA = (a.kunde?.name || '').toLowerCase();
                    valueB = (b.kunde?.name || '').toLowerCase();
                    break;
                default:
                    return 0;
            }

            if (valueA < valueB) return -1 * multiplier;
            if (valueA > valueB) return 1 * multiplier;
            return 0;
        });
    }

    /**
     * Nicht zugeordnete Mails aktualisieren
     */
    function refreshUnassigned() {
        currentUnassigned = Storage.getUnassignedMails();
        UI.renderUnassignedMails(currentUnassigned);
    }

    /**
     * Datei-Import Handler
     */
    function handleFileImport(e) {
        const file = e.target.files[0];
        if (file) {
            processImportFile(file);
        }
        // Input zurücksetzen für erneuten Import
        e.target.value = '';
    }

    /**
     * Import-Datei verarbeiten
     */
    async function processImportFile(file) {
        try {
            const result = await Export.importFromJSON(file);

            if (result.type === 'backup') {
                UI.showToast('Backup erfolgreich importiert', 'success');
                refreshData();
            } else if (result.type === 'outlook') {
                const processResult = Export.processOutlookExport(result.data);

                let message = `${processResult.processed} E-Mails verarbeitet`;
                if (processResult.matched > 0) {
                    message += `, ${processResult.matched} automatisch zugeordnet`;
                }
                if (processResult.unmatched > 0) {
                    message += `, ${processResult.unmatched} nicht zugeordnet`;
                }

                UI.showToast(message, processResult.matched > 0 ? 'success' : 'info');
                refreshData();
            }
        } catch (error) {
            console.error('Import-Fehler:', error);
            UI.showToast(error.message, 'error');
        }
    }

    /**
     * CSV Export Handler
     */
    function handleCsvExport() {
        const filters = UI.getFilterValues();
        let cases = Storage.getCasesArray();
        cases = filterCases(cases, filters);
        cases = sortCases(cases, filters.sort);

        if (cases.length === 0) {
            UI.showToast('Keine Daten zum Exportieren', 'warning');
            return;
        }

        Export.exportToCSV(cases);
    }

    /**
     * Demo Reset Handler
     */
    function handleDemoReset() {
        if (confirm('Alle Daten werden gelöscht und durch 50 Demo-Vorgänge ersetzt. Fortfahren?')) {
            DemoData.resetDemoData();
            UI.showToast('Demo-Daten wurden zurückgesetzt', 'success');
            refreshData();
        }
    }

    /**
     * Klick auf Vorgangs-Karte
     */
    function handleCaseCardClick(e) {
        const card = e.target.closest('.case-card');
        if (!card) return;

        const caseId = card.dataset.caseId;
        const caseData = Storage.getCase(caseId);

        if (caseData) {
            openCaseModal(caseData);
        }
    }

    /**
     * Vorgang Modal öffnen
     */
    function openCaseModal(caseData) {
        UI.openCaseModal(caseData);
    }

    /**
     * Vorgang speichern
     */
    function handleSaveCase() {
        const formData = UI.getCaseFormData();

        // Validierung
        if (!formData.kunde.name && !formData.versicherungsnummer.value) {
            UI.showToast('Bitte mindestens Kunde oder VS-Nr angeben', 'warning');
            return;
        }

        let caseData;
        const isNew = !formData.id;

        if (isNew) {
            // Neuer Vorgang
            caseData = {
                ...formData,
                conversationIds: [],
                messageIds: [],
                messages: [],
                statusHistory: [
                    { date: new Date().toISOString().split('T')[0], from: null, to: formData.status, note: 'Manuell erstellt' }
                ]
            };
        } else {
            // Bestehender Vorgang
            caseData = Storage.getCase(formData.id);
            const oldStatus = caseData.status;

            // Daten aktualisieren
            caseData.kunde.name = formData.kunde.name;
            if (!caseData.kunde.source || formData.kunde.name !== caseData.kunde.name) {
                caseData.kunde.source = 'manual';
                caseData.kunde.confidence = 1.0;
            }

            caseData.versicherungsnummer.value = formData.versicherungsnummer.value;
            if (!caseData.versicherungsnummer.source || formData.versicherungsnummer.value !== caseData.versicherungsnummer.value) {
                caseData.versicherungsnummer.source = 'manual';
                caseData.versicherungsnummer.confidence = 1.0;
            }

            caseData.versicherer = formData.versicherer;
            caseData.sparte = formData.sparte;
            caseData.status = formData.status;
            caseData.gueltigkeitsdatum = formData.gueltigkeitsdatum;
            caseData.notes = formData.notes;
            caseData.flagged = formData.flagged;

            // Status-Historie aktualisieren
            if (oldStatus !== formData.status) {
                if (!caseData.statusHistory) caseData.statusHistory = [];
                caseData.statusHistory.push({
                    date: new Date().toISOString().split('T')[0],
                    from: oldStatus,
                    to: formData.status,
                    note: 'Manuell geändert'
                });
            }
        }

        // Speichern
        const saved = Storage.saveCase(caseData);

        if (saved) {
            UI.showToast(isNew ? 'Vorgang erstellt' : 'Vorgang gespeichert', 'success');
            UI.closeCaseModal();
            refreshData();
        } else {
            UI.showToast('Fehler beim Speichern', 'error');
        }
    }

    /**
     * Vorgang löschen
     */
    function handleDeleteCase() {
        const caseId = document.getElementById('caseId').value;

        if (!caseId) {
            UI.closeCaseModal();
            return;
        }

        if (confirm('Vorgang wirklich löschen?')) {
            const deleted = Storage.deleteCase(caseId);

            if (deleted) {
                UI.showToast('Vorgang gelöscht', 'success');
                UI.closeCaseModal();
                refreshData();
            } else {
                UI.showToast('Fehler beim Löschen', 'error');
            }
        }
    }

    /**
     * Neuen Vorgang aus nicht zugeordneter Mail erstellen
     */
    function createCaseFromMail(mailId) {
        const mail = currentUnassigned.find(m => m.entryID === mailId);

        if (!mail) {
            UI.showToast('Mail nicht gefunden', 'error');
            return;
        }

        const newCase = Matcher.createCaseFromEmail(mail);

        if (newCase) {
            // Mail aus unassigned entfernen
            Storage.removeUnassignedMail(mailId);

            UI.showToast('Vorgang erstellt', 'success');
            refreshData();

            // Modal öffnen
            openCaseModal(newCase);
        } else {
            UI.showToast('Fehler beim Erstellen', 'error');
        }
    }

    /**
     * Zuordnungs-Modal anzeigen
     */
    function showAssignModal(mailId) {
        const mail = currentUnassigned.find(m => m.entryID === mailId);

        if (!mail) {
            UI.showToast('Mail nicht gefunden', 'error');
            return;
        }

        currentAssignMailId = mailId;
        selectedAssignCaseId = null;

        const cases = Storage.getCasesArray();
        UI.openAssignModal(mail, cases);
    }

    /**
     * Zuordnungs-Suche
     */
    function handleAssignSearch() {
        const searchTerm = document.getElementById('assignSearch').value.trim().toLowerCase();
        let cases = Storage.getCasesArray();

        if (searchTerm) {
            cases = cases.filter(c => {
                const searchFields = [
                    c.kunde?.name,
                    c.versicherungsnummer?.value,
                    c.versicherer?.name
                ].filter(Boolean).join(' ').toLowerCase();

                return searchFields.includes(searchTerm);
            });
        }

        // Maximal 10 Ergebnisse
        cases = cases.slice(0, 10);

        UI.renderAssignResults(cases);
    }

    /**
     * Klick auf Zuordnungs-Ergebnis
     */
    function handleAssignResultClick(e) {
        const item = e.target.closest('.assign-result-item');
        if (!item) return;

        // Alte Auswahl entfernen
        document.querySelectorAll('.assign-result-item.selected').forEach(el => {
            el.classList.remove('selected');
        });

        // Neue Auswahl
        item.classList.add('selected');
        selectedAssignCaseId = item.dataset.caseId;

        // Button aktivieren
        document.getElementById('assignConfirm').disabled = false;
    }

    /**
     * Zuordnung bestätigen
     */
    function handleAssignConfirm() {
        if (!selectedAssignCaseId || !currentAssignMailId) {
            return;
        }

        const mail = currentUnassigned.find(m => m.entryID === currentAssignMailId);

        if (!mail) {
            UI.showToast('Mail nicht gefunden', 'error');
            UI.closeAssignModal();
            return;
        }

        // Mail zum Vorgang hinzufügen
        const result = Storage.addMessagesToCase(selectedAssignCaseId, [mail]);

        if (result) {
            // Mail als verarbeitet markieren
            Storage.markMessageProcessed(mail.entryID);

            // Aus unassigned entfernen
            Storage.removeUnassignedMail(mail.entryID);

            // Status ggf. aktualisieren
            Matcher.updateStatusFromEmail(selectedAssignCaseId, mail);

            UI.showToast('Mail zugeordnet', 'success');
            UI.closeAssignModal();
            refreshData();
        } else {
            UI.showToast('Fehler bei Zuordnung', 'error');
        }
    }

    /**
     * Debounce Hilfsfunktion
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Öffentliche API (für onclick in HTML)
    return {
        init,
        createCaseFromMail,
        showAssignModal,
        refreshData
    };
})();

// Anwendung starten wenn DOM bereit
document.addEventListener('DOMContentLoaded', App.init);
