' ========================================
' Bestandsuebertragung - Outlook Export
' VBScript fuer E-Mail-Export aus Outlook
' ========================================

Option Explicit

' Konfiguration
Const MAX_EMAILS = 5000
Const MAX_BODY_LENGTH = 10000
Const TARGET_MAILBOX = "ebrenneisen@deloitte.de"
Const SUBJECT_FILTER = "Demo Bestandsübertragung"
Const DAYS_BACK = 90

' Globale Variablen
Dim objOutlook, objNamespace
Dim fso, outputFile
Dim emailCount, outputPath

' Hauptprogramm
Sub Main()
    Dim result

    ' Einfacher Start-Dialog
    result = MsgBox("Bestandsübertragung - Outlook Export" & vbCrLf & vbCrLf & _
        "Postfach: " & TARGET_MAILBOX & vbCrLf & _
        "Filter: Betreff enthält '" & SUBJECT_FILTER & "'" & vbCrLf & _
        "Zeitraum: Letzte " & DAYS_BACK & " Tage" & vbCrLf & vbCrLf & _
        "Mail Export starten?", vbYesNo + vbQuestion, "Outlook Export")

    If result <> vbYes Then
        WScript.Quit
    End If

    ' Mit Outlook verbinden
    If Not ConnectOutlook() Then
        MsgBox "Fehler: Konnte nicht mit Outlook verbinden." & vbCrLf & _
            "Bitte stellen Sie sicher, dass Outlook geoeffnet ist.", _
            vbCritical, "Verbindungsfehler"
        WScript.Quit
    End If

    ' Postfach finden
    Dim mailbox
    Set mailbox = FindMailbox(TARGET_MAILBOX)

    If mailbox Is Nothing Then
        MsgBox "Fehler: Postfach '" & TARGET_MAILBOX & "' nicht gefunden." & vbCrLf & vbCrLf & _
            "Bitte prüfen Sie, ob das Postfach in Outlook eingerichtet ist.", _
            vbCritical, "Postfach nicht gefunden"
        WScript.Quit
    End If

    ' Speicherort festlegen (Desktop)
    outputPath = GetSavePath()

    ' E-Mails exportieren
    If ExportEmails(mailbox) Then
        MsgBox "Export erfolgreich!" & vbCrLf & vbCrLf & _
            "Exportierte E-Mails: " & emailCount & vbCrLf & _
            "Datei: " & outputPath & vbCrLf & vbCrLf & _
            "Sie koennen diese Datei nun in der Web-App importieren.", _
            vbInformation, "Export abgeschlossen"
    Else
        MsgBox "Export fehlgeschlagen oder keine E-Mails gefunden.", _
            vbExclamation, "Exportergebnis"
    End If
End Sub

' Mit Outlook verbinden
Function ConnectOutlook()
    On Error Resume Next

    Set objOutlook = GetObject(, "Outlook.Application")
    If Err.Number <> 0 Then
        Err.Clear
        Set objOutlook = CreateObject("Outlook.Application")
    End If

    If Err.Number <> 0 Then
        ConnectOutlook = False
        Exit Function
    End If

    Set objNamespace = objOutlook.GetNamespace("MAPI")
    ConnectOutlook = True

    On Error GoTo 0
End Function

' Postfach nach Name finden
Function FindMailbox(mailboxName)
    Dim folders, folder, i

    Set FindMailbox = Nothing
    Set folders = objNamespace.Folders

    For i = 1 To folders.Count
        Set folder = folders.Item(i)
        If LCase(folder.Name) = LCase(mailboxName) Then
            Set FindMailbox = folder
            Exit Function
        End If
    Next
End Function

' Speicherort festlegen (Downloads-Ordner)
Function GetSavePath()
    Dim shell, downloadsPath, filename

    Set shell = CreateObject("WScript.Shell")

    ' Downloads-Ordner ermitteln
    downloadsPath = shell.ExpandEnvironmentStrings("%USERPROFILE%") & "\Downloads"

    filename = "bestandsuebertragung-export-" & _
        Year(Date) & "-" & Right("0" & Month(Date), 2) & "-" & Right("0" & Day(Date), 2) & ".json"

    GetSavePath = downloadsPath & "\" & filename

    Set shell = Nothing
