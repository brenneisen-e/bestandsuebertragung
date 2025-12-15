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

            // Statistik
            statTotal: document.getElementById('statTotal'),
            statBestaetigt: document.getElementById('statBestaetigt'),
            statAbgelehnt: document.getElementById('statAbgelehnt'),
            statOffen: document.getElementById('statOffen'),

            // Tab Counts
            kundenCount: document.getElementById('kundenCount'),
            maklerCount: document.getElementById('maklerCount'),
            emailsCount: document.getElementById('emailsCount'),

            // Kunden Tab
            kundenSearch: document.getElementById('kundenSearch'),
            filterStatus: document.getElementById('filterStatus'),
            filterSparte: document.getElementById('filterSparte'),
            kundenTableBody: document.getElementById('kundenTableBody'),
            kundenEmpty: document.getElementById('kundenEmpty'),

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

            // Makler Modal
            maklerModal: document.getElementById('maklerModal'),
            maklerModalTitle: document.getElementById('maklerModalTitle'),
            maklerInfo: document.getElementById('maklerInfo'),
            maklerCasesBody: document.getElementById('maklerCasesBody')
        };
    }

    /**
     * Statistiken aktualisieren
     */
    function renderStats(stats) {
        if (elements.statTotal) elements.statTotal.textContent = stats.total;
        if (elements.statBestaetigt) elements.statBestaetigt.textContent = stats.bestaetigt;
        if (elements.statAbgelehnt) elements.statAbgelehnt.textContent = stats.abgelehnt;
        if (elements.statOffen) elements.statOffen.textContent = stats.offen;
    }

    /**
     * Tab Counts aktualisieren
     */
    function updateTabCounts(kundenCount, maklerCount, emailsCount) {
        if (elements.kundenCount) elements.kundenCount.textContent = kundenCount;
        if (elements.maklerCount) elements.maklerCount.textContent = maklerCount;
        if (elements.emailsCount) elements.emailsCount.textContent = emailsCount;
    }

    /**
     * Kunden-Tabelle rendern
     */
    function renderKundenTable(cases) {
        if (!elements.kundenTableBody) return;

        if (!cases || cases.length === 0) {
            elements.kundenTableBody.innerHTML = '';
            if (elements.kundenEmpty) elements.kundenEmpty.style.display = 'block';
            return;
        }

        if (elements.kundenEmpty) elements.kundenEmpty.style.display = 'none';

        elements.kundenTableBody.innerHTML = cases.map(c => {
            const kunde = c.kunde?.name || 'Unbekannt';
            const vsNr = c.versicherungsnummer?.value || '-';
            const sparte = c.sparte || '-';
            const makler = c.makler?.name || '-';
            const datum = c.gueltigkeitsdatum?.value || '-';
            const updatedAt = formatDate(c.updatedAt);
            const messageCount = c.messages?.length || 0;

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
                    <td class="col-mails">${messageCount > 0 ? `<span class="mail-badge">${messageCount}</span>` : '-'}</td>
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
     * Tab wechseln
     */
    function switchTab(tabName) {
        // Tab-Buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Tab-Content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `tab-${tabName}`);
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
     * Filter-Werte auslesen (Kunden Tab)
     */
    function getKundenFilterValues() {
        return {
            search: elements.kundenSearch?.value.trim().toLowerCase() || '',
            status: elements.filterStatus?.value || '',
            sparte: elements.filterSparte?.value || ''
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

        // Rendering
        renderStats,
        updateTabCounts,
        renderKundenTable,
        renderMaklerTable,
        renderEmailsTable,

        // Modals
        openCaseModal,
        closeCaseModal,
        openMaklerModal,
        closeMaklerModal,

        // Tabs
        switchTab,

        // Notifications
        showToast,
        showDropOverlay,

        // Formulare
        getCaseFormData,
        getKundenFilterValues,
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
