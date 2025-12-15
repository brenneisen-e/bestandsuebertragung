' ========================================
' Bestandsuebertragung - Outlook Export MAKRO
' Diese Version läuft INNERHALB von Outlook (mehr Berechtigungen)
'
' ANLEITUNG:
' 1. In Outlook: Alt + F11 (VBA-Editor öffnen)
' 2. Einfügen → Modul
' 3. Diesen Code einfügen
' 4. Alt + F8 → ExportEmails → Ausführen
' ========================================

Option Explicit

' Konfiguration
Const MAX_EMAILS As Integer = 5000
Const MAX_BODY_LENGTH As Long = 10000
Const SUBJECT_FILTER As String = "[EXT] Demo Bestand"
Const DAYS_BACK As Integer = 365

' Globale Variablen
Dim emailCount As Integer
Dim fso As Object

Public Sub ExportEmails()
    Dim ns As Outlook.NameSpace
    Dim inbox As Outlook.MAPIFolder
    Dim emails As Object
    Dim outputPath As String
    Dim jsonContent As String
    Dim mailboxName As String

    ' FSO erstellen
    Set fso = CreateObject("Scripting.FileSystemObject")

    ' Namespace holen
    Set ns = Application.GetNamespace("MAPI")

    ' Default Inbox verwenden
    Set inbox = ns.GetDefaultFolder(olFolderInbox)
    mailboxName = inbox.Parent.Name

    ' Speicherort
    outputPath = Environ("USERPROFILE") & "\Downloads\bestandsuebertragung-export-" & _
        Format(Date, "yyyy-mm-dd") & ".json"

    ' E-Mails sammeln
    emailCount = 0
    Set emails = CreateObject("Scripting.Dictionary")

    CollectEmailsFromFolder inbox, emails

    If emailCount = 0 Then
        MsgBox "Keine E-Mails mit Betreff '" & SUBJECT_FILTER & "' gefunden." & vbCrLf & _
            "Postfach: " & mailboxName, vbExclamation, "Export"
        Exit Sub
    End If

    ' JSON erstellen
    jsonContent = BuildJSON(emails, mailboxName)

    ' JSON schreiben
    If WriteFile(outputPath, jsonContent) Then
        MsgBox "Export erfolgreich!" & vbCrLf & vbCrLf & _
            "Postfach: " & mailboxName & vbCrLf & _
            "Exportierte E-Mails: " & emailCount & vbCrLf & _
            "Datei: " & outputPath & vbCrLf & vbCrLf & _
            "Sie können diese Datei nun in der Web-App importieren.", _
            vbInformation, "Export abgeschlossen"
    Else
        MsgBox "Fehler beim Schreiben der Datei: " & outputPath, vbCritical, "Export"
    End If
End Sub

Private Sub CollectEmailsFromFolder(folder As Outlook.MAPIFolder, emails As Object)
    Dim items As Outlook.Items
    Dim item As Object
    Dim mail As Outlook.MailItem
    Dim dateFrom As Date
    Dim i As Integer
    Dim subFolder As Outlook.MAPIFolder

    dateFrom = DateAdd("d", -DAYS_BACK, Date)

    Set items = folder.Items

    For i = 1 To items.Count
        If emailCount >= MAX_EMAILS Then Exit For

        On Error Resume Next
        Set item = items.Item(i)
        On Error GoTo 0

        If Not item Is Nothing Then
            If TypeOf item Is Outlook.MailItem Then
                Set mail = item

                ' Datum prüfen
                If mail.ReceivedTime >= dateFrom Then
                    ' Betreff prüfen
                    If InStr(1, mail.Subject, SUBJECT_FILTER, vbTextCompare) > 0 Then
                        emailCount = emailCount + 1

                        ' Daten speichern
                        emails.Add "e" & emailCount & "_entryID", mail.EntryID
                        emails.Add "e" & emailCount & "_convID", mail.ConversationID
                        emails.Add "e" & emailCount & "_subject", CleanStr(mail.Subject)
                        emails.Add "e" & emailCount & "_sender", CleanStr(GetSenderEmail(mail))
                        emails.Add "e" & emailCount & "_time", Format(mail.ReceivedTime, "dd.mm.yyyy hh:nn:ss")
                        emails.Add "e" & emailCount & "_body", CleanStr(GetBodyText(mail))
                        emails.Add "e" & emailCount & "_folder", folder.Name
                    End If
                End If
            End If
        End If

        Set item = Nothing
        Set mail = Nothing
    Next i

    ' Unterordner durchsuchen
    On Error Resume Next
    For Each subFolder In folder.Folders
        CollectEmailsFromFolder subFolder, emails
    Next subFolder
    On Error GoTo 0
