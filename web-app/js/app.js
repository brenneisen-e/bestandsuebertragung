/**
 * App Modul - Hauptapplikation für Bestandsübertragung Tool
 * Version 2.0 mit Dashboard Landing Page
 */

const App = (function() {
    'use strict';

    // Aktueller Zustand
    let currentView = 'dashboard';
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
            UI.showToast('26 Demo-Vorgänge wurden geladen', 'success');
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
        document.getElementById('resetDemoBtn')?.addEventListener('click', handleResetDemo);

        // Main Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentView = btn.dataset.view;
                UI.switchView(currentView);
                refreshCurrentView();
            });
        });

        // Dashboard: Show Incomplete Cases Button
        document.getElementById('showIncompleteBtn')?.addEventListener('click', handleShowIncomplete);

        // Dashboard: Validate All Button
        document.getElementById('validateAllBtn')?.addEventListener('click', handleValidateAll);

        // Dashboard: Export Ready Button
        document.getElementById('exportReadyBtn')?.addEventListener('click', handleExportReady);

        // Dashboard: Export to Robotics (hover button)
        document.getElementById('exportToRoboticsBtn')?.addEventListener('click', handleExportToRobotics);

        // Dashboard: Recent Activity Clicks
        document.getElementById('recentActivityBody')?.addEventListener('click', handleActivityRowClick);

        // Dashboard: Live Search
        document.getElementById('dashboardSearch')?.addEventListener('input', debounce(handleDashboardSearch, 300));
        document.getElementById('dashboardSearchResults')?.addEventListener('click', handleDashboardSearchClick);

        // Dashboard: Activity Filter
        document.getElementById('activityStatusFilter')?.addEventListener('change', refreshDashboard);
        document.getElementById('activitySort')?.addEventListener('change', refreshDashboard);

        // Vorgänge View
        document.getElementById('newCaseBtn')?.addEventListener('click', () => openCaseModal(null));
        document.getElementById('vorgaengeSearch')?.addEventListener('input', debounce(refreshVorgaengeView, 300));
        document.getElementById('filterSparte')?.addEventListener('change', refreshVorgaengeView);
        document.getElementById('filterExport')?.addEventListener('change', refreshVorgaengeView);

        // Vorgänge-Liste Klick
        document.getElementById('casesGroupedContainer')?.addEventListener('click', handleListItemClick);

        // Makler View
        document.getElementById('maklerSearch')?.addEventListener('input', debounce(refreshMaklerView, 300));
        document.querySelectorAll('#view-makler th.sortable').forEach(th => {
            th.addEventListener('click', () => handleMaklerSort(th.dataset.sort));
        });
        document.getElementById('maklerTableBody')?.addEventListener('click', handleMaklerRowClick);

        // E-Mails View
        document.getElementById('emailSearch')?.addEventListener('input', debounce(refreshEmailsView, 300));
        document.getElementById('emailSort')?.addEventListener('change', refreshEmailsView);
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

        // Export Modal
        document.getElementById('exportModalClose')?.addEventListener('click', () => UI.closeExportModal());
        document.getElementById('cancelExport')?.addEventListener('click', () => UI.closeExportModal());
        document.getElementById('confirmExport')?.addEventListener('click', handleConfirmExport);

        // Validation Modal
        document.getElementById('validationModalClose')?.addEventListener('click', () => UI.closeValidationModal());
        document.getElementById('validationSkip')?.addEventListener('click', handleValidationSkip);
        document.getElementById('validationConfirm')?.addEventListener('click', handleValidationConfirm);

        // Email Templates Modal
        document.getElementById('emailTemplatesBtn')?.addEventListener('click', openEmailTemplatesModal);
        document.getElementById('emailTemplatesModalClose')?.addEventListener('click', closeEmailTemplatesModal);
        document.getElementById('closeEmailTemplates')?.addEventListener('click', closeEmailTemplatesModal);
        document.getElementById('emailTemplatesModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'emailTemplatesModal') closeEmailTemplatesModal();
        });

        // Copy buttons for email templates
        document.querySelectorAll('.btn-copy').forEach(btn => {
            btn.addEventListener('click', handleCopyTemplate);
        });

        // Drag & Drop
        setupDragAndDrop();

        // Modal schließen bei Klick außerhalb
        document.getElementById('caseModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'caseModal') UI.closeCaseModal();
        });
        document.getElementById('maklerModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'maklerModal') UI.closeMaklerModal();
        });
        document.getElementById('exportModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'exportModal') UI.closeExportModal();
        });

        // Klick auf verknüpften Vorgang
        document.getElementById('linkedCasesList')?.addEventListener('click', (e) => {
            const linkedItem = e.target.closest('.linked-case-item');
            if (linkedItem) {
                const caseId = linkedItem.dataset.caseId;
                if (caseId) {
                    const caseData = Storage.getCase(caseId);
                    if (caseData) {
                        UI.openCaseModal(caseData);
                    }
                }
            }
        });

        // Keyboard Shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                UI.closeCaseModal();
                UI.closeMaklerModal();
                UI.closeExportModal();
                UI.closeValidationModal();
                closeEmailTemplatesModal();
            }
        });

        // Validation Modal Overlay Klick
        document.getElementById('validationModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'validationModal') UI.closeValidationModal();
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
     * Alle Daten aktualisieren
     */
    function refreshData() {
        // Navigation Counts
        const cases = Storage.getCasesArray();
        const maklerStats = Storage.getMaklerStats();
        const emails = Storage.getAllEmails();
        UI.updateNavCounts(cases.length, maklerStats.length, emails.length);

        // Aktuellen View aktualisieren
        refreshCurrentView();
    }

    /**
     * Aktuellen View aktualisieren
     */
    function refreshCurrentView() {
        switch (currentView) {
            case 'dashboard':
                refreshDashboard();
                break;
            case 'vorgaenge':
                refreshVorgaengeView();
                break;
            case 'makler':
                refreshMaklerView();
                break;
            case 'emails':
                refreshEmailsView();
                break;
        }
    }

    /**
     * Dashboard aktualisieren
     */
    function refreshDashboard() {
        const stats = Storage.getDetailedStats();
        const maklerStats = Storage.getMaklerStats();
        const spartenStats = Storage.getSpartenStats();
        const recentActivity = Storage.getRecentActivity(26);
        const importExportHistory = Storage.getImportExportHistory();
        const activityFilters = UI.getActivityFilterValues();

        UI.renderDashboardKPIs(stats);
        UI.renderSpartenList(spartenStats);
        UI.renderRecentActivity(recentActivity, activityFilters.status, activityFilters.sort);
        UI.renderImportExportHistory(importExportHistory);
    }

    /**
     * Vorgänge View aktualisieren (Kachel-Ansicht)
     */
    function refreshVorgaengeView() {
        const filters = UI.getVorgaengeFilterValues();
        let cases = Storage.getCasesArray();

        // Filtern
        cases = filterVorgaenge(cases, filters);

        // Sortieren nach Aktualisierungsdatum (neueste zuerst)
        cases.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));

        // Rendern
        UI.renderCaseTiles(cases);
    }

    /**
     * Vorgänge filtern
     */
    function filterVorgaenge(cases, filters) {
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

            // Sparte
            if (filters.sparte && c.sparte !== filters.sparte) {
                return false;
            }

            // Export-Filter
            if (filters.exportFilter === 'exported' && (!c.exported || !c.exported.date)) {
                return false;
            }
            if (filters.exportFilter === 'not-exported' && c.exported && c.exported.date) {
                return false;
            }

            return true;
        });
    }

    /**
     * Makler View aktualisieren
     */
    function refreshMaklerView() {
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

        updateSortIndicators('#view-makler', field, maklerSortDir);
        refreshMaklerView();
    }

    /**
     * E-Mails View aktualisieren
     */
    function refreshEmailsView() {
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
     * Klick auf Activity-Zeile
     */
    function handleActivityRowClick(e) {
        const row = e.target.closest('tr.clickable-row');
        if (!row) return;

        const caseId = row.dataset.caseId;
        const caseData = Storage.getCase(caseId);

        if (caseData) {
            openCaseModal(caseData);
        }
    }

    /**
     * Dashboard Live-Suche
     */
    function handleDashboardSearch(e) {
        const query = e.target.value.trim();

        if (query.length < 2) {
            UI.renderDashboardSearchResults([], query);
            return;
        }

        const allCases = Storage.getAllCases();
        const queryLower = query.toLowerCase();

        const matches = allCases.filter(c => {
            const kundeName = (c.kunde?.name || '').toLowerCase();
            const vsNr = (c.versicherungsnummer?.value || '').toLowerCase();
            const maklerName = (c.makler?.name || '').toLowerCase();
            const maklerEmail = (c.makler?.email || '').toLowerCase();
            const sparte = (c.sparte || '').toLowerCase();

            return kundeName.includes(queryLower) ||
                   vsNr.includes(queryLower) ||
                   maklerName.includes(queryLower) ||
                   maklerEmail.includes(queryLower) ||
                   sparte.includes(queryLower);
        });

        UI.renderDashboardSearchResults(matches, query);
    }

    /**
     * Dashboard Suchergebnis-Klick
     */
    function handleDashboardSearchClick(e) {
        const item = e.target.closest('.search-result-item');
        if (!item) return;

        const caseId = item.dataset.caseId;
        const caseData = Storage.getCase(caseId);

        if (caseData) {
            openCaseModal(caseData);
        }
    }

    /**
     * Klick auf Vorgänge-Kachel
     */
    function handleListItemClick(e) {
        const item = e.target.closest('.case-list-item');
        if (!item) return;

        const caseId = item.dataset.caseId;
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

            // Auto-Promotion: Wenn unvollständig und jetzt vollständig -> angefragt
            if (oldStatus === 'unvollstaendig' && formData.status === 'unvollstaendig') {
                // Prüfen ob jetzt alle Pflichtdaten vorhanden
                const hasKunde = formData.kunde && formData.kunde.name && formData.kunde.name.trim();
                const hasVsNr = formData.versicherungsnummer && formData.versicherungsnummer.value && formData.versicherungsnummer.value.trim();

                if (hasKunde && hasVsNr) {
                    caseData.status = 'angefragt';
                    UI.showToast('Daten vollständig - Status auf "Angefragt" geändert', 'success');
                }
            }

            // Status-Historie aktualisieren
            if (oldStatus !== caseData.status) {
                if (!caseData.statusHistory) caseData.statusHistory = [];
                caseData.statusHistory.push({
                    date: new Date().toISOString().split('T')[0],
                    from: oldStatus,
                    to: caseData.status,
                    note: oldStatus === 'unvollstaendig' ? 'Daten ergänzt' : 'Manuell geändert'
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
     * Unvollständige Vorgänge anzeigen - wechselt zu Vorgänge mit Filter
     */
    function handleShowIncomplete() {
        const incompleteCases = Storage.getIncompleteCases();

        if (incompleteCases.length === 0) {
            UI.showToast('Keine unvollständigen Vorgänge', 'info');
            return;
        }

        // Zu Vorgänge-View wechseln
        currentView = 'vorgaenge';
        UI.switchView(currentView);

        // Filter auf "unvollständig" setzen
        const filterStatus = document.getElementById('filterStatus');
        if (filterStatus) {
            filterStatus.value = 'unvollstaendig';
        }

        refreshVorgaengeView();
        UI.showToast(`${incompleteCases.length} unvollständige Vorgänge`, 'info');
    }

    /**
     * Offene Validierung Button Handler - öffnet Step-by-Step Modal
     */
    function handleValidateAll() {
        const pendingCases = Storage.getPendingValidationCases();

        if (pendingCases.length === 0) {
            UI.showToast('Keine Vorgänge zur Validierung', 'info');
            return;
        }

        // Step-by-Step Validation Modal öffnen
        UI.openValidationModal(pendingCases);
    }

    /**
     * Validation Modal: Überspringen
     */
    function handleValidationSkip() {
        if (UI.hasMoreValidationCases()) {
            UI.nextValidationCase();
        } else {
            UI.closeValidationModal();
            UI.showToast('Validierung abgeschlossen', 'info');
            refreshData();
        }
    }

    /**
     * Validation Modal: Als validiert markieren
     */
    function handleValidationConfirm() {
        const currentCase = UI.getCurrentValidationCase();

        if (currentCase) {
            // Formulardaten lesen
            const formData = UI.getValidationFormData();

            // Prüfen ob Daten geändert wurden
            const changes = [];
            if (formData.kunde !== (currentCase.kunde?.name || '')) {
                changes.push('Kunde');
            }
            if (formData.vsNr !== (currentCase.versicherungsnummer?.value || '')) {
                changes.push('VS-Nr');
            }
            if (formData.sparte !== (currentCase.sparte || '')) {
                changes.push('Sparte');
            }
            if (formData.makler !== (currentCase.makler?.name || '')) {
                changes.push('Makler');
            }
            if (formData.status !== (currentCase.status || 'angefragt')) {
                changes.push('Status');
            }

            // Änderungen anwenden
            if (!currentCase.kunde) currentCase.kunde = {};
            currentCase.kunde.name = formData.kunde;

            if (!currentCase.versicherungsnummer) currentCase.versicherungsnummer = {};
            currentCase.versicherungsnummer.value = formData.vsNr;

            currentCase.sparte = formData.sparte;

            if (!currentCase.gueltigkeitsdatum) currentCase.gueltigkeitsdatum = {};
            currentCase.gueltigkeitsdatum.value = formData.datum;

            if (!currentCase.makler) currentCase.makler = {};
            currentCase.makler.name = formData.makler;

            currentCase.status = formData.status;
            currentCase.updatedAt = new Date().toISOString();

            // Workflow-Änderung protokollieren
            if (!currentCase.validationHistory) currentCase.validationHistory = [];
            currentCase.validationHistory.push({
                date: new Date().toISOString(),
                user: 'PV-Bearbeiter',
                action: 'validiert',
                changes: changes.length > 0 ? changes : null
            });

            // Speichern und als validiert markieren
            Storage.saveCase(currentCase);
            Storage.markCasesValidated([currentCase.id]);
        }

        if (UI.hasMoreValidationCases()) {
            UI.nextValidationCase();
            UI.showToast('Vorgang validiert', 'success');
        } else {
            UI.closeValidationModal();
            UI.showToast('Alle Vorgänge validiert', 'success');
            refreshData();
        }
    }

    /**
     * Email Templates Modal öffnen
     */
    function openEmailTemplatesModal() {
        const modal = document.getElementById('emailTemplatesModal');
        if (modal) modal.style.display = 'flex';
    }

    /**
     * Email Templates Modal schließen
     */
    function closeEmailTemplatesModal() {
        const modal = document.getElementById('emailTemplatesModal');
        if (modal) modal.style.display = 'none';
    }

    /**
     * Email Template in Zwischenablage kopieren
     */
    function handleCopyTemplate(e) {
        const templateId = e.target.dataset.template;
        const templateContent = document.getElementById(templateId);

        if (templateContent) {
            const text = templateContent.textContent;

            navigator.clipboard.writeText(text).then(() => {
                UI.showToast('Vorlage in Zwischenablage kopiert', 'success');
                e.target.textContent = 'Kopiert!';
                setTimeout(() => {
                    e.target.textContent = 'Kopieren';
                }, 2000);
            }).catch(err => {
                console.error('Kopieren fehlgeschlagen:', err);
                UI.showToast('Kopieren fehlgeschlagen', 'error');
            });
        }
    }

    /**
     * Export-bereit Button Handler
     */
    function handleExportReady() {
        const exportReadyCases = Storage.getExportReadyCases();

        if (exportReadyCases.length === 0) {
            UI.showToast('Keine Vorgänge zum Exportieren', 'info');
            return;
        }

        UI.openExportModal(exportReadyCases.length);
    }

    /**
     * Export nach Robotics (Hover-Button) - stoppt Event-Propagation
     */
    function handleExportToRobotics(e) {
        e.stopPropagation(); // Verhindert dass exportReadyBtn auch getriggert wird
        handleExportReady();
    }

    /**
     * Export bestätigen
     */
    function handleConfirmExport() {
        const exporterName = UI.getExporterName();

        if (!exporterName) {
            UI.showToast('Bitte Namen eingeben', 'warning');
            return;
        }

        const exportReadyCases = Storage.getExportReadyCases();
        const caseIds = exportReadyCases.map(c => c.id);

        // CSV exportieren
        Export.exportToCSV(exportReadyCases, `ergo_robotics_export_${Export.formatDateForFilename(new Date())}.csv`);

        // Als exportiert markieren
        const count = Storage.markCasesExported(caseIds, exporterName);

        // Export in Historie loggen
        Storage.logImportExport('export', count, exporterName);

        UI.closeExportModal();
        UI.showToast(`${count} Vorgänge exportiert und als "exportiert" markiert`, 'success');
        refreshData();
    }

    /**
     * Demo-Daten zurücksetzen
     */
    function handleResetDemo() {
        if (confirm('Alle Daten zurücksetzen und Demo-Daten neu laden?')) {
            Storage.clearAll();
            DemoData.loadDemoData(true);
            UI.showToast('Demo-Daten wurden neu geladen', 'success');
            refreshData();
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
                const cases = Storage.getCasesArray();
                Storage.logImportExport('import', cases.length, 'Backup-Import');
                UI.showToast('Backup erfolgreich importiert', 'success');
                refreshData();
            } else if (result.type === 'outlook') {
                const processResult = Export.processOutlookExport(result.data);

                let message = `${processResult.processed} E-Mails verarbeitet`;
                if (processResult.created > 0) {
                    message += `, ${processResult.created} neue Vorgänge erstellt`;
                }
                if (processResult.matched > 0) {
                    message += `, ${processResult.matched} zugeordnet`;
                }

                // Import in Historie loggen
                const importCount = processResult.created + processResult.matched;
                if (importCount > 0) {
                    Storage.logImportExport('import', importCount, 'Outlook-Import');
                }

                UI.showToast(message, (processResult.created > 0 || processResult.matched > 0) ? 'success' : 'info');
                refreshData();
            }
        } catch (error) {
            console.error('Import-Fehler:', error);
            UI.showToast(error.message, 'error');
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

    // Öffentliche API
    return {
        init,
        refreshData
    };
})();

// Anwendung starten wenn DOM bereit
document.addEventListener('DOMContentLoaded', App.init);
