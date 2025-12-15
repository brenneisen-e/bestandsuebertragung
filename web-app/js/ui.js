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
        'abgelehnt': '✕',
        'erledigt': '✔'
    };

    // Status-Labels
    const STATUS_LABELS = {
        'neu': 'Neu',
        'angefragt': 'Angefragt',
        'in-bearbeitung': 'In Bearbeitung',
        'bestaetigt': 'Bestätigt',
        'abgelehnt': 'Abgelehnt',
        'erledigt': 'Erledigt'
    };

    // Cache für DOM-Elemente
    let elements = {};

    /**
     * UI initialisieren - DOM-Elemente cachen
     */
    function init() {
        elements = {
            casesList: document.getElementById('casesList'),
            casesEmpty: document.getElementById('casesEmpty'),
            warningSection: document.getElementById('warningSection'),
            warningCount: document.getElementById('warningCount'),
            unassignedMails: document.getElementById('unassignedMails'),
            toastContainer: document.getElementById('toastContainer'),
            dropOverlay: document.getElementById('dropOverlay'),

            // Filter
            searchInput: document.getElementById('searchInput'),
            filterStatus: document.getElementById('filterStatus'),
            filterVersicherer: document.getElementById('filterVersicherer'),
            filterSparte: document.getElementById('filterSparte'),
            filterFlagged: document.getElementById('filterFlagged'),
            filterOpen: document.getElementById('filterOpen'),
            sortSelect: document.getElementById('sortSelect'),

            // Statistik
            statTotal: document.getElementById('statTotal'),
            statNeu: document.getElementById('statNeu'),
            statAngefragt: document.getElementById('statAngefragt'),
            statBearbeitung: document.getElementById('statBearbeitung'),
            statBestaetigt: document.getElementById('statBestaetigt'),
            statAbgelehnt: document.getElementById('statAbgelehnt'),
            statErledigt: document.getElementById('statErledigt'),
            statFlagged: document.getElementById('statFlagged'),

            // Case Modal
            caseModal: document.getElementById('caseModal'),
            modalTitle: document.getElementById('modalTitle'),
            caseForm: document.getElementById('caseForm'),
            caseId: document.getElementById('caseId'),
            caseKunde: document.getElementById('caseKunde'),
            caseVsNr: document.getElementById('caseVsNr'),
            caseVersicherer: document.getElementById('caseVersicherer'),
            caseSparte: document.getElementById('caseSparte'),
            caseStatus: document.getElementById('caseStatus'),
            caseDatum: document.getElementById('caseDatum'),
            caseNotes: document.getElementById('caseNotes'),
            caseFlagged: document.getElementById('caseFlagged'),
            messagesTimeline: document.getElementById('messagesTimeline'),
            messagesEmpty: document.getElementById('messagesEmpty'),
            messagesCount: document.getElementById('messagesCount'),
            historyTimeline: document.getElementById('historyTimeline'),
            kundeConfidence: document.getElementById('kundeConfidence'),
            vsNrConfidence: document.getElementById('vsNrConfidence'),
            datumConfidence: document.getElementById('datumConfidence'),

            // Assign Modal
            assignModal: document.getElementById('assignModal'),
            assignMailPreview: document.getElementById('assignMailPreview'),
            assignSearch: document.getElementById('assignSearch'),
            assignResults: document.getElementById('assignResults'),
            assignConfirm: document.getElementById('assignConfirm')
        };
    }

    /**
     * Vorgangsliste rendern
     */
    function renderCasesList(cases) {
        if (!elements.casesList) return;

        if (!cases || cases.length === 0) {
            elements.casesList.innerHTML = '';
            elements.casesEmpty.style.display = 'block';
            return;
        }

        elements.casesEmpty.style.display = 'none';
        elements.casesList.innerHTML = cases.map(c => renderCaseCard(c)).join('');
    }

    /**
     * Einzelne Vorgangs-Karte rendern
     */
    function renderCaseCard(caseData) {
        const statusClass = `status-${caseData.status.replace('-', '-')}`;
        const flaggedClass = caseData.flagged ? 'flagged' : '';
        const kunde = caseData.kunde?.name || 'Unbekannt';
        const versicherer = caseData.versicherer?.name || '-';
        const vsNr = caseData.versicherungsnummer?.value || '-';
        const sparte = caseData.sparte || '-';
        const messageCount = caseData.messages?.length || 0;
        const updatedAt = formatDate(caseData.updatedAt);

        return `
            <div class="case-card ${flaggedClass}" data-case-id="${caseData.id}">
                <div class="case-status-icon ${statusClass}">
                    ${STATUS_ICONS[caseData.status] || '○'}
                </div>
                <div class="case-content">
                    <div class="case-header">
                        <span class="case-kunde">${escapeHtml(kunde)}</span>
                        ${caseData.flagged ? '<span class="case-flagged">⚑</span>' : ''}
                    </div>
                    <div class="case-details">
                        <span class="case-detail">${escapeHtml(versicherer)}</span>
                        <span class="case-detail">${escapeHtml(vsNr)}</span>
                        <span class="case-detail">${escapeHtml(sparte)}</span>
                    </div>
                </div>
                <div class="case-meta">
                    <div class="case-date">${updatedAt}</div>
                    <div class="case-message-count">
                        <span>✉</span> ${messageCount}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Statistiken aktualisieren
     */
    function renderStats(stats) {
        if (elements.statTotal) elements.statTotal.textContent = stats.total;
        if (elements.statNeu) elements.statNeu.textContent = stats.neu;
        if (elements.statAngefragt) elements.statAngefragt.textContent = stats.angefragt;
        if (elements.statBearbeitung) elements.statBearbeitung.textContent = stats['in-bearbeitung'];
        if (elements.statBestaetigt) elements.statBestaetigt.textContent = stats.bestaetigt;
        if (elements.statAbgelehnt) elements.statAbgelehnt.textContent = stats.abgelehnt;
        if (elements.statErledigt) elements.statErledigt.textContent = stats.erledigt;
        if (elements.statFlagged) elements.statFlagged.textContent = stats.flagged;
    }

    /**
     * Nicht zugeordnete Mails rendern
     */
    function renderUnassignedMails(mails) {
        if (!elements.warningSection || !elements.unassignedMails) return;

        if (!mails || mails.length === 0) {
            elements.warningSection.style.display = 'none';
            return;
        }

        elements.warningSection.style.display = 'block';
        elements.warningCount.textContent = mails.length;

        elements.unassignedMails.innerHTML = mails.map(mail => `
            <div class="unassigned-mail-card" data-mail-id="${mail.entryID}">
                <div class="unassigned-mail-icon">${mail.folder === 'sent' ? '↑' : '↓'}</div>
                <div class="unassigned-mail-content">
                    <div class="unassigned-mail-subject">${escapeHtml(mail.subject || 'Kein Betreff')}</div>
                    <div class="unassigned-mail-meta">
                        <span>${escapeHtml(mail.senderEmail || '-')}</span>
                        <span>${formatDate(mail.receivedTime)}</span>
                    </div>
                </div>
                <div class="unassigned-mail-actions">
                    <button class="btn btn-primary btn-sm" onclick="App.createCaseFromMail('${mail.entryID}')">
                        + Neuer Vorgang
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="App.showAssignModal('${mail.entryID}')">
                        Zuordnen
                    </button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Versicherer-Filter-Dropdown befüllen
     */
    function populateVersichererFilter(cases) {
        if (!elements.filterVersicherer) return;

        const versicherer = new Set();
        cases.forEach(c => {
            if (c.versicherer?.name) {
                versicherer.add(c.versicherer.name);
            }
        });

        const options = ['<option value="">Alle Versicherer</option>'];
        Array.from(versicherer).sort().forEach(v => {
            options.push(`<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`);
        });

        elements.filterVersicherer.innerHTML = options.join('');
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
            elements.caseVersicherer.value = caseData.versicherer?.name || '';
            elements.caseSparte.value = caseData.sparte || '';
            elements.caseStatus.value = caseData.status || 'neu';
            elements.caseDatum.value = caseData.gueltigkeitsdatum?.value || '';
            elements.caseNotes.value = caseData.notes || '';
            elements.caseFlagged.checked = caseData.flagged || false;

            // Confidence-Indikatoren
            renderConfidenceIndicator(elements.kundeConfidence, caseData.kunde);
            renderConfidenceIndicator(elements.vsNrConfidence, caseData.versicherungsnummer);
            renderConfidenceIndicator(elements.datumConfidence, caseData.gueltigkeitsdatum);

            // Nachrichten rendern
            renderMessages(caseData.messages || []);

            // Historie rendern
            renderHistory(caseData.statusHistory || []);
        } else {
            elements.caseId.value = '';
            clearConfidenceIndicators();
            renderMessages([]);
            renderHistory([]);
        }

        // Tab auf "Details" setzen
        switchTab('details');

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
     * Confidence-Indikator rendern
     */
    function renderConfidenceIndicator(element, data) {
        if (!element) return;

        if (!data || data.confidence === undefined) {
            element.textContent = '';
            element.className = 'confidence-indicator';
            return;
        }

        const confidence = data.confidence;
        const source = data.source === 'auto' ? 'automatisch erkannt' : 'manuell eingegeben';
        const percent = Math.round(confidence * 100);

        let level = 'low';
        if (confidence >= 0.9) level = 'high';
        else if (confidence >= 0.7) level = 'medium';

        element.className = `confidence-indicator ${level}`;
        element.textContent = `${percent}% ${source}`;
    }

    /**
     * Confidence-Indikatoren leeren
     */
    function clearConfidenceIndicators() {
        if (elements.kundeConfidence) elements.kundeConfidence.textContent = '';
        if (elements.vsNrConfidence) elements.vsNrConfidence.textContent = '';
        if (elements.datumConfidence) elements.datumConfidence.textContent = '';
    }

    /**
     * Nachrichten-Timeline rendern
     */
    function renderMessages(messages) {
        if (!elements.messagesTimeline || !elements.messagesEmpty) return;

        elements.messagesCount.textContent = messages.length;

        if (messages.length === 0) {
            elements.messagesTimeline.innerHTML = '';
            elements.messagesTimeline.style.display = 'none';
            elements.messagesEmpty.style.display = 'block';
            return;
        }

        elements.messagesEmpty.style.display = 'none';
        elements.messagesTimeline.style.display = 'flex';

        // Nach Datum sortieren (neueste zuerst)
        const sorted = [...messages].sort((a, b) =>
            new Date(b.receivedTime) - new Date(a.receivedTime)
        );

        elements.messagesTimeline.innerHTML = sorted.map(msg => {
            const isSent = msg.folder === 'sent';
            const directionIcon = isSent ? '↑' : '↓';
            const directionText = isSent ? 'Gesendet' : 'Empfangen';

            return `
                <div class="message-item ${msg.folder}">
                    <div class="message-header">
                        <div class="message-direction">
                            <span class="icon">${directionIcon}</span>
                            ${directionText}
                        </div>
                        <div class="message-date">${formatDateTime(msg.receivedTime)}</div>
                    </div>
                    <div class="message-subject">${escapeHtml(msg.subject || 'Kein Betreff')}</div>
                    <div class="message-sender">${escapeHtml(msg.senderEmail || '-')}</div>
                    <div class="message-body">${escapeHtml(msg.bodyPlain || msg.body || '')}</div>
                </div>
            `;
        }).join('');
    }

    /**
     * Status-Historie rendern
     */
    function renderHistory(history) {
        if (!elements.historyTimeline) return;

        if (!history || history.length === 0) {
            elements.historyTimeline.innerHTML = '<p class="text-muted">Keine Historie vorhanden</p>';
            return;
        }

        // Nach Datum sortieren (neueste zuerst)
        const sorted = [...history].sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        );

        elements.historyTimeline.innerHTML = sorted.map(entry => {
            const fromLabel = entry.from ? STATUS_LABELS[entry.from] : '-';
            const toLabel = STATUS_LABELS[entry.to] || entry.to;
            const fromIcon = entry.from ? STATUS_ICONS[entry.from] : '';
            const toIcon = STATUS_ICONS[entry.to] || '';

            return `
                <div class="history-item">
                    <div class="history-date">${formatDate(entry.date)}</div>
                    <div class="history-change">
                        ${entry.from ? `${fromIcon} ${fromLabel} → ` : ''}${toIcon} ${toLabel}
                    </div>
                    ${entry.note ? `<div class="history-note">${escapeHtml(entry.note)}</div>` : ''}
                </div>
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
     * Assign Modal öffnen
     */
    function openAssignModal(mail, cases) {
        if (!elements.assignModal) return;

        // Mail-Vorschau
        elements.assignMailPreview.innerHTML = `
            <div class="mail-preview-subject"><strong>${escapeHtml(mail.subject || 'Kein Betreff')}</strong></div>
            <div class="mail-preview-meta">${escapeHtml(mail.senderEmail || '-')} | ${formatDateTime(mail.receivedTime)}</div>
        `;

        // Suchergebnisse initialisieren
        elements.assignSearch.value = '';
        renderAssignResults(cases.slice(0, 10));

        // Auswahl zurücksetzen
        elements.assignConfirm.disabled = true;
        elements.assignConfirm.dataset.caseId = '';
        elements.assignConfirm.dataset.mailId = mail.entryID;

        elements.assignModal.style.display = 'flex';
    }

    /**
     * Assign Modal schließen
     */
    function closeAssignModal() {
        if (elements.assignModal) {
            elements.assignModal.style.display = 'none';
        }
    }

    /**
     * Zuordnungs-Ergebnisse rendern
     */
    function renderAssignResults(cases) {
        if (!elements.assignResults) return;

        if (cases.length === 0) {
            elements.assignResults.innerHTML = '<div class="assign-result-empty">Keine Vorgänge gefunden</div>';
            return;
        }

        elements.assignResults.innerHTML = cases.map(c => `
            <div class="assign-result-item" data-case-id="${c.id}">
                <div class="assign-result-kunde">${escapeHtml(c.kunde?.name || 'Unbekannt')}</div>
                <div class="assign-result-details">
                    ${escapeHtml(c.versicherer?.name || '-')} | ${escapeHtml(c.versicherungsnummer?.value || '-')}
                </div>
            </div>
        `).join('');
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
                confidence: elements.caseId.value ? undefined : 1.0,
                source: 'manual'
            },
            versicherungsnummer: {
                value: elements.caseVsNr.value.trim(),
                confidence: elements.caseId.value ? undefined : 1.0,
                source: 'manual'
            },
            versicherer: {
                name: elements.caseVersicherer.value,
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
            notes: elements.caseNotes.value.trim(),
            flagged: elements.caseFlagged.checked
        };
    }

    /**
     * Filter-Werte auslesen
     */
    function getFilterValues() {
        return {
            search: elements.searchInput?.value.trim().toLowerCase() || '',
            status: elements.filterStatus?.value || '',
            versicherer: elements.filterVersicherer?.value || '',
            sparte: elements.filterSparte?.value || '',
            flaggedOnly: elements.filterFlagged?.checked || false,
            openOnly: elements.filterOpen?.checked || false,
            sort: elements.sortSelect?.value || 'updatedAt-desc'
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
        renderCasesList,
        renderStats,
        renderUnassignedMails,
        renderAssignResults,
        populateVersichererFilter,

        // Modals
        openCaseModal,
        closeCaseModal,
        openAssignModal,
        closeAssignModal,

        // Tabs
        switchTab,

        // Notifications
        showToast,
        showDropOverlay,

        // Formulare
        getCaseFormData,
        getFilterValues,

        // Hilfsfunktionen
        formatDate,
        formatDateTime,
        escapeHtml,

        // Konstanten
        STATUS_ICONS,
        STATUS_LABELS
    };
})();
