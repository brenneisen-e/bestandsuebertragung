' ========================================
' Bestandsuebertragung - Outlook Export
' VBScript fuer E-Mail-Export aus Outlook
' ========================================

Option Explicit

' Konfiguration
Const MAX_EMAILS = 5000
Const MAX_BODY_LENGTH = 10000
Const SUBJECT_FILTER = "[EXT] Demo Bestand"
Const DAYS_BACK = 90

' Globale Variablen
Dim objOutlook, objNamespace
Dim fso, outputFile
Dim emailCount, outputPath

' Globale Variable fuer ausgewaehltes Postfach
Dim selectedMailbox

' Hauptprogramm
Sub Main()
    Dim result

    ' Mit Outlook verbinden
    If Not ConnectOutlook() Then
        MsgBox "Fehler: Konnte nicht mit Outlook verbinden." & vbCrLf & _
            "Bitte stellen Sie sicher, dass Outlook geoeffnet ist.", _
            vbCritical, "Verbindungsfehler"
        WScript.Quit
    End If

    ' Postfach auswaehlen lassen
    Set selectedMailbox = SelectMailbox()
    If selectedMailbox Is Nothing Then
        MsgBox "Abgebrochen.", vbInformation, "Export"
        WScript.Quit
    End If

    ' Speicherort festlegen
    outputPath = GetSavePath()

    ' E-Mails exportieren
    If ExportEmailsFromMailbox(selectedMailbox) Then
        MsgBox "Export erfolgreich!" & vbCrLf & vbCrLf & _
            "Postfach: " & selectedMailbox.Name & vbCrLf & _
            "Exportierte E-Mails: " & emailCount & vbCrLf & _
            "Datei: " & outputPath & vbCrLf & vbCrLf & _
            "Sie koennen diese Datei nun in der Web-App importieren.", _
            vbInformation, "Export abgeschlossen"
    Else
        MsgBox "Export fehlgeschlagen oder keine E-Mails gefunden." & vbCrLf & vbCrLf & _
            "Postfach: " & selectedMailbox.Name & vbCrLf & _
            "Betreff-Filter: " & SUBJECT_FILTER, _
            vbExclamation, "Exportergebnis"
    End If
End Sub

' Postfach-Auswahl Dialog
Function SelectMailbox()
    Dim folders, folder, i
    Dim mailboxList, selection

    Set SelectMailbox = Nothing
    Set folders = objNamespace.Folders

    ' Liste der Postfaecher erstellen
    mailboxList = "Bitte Postfach-Nummer eingeben:" & vbCrLf & vbCrLf

    For i = 1 To folders.Count
        Set folder = folders.Item(i)
        mailboxList = mailboxList & i & ". " & folder.Name & vbCrLf
    Next

    ' Benutzer nach Nummer fragen
    selection = InputBox(mailboxList, "Postfach auswaehlen", "")

    If selection = "" Then
        Exit Function
    End If

    ' Auswahl validieren
    On Error Resume Next
    Dim num
    num = CInt(selection)
    If Err.Number <> 0 Or num < 1 Or num > folders.Count Then
        MsgBox "Ungueltige Auswahl: " & selection, vbExclamation, "Fehler"
        Exit Function
    End If
    On Error GoTo 0

    Set SelectMailbox = folders.Item(num)
End Function

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

' E-Mails aus ausgewaehltem Postfach exportieren
Function ExportEmailsFromMailbox(mailbox)
    Dim inbox, sentFolder
    Dim inboxEmails, sentEmails
    Dim jsonContent
    Dim dateFrom, dateTo
    Dim mailboxName

    On Error Resume Next

    Set fso = CreateObject("Scripting.FileSystemObject")

    dateFrom = DateAdd("d", -DAYS_BACK, Date)
    dateTo = Date
    mailboxName = mailbox.Name

    ' Posteingang und Gesendete aus dem Postfach holen
    Set inbox = FindFolderInMailbox(mailbox, Array("Posteingang", "Inbox"))
    Set sentFolder = FindFolderInMailbox(mailbox, Array("Gesendete Elemente", "Sent Items", "Gesendet"))

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
        ExportEmailsFromMailbox = False
        Exit Function
    End If

    ' JSON erstellen und speichern
    jsonContent = BuildJsonOutput(inboxEmails, sentEmails, mailboxName, dateFrom, dateTo)

    ' UTF-8 ohne BOM schreiben (ADODB.Stream)
    Dim stream
    Set stream = CreateObject("ADODB.Stream")
    stream.Type = 2 ' Text
    stream.Charset = "UTF-8"
    stream.Open
    stream.WriteText jsonContent

    ' BOM entfernen durch Kopieren ab Position 3
    stream.Position = 0
    stream.Type = 1 ' Binary
    stream.Position = 3 ' Skip UTF-8 BOM

    Dim binaryStream
    Set binaryStream = CreateObject("ADODB.Stream")
    binaryStream.Type = 1 ' Binary
    binaryStream.Open
    stream.CopyTo binaryStream

    binaryStream.SaveToFile outputPath, 2 ' Overwrite

    binaryStream.Close
    stream.Close
    Set binaryStream = Nothing
    Set stream = Nothing

    ExportEmailsFromMailbox = True

    On Error GoTo 0
End Function

' Ordner im Postfach finden
Function FindFolderInMailbox(mailbox, folderNames)
    Dim folders, folder, i, j

    Set FindFolderInMailbox = Nothing
    Set folders = mailbox.Folders

    On Error Resume Next
    For i = 1 To folders.Count
        Set folder = folders.Item(i)
        For j = 0 To UBound(folderNames)
            If LCase(folder.Name) = LCase(folderNames(j)) Then
                Set FindFolderInMailbox = folder
                Exit Function
            End If
        Next
    Next
    On Error GoTo 0
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
