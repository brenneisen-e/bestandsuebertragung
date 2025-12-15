/**
 * UI Modul - User Interface Komponenten und Rendering
 * Verwaltet DOM-Updates, Modals, Toasts und Interaktionen
 */

const UI = (function() {
    'use strict';

    // Status-Icon Mapping
    const STATUS_ICONS = {
        'neu': '○',
        'angefragt': '◐',
        'in-bearbeitung': '◑',
        'bestaetigt': '●',
        'abgelehnt': '✕'
    };

    // Status-Labels
    const STATUS_LABELS = {
        'neu': 'Neu',
        'angefragt': 'Angefragt',
        'in-bearbeitung': 'In Bearbeitung',
        'bestaetigt': 'Bestätigt',
        'abgelehnt': 'Abgelehnt'
    };

    // Cache für DOM-Elemente
    let elements = {};

    /**
     * UI initialisieren - DOM-Elemente cachen
     */
    function init() {
        elements = {
            // Toast & Drop
            toastContainer: document.getElementById('toastContainer'),
            dropOverlay: document.getElementById('dropOverlay'),

            // Navigation Counts
            vorgaengeCount: document.getElementById('vorgaengeCount'),
            maklerNavCount: document.getElementById('maklerNavCount'),
            emailsNavCount: document.getElementById('emailsNavCount'),

            // Dashboard KPIs
            kpiTotal: document.getElementById('kpiTotal'),
            kpiBestaetigt: document.getElementById('kpiBestaetigt'),
            kpiAbgelehnt: document.getElementById('kpiAbgelehnt'),
            kpiOffen: document.getElementById('kpiOffen'),
            kpiExportiert: document.getElementById('kpiExportiert'),
            kpiBestaetPct: document.getElementById('kpiBestaetPct'),
            kpiAbgelehntPct: document.getElementById('kpiAbgelehntPct'),
            kpiOffenPct: document.getElementById('kpiOffenPct'),
            kpiExportiertPct: document.getElementById('kpiExportiertPct'),

            // Dashboard Charts
            statusBars: document.getElementById('statusBars'),
            topMaklerList: document.getElementById('topMaklerList'),
            spartenList: document.getElementById('spartenList'),
            exportReadyCount: document.getElementById('exportReadyCount'),
            recentActivityBody: document.getElementById('recentActivityBody'),

            // Vorgänge Tab
            vorgaengeSearch: document.getElementById('vorgaengeSearch'),
            filterStatus: document.getElementById('filterStatus'),
            filterSparte: document.getElementById('filterSparte'),
            filterExport: document.getElementById('filterExport'),
            vorgaengeTableBody: document.getElementById('vorgaengeTableBody'),
            vorgaengeEmpty: document.getElementById('vorgaengeEmpty'),

            // Makler Tab
            maklerSearch: document.getElementById('maklerSearch'),
            maklerTableBody: document.getElementById('maklerTableBody'),
            maklerEmpty: document.getElementById('maklerEmpty'),

            // E-Mails Tab
            emailSearch: document.getElementById('emailSearch'),
            emailSort: document.getElementById('emailSort'),
            emailsTableBody: document.getElementById('emailsTableBody'),
            emailsEmpty: document.getElementById('emailsEmpty'),

            // Case Modal
            caseModal: document.getElementById('caseModal'),
            modalTitle: document.getElementById('modalTitle'),
            caseForm: document.getElementById('caseForm'),
            caseId: document.getElementById('caseId'),
            caseKunde: document.getElementById('caseKunde'),
            caseVsNr: document.getElementById('caseVsNr'),
            caseSparte: document.getElementById('caseSparte'),
            caseDatum: document.getElementById('caseDatum'),
            caseMaklerName: document.getElementById('caseMaklerName'),
            caseMaklerEmail: document.getElementById('caseMaklerEmail'),
            caseStatus: document.getElementById('caseStatus'),
            caseNotes: document.getElementById('caseNotes'),
            emailTimeline: document.getElementById('emailTimeline'),
            modalMailCount: document.getElementById('modalMailCount'),
            exportInfo: document.getElementById('exportInfo'),
            exportInfoText: document.getElementById('exportInfoText'),

            // Makler Modal
            maklerModal: document.getElementById('maklerModal'),
            maklerModalTitle: document.getElementById('maklerModalTitle'),
            maklerInfo: document.getElementById('maklerInfo'),
            maklerCasesBody: document.getElementById('maklerCasesBody'),

            // Export Modal
            exportModal: document.getElementById('exportModal'),
            exportCaseCount: document.getElementById('exportCaseCount'),
            exporterName: document.getElementById('exporterName')
        };
    }

    /**
     * Dashboard KPIs rendern
     */
    function renderDashboardKPIs(stats) {
        if (!stats) return;

        const total = stats.total || 0;

        // KPI Werte
        if (elements.kpiTotal) elements.kpiTotal.textContent = total;
        if (elements.kpiBestaetigt) elements.kpiBestaetigt.textContent = stats.byStatus?.bestaetigt || 0;
        if (elements.kpiAbgelehnt) elements.kpiAbgelehnt.textContent = stats.byStatus?.abgelehnt || 0;
        if (elements.kpiOffen) {
            const offen = (stats.byStatus?.neu || 0) + (stats.byStatus?.angefragt || 0) + (stats.byStatus?.['in-bearbeitung'] || 0);
            elements.kpiOffen.textContent = offen;
        }
        if (elements.kpiExportiert) elements.kpiExportiert.textContent = stats.exportiert || 0;

        // Prozente
        if (total > 0) {
            if (elements.kpiBestaetPct) elements.kpiBestaetPct.textContent = Math.round((stats.byStatus?.bestaetigt || 0) / total * 100) + '%';
            if (elements.kpiAbgelehntPct) elements.kpiAbgelehntPct.textContent = Math.round((stats.byStatus?.abgelehnt || 0) / total * 100) + '%';
            if (elements.kpiOffenPct) {
                const offen = (stats.byStatus?.neu || 0) + (stats.byStatus?.angefragt || 0) + (stats.byStatus?.['in-bearbeitung'] || 0);
                elements.kpiOffenPct.textContent = Math.round(offen / total * 100) + '%';
            }
            if (elements.kpiExportiertPct) elements.kpiExportiertPct.textContent = Math.round((stats.exportiert || 0) / total * 100) + '%';
        }

        // Export-bereit Count
        if (elements.exportReadyCount) {
            elements.exportReadyCount.textContent = stats.exportReady || 0;
        }
    }

    /**
     * Status-Balken rendern
     */
    function renderStatusBars(stats) {
        if (!elements.statusBars || !stats.byStatus) return;

        const total = stats.total || 1;
        const statusOrder = ['neu', 'angefragt', 'in-bearbeitung', 'bestaetigt', 'abgelehnt'];

        elements.statusBars.innerHTML = statusOrder.map(status => {
            const count = stats.byStatus[status] || 0;
            const pct = Math.round(count / total * 100);
            return `
                <div class="status-bar-item">
                    <span class="status-bar-label">${STATUS_LABELS[status]}</span>
                    <div class="status-bar-track">
                        <div class="status-bar-fill ${status}" style="width: ${pct}%"></div>
                    </div>
                    <span class="status-bar-count">${count}</span>
                </div>
            `;
        }).join('');
    }

    /**
     * Top-Makler Liste rendern
     */
    function renderTopMaklerList(maklerStats) {
        if (!elements.topMaklerList) return;

        const top5 = maklerStats.slice(0, 5);

        if (top5.length === 0) {
            elements.topMaklerList.innerHTML = '<p class="text-muted">Keine Makler vorhanden</p>';
            return;
        }

        elements.topMaklerList.innerHTML = top5.map(m => `
            <div class="top-list-item">
                <span class="top-list-name" title="${escapeHtml(m.name)}">${escapeHtml(m.name)}</span>
                <span class="top-list-count">${m.total}</span>
            </div>
        `).join('');
    }

    /**
     * Sparten-Liste rendern
     */
    function renderSpartenList(spartenStats) {
        if (!elements.spartenList) return;

        if (spartenStats.length === 0) {
            elements.spartenList.innerHTML = '<p class="text-muted">Keine Sparten vorhanden</p>';
            return;
        }

        elements.spartenList.innerHTML = spartenStats.map(s => `
            <span class="sparten-tag">
                ${escapeHtml(s.sparte)}
                <span class="count">${s.count}</span>
            </span>
        `).join('');
    }

    /**
     * Letzte Aktivitäten rendern
     */
    function renderRecentActivity(activities) {
        if (!elements.recentActivityBody) return;

        if (!activities || activities.length === 0) {
            elements.recentActivityBody.innerHTML = '<tr><td colspan="5" class="text-muted">Keine Aktivitäten</td></tr>';
            return;
        }

        elements.recentActivityBody.innerHTML = activities.map(a => {
            const action = a.from
                ? `${STATUS_ICONS[a.from] || ''} → ${STATUS_ICONS[a.to] || ''} ${STATUS_LABELS[a.to] || a.to}`
                : `${STATUS_ICONS[a.to] || ''} ${STATUS_LABELS[a.to] || a.to}`;

            return `
                <tr class="clickable-row" data-case-id="${a.caseId}">
                    <td>${formatDate(a.date)}</td>
                    <td>${escapeHtml(a.kundeName)}</td>
                    <td>${escapeHtml(a.maklerName)}</td>
                    <td>${action}</td>
                    <td><span class="status-badge status-${a.to}">${STATUS_ICONS[a.to] || ''}</span></td>
                </tr>
            `;
        }).join('');
    }

    /**
     * Navigation Counts aktualisieren
     */
    function updateNavCounts(vorgaenge, makler, emails) {
        if (elements.vorgaengeCount) elements.vorgaengeCount.textContent = vorgaenge;
        if (elements.maklerNavCount) elements.maklerNavCount.textContent = makler;
        if (elements.emailsNavCount) elements.emailsNavCount.textContent = emails;
    }

    /**
     * Vorgänge-Tabelle rendern
     */
    function renderVorgaengeTable(cases) {
        if (!elements.vorgaengeTableBody) return;

        if (!cases || cases.length === 0) {
            elements.vorgaengeTableBody.innerHTML = '';
            if (elements.vorgaengeEmpty) elements.vorgaengeEmpty.style.display = 'block';
            return;
        }

        if (elements.vorgaengeEmpty) elements.vorgaengeEmpty.style.display = 'none';

        elements.vorgaengeTableBody.innerHTML = cases.map(c => {
            const kunde = c.kunde?.name || 'Unbekannt';
            const vsNr = c.versicherungsnummer?.value || '-';
            const sparte = c.sparte || '-';
            const makler = c.makler?.name || '-';
            const datum = c.gueltigkeitsdatum?.value || '-';
            const updatedAt = formatDate(c.updatedAt);

            // Export Status
            let exportBadge;
            if (c.exported && c.exported.date) {
                const exportDate = formatDate(c.exported.date);
                exportBadge = `<span class="export-badge" title="Exportiert von ${escapeHtml(c.exported.by)}">↑ ${exportDate}</span>`;
            } else {
                exportBadge = '<span class="export-badge not-exported">–</span>';
            }

            return `
                <tr class="clickable-row" data-case-id="${c.id}">
                    <td class="col-status">
                        <span class="status-badge status-${c.status}">${STATUS_ICONS[c.status] || '○'} ${STATUS_LABELS[c.status] || c.status}</span>
                    </td>
                    <td class="col-kunde">${escapeHtml(kunde)}</td>
                    <td class="col-vsnr">${escapeHtml(vsNr)}</td>
                    <td class="col-sparte">${escapeHtml(sparte)}</td>
                    <td class="col-makler">${escapeHtml(makler)}</td>
                    <td class="col-datum">${escapeHtml(datum)}</td>
                    <td class="col-aktivitaet">${updatedAt}</td>
                    <td class="col-export">${exportBadge}</td>
                </tr>
            `;
        }).join('');
    }

    /**
     * Makler-Tabelle rendern
     */
    function renderMaklerTable(maklerStats) {
        if (!elements.maklerTableBody) return;

        if (!maklerStats || maklerStats.length === 0) {
            elements.maklerTableBody.innerHTML = '';
            if (elements.maklerEmpty) elements.maklerEmpty.style.display = 'block';
            return;
        }

        if (elements.maklerEmpty) elements.maklerEmpty.style.display = 'none';

        elements.maklerTableBody.innerHTML = maklerStats.map(m => {
            return `
                <tr class="clickable-row" data-makler-name="${escapeHtml(m.name)}">
                    <td class="col-makler-name">${escapeHtml(m.name)}</td>
                    <td class="col-makler-email">${escapeHtml(m.email)}</td>
                    <td class="col-number">${m.total}</td>
                    <td class="col-number"><span class="text-success">${m.bestaetigt}</span></td>
                    <td class="col-number"><span class="text-warning">${m.offen}</span></td>
                    <td class="col-number"><span class="text-danger">${m.abgelehnt}</span></td>
                </tr>
            `;
        }).join('');
    }

    /**
     * E-Mail-Tabelle rendern
     */
    function renderEmailsTable(emails) {
        if (!elements.emailsTableBody) return;

        if (!emails || emails.length === 0) {
            elements.emailsTableBody.innerHTML = '';
            if (elements.emailsEmpty) elements.emailsEmpty.style.display = 'block';
            return;
        }

        if (elements.emailsEmpty) elements.emailsEmpty.style.display = 'none';

        elements.emailsTableBody.innerHTML = emails.map(email => {
            const isSent = email.folder === 'sent';
            const directionIcon = isSent ? '↑' : '↓';
            const directionClass = isSent ? 'direction-sent' : 'direction-inbox';
            const senderOrRecipient = email.senderEmail || '-';
            const subject = email.subject || 'Kein Betreff';
            const date = formatDateTime(email.receivedTime);
            const kunde = email.kundeName || 'Unbekannt';
            const status = email.status || 'neu';

            return `
                <tr class="clickable-row" data-case-id="${email.caseId}">
                    <td class="col-direction"><span class="${directionClass}">${directionIcon}</span></td>
                    <td class="col-datum">${date}</td>
                    <td class="col-sender">${escapeHtml(senderOrRecipient)}</td>
                    <td class="col-subject">${escapeHtml(subject)}</td>
                    <td class="col-kunde">${escapeHtml(kunde)}</td>
                    <td class="col-status">
                        <span class="status-badge status-${status}">${STATUS_ICONS[status] || '○'}</span>
                    </td>
                </tr>
            `;
        }).join('');
    }

    /**
     * View wechseln
     */
    function switchView(viewName) {
        // Nav-Buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewName);
        });

        // Views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.toggle('active', view.id === `view-${viewName}`);
        });
    }

    /**
     * Case Modal öffnen
     */
    function openCaseModal(caseData) {
        if (!elements.caseModal) return;

        const isNew = !caseData;
        elements.modalTitle.textContent = isNew ? 'Neuer Vorgang' : 'Vorgang bearbeiten';

        // Formular zurücksetzen
        elements.caseForm.reset();

        // Export-Info verstecken
        if (elements.exportInfo) {
            elements.exportInfo.style.display = 'none';
        }

        if (caseData) {
            elements.caseId.value = caseData.id;
            elements.caseKunde.value = caseData.kunde?.name || '';
            elements.caseVsNr.value = caseData.versicherungsnummer?.value || '';
            elements.caseSparte.value = caseData.sparte || '';
            elements.caseDatum.value = caseData.gueltigkeitsdatum?.value || '';
            elements.caseMaklerName.value = caseData.makler?.name || '';
            elements.caseMaklerEmail.value = caseData.makler?.email || '';
            elements.caseStatus.value = caseData.status || 'neu';
            elements.caseNotes.value = caseData.notes || '';

            // Export-Info anzeigen falls exportiert
            if (caseData.exported && caseData.exported.date && elements.exportInfo) {
                elements.exportInfo.style.display = 'flex';
                elements.exportInfoText.textContent = `Exportiert am ${formatDateTime(caseData.exported.date)} von ${caseData.exported.by}`;
            }

            // E-Mail Timeline rendern
            renderEmailTimeline(caseData.messages || []);
        } else {
            elements.caseId.value = '';
            renderEmailTimeline([]);
        }

        // Modal anzeigen
        elements.caseModal.style.display = 'flex';
    }

    /**
     * Case Modal schließen
     */
    function closeCaseModal() {
        if (elements.caseModal) {
            elements.caseModal.style.display = 'none';
        }
    }

    /**
     * E-Mail Timeline rendern
     */
    function renderEmailTimeline(messages) {
        if (!elements.emailTimeline) return;

        elements.modalMailCount.textContent = messages.length;

        if (messages.length === 0) {
            elements.emailTimeline.innerHTML = '<p class="empty-message">Keine E-Mails vorhanden</p>';
            return;
        }

        // Nach Datum sortieren (neueste zuerst)
        const sorted = [...messages].sort((a, b) =>
            new Date(b.receivedTime) - new Date(a.receivedTime)
        );

        elements.emailTimeline.innerHTML = sorted.map(msg => {
            const isSent = msg.folder === 'sent';
            const directionIcon = isSent ? '↑' : '↓';
            const directionText = isSent ? 'Gesendet' : 'Empfangen';
            const directionClass = isSent ? 'direction-sent' : 'direction-inbox';

            return `
                <div class="email-item ${msg.folder}">
                    <div class="email-header">
                        <span class="email-direction ${directionClass}">${directionIcon} ${directionText}</span>
                        <span class="email-date">${formatDateTime(msg.receivedTime)}</span>
                    </div>
                    <div class="email-subject">${escapeHtml(msg.subject || 'Kein Betreff')}</div>
                    <div class="email-sender">${escapeHtml(msg.senderEmail || '-')}</div>
                    <div class="email-body">${escapeHtml(truncateText(msg.bodyPlain || msg.body || '', 300))}</div>
                </div>
            `;
        }).join('');
    }

    /**
     * Makler Modal öffnen
     */
    function openMaklerModal(maklerData, cases) {
        if (!elements.maklerModal) return;

        elements.maklerModalTitle.textContent = maklerData.name;

        // Makler Info
        elements.maklerInfo.innerHTML = `
            <div class="makler-detail">
                <span class="label">E-Mail:</span>
                <span class="value">${escapeHtml(maklerData.email)}</span>
            </div>
            <div class="makler-stats">
                <span class="makler-stat">
                    <span class="number">${maklerData.total}</span>
                    <span class="label">Vorgänge</span>
                </span>
                <span class="makler-stat text-success">
                    <span class="number">${maklerData.bestaetigt}</span>
                    <span class="label">Bestätigt</span>
                </span>
                <span class="makler-stat text-warning">
                    <span class="number">${maklerData.offen}</span>
                    <span class="label">Offen</span>
                </span>
                <span class="makler-stat text-danger">
                    <span class="number">${maklerData.abgelehnt}</span>
                    <span class="label">Abgelehnt</span>
                </span>
            </div>
        `;

        // Vorgänge-Tabelle
        elements.maklerCasesBody.innerHTML = cases.map(c => {
            const kunde = c.kunde?.name || 'Unbekannt';
            const vsNr = c.versicherungsnummer?.value || '-';
            const sparte = c.sparte || '-';
            const updatedAt = formatDate(c.updatedAt);

            return `
                <tr class="clickable-row" data-case-id="${c.id}">
                    <td>
                        <span class="status-badge status-${c.status}">${STATUS_ICONS[c.status] || '○'}</span>
                    </td>
                    <td>${escapeHtml(kunde)}</td>
                    <td>${escapeHtml(vsNr)}</td>
                    <td>${escapeHtml(sparte)}</td>
                    <td>${updatedAt}</td>
                </tr>
            `;
        }).join('');

        // Modal anzeigen
        elements.maklerModal.style.display = 'flex';
    }

    /**
     * Makler Modal schließen
     */
    function closeMaklerModal() {
        if (elements.maklerModal) {
            elements.maklerModal.style.display = 'none';
        }
    }

    /**
     * Export Modal öffnen
     */
    function openExportModal(caseCount) {
        if (!elements.exportModal) return;

        elements.exportCaseCount.textContent = caseCount;
        elements.exporterName.value = '';
        elements.exportModal.style.display = 'flex';
    }

    /**
     * Export Modal schließen
     */
    function closeExportModal() {
        if (elements.exportModal) {
            elements.exportModal.style.display = 'none';
        }
    }

    /**
     * Exporter-Name holen
     */
    function getExporterName() {
        return elements.exporterName?.value.trim() || '';
    }

    /**
     * Toast-Benachrichtigung anzeigen
     */
    function showToast(message, type = 'info', duration = 4000) {
        if (!elements.toastContainer) return;

        const icons = {
            success: '✔',
            error: '✕',
            warning: '△',
            info: 'ℹ'
        };

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-message">${escapeHtml(message)}</span>
        `;

        elements.toastContainer.appendChild(toast);

        // Nach Dauer entfernen
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    /**
     * Drop-Overlay anzeigen/verstecken
     */
    function showDropOverlay(show) {
        if (elements.dropOverlay) {
            elements.dropOverlay.style.display = show ? 'flex' : 'none';
        }
    }

    /**
     * Formular-Daten auslesen
     */
    function getCaseFormData() {
        return {
            id: elements.caseId.value || null,
            kunde: {
                name: elements.caseKunde.value.trim(),
                confidence: 1.0,
                source: 'manual'
            },
            versicherungsnummer: {
                value: elements.caseVsNr.value.trim(),
                confidence: 1.0,
                source: 'manual'
            },
            sparte: elements.caseSparte.value,
            status: elements.caseStatus.value,
            gueltigkeitsdatum: elements.caseDatum.value ? {
                value: elements.caseDatum.value.trim(),
                confidence: 1.0,
                source: 'manual'
            } : null,
            makler: {
                name: elements.caseMaklerName.value.trim(),
                email: elements.caseMaklerEmail.value.trim()
            },
            notes: elements.caseNotes.value.trim()
        };
    }

    /**
     * Filter-Werte auslesen (Vorgänge View)
     */
    function getVorgaengeFilterValues() {
        return {
            search: elements.vorgaengeSearch?.value.trim().toLowerCase() || '',
            status: elements.filterStatus?.value || '',
            sparte: elements.filterSparte?.value || '',
            exportFilter: elements.filterExport?.value || ''
        };
    }

    /**
     * Makler-Suchwert auslesen
     */
    function getMaklerSearchValue() {
        return elements.maklerSearch?.value.trim().toLowerCase() || '';
    }

    /**
     * E-Mail-Filter auslesen
     */
    function getEmailFilterValues() {
        return {
            search: elements.emailSearch?.value.trim().toLowerCase() || '',
            sort: elements.emailSort?.value || 'desc'
        };
    }

    /**
     * Datum formatieren (TT.MM.JJJJ)
     */
    function formatDate(dateStr) {
        if (!dateStr) return '-';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (e) {
            return dateStr;
        }
    }

    /**
     * Datum+Zeit formatieren
     */
    function formatDateTime(dateStr) {
        if (!dateStr) return '-';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateStr;
        }
    }

    /**
     * Text kürzen
     */
    function truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    /**
     * HTML-Zeichen escapen
     */
    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Öffentliche API
    return {
        init,
        elements,

        // Dashboard
        renderDashboardKPIs,
        renderStatusBars,
        renderTopMaklerList,
        renderSpartenList,
        renderRecentActivity,

        // Navigation
        updateNavCounts,
        switchView,

        // Rendering
        renderVorgaengeTable,
        renderMaklerTable,
        renderEmailsTable,

        // Modals
        openCaseModal,
        closeCaseModal,
        openMaklerModal,
        closeMaklerModal,
        openExportModal,
        closeExportModal,
        getExporterName,

        // Notifications
        showToast,
        showDropOverlay,

        // Formulare
        getCaseFormData,
        getVorgaengeFilterValues,
        getMaklerSearchValue,
        getEmailFilterValues,

        // Hilfsfunktionen
        formatDate,
        formatDateTime,
        escapeHtml,

        // Konstanten
        STATUS_ICONS,
        STATUS_LABELS
    };
})();