End Sub

Private Function GetSenderEmail(mail As Outlook.MailItem) As String
    Dim senderEmail As String
    Dim exchUser As Outlook.ExchangeUser

    senderEmail = ""

    On Error Resume Next

    ' Methode 1: Bei SMTP direkt verwenden
    If mail.SenderEmailType <> "EX" Then
        senderEmail = mail.SenderEmailAddress
    End If

    ' Methode 2: Exchange User auflösen
    If Len(senderEmail) = 0 Then
        If Not mail.Sender Is Nothing Then
            Set exchUser = mail.Sender.GetExchangeUser()
            If Not exchUser Is Nothing Then
                senderEmail = exchUser.PrimarySmtpAddress
            End If
        End If
    End If

    ' Methode 3: PropertyAccessor
    If Len(senderEmail) = 0 Then
        senderEmail = mail.PropertyAccessor.GetProperty("http://schemas.microsoft.com/mapi/proptag/0x5D01001F")
    End If

    ' Methode 4: Fallback auf SenderEmailAddress
    If Len(senderEmail) = 0 Then
        senderEmail = mail.SenderEmailAddress
    End If

    On Error GoTo 0

    GetSenderEmail = senderEmail
End Function

Private Function GetBodyText(mail As Outlook.MailItem) As String
    Dim bodyText As String

    bodyText = ""

    On Error Resume Next

    ' Plain text Body versuchen
    bodyText = mail.Body

    ' Falls leer, HTML Body als Fallback
    If Len(bodyText) = 0 And mail.BodyFormat = olFormatHTML Then
        bodyText = StripHTML(mail.HTMLBody)
    End If

    On Error GoTo 0

    ' Länge begrenzen
    If Len(bodyText) > MAX_BODY_LENGTH Then
        bodyText = Left(bodyText, MAX_BODY_LENGTH) & " [...]"
    End If

    GetBodyText = bodyText
End Function

Private Function StripHTML(html As String) As String
    Dim result As String
    Dim inTag As Boolean
    Dim ch As String
    Dim j As Long

    result = ""
    inTag = False

    For j = 1 To Len(html)
        ch = Mid(html, j, 1)
        If ch = "<" Then
            inTag = True
        ElseIf ch = ">" Then
            inTag = False
        ElseIf Not inTag Then
            result = result & ch
        End If
    Next j

    ' Mehrfache Leerzeichen reduzieren
    result = Replace(result, vbCrLf & vbCrLf, vbCrLf)
    result = Replace(result, "  ", " ")

    StripHTML = Trim(result)
End Function

Private Function CleanStr(s As String) As String
    Dim r As String
    r = s

    ' Backslash ZUERST
    r = Replace(r, "\", "\\")
    ' Anführungszeichen
    r = Replace(r, """", "\""")
    ' Zeilenumbrüche
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

Private Function BuildJSON(emails As Object, mailboxName As String) As String
    Dim json As String
    Dim i As Integer

    json = "{" & vbCrLf
    json = json & "  ""exportDate"": """ & Format(Now, "dd.mm.yyyy hh:nn:ss") & """," & vbCrLf
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
    Next i

    json = json & vbCrLf & "  ]" & vbCrLf
    json = json & "}" & vbCrLf

    BuildJSON = json
End Function

Private Function WriteFile(filePath As String, content As String) As Boolean
    Dim f As Object

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
