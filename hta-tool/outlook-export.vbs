' ========================================
' Bestandsuebertragung - Outlook Export
' VBScript fuer E-Mail-Export aus Outlook
' ========================================

Option Explicit

' Konfiguration
Const MAX_EMAILS = 5000
Const MAX_BODY_LENGTH = 10000
Const SUBJECT_FILTER = "[EXT] Demo Bestand"
Const DAYS_BACK = 365
Const MAILBOX_INDEX = 9  ' ebrenneisen@deloitte.de

' Globale Variablen
Dim objOutlook, objNamespace, fso
Dim emailCount, outputPath

' Hauptprogramm
Main

Sub Main()
    Dim mailbox, emails, jsonContent

    ' FSO erstellen
    Set fso = CreateObject("Scripting.FileSystemObject")

    ' Mit Outlook verbinden
    If Not ConnectOutlook() Then
        MsgBox "Fehler: Konnte nicht mit Outlook verbinden." & vbCrLf & _
            "Bitte stellen Sie sicher, dass Outlook geoeffnet ist.", _
            vbCritical, "Verbindungsfehler"
        WScript.Quit 1
    End If

    ' Postfach holen
    On Error Resume Next
    Set mailbox = objNamespace.Folders.Item(MAILBOX_INDEX)
    On Error GoTo 0

    If mailbox Is Nothing Then
        MsgBox "Fehler: Postfach #" & MAILBOX_INDEX & " nicht gefunden.", vbCritical, "Export"
        WScript.Quit 1
    End If

    ' Speicherort festlegen
    outputPath = GetSavePath()

    ' E-Mails sammeln
    emailCount = 0
    Set emails = CreateObject("Scripting.Dictionary")

    CollectEmails mailbox, emails

    If emailCount = 0 Then
        MsgBox "Keine E-Mails mit Betreff '" & SUBJECT_FILTER & "' gefunden." & vbCrLf & _
            "Postfach: " & mailbox.Name, vbExclamation, "Export"
        WScript.Quit 0
    End If

    ' JSON erstellen
    jsonContent = BuildJSON(emails, mailbox.Name)

    ' JSON in Datei schreiben
    If WriteFile(outputPath, jsonContent) Then
        MsgBox "Export erfolgreich!" & vbCrLf & vbCrLf & _
            "Postfach: " & mailbox.Name & vbCrLf & _
            "Exportierte E-Mails: " & emailCount & vbCrLf & _
            "Datei: " & outputPath & vbCrLf & vbCrLf & _
            "Sie koennen diese Datei nun in der Web-App importieren.", _
            vbInformation, "Export abgeschlossen"
    Else
        MsgBox "Fehler beim Schreiben der Datei: " & outputPath, vbCritical, "Export"
    End If
End Sub

' Mit Outlook verbinden
Function ConnectOutlook()
    ConnectOutlook = False

    On Error Resume Next
    Set objOutlook = GetObject(, "Outlook.Application")
    If Err.Number <> 0 Then
        Err.Clear
        Set objOutlook = CreateObject("Outlook.Application")
    End If

    If Err.Number <> 0 Then Exit Function

    Set objNamespace = objOutlook.GetNamespace("MAPI")
    ConnectOutlook = True
    On Error GoTo 0
End Function

' E-Mails rekursiv sammeln
Sub CollectEmails(folder, emails)
    Dim items, item, i, subFolder
    Dim dateFrom, receivedTime, subject
    Dim entryId, convId, sender, body, folderName, recTime

    dateFrom = DateAdd("d", -DAYS_BACK, Date)

    On Error Resume Next
    Set items = folder.Items

    If Not items Is Nothing Then
        For i = 1 To items.Count
            If emailCount >= MAX_EMAILS Then Exit For

            Set item = items.Item(i)

            ' Nur Mail-Items (Class = 43)
            If item.Class = 43 Then
                receivedTime = item.ReceivedTime

                ' Datum pruefen (heute eingeschlossen)
                If receivedTime >= dateFrom Then
                    subject = "" & item.Subject

                    ' Betreff-Filter pruefen
                    If InStr(1, subject, SUBJECT_FILTER, vbTextCompare) > 0 Then
                        ' Alle Werte VORHER in Variablen speichern
                        entryId = "" & item.EntryID
                        convId = GetConvID(item)
                        sender = GetSender(item)
                        body = TruncBody(item)
                        folderName = "" & folder.Name
                        recTime = FormatDateTime(receivedTime, vbGeneralDate)

                        emailCount = emailCount + 1

                        ' Als einzelne Strings speichern (kein Array)
                        emails.Add "e" & emailCount & "_entryID", entryId
                        emails.Add "e" & emailCount & "_convID", convId
                        emails.Add "e" & emailCount & "_subject", CleanStr(subject)
                        emails.Add "e" & emailCount & "_sender", sender
                        emails.Add "e" & emailCount & "_time", recTime
                        emails.Add "e" & emailCount & "_body", CleanStr(body)
                        emails.Add "e" & emailCount & "_folder", folderName
                    End If
                End If
            End If

            Set item = Nothing
        Next
    End If

    ' Unterordner durchsuchen
    For Each subFolder In folder.Folders
        CollectEmails subFolder, emails
    Next

    On Error GoTo 0