End Function

' E-Mails exportieren
Function ExportEmails(mailbox)
    Dim inbox, sentFolder
    Dim inboxEmails, sentEmails
    Dim jsonContent, i
    Dim dateFrom, dateTo

    On Error Resume Next

    Set fso = CreateObject("Scripting.FileSystemObject")

    dateFrom = DateAdd("d", -DAYS_BACK, Date)
    dateTo = Date

    ' Posteingang finden
    Set inbox = FindFolder(mailbox, Array("Posteingang", "Inbox"))

    ' Gesendete finden
    Set sentFolder = FindFolder(mailbox, Array("Gesendete Elemente", "Sent Items", "Gesendet"))

    ' E-Mails sammeln
    emailCount = 0
    ReDim inboxEmails(0)
    ReDim sentEmails(0)

    If Not inbox Is Nothing Then
        inboxEmails = GetEmailsFromFolder(inbox, dateFrom, dateTo, "inbox")
    End If

    If Not sentFolder Is Nothing Then
        sentEmails = GetEmailsFromFolder(sentFolder, dateFrom, dateTo, "sent")
    End If

    ' Pruefen ob E-Mails gefunden
    If emailCount = 0 Then
        ExportEmails = False
        Exit Function
    End If

    ' JSON erstellen und speichern
    jsonContent = BuildJsonOutput(inboxEmails, sentEmails, TARGET_MAILBOX, dateFrom, dateTo)

    Set outputFile = fso.CreateTextFile(outputPath, True, True) ' Unicode
    outputFile.Write jsonContent
    outputFile.Close

    ExportEmails = True

    On Error GoTo 0
End Function

' Ordner finden
Function FindFolder(mailbox, folderNames)
    Dim folders, folder, i, j

    Set FindFolder = Nothing
    Set folders = mailbox.Folders

    For i = 1 To folders.Count
        Set folder = folders.Item(i)
        For j = 0 To UBound(folderNames)
            If LCase(folder.Name) = LCase(folderNames(j)) Then
                Set FindFolder = folder
                Exit Function
            End If
        Next
    Next
End Function

' E-Mails aus Ordner holen (nur mit Betreff-Filter)
Function GetEmailsFromFolder(folder, dateFrom, dateTo, folderType)
    Dim items, item, i, emails(), count
    Dim receivedTime, senderEmail, subject

    On Error Resume Next

    count = 0
    ReDim emails(0)

    Set items = folder.Items
    items.Sort "[ReceivedTime]", True

    For i = 1 To items.Count
        If count >= MAX_EMAILS Then Exit For

        Set item = items.Item(i)

        ' Nur Mail-Items
        If item.Class = 43 Then
            receivedTime = item.ReceivedTime

            ' Datum pruefen
            If receivedTime < dateFrom Then Exit For
            If receivedTime <= dateTo Then
                ' BETREFF-FILTER: Nur Mails mit "Demo Bestandsübertragung"
                subject = item.Subject
                If InStr(1, subject, SUBJECT_FILTER, vbTextCompare) > 0 Then
                    count = count + 1
                    ReDim Preserve emails(count)

                    senderEmail = GetSenderEmail(item)

                    emails(count) = Array( _
                        item.EntryID, _
                        GetConversationID(item), _
                        CleanString(subject), _
                        senderEmail, _
                        FormatDateTime(receivedTime, vbGeneralDate), _
                        TruncateBody(item.Body), _
                        folderType _
                    )

                    emailCount = emailCount + 1
                End If
            End If
        End If
    Next

    GetEmailsFromFolder = emails

    On Error GoTo 0
End Function

