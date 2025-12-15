/**
 * EmailExtract - E-Mail Extraktion und Verarbeitung
 * Scannt Ordner, filtert nach Schlagwörtern, gruppiert nach Konversationen
 */

var EmailExtract = (function() {
    'use strict';

    // Zwischenspeicher für gescannte Daten
    var scannedData = null;

    /**
     * E-Mails scannen
     */
    function scan(settings) {
        var allEmails = [];

        // Posteingang scannen
        if (settings.folders.inbox) {
            var inbox = OutlookConnect.getInbox(settings.mailbox);
            if (inbox) {
                var inboxMails = OutlookConnect.getEmails(inbox, settings.dateFrom, settings.dateTo);
                inboxMails.forEach(function(mail) {
                    mail.folder = 'inbox';
                });
                allEmails = allEmails.concat(inboxMails);
            }
        }

        // Gesendete Elemente scannen
        if (settings.folders.sent) {
            var sent = OutlookConnect.getSentFolder(settings.mailbox);
            if (sent) {
                var sentMails = OutlookConnect.getEmails(sent, settings.dateFrom, settings.dateTo);
                sentMails.forEach(function(mail) {
                    mail.folder = 'sent';
                });
                allEmails = allEmails.concat(sentMails);
            }
        }

        // Nach Schlagwörtern filtern (falls aktiviert)
        if (settings.useKeywords && settings.keywords.length > 0) {
            allEmails = filterByKeywords(allEmails, settings.keywords);
        }

        // Nach Konversationen gruppieren
        var conversations = groupByConversation(allEmails);

        // Ergebnis speichern
        scannedData = {
            exportDate: new Date().toISOString(),
            mailboxName: settings.mailbox,
            exportSettings: {
                dateRange: {
                    from: settings.dateFrom,
                    to: settings.dateTo
                },
                folders: Object.keys(settings.folders).filter(function(k) {
                    return settings.folders[k];
                }),
                keywordFilter: settings.useKeywords ? settings.keywords : []
            },
            totalEmails: allEmails.length,
            conversationCount: Object.keys(conversations).length,
            conversations: conversations
        };

        return {
            totalEmails: scannedData.totalEmails,
            conversationCount: scannedData.conversationCount
        };
    }

    /**
     * Nach Schlagwörtern filtern
     */
    function filterByKeywords(emails, keywords) {
        return emails.filter(function(email) {
            var searchText = (email.subject + ' ' + email.bodyPlain).toLowerCase();

            for (var i = 0; i < keywords.length; i++) {
                if (searchText.indexOf(keywords[i].toLowerCase()) !== -1) {
                    return true;
                }
            }
            return false;
        });
    }

    /**
     * E-Mails nach ConversationID gruppieren
     */
    function groupByConversation(emails) {
        var conversations = {};

        emails.forEach(function(email) {
            var convId = email.conversationID || 'no-conv-' + email.entryID;

            if (!conversations[convId]) {
                conversations[convId] = {
                    conversationID: convId,
                    subject: email.subject,
                    messages: []
                };
            }

            conversations[convId].messages.push({
                entryID: email.entryID,
                folder: email.folder,
                subject: email.subject,
                senderEmail: email.senderEmail,
                receivedTime: email.receivedTime,
                bodyPlain: email.bodyPlain
            });
        });

        // Nachrichten innerhalb jeder Konversation nach Datum sortieren
        for (var convId in conversations) {
            if (conversations.hasOwnProperty(convId)) {
                conversations[convId].messages.sort(function(a, b) {
                    return new Date(a.receivedTime) - new Date(b.receivedTime);
                });

                // Betreff von der neuesten Nachricht nehmen
                var lastMsg = conversations[convId].messages[conversations[convId].messages.length - 1];
                conversations[convId].subject = lastMsg.subject;
            }
        }

        return conversations;
    }

    /**
     * Gescannte Daten abrufen
     */
    function getScannedData() {
        return scannedData;
    }

    /**
     * Cache leeren
     */
    function clearCache() {
        scannedData = null;
    }

    /**
     * Versicherer aus E-Mail-Domain erkennen
     */
    function detectVersicherer(email) {
        if (!email) return null;

        var domain = email.split('@')[1];
        if (!domain) return null;

        domain = domain.toLowerCase();

        for (var key in Config.versichererDomains) {
            if (Config.versichererDomains.hasOwnProperty(key)) {
                if (domain === key || domain.indexOf(key) !== -1) {
                    return Config.versichererDomains[key];
                }
            }
        }

        return null;
    }

    // Öffentliche API
    return {
        scan: scan,
        getScannedData: getScannedData,
        clearCache: clearCache,
        detectVersicherer: detectVersicherer
    };
})();