End Sub

' ConversationID holen
Function GetConvID(item)
    On Error Resume Next
    GetConvID = "" & item.ConversationID
    If Err.Number <> 0 Then GetConvID = ""
    On Error GoTo 0
End Function

' Sender E-Mail holen
Function GetSender(item)
    Dim email, senderType, senderAddr
    email = ""

    On Error Resume Next

    ' Erst SenderEmailType pruefen
    senderType = "" & item.SenderEmailType
    senderAddr = "" & item.SenderEmailAddress

    ' Bei Exchange-Adressen die SMTP-Adresse holen
    If senderType = "EX" Then
        If Not item.Sender Is Nothing Then
            Dim exchUser
            Set exchUser = item.Sender.GetExchangeUser()
            If Not exchUser Is Nothing Then
                email = "" & exchUser.PrimarySmtpAddress
                Set exchUser = Nothing
            End If
        End If
    End If

    ' Fallback: SenderEmailAddress direkt verwenden
    If email = "" Then
        email = senderAddr
    End If

    ' Wenn immer noch leer, versuche PropertyAccessor
    If email = "" Then
        Dim propEmail
        propEmail = item.PropertyAccessor.GetProperty("http://schemas.microsoft.com/mapi/proptag/0x5D01001F")
        If Err.Number = 0 Then
            email = "" & propEmail
        End If
        Err.Clear
    End If

    On Error GoTo 0

    GetSender = email
End Function

' Body sicher holen und kuerzen
Function TruncBody(item)
    Dim b
    b = ""

    On Error Resume Next
    b = item.Body
    If Err.Number <> 0 Then
        Err.Clear
        b = ""
    End If
    On Error GoTo 0

    If IsNull(b) Or IsEmpty(b) Then b = ""
    b = "" & b

    If Len(b) > MAX_BODY_LENGTH Then
        TruncBody = Left(b, MAX_BODY_LENGTH) & " [...]"
    Else
        TruncBody = b
    End If
End Function

' String fuer JSON bereinigen - EINFACH
Function CleanStr(s)
    Dim r
    r = "" & s

    ' Backslash ZUERST
    r = Replace(r, "\", "\\")
    ' Anfuehrungszeichen
    r = Replace(r, """", "\""")
    ' Zeilenumbrueche
    r = Replace(r, vbCrLf, "\n")
    r = Replace(r, vbCr, "\n")
    r = Replace(r, vbLf, "\n")
    ' Tab
    r = Replace(r, vbTab, "\t")
    ' Steuerzeichen entfernen
    r = Replace(r, Chr(0), "")
    r = Replace(r, Chr(12), "")

    CleanStr = r
End Function

' JSON erstellen
Function BuildJSON(emails, mailboxName)
    Dim json, i

    json = "{" & vbCrLf
    json = json & "  ""exportDate"": """ & FormatDateTime(Now, vbGeneralDate) & """," & vbCrLf
    json = json & "  ""mailbox"": """ & CleanStr(mailboxName) & """," & vbCrLf
    json = json & "  ""subjectFilter"": """ & CleanStr(SUBJECT_FILTER) & """," & vbCrLf
    json = json & "  ""totalEmails"": " & emailCount & "," & vbCrLf
    json = json & "  ""emails"": [" & vbCrLf

    For i = 1 To emailCount
        If i > 1 Then json = json & "," & vbCrLf

        json = json & "    {"
        json = json & """entryID"": """ & emails.Item("e" & i & "_entryID") & """, "
        json = json & """conversationID"": """ & emails.Item("e" & i & "_convID") & """, "
        json = json & """subject"": """ & emails.Item("e" & i & "_subject") & """, "
        json = json & """senderEmail"": """ & emails.Item("e" & i & "_sender") & """, "
        json = json & """receivedTime"": """ & emails.Item("e" & i & "_time") & """, "
        json = json & """bodyPlain"": """ & emails.Item("e" & i & "_body") & """, "
        json = json & """folder"": """ & emails.Item("e" & i & "_folder") & """"
        json = json & "}"
    Next

    json = json & vbCrLf & "  ]" & vbCrLf
    json = json & "}" & vbCrLf

    BuildJSON = json
End Function

' Datei schreiben
Function WriteFile(filePath, content)
    Dim f

    On Error Resume Next
    Set f = fso.CreateTextFile(filePath, True, False)

    If Err.Number <> 0 Then
        WriteFile = False
        Exit Function
    End If

    f.Write content
    f.Close
    Set f = Nothing

    WriteFile = (Err.Number = 0)
    On Error GoTo 0
End Function

' Speicherpfad ermitteln
Function GetSavePath()
    Dim shell, downloadsPath, filename

    Set shell = CreateObject("WScript.Shell")
    downloadsPath = shell.ExpandEnvironmentStrings("%USERPROFILE%") & "\Downloads"

    filename = "bestandsuebertragung-export-" & _
        Year(Date) & "-" & Right("0" & Month(Date), 2) & "-" & Right("0" & Day(Date), 2) & ".json"

    GetSavePath = downloadsPath & "\" & filename
    Set shell = Nothing
End Function
