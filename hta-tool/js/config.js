/**
 * Config - Konfiguration für Bestandsübertragung Export
 */

var Config = {
    // Anwendungsversion
    version: '1.0.0',

    // Standard-Schlagwörter für Bestandsübertragung
    defaultKeywords: [
        'bestandsübertragung',
        'maklervollmacht',
        'courtagezusage',
        'übertragung',
        'courtage',
        'maklermandat',
        'vermittlerwechsel'
    ],

    // Outlook Ordner-Namen (deutsch)
    folderNames: {
        inbox: ['Posteingang', 'Inbox'],
        sent: ['Gesendete Elemente', 'Sent Items', 'Gesendet']
    },

    // Versicherer Domain Mapping
    versichererDomains: {
        'ergo.de': 'ERGO',
        'ergo-direkt.de': 'ERGO',
        'allianz.de': 'Allianz',
        'axa.de': 'AXA',
        'hdi.de': 'HDI',
        'zurich.de': 'Zurich',
        'generali.de': 'Generali',
        'debeka.de': 'Debeka',
        'signal-iduna.de': 'Signal Iduna',
        'huk-coburg.de': 'HUK-Coburg',
        'nuernberger.de': 'Nürnberger',
        'gothaer.de': 'Gothaer',
        'barmenia.de': 'Barmenia',
        'r-v.de': 'R+V',
        'lvm.de': 'LVM',
        'devk.de': 'DEVK',
        'continentale.de': 'Continentale',
        'wwk.de': 'WWK',
        'basler.de': 'Basler',
        'hansemerkur.de': 'HanseMerkur',
        'inter.de': 'INTER',
        'volkswohl-bund.de': 'Volkswohl Bund',
        'swiss-life.de': 'Swiss Life',
        'canada-life.de': 'Canada Life',
        'condor-versicherung.de': 'Condor',
        'alte-leipziger.de': 'Alte Leipziger',
        'hallesche.de': 'Hallesche',
        'provinzial.de': 'Provinzial',
        'sparkassen-versicherung.de': 'SV SparkassenVersicherung',
        'wgv.de': 'WGV'
    },

    // Export-Einstellungen
    export: {
        // Maximale Anzahl E-Mails pro Export
        maxEmails: 5000,

        // Body-Text Limit (Zeichen)
        maxBodyLength: 10000,

        // Standard-Dateiname
        defaultFilename: 'bestandsuebertragung-export'
    }
};
