' ========================================
' DEBUG: Outlook Ordner anzeigen
' ========================================

Option Explicit

Dim objOutlook, objNamespace
Dim result, folderList, i

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

' Alle Postfächer auflisten
folderList = "VERFUEGBARE POSTFAECHER:" & vbCrLf & vbCrLf

For i = 1 To objNamespace.Folders.Count
    Dim mailbox, subFolders, j
    Set mailbox = objNamespace.Folders.Item(i)
    folderList = folderList & i & ". " & mailbox.Name & vbCrLf

    ' Unterordner auflisten
    On Error Resume Next
    For j = 1 To mailbox.Folders.Count
        Dim subFolder
        Set subFolder = mailbox.Folders.Item(j)
        folderList = folderList & "   - " & subFolder.Name & vbCrLf
    Next
    On Error GoTo 0

    folderList = folderList & vbCrLf
Next

' Auch Default-Ordner anzeigen
folderList = folderList & vbCrLf & "DEFAULT ORDNER:" & vbCrLf
On Error Resume Next

Dim defaultInbox, defaultSent
Set defaultInbox = objNamespace.GetDefaultFolder(6) ' olFolderInbox
If Err.Number = 0 Then
    folderList = folderList & "Default Inbox: " & defaultInbox.Name & " (in " & defaultInbox.Parent.Name & ")" & vbCrLf
Else
    folderList = folderList & "Default Inbox: NICHT GEFUNDEN" & vbCrLf
    Err.Clear
End If

Set defaultSent = objNamespace.GetDefaultFolder(5) ' olFolderSentMail
If Err.Number = 0 Then
    folderList = folderList & "Default Sent: " & defaultSent.Name & " (in " & defaultSent.Parent.Name & ")" & vbCrLf
Else
    folderList = folderList & "Default Sent: NICHT GEFUNDEN" & vbCrLf
    Err.Clear
End If

On Error GoTo 0

MsgBox folderList, vbInformation, "Outlook Ordner Debug"
