' ========================================
' Bestandsuebertragung - Outlook Export
' VBScript fuer E-Mail-Export aus Outlook
' ========================================

Option Explicit

' Konfiguration
Const MAX_EMAILS = 5000
Const MAX_BODY_LENGTH = 10000

' Globale Variablen
Dim objOutlook, objNamespace
Dim fso, outputFile
Dim emailCount, outputPath

' Hauptprogramm
Sub Main()
    Dim mailboxName, dateFrom, dateTo
    Dim daysBack, result

    ' Begruessungsdialog
    result = MsgBox("Bestandsuebertragung - Outlook Export" & vbCrLf & vbCrLf & _
        "Dieses Skript exportiert E-Mails aus Outlook als JSON-Datei." & vbCrLf & _
        "Die Datei kann dann in der Web-App importiert werden." & vbCrLf & vbCrLf & _
        "Outlook muss geoeffnet sein!" & vbCrLf & vbCrLf & _
        "Fortfahren?", vbYesNo + vbQuestion, "Outlook Export")

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

    ' Postfach auswaehlen
    mailboxName = SelectMailbox()
    If mailboxName = "" Then
        WScript.Quit
    End If

    ' Zeitraum auswaehlen
    daysBack = InputBox("Wie viele Tage zurueck sollen E-Mails exportiert werden?" & vbCrLf & vbCrLf & _
        "Beispiele:" & vbCrLf & _
        "  7 = Letzte Woche" & vbCrLf & _
        "  14 = Letzte 2 Wochen" & vbCrLf & _
        "  30 = Letzter Monat" & vbCrLf & _
        "  90 = Letzte 3 Monate", _
        "Zeitraum", "14")

    If daysBack = "" Then
        WScript.Quit
    End If

    If Not IsNumeric(daysBack) Then
        MsgBox "Bitte geben Sie eine Zahl ein.", vbExclamation, "Eingabefehler"
        WScript.Quit
    End If

    dateFrom = DateAdd("d", -CInt(daysBack), Date)
    dateTo = Date

    ' Speicherort auswaehlen
    outputPath = GetSavePath()
    If outputPath = "" Then
        WScript.Quit
    End If

    ' E-Mails exportieren
    If ExportEmails(mailboxName, dateFrom, dateTo) Then
        MsgBox "Export erfolgreich!" & vbCrLf & vbCrLf & _
            "Exportierte E-Mails: " & emailCount & vbCrLf & _
            "Datei: " & outputPath & vbCrLf & vbCrLf & _
            "Sie koennen diese Datei nun in der Web-App importieren.", _
            vbInformation, "Export abgeschlossen"
    Else
        MsgBox "Export fehlgeschlagen. Bitte versuchen Sie es erneut.", _
            vbCritical, "Exportfehler"
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

' Postfach auswaehlen
Function SelectMailbox()
    Dim folders, folder, i, choices, selection

    Set folders = objNamespace.Folders

    If folders.Count = 0 Then
        MsgBox "Keine Postfaecher gefunden.", vbExclamation, "Fehler"
        SelectMailbox = ""
        Exit Function
    End If

    ' Liste der Postfaecher erstellen
    choices = "Bitte waehlen Sie ein Postfach:" & vbCrLf & vbCrLf

    For i = 1 To folders.Count
        Set folder = folders.Item(i)
        choices = choices & i & ". " & folder.Name & vbCrLf
    Next

    selection = InputBox(choices, "Postfach auswaehlen", "1")

    If selection = "" Then
        SelectMailbox = ""
        Exit Function
    End If

    If Not IsNumeric(selection) Or CInt(selection) < 1 Or CInt(selection) > folders.Count Then
        MsgBox "Ungueltige Auswahl.", vbExclamation, "Fehler"
        SelectMailbox = ""
        Exit Function
    End If

    SelectMailbox = folders.Item(CInt(selection)).Name
End Function

' Speicherort auswaehlen
Function GetSavePath()
    Dim shell, desktopPath, filename

    Set shell = CreateObject("WScript.Shell")
    desktopPath = shell.SpecialFolders("Desktop")

    filename = "bestandsuebertragung-export-" & _
        Year(Date) & "-" & Right("0" & Month(Date), 2) & "-" & Right("0" & Day(Date), 2) & ".json"

    GetSavePath = desktopPath & "\" & filename

    Set shell = Nothing
End Function

' E-Mails exportieren
Function ExportEmails(mailboxName, dateFrom, dateTo)
    Dim mailbox, inbox, sentFolder
    Dim inboxEmails, sentEmails
    Dim jsonContent, i

    On Error Resume Next

    Set fso = CreateObject("Scripting.FileSystemObject")

    ' Postfach finden
    Set mailbox = Nothing
    For i = 1 To objNamespace.Folders.Count
        If objNamespace.Folders.Item(i).Name = mailboxName Then
            Set mailbox = objNamespace.Folders.Item(i)
            Exit For
        End If
    Next

    If mailbox Is Nothing Then
        ExportEmails = False
        Exit Function
    End If

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

    ' JSON erstellen und speichern
    jsonContent = BuildJsonOutput(inboxEmails, sentEmails, mailboxName, dateFrom, dateTo)

    Set outputFile = fso.CreateTextFile(outputPath, True, True) ' Unicode
    outputFile.Write jsonContent
    outputFile.Close

    ExportEmails = True

    On Error GoTo 0
End Function

' Ordner finden
Function FindFolder(mailbox, folderNames)
    Dim folders, folder, i, j, name

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

' E-Mails aus Ordner holen
Function GetEmailsFromFolder(folder, dateFrom, dateTo, folderType)
    Dim items, item, i, emails(), count
    Dim receivedTime, senderEmail

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
                count = count + 1
                ReDim Preserve emails(count)

                senderEmail = GetSenderEmail(item)

                emails(count) = Array( _
                    item.EntryID, _
                    GetConversationID(item), _
                    CleanString(item.Subject), _
                    senderEmail, _
                    FormatDateTime(receivedTime, vbGeneralDate), _
                    TruncateBody(item.Body), _
                    folderType _
                )

                emailCount = emailCount + 1
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
