' ========================================
' DEBUG: Body und Sender Extraktion testen
' ========================================

Option Explicit

Const SUBJECT_FILTER = "[EXT] Demo Bestand"
Const MAILBOX_INDEX = 9

Dim objOutlook, objNamespace, fso
Dim result, mailbox

' FSO erstellen
Set fso = CreateObject("Scripting.FileSystemObject")

' Mit Outlook verbinden
On Error Resume Next
Set objOutlook = GetObject(, "Outlook.Application")
If Err.Number <> 0 Then
    Err.Clear
    Set objOutlook = CreateObject("Outlook.Application")
End If

If Err.Number <> 0 Then
    MsgBox "Fehler: Konnte nicht mit Outlook verbinden.", vbCritical, "Fehler"
    WScript.Quit
End If
On Error GoTo 0

Set objNamespace = objOutlook.GetNamespace("MAPI")

' Postfach holen
Set mailbox = objNamespace.Folders.Item(MAILBOX_INDEX)
If mailbox Is Nothing Then
    MsgBox "Postfach #" & MAILBOX_INDEX & " nicht gefunden.", vbCritical, "Fehler"
    WScript.Quit
End If

result = "=== DEBUG: Body/Sender Extraktion ===" & vbCrLf
result = result & "Postfach: " & mailbox.Name & vbCrLf & vbCrLf

' Inbox durchsuchen
Dim inbox, items, item, i, foundCount
Set inbox = mailbox.Folders("Inbox")
Set items = inbox.Items

foundCount = 0