' Sender E-Mail extrahieren
Function GetSenderEmail(item)
    On Error Resume Next

    Dim email
    email = ""

    If item.SenderEmailType = "EX" Then
        If Not item.Sender Is Nothing Then
            Dim exchUser
            Set exchUser = item.Sender.GetExchangeUser()
            If Not exchUser Is Nothing Then
                email = exchUser.PrimarySmtpAddress
            End If
        End If
    End If

    If email = "" Then
        email = item.SenderEmailAddress
    End If

    GetSenderEmail = email

    On Error GoTo 0
End Function

' ConversationID holen (falls verfuegbar)
Function GetConversationID(item)
    On Error Resume Next
    GetConversationID = item.ConversationID
    If Err.Number <> 0 Then
        GetConversationID = ""
    End If
    On Error GoTo 0
End Function

' Body kuerzen
Function TruncateBody(body)
    If Len(body) > MAX_BODY_LENGTH Then
        TruncateBody = Left(body, MAX_BODY_LENGTH) & vbCrLf & "[... gekuerzt]"
    Else
        TruncateBody = body
    End If
End Function

' String fuer JSON bereinigen
Function CleanString(str)
    Dim result
    result = str
    result = Replace(result, "\", "\\")
    result = Replace(result, """", "\""")
    result = Replace(result, vbCrLf, "\n")
    result = Replace(result, vbCr, "\n")
    result = Replace(result, vbLf, "\n")
    result = Replace(result, vbTab, "\t")
    CleanString = result
End Function

' JSON Output erstellen
Function BuildJsonOutput(inboxEmails, sentEmails, mailboxName, dateFrom, dateTo)
    Dim json, i, email

    json = "{" & vbCrLf
    json = json & "  ""exportDate"": """ & FormatDateTime(Now, vbGeneralDate) & """," & vbCrLf
    json = json & "  ""exportedBy"": ""Outlook VBScript Export""," & vbCrLf
    json = json & "  ""mailbox"": """ & CleanString(mailboxName) & """," & vbCrLf
    json = json & "  ""subjectFilter"": """ & CleanString(SUBJECT_FILTER) & """," & vbCrLf
    json = json & "  ""dateRange"": {" & vbCrLf
    json = json & "    ""from"": """ & FormatDateTime(dateFrom, vbShortDate) & """," & vbCrLf
    json = json & "    ""to"": """ & FormatDateTime(dateTo, vbShortDate) & """" & vbCrLf
    json = json & "  }," & vbCrLf
    json = json & "  ""totalEmails"": " & emailCount & "," & vbCrLf
    json = json & "  ""emails"": [" & vbCrLf

    Dim firstEmail
    firstEmail = True

    ' Inbox-Mails
    For i = 1 To UBound(inboxEmails)
        If Not firstEmail Then
            json = json & "," & vbCrLf
        End If
        firstEmail = False

        email = inboxEmails(i)
        json = json & BuildEmailJson(email)
    Next

    ' Sent-Mails
    For i = 1 To UBound(sentEmails)
        If Not firstEmail Then
            json = json & "," & vbCrLf
        End If
        firstEmail = False

        email = sentEmails(i)
        json = json & BuildEmailJson(email)
    Next

    json = json & vbCrLf & "  ]" & vbCrLf
    json = json & "}" & vbCrLf

    BuildJsonOutput = json
End Function

' Einzelne E-Mail als JSON
Function BuildEmailJson(emailArr)
    Dim json

    json = "    {" & vbCrLf
    json = json & "      ""entryID"": """ & CleanString(emailArr(0)) & """," & vbCrLf
    json = json & "      ""conversationID"": """ & CleanString(emailArr(1)) & """," & vbCrLf
    json = json & "      ""subject"": """ & CleanString(emailArr(2)) & """," & vbCrLf
    json = json & "      ""senderEmail"": """ & CleanString(emailArr(3)) & """," & vbCrLf
    json = json & "      ""receivedTime"": """ & emailArr(4) & """," & vbCrLf
    json = json & "      ""bodyPlain"": """ & CleanString(emailArr(5)) & """," & vbCrLf
    json = json & "      ""folder"": """ & emailArr(6) & """" & vbCrLf
    json = json & "    }"

    BuildEmailJson = json
End Function

' Skript starten
Main()
