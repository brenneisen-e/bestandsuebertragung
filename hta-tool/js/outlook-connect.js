/**
 * OutlookConnect - Verbindung zu Microsoft Outlook
 * Verwendet COM-Objekte für Outlook-Zugriff
 */

var OutlookConnect = (function() {
    'use strict';

    // Outlook Application und Namespace
    var outlook = null;
    var namespace = null;
    var connected = false;

    /**
     * Mit Outlook verbinden
     */
    function connect() {
        try {
            // Outlook COM-Objekt erstellen
            outlook = new ActiveXObject('Outlook.Application');
            namespace = outlook.GetNamespace('MAPI');

            // Postfächer auslesen
            var mailboxes = [];
            for (var i = 1; i <= namespace.Folders.Count; i++) {
                var folder = namespace.Folders.Item(i);
                mailboxes.push({
                    name: folder.Name,
                    index: i
                });
            }

            connected = true;

            return {
                success: true,
                mailboxes: mailboxes
            };
        } catch (e) {
            connected = false;
            return {
                success: false,
                error: e.message || 'Outlook-Verbindung fehlgeschlagen'
            };
        }
    }

    /**
     * Postfach nach Namen holen
     */
    function getMailbox(name) {
        if (!connected || !namespace) {
            return null;
        }

        try {
            for (var i = 1; i <= namespace.Folders.Count; i++) {
                var folder = namespace.Folders.Item(i);
                if (folder.Name === name) {
                    return folder;
                }
            }
        } catch (e) {
            // Fehler ignorieren
        }

        return null;
    }

    /**
     * Ordner im Postfach finden
     */
    function findFolder(mailbox, folderNames) {
        if (!mailbox) return null;

        try {
            for (var i = 1; i <= mailbox.Folders.Count; i++) {
                var folder = mailbox.Folders.Item(i);
                for (var j = 0; j < folderNames.length; j++) {
                    if (folder.Name.toLowerCase() === folderNames[j].toLowerCase()) {
                        return folder;
                    }
                }
            }
        } catch (e) {
            // Fehler ignorieren
        }

        return null;
    }

    /**
     * Posteingang holen
     */
    function getInbox(mailboxName) {
        var mailbox = getMailbox(mailboxName);
        return findFolder(mailbox, Config.folderNames.inbox);
    }

    /**
     * Gesendete Elemente holen
     */
    function getSentFolder(mailboxName) {
        var mailbox = getMailbox(mailboxName);
        return findFolder(mailbox, Config.folderNames.sent);
    }

    /**
     * E-Mails aus Ordner lesen
     */
    function getEmails(folder, dateFrom, dateTo) {
        if (!folder) return [];

        var emails = [];
        var fromDate = new Date(dateFrom);
        var toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);

        try {
            var items = folder.Items;
            items.Sort('[ReceivedTime]', true); // Neueste zuerst

            for (var i = 1; i <= items.Count && emails.length < Config.export.maxEmails; i++) {
                try {
                    var item = items.Item(i);

                    // Nur Mail-Items verarbeiten
                    if (item.Class !== 43) continue; // 43 = olMail

                    var receivedTime = new Date(item.ReceivedTime);

                    // Datum prüfen
                    if (receivedTime < fromDate) break; // Keine älteren mehr
                    if (receivedTime > toDate) continue;

                    emails.push({
                        entryID: item.EntryID,
                        conversationID: item.ConversationID || '',
                        subject: item.Subject || '',
                        senderEmail: getSenderEmail(item),
                        receivedTime: receivedTime.toISOString(),
                        bodyPlain: truncateBody(item.Body || ''),
                        folder: folder.Name
                    });
                } catch (itemError) {
                    // Einzelnen Item überspringen bei Fehler
                }
            }
        } catch (e) {
            // Fehler bei Ordner-Zugriff
        }

        return emails;
    }

    /**
     * Sender E-Mail-Adresse extrahieren
     */
    function getSenderEmail(item) {
        try {
            // Verschiedene Möglichkeiten die Absender-Adresse zu bekommen
            if (item.SenderEmailAddress) {
                // Exchange-Adresse in SMTP umwandeln
                if (item.SenderEmailType === 'EX') {
                    try {
                        var sender = item.Sender;
                        if (sender) {
                            var exchUser = sender.GetExchangeUser();
                            if (exchUser) {
                                return exchUser.PrimarySmtpAddress;
                            }
                        }
                    } catch (e) {
                        // Fallback auf Original
                    }
                }
                return item.SenderEmailAddress;
            }
            return '';
        } catch (e) {
            return '';
        }
    }

    /**
     * Body-Text kürzen
     */
    function truncateBody(body) {
        if (!body) return '';
        if (body.length > Config.export.maxBodyLength) {
            return body.substring(0, Config.export.maxBodyLength) + '\n[... gekürzt]';
        }
        return body;
    }

    /**
     * Verbindungsstatus prüfen
     */
    function isConnected() {
        return connected;
    }

    /**
     * Verbindung trennen
     */
    function disconnect() {
        outlook = null;
        namespace = null;
        connected = false;
    }

    // Öffentliche API
    return {
        connect: connect,
        getMailbox: getMailbox,
        getInbox: getInbox,
        getSentFolder: getSentFolder,
        getEmails: getEmails,
        isConnected: isConnected,
        disconnect: disconnect
    };
})();