For i = 1 To items.Count
    On Error Resume Next
    Set item = items.Item(i)

    If item.Class = 43 Then ' MailItem
        If InStr(1, item.Subject, SUBJECT_FILTER, vbTextCompare) > 0 Then
            foundCount = foundCount + 1
            result = result & "========== E-MAIL #" & foundCount & " ==========" & vbCrLf
            result = result & "Subject: " & item.Subject & vbCrLf
            result = result & "ReceivedTime: " & item.ReceivedTime & vbCrLf
            result = result & vbCrLf

            ' === BODY TESTS ===
            result = result & "--- BODY TESTS ---" & vbCrLf

            ' Test 1: .Body
            Err.Clear
            Dim testBody1
            testBody1 = item.Body
            If Err.Number <> 0 Then
                result = result & "1. item.Body: ERROR " & Err.Number & " - " & Err.Description & vbCrLf
                Err.Clear
            ElseIf IsNull(testBody1) Then
                result = result & "1. item.Body: NULL" & vbCrLf
            ElseIf Len(testBody1) = 0 Then
                result = result & "1. item.Body: LEER (Len=0)" & vbCrLf
            Else
                result = result & "1. item.Body: OK (Len=" & Len(testBody1) & ") = " & Left(testBody1, 100) & "..." & vbCrLf
            End If

            ' Test 2: .HTMLBody
            Err.Clear
            Dim testBody2
            testBody2 = item.HTMLBody
            If Err.Number <> 0 Then
                result = result & "2. item.HTMLBody: ERROR " & Err.Number & " - " & Err.Description & vbCrLf
                Err.Clear
            ElseIf IsNull(testBody2) Then
                result = result & "2. item.HTMLBody: NULL" & vbCrLf
            ElseIf Len(testBody2) = 0 Then
                result = result & "2. item.HTMLBody: LEER (Len=0)" & vbCrLf
            Else
                result = result & "2. item.HTMLBody: OK (Len=" & Len(testBody2) & ")" & vbCrLf
            End If

            ' Test 3: .RTFBody
            Err.Clear
            Dim testBody3
            testBody3 = item.RTFBody
            If Err.Number <> 0 Then
                result = result & "3. item.RTFBody: ERROR " & Err.Number & " - " & Err.Description & vbCrLf
                Err.Clear
            ElseIf IsNull(testBody3) Then
                result = result & "3. item.RTFBody: NULL" & vbCrLf
            Else
                result = result & "3. item.RTFBody: OK (hat Daten)" & vbCrLf
            End If

            ' Test 4: BodyFormat
            Err.Clear
            Dim bodyFormat
            bodyFormat = item.BodyFormat
            If Err.Number <> 0 Then
                result = result & "4. item.BodyFormat: ERROR" & vbCrLf
                Err.Clear
            Else
                result = result & "4. item.BodyFormat: " & bodyFormat & " (1=Text, 2=HTML, 3=RTF)" & vbCrLf
            End If

            ' Test 5: PropertyAccessor PR_BODY
            Err.Clear
            Dim testBody5
            testBody5 = item.PropertyAccessor.GetProperty("http://schemas.microsoft.com/mapi/proptag/0x1000001F")
            If Err.Number <> 0 Then
                result = result & "5. PR_BODY (0x1000): ERROR " & Err.Number & vbCrLf
                Err.Clear
            ElseIf Len(testBody5) = 0 Then
                result = result & "5. PR_BODY (0x1000): LEER" & vbCrLf
            Else
                result = result & "5. PR_BODY (0x1000): OK (Len=" & Len(testBody5) & ")" & vbCrLf
            End If

            result = result & vbCrLf

            ' === SENDER TESTS ===
            result = result & "--- SENDER TESTS ---" & vbCrLf

            ' Test 1: SenderEmailAddress
            Err.Clear
            Dim testSender1
            testSender1 = item.SenderEmailAddress
            If Err.Number <> 0 Then
                result = result & "1. SenderEmailAddress: ERROR " & Err.Number & vbCrLf
                Err.Clear
            ElseIf Len(testSender1) = 0 Then
                result = result & "1. SenderEmailAddress: LEER" & vbCrLf
            Else
                result = result & "1. SenderEmailAddress: " & testSender1 & vbCrLf
            End If

            ' Test 2: SenderEmailType
            Err.Clear
            Dim testSender2
            testSender2 = item.SenderEmailType
            If Err.Number <> 0 Then
                result = result & "2. SenderEmailType: ERROR" & vbCrLf
                Err.Clear
            Else
                result = result & "2. SenderEmailType: " & testSender2 & vbCrLf
            End If

            ' Test 3: SenderName
            Err.Clear
            Dim testSender3
            testSender3 = item.SenderName
            If Err.Number <> 0 Then
                result = result & "3. SenderName: ERROR" & vbCrLf
                Err.Clear
            ElseIf Len(testSender3) = 0 Then
                result = result & "3. SenderName: LEER" & vbCrLf
            Else
                result = result & "3. SenderName: " & testSender3 & vbCrLf
            End If

            ' Test 4: Sender.GetExchangeUser
            Err.Clear
            Dim exchUser, testSender4
            testSender4 = ""
            If Not item.Sender Is Nothing Then
                Set exchUser = item.Sender.GetExchangeUser()
                If Not exchUser Is Nothing Then
                    testSender4 = exchUser.PrimarySmtpAddress
                End If
            End If
            If Err.Number <> 0 Then
                result = result & "4. ExchangeUser.SMTP: ERROR " & Err.Number & vbCrLf
                Err.Clear
            ElseIf Len(testSender4) = 0 Then
                result = result & "4. ExchangeUser.SMTP: LEER/NULL" & vbCrLf
            Else
                result = result & "4. ExchangeUser.SMTP: " & testSender4 & vbCrLf
            End If

            ' Test 5: PropertyAccessor PR_SENDER_SMTP_ADDRESS
            Err.Clear
            Dim testSender5
            testSender5 = item.PropertyAccessor.GetProperty("http://schemas.microsoft.com/mapi/proptag/0x5D01001F")
            If Err.Number <> 0 Then
                result = result & "5. PR_SENDER_SMTP: ERROR " & Err.Number & vbCrLf
                Err.Clear
            ElseIf Len(testSender5) = 0 Then
                result = result & "5. PR_SENDER_SMTP: LEER" & vbCrLf
            Else
                result = result & "5. PR_SENDER_SMTP: " & testSender5 & vbCrLf
            End If

            ' Test 6: PropertyAccessor PR_SENT_REPRESENTING_EMAIL_ADDRESS
            Err.Clear
            Dim testSender6
            testSender6 = item.PropertyAccessor.GetProperty("http://schemas.microsoft.com/mapi/proptag/0x0065001F")
            If Err.Number <> 0 Then
                result = result & "6. PR_SENT_REPR_EMAIL: ERROR " & Err.Number & vbCrLf
                Err.Clear
            ElseIf Len(testSender6) = 0 Then
                result = result & "6. PR_SENT_REPR_EMAIL: LEER" & vbCrLf
            Else
                result = result & "6. PR_SENT_REPR_EMAIL: " & testSender6 & vbCrLf
            End If

            ' Test 7: ReplyRecipients
            Err.Clear
            Dim testSender7
            testSender7 = ""
            If item.ReplyRecipients.Count > 0 Then
                testSender7 = item.ReplyRecipients.Item(1).Address
            End If
            If Err.Number <> 0 Then
                result = result & "7. ReplyRecipients: ERROR" & vbCrLf
                Err.Clear
            ElseIf Len(testSender7) = 0 Then
                result = result & "7. ReplyRecipients: LEER/KEINE" & vbCrLf
            Else
                result = result & "7. ReplyRecipients: " & testSender7 & vbCrLf
            End If

            result = result & vbCrLf

            If foundCount >= 3 Then Exit For
        End If
    End If

    Set item = Nothing
Next

On Error GoTo 0

If foundCount = 0 Then
    result = result & "Keine E-Mails mit Betreff '" & SUBJECT_FILTER & "' gefunden!"
End If

' Ergebnis in Datei schreiben
Dim shell, outputPath, f
Set shell = CreateObject("WScript.Shell")
outputPath = shell.ExpandEnvironmentStrings("%USERPROFILE%") & "\Downloads\outlook-debug-result.txt"

Set f = fso.CreateTextFile(outputPath, True, True)
f.Write result
f.Close

MsgBox "Debug abgeschlossen!" & vbCrLf & vbCrLf & "Ergebnis gespeichert in:" & vbCrLf & outputPath, vbInformation, "Debug"

' Auch in MsgBox anzeigen (gekürzt)
If Len(result) > 1500 Then
    MsgBox Left(result, 1500) & vbCrLf & "...[GEKÜRZT - siehe Datei]", vbInformation, "Debug Ergebnis"
Else
    MsgBox result, vbInformation, "Debug Ergebnis"
End If
