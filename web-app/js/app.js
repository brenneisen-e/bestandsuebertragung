/**
 * App Modul - Hauptapplikation für Bestandsübertragung Tool
 * Initialisiert die Anwendung und verbindet alle Module
 */

const App = (function() {
    'use strict';

    // Aktueller Zustand
    let currentTab = 'kunden';
    let kundenSortField = 'updatedAt';
    let kundenSortDir = 'desc';
    let maklerSortField = 'total';
    let maklerSortDir = 'desc';

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
        document.getElementById('newCaseBtn')?.addEventListener('click', () => openCaseModal(null));

        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentTab = btn.dataset.tab;
                UI.switchTab(currentTab);
                refreshCurrentTab();
            });
        });

        // Kunden Tab - Filter und Suche
        document.getElementById('kundenSearch')?.addEventListener('input', debounce(refreshKundenTab, 300));
        document.getElementById('filterStatus')?.addEventListener('change', refreshKundenTab);
        document.getElementById('filterSparte')?.addEventListener('change', refreshKundenTab);

        // Kunden Tab - Sortierbare Spalten
        document.querySelectorAll('#tab-kunden th.sortable').forEach(th => {
            th.addEventListener('click', () => handleKundenSort(th.dataset.sort));
        });

        // Makler Tab - Suche und Sortierung
        document.getElementById('maklerSearch')?.addEventListener('input', debounce(refreshMaklerTab, 300));
        document.querySelectorAll('#tab-makler th.sortable').forEach(th => {
            th.addEventListener('click', () => handleMaklerSort(th.dataset.sort));
        });

        // E-Mails Tab - Suche und Sortierung
        document.getElementById('emailSearch')?.addEventListener('input', debounce(refreshEmailsTab, 300));
        document.getElementById('emailSort')?.addEventListener('change', refreshEmailsTab);

        // Kunden-Tabelle Klick
        document.getElementById('kundenTableBody')?.addEventListener('click', handleKundenRowClick);

        // Makler-Tabelle Klick
        document.getElementById('maklerTableBody')?.addEventListener('click', handleMaklerRowClick);

        // E-Mails-Tabelle Klick
        document.getElementById('emailsTableBody')?.addEventListener('click', handleEmailRowClick);

        // Makler Modal - Vorgang Klick
        document.getElementById('maklerCasesBody')?.addEventListener('click', handleMaklerCaseClick);

        // Case Modal
        document.getElementById('modalClose')?.addEventListener('click', () => UI.closeCaseModal());
        document.getElementById('cancelCase')?.addEventListener('click', () => UI.closeCaseModal());
        document.getElementById('saveCase')?.addEventListener('click', handleSaveCase);
        document.getElementById('deleteCase')?.addEventListener('click', handleDeleteCase);

        // Makler Modal
        document.getElementById('maklerModalClose')?.addEventListener('click', () => UI.closeMaklerModal());
        document.getElementById('closeMaklerModal')?.addEventListener('click', () => UI.closeMaklerModal());

        // Drag & Drop
        setupDragAndDrop();

        // Modal schließen bei Klick außerhalb
        document.getElementById('caseModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'caseModal') UI.closeCaseModal();
        });
        document.getElementById('maklerModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'maklerModal') UI.closeMaklerModal();
        });

        // Keyboard Shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                UI.closeCaseModal();
                UI.closeMaklerModal();
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

        // Tab Counts aktualisieren
        const cases = Storage.getCasesArray();
        const maklerStats = Storage.getMaklerStats();
        const emails = Storage.getAllEmails();
        UI.updateTabCounts(cases.length, maklerStats.length, emails.length);

        // Aktuellen Tab aktualisieren
        refreshCurrentTab();
    }

    /**
     * Aktuellen Tab aktualisieren
     */
    function refreshCurrentTab() {
        switch (currentTab) {
            case 'kunden':
                refreshKundenTab();
                break;
            case 'makler':
                refreshMaklerTab();
                break;
            case 'emails':
                refreshEmailsTab();
                break;
        }
    }

    /**
     * Kunden Tab aktualisieren
     */
    function refreshKundenTab() {
        const filters = UI.getKundenFilterValues();
        let cases = Storage.getCasesArray();

        // Filtern
        cases = filterKunden(cases, filters);

        // Sortieren
        cases = sortKunden(cases, kundenSortField, kundenSortDir);

        // Rendern
        UI.renderKundenTable(cases);

        // Stats aktualisieren
        const stats = Storage.getStats();
        UI.renderStats(stats);
    }

    /**
     * Kunden filtern
     */
    function filterKunden(cases, filters) {
        return cases.filter(c => {
            // Textsuche
            if (filters.search) {
                const searchText = filters.search.toLowerCase();
                const searchFields = [
                    c.kunde?.name,
                    c.versicherungsnummer?.value,
                    c.makler?.name,
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

            // Sparte
            if (filters.sparte && c.sparte !== filters.sparte) {
                return false;
            }

            return true;
        });
    }

    /**
     * Kunden sortieren
     */
    function sortKunden(cases, field, direction) {
        const multiplier = direction === 'desc' ? -1 : 1;

        return cases.sort((a, b) => {
            let valueA, valueB;

            switch (field) {
                case 'updatedAt':
                    valueA = new Date(a.updatedAt || 0);
                    valueB = new Date(b.updatedAt || 0);
                    break;
                case 'kunde':
                    valueA = (a.kunde?.name || '').toLowerCase();
                    valueB = (b.kunde?.name || '').toLowerCase();
                    break;
                case 'makler':
                    valueA = (a.makler?.name || '').toLowerCase();
                    valueB = (b.makler?.name || '').toLowerCase();
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
     * Kunden-Sortierung Handler
     */
    function handleKundenSort(field) {
        if (kundenSortField === field) {
            kundenSortDir = kundenSortDir === 'desc' ? 'asc' : 'desc';
        } else {
            kundenSortField = field;
            kundenSortDir = 'desc';
        }

        // Sortier-Indikatoren aktualisieren
        updateSortIndicators('#tab-kunden', field, kundenSortDir);

        refreshKundenTab();
    }

    /**
     * Makler Tab aktualisieren
     */
    function refreshMaklerTab() {
        const search = UI.getMaklerSearchValue();
        let maklerStats = Storage.getMaklerStats();

        // Suche filtern
        if (search) {
            maklerStats = maklerStats.filter(m =>
                m.name.toLowerCase().includes(search) ||
                m.email.toLowerCase().includes(search)
            );
        }

        // Sortieren
        maklerStats = sortMakler(maklerStats, maklerSortField, maklerSortDir);

        // Rendern
        UI.renderMaklerTable(maklerStats);
    }

    /**
     * Makler sortieren
     */
    function sortMakler(maklerStats, field, direction) {
        const multiplier = direction === 'desc' ? -1 : 1;

        return maklerStats.sort((a, b) => {
            let valueA, valueB;

            switch (field) {
                case 'name':
                    valueA = a.name.toLowerCase();
                    valueB = b.name.toLowerCase();
                    break;
                case 'total':
                    valueA = a.total;
                    valueB = b.total;
                    break;
                case 'bestaetigt':
                    valueA = a.bestaetigt;
                    valueB = b.bestaetigt;
                    break;
                case 'offen':
                    valueA = a.offen;
                    valueB = b.offen;
                    break;
                case 'abgelehnt':
                    valueA = a.abgelehnt;
                    valueB = b.abgelehnt;
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
     * Makler-Sortierung Handler
     */
    function handleMaklerSort(field) {
        if (maklerSortField === field) {
            maklerSortDir = maklerSortDir === 'desc' ? 'asc' : 'desc';
        } else {
            maklerSortField = field;
            maklerSortDir = 'desc';
        }

        // Sortier-Indikatoren aktualisieren
        updateSortIndicators('#tab-makler', field, maklerSortDir);

        refreshMaklerTab();
    }

    /**
     * E-Mails Tab aktualisieren
     */
    function refreshEmailsTab() {
        const filters = UI.getEmailFilterValues();
        let emails = Storage.getAllEmails();

        // Suche filtern
        if (filters.search) {
            emails = emails.filter(e => {
                const searchFields = [
                    e.subject,
                    e.senderEmail,
                    e.kundeName,
                    e.bodyPlain
                ].filter(Boolean).join(' ').toLowerCase();

                return searchFields.includes(filters.search);
            });
        }

        // Sortieren
        if (filters.sort === 'asc') {
            emails.sort((a, b) => new Date(a.receivedTime) - new Date(b.receivedTime));
        } else {
            emails.sort((a, b) => new Date(b.receivedTime) - new Date(a.receivedTime));
        }

        // Rendern
        UI.renderEmailsTable(emails);
    }

    /**
     * Sortier-Indikatoren aktualisieren
     */
    function updateSortIndicators(tableSelector, activeField, direction) {
        const arrow = direction === 'desc' ? ' ↓' : ' ↑';

        document.querySelectorAll(`${tableSelector} th.sortable`).forEach(th => {
            const field = th.dataset.sort;
            const text = th.textContent.replace(/ [↓↑]$/, '');

            if (field === activeField) {
                th.classList.add('active');
                th.textContent = text + arrow;
            } else {
                th.classList.remove('active');
                th.textContent = text;
            }
        });
    }

    /**
     * Klick auf Kunden-Zeile
     */
    function handleKundenRowClick(e) {
        const row = e.target.closest('tr.clickable-row');
        if (!row) return;

        const caseId = row.dataset.caseId;
        const caseData = Storage.getCase(caseId);

        if (caseData) {
            openCaseModal(caseData);
        }
    }

    /**
     * Klick auf Makler-Zeile
     */
    function handleMaklerRowClick(e) {
        const row = e.target.closest('tr.clickable-row');
        if (!row) return;

        const maklerName = row.dataset.maklerName;
        const maklerStats = Storage.getMaklerStats();
        const maklerData = maklerStats.find(m => m.name === maklerName);

        if (maklerData) {
            const cases = Storage.findCasesByMakler(maklerName);
            UI.openMaklerModal(maklerData, cases);
        }
    }

    /**
     * Klick auf E-Mail-Zeile
     */
    function handleEmailRowClick(e) {
        const row = e.target.closest('tr.clickable-row');
        if (!row) return;

        const caseId = row.dataset.caseId;
        const caseData = Storage.getCase(caseId);

        if (caseData) {
            openCaseModal(caseData);
        }
    }

    /**
     * Klick auf Vorgang in Makler-Modal
     */
    function handleMaklerCaseClick(e) {
        const row = e.target.closest('tr.clickable-row');
        if (!row) return;

        const caseId = row.dataset.caseId;
        const caseData = Storage.getCase(caseId);

        if (caseData) {
            UI.closeMaklerModal();
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
            caseData.kunde = formData.kunde;
            caseData.versicherungsnummer = formData.versicherungsnummer;
            caseData.sparte = formData.sparte;
            caseData.status = formData.status;
            caseData.gueltigkeitsdatum = formData.gueltigkeitsdatum;
            caseData.makler = formData.makler;
            caseData.notes = formData.notes;

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
        const filters = UI.getKundenFilterValues();
        let cases = Storage.getCasesArray();
        cases = filterKunden(cases, filters);
        cases = sortKunden(cases, kundenSortField, kundenSortDir);

        if (cases.length === 0) {
            UI.showToast('Keine Daten zum Exportieren', 'warning');
            return;
        }

        Export.exportToCSV(cases);
        UI.showToast(`${cases.length} Vorgänge exportiert`, 'success');
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

    // Öffentliche API
    return {
        init,
        refreshData
    };
})();

// Anwendung starten wenn DOM bereit
document.addEventListener('DOMContentLoaded', App.init);
