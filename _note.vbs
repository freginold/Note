' Options:
' 1. Time Stamp: hide/show
' 2. Background Color: 1-gray/2-yellow/3-white/4-pink/5-green/6-blue
' 3. Note Font: p1-serif/p2-sans serif/uf0/uf1/uf2/uf3
' 4. Note Font Size: small/medium/large
' 5. User Font 1
' 6. User Font 2
' 7. User Font 3
' 8. User Font 4



' ----- set up variables, constants, & objects ------

Set fs = CreateObject("Scripting.FileSystemObject")
allData = ""
const NotesDir = ".\notes\"
Const Default1 = "hide"
Const Default2 = "1"
Const Default3 = "p1"
Const Default4 = "medium"
Const Default5 = ""
Const Default6 = ""
Const Default7 = ""
Const Default8 = ""
Const OptionsFile = "config.txt"
Const EOFConst = "<<<EOF>>>"
Const BackupPrefix = "backup_notes_"
Const BadCharString = "':*?;<>|{}[]%$/\""()"
Const NotesFolderErrorMsg = "<br /><p style='vertical-align: middle; text-align: center;'>File System Access Error... can not create/access notes subfolder.</p>"
Const OptionsFileErrorMsg = "<br /><p style='vertical-align: middle; text-align: center;'>File System Access Error... can not create/access configuration file.</p>"
Opt1 = Default1
Opt2 = Default2
Opt3 = Default3
Opt4 = Default4
Opt5 = Default5
Opt6 = Default6
Opt7 = Default7
Opt8 = Default8
NewFileWithPath = ""
TempFileName = ""
TempFile = ""
Dim NewFileWithPath, rfile


' ------ subroutines & functions -----------

Sub GetFileList
  NoteList.innerHtml = ""
  for each file in fs.GetFolder(notesDir).Files
    if fs.GetExtensionName(file) = "txt" then
      NoteList.innerHtml = NoteList.innerHTML + "<button class='noteButton' id='" + fs.GetBaseName(file) + "' onclick='showNotes(this.id)'>" + fs.GetBaseName(file) + "</button>"
    end if
  next
End Sub

Sub CheckForNotesFolder
  ' see if notes subfolder exists; if not, create it
  if fs.FolderExists(NotesDir) then exit sub
  fs.CreateFolder(NotesDir)
  ' verify folder was created; if not, may have access/permission issues
  if fs.FolderExists(NotesDir) then exit sub
  document.getElementById("noteBody").innerHTML = NotesFolderErrorMsg
  document.getElementById("newButton").disabled = true
End Sub

Function CheckForOptionsFile
  ' see if config.txt file exists; if not, create it
  CheckForOptionsFile = true
  if fs.FileExists(OptionsFile) then exit function
  OptionsCorrupted(0)
  ' verify options file was created; if not, may have access/permission issues
  if fs.FileExists(OptionsFile) then exit function
  document.getElementById("noteBody").innerHTML = OptionsFileErrorMsg
  document.getElementById("optionsDiv").innerHTML = OptionsFileErrorMsg
  CheckForOptionsFile = false
  document.getElementById("optionsButton").disabled = true
End Function

Function HideStamp(line)
  ' if set to hide time stamp, get line starting after 1st >
  segments = Split(line, ">")
  i = 0
  line = ""
  for each x in segments
    i = i + 1
    if i > 2 then x = ">" + x
    if i > 1 then line = line + x
  next
  HideStamp = line
End Function

Sub OpenRFile(FileName)
  FileName = NotesDir + FileName + ".txt"
  if fs.FileExists(FileName) then set rfile=fs.opentextfile(FileName, 1)
  if NOT fs.FileExists(FileName) then msgbox FileName & " not there"
End Sub

Sub CloseRFile(FileName)
  FileName = NotesDir + FileName + ".txt"
  rfile.close
End Sub

Function GetLine(dummyVar)
  ' pull each line out of the note file, return it
  line = ""
  Select Case rfile.AtEndOfStream
    Case false
      line = rfile.Readline
      if LCase(Opt1) = "hide" then line = HideStamp(line)
    Case Else
      line = EOFConst
  End Select
  GetLine = line
End Function

Sub AddNote(TempText, NoteName)
  ' append TempText to note file
  FileName = NotesDir + NoteName + ".txt"
  Set afile=fs.openTextFile(FileName, 8, true)
  afile.WriteLine(date & ", " & time & " >       " & TempText & VbCrLf)
  afile.close
  showNotes(NoteName)
End Sub

Function CreateNewFile(FileName)
  CreateNewFile = false
  NewFileWithPath = NotesDir + FileName + ".txt"
  On Error Resume Next
  c = 0
  BadChar = false
  for c = 1 to len(FileName)
    for c2 = 1 to len(BadCharString)
      if mid(FileName, c, 1) = mid(BadCharString, c2, 1) then BadChar = true
    next
  next
  if BadChar then
    err.raise 5021
  else
    if fs.FileExists(NewFileWithPath) then msgbox "A file with that name already exists.": exit function
    fs.CreateTextFile(NewFileWithPath)
  end if
  if ErrorCheck then exit function
  On Error GoTo 0
  CreateNewFile = true
  GetFileList
End Function

Sub GetOptions(dummyVar)
  ' open options file, load options into memory
  if fs.FileExists(OptionsFile) then 
    set rofile = fs.opentextfile(OptionsFile, 1)
    ' get option 1 = time stamp
    ' check for rofile.AtEndOfStream -- if premature, use default values for missing values
    if rofile.AtEndOfStream then rofile.close : OptionsCorrupted(0) : Exit Sub
    line = LCase(rofile.Readline)
    if (line <> "show") and (line <> "hide") then line = Default1
    Opt1 = line
    ' get option 2 = background color
    if rofile.AtEndOfStream then rofile.close : OptionsCorrupted(1) : Exit Sub
    line = rofile.Readline
    Opt2 = line
    GetOpt2Text(Opt2)
    ' get option 3 - font name
    if rofile.AtEndOfStream then rofile.close : OptionsCorrupted(2) : Exit Sub
    line = Lcase(rofile.Readline)
    Opt3 = line
    ' get option 4 - font size
    if rofile.AtEndOfStream then rofile.close : OptionsCorrupted(3) : Exit Sub
    line = Lcase(rofile.Readline)
    Opt4 = line
    ' get option 5 - user font 1
    if rofile.AtEndOfStream then rofile.close : OptionsCorrupted(4) : Exit Sub
    line = Lcase(rofile.Readline)
    Opt5 = line
    ' get option 6 - user font 2
    if rofile.AtEndOfStream then rofile.close : OptionsCorrupted(5) : Exit Sub
    line = Lcase(rofile.Readline)
    Opt6 = line
    ' get option 7 - user font 3
    if rofile.AtEndOfStream then rofile.close : OptionsCorrupted(6) : Exit Sub
    line = Lcase(rofile.Readline)
    Opt7 = line
    ' get option8 - user font 4
    if rofile.AtEndOfStream then rofile.close : OptionsCorrupted(7) : Exit Sub
    line = Lcase(rofile.Readline)
    Opt8 = line
    ' close file
    rofile.close
  Else
    OptionsCorrupted(0)
  End If
End Sub

Function GetOption(ThisOption)
  'return options one at a time to be applied by JS
  if ThisOption = "1" then GetOption = Opt1
  if ThisOption = "2" then GetOption = GetOpt2Text(Opt2)
  if ThisOption = "3" then GetOption = Opt3
  if ThisOption = "4" then GetOption = Opt4
  if ThisOption = "5" then GetOption = Opt5
  if ThisOption = "6" then GetOption = Opt6
  if ThisOption = "7" then GetOption = Opt7
  if ThisOption = "8" then GetOption = Opt8
End Function

Function GetOpt2Text(Opt2)
  Select Case Opt2
    Case "1" Opt2Text = "gray"
    Case "2" Opt2Text = "yellow"
    Case "3" Opt2Text = "white"
    Case "4" Opt2Text = "pink"
    Case "5" Opt2Text = "green"
    Case "6" Opt2Text = "blue"
    Case Else Opt2Text = Default2 : Opt2 = 1
  End Select
  GetOpt2Text = Opt2Text
End Function

Sub OptionsCorrupted(numCorr)
  ' if options file not present or not formatted correctly, pass in any missing values & recreate it
  ' numCorr = number of options loaded succesfully
  if numCorr < 8 then Opt8 = Default8
  if numCorr < 7 then Opt7 = Default7
  if numCorr < 6 then Opt6 = Default6
  if numCorr < 5 then Opt5 = Default5
  if numCorr < 4 then Opt4 = Default4
  if numCorr < 3 then Opt3 = Default3
  if numCorr < 2 then Opt2 = Default2
  if numCorr < 1 then Opt1 = Default1
  WriteOptions
End Sub

Sub WriteOptions
  ' write options to disk
  TempFileName = fs.GetTempName
  TempFile = TempFileName + ".txt"
  set tfile = fs.OpenTextFile(TempFile, 2, True)
  tfile.WriteLine(Opt1)
  tfile.WriteLine(Opt2)
  tfile.WriteLine(Opt3)
  tfile.WriteLine(Opt4)
  tfile.WriteLine(Opt5)
  tfile.WriteLine(Opt6)
  tfile.WriteLine(Opt7)
  tfile.WriteLine(Opt8)
  tfile.close
  if fs.FileExists(OptionsFile) then fs.DeleteFile(OptionsFile)
  fs.MoveFile TempFile, OptionsFile  
End Sub

Sub DelLine(ThisLine)
  segments = Split(ThisLine.id, "X")
  LineNum = CInt(segments(1))
  OpenRFile(currentNote)
  TempFileName = fs.GetTempName
  TempFile = NotesDir + TempFileName + ".txt"
  set tfile = fs.OpenTextFile(TempFile, 2, True)
  count = 0
  do until rfile.AtEndOfStream
    line=rfile.Readline
    if count <> LineNum then tfile.WriteLine(line)
    if line <> "" then count = count + 1
  loop
  tfile.close
  CloseRFile(currentNote)
  currentNoteFile = NotesDir + currentNote + ".txt"
  if fs.FileExists(CurrentNoteFile) then fs.DeleteFile(CurrentNoteFile)
  fs.MoveFile TempFile, CurrentNoteFile
  showNotes(CurrentNote)  
End Sub

Sub DeleteThisNote
  CurrentNoteFile = NotesDir + currentNote + ".txt"
  if fs.FileExists(CurrentNoteFile) then
    fs.DeleteFile(CurrentNoteFile)
  Else
    msgbox "File Error: could not delete " & currentNote
  End If
  GetFileList()
  clearAll()
End Sub

Sub RenameThisNote()
  NewName = InputBox("New name for this note:", "Note", currentNote, screen.availWidth/.45, screen.availWidth/.45)
  if NewName = "" then exit sub
  NewName = checkForLeadingSpaces(NewName)
  NewName = checkForTrailingSpaces(NewName)
  if NewName = "" then exit sub
  if NewName = currentNote then exit sub
  if CreateNewFile(NewName) = false then exit sub
  OpenRFile(currentNote)
  On Error Resume Next
  set tfile = fs.OpenTextFile(NewFileWithPath, 2, True)
  if ErrorCheck then exit sub
  On Error GoTo 0
  do until rfile.AtEndOfStream
    line=rfile.Readline
    tfile.WriteLine(line)
  loop
  CloseRFile(currentNote)
  tfile.close
  DeleteThisNote
  currentNote = NewName
  showNotes(currentNote)
End Sub

Sub Backup
  ' backup note files to notes_backup_date&time folder
  ' use error handling
  ' make folder, copy config.txt & notes subfolder, check that they exist
  d = date
  t = time
  BackupDate = month(FormatDateTime(d,2)) & "-" & day(FormatDateTime(d,2)) & "-" & year(FormatDateTime(d,2))
  BackupTime = Hour(Now) & "-" & Minute(Now) & "-" & Second(Now)
  BackupFolder = BackupPrefix & BackupDate & "_" & BackupTime
  On Error Resume Next
  fs.CreateFolder(BackupFolder)
  if ErrorCheckBackup then exit sub
  BackupFolder = ".\" & BackupFolder & "\"
  On Error Resume Next
  fs.CopyFile OptionsFile, BackupFolder
  if ErrorCheckBackup then exit sub
  BackupNotesFolder = BackupFolder & "\notes"
  On Error Resume Next
  fs.CreateFolder(BackupNotesFolder)
  if ErrorCheckBackup then exit sub
  NotesDirPath = NotesDir & "*.*"
  On Error Resume Next
  fs.CopyFile NotesDirPath, BackupNotesFolder
  if ErrorCheckBackup then exit sub
  msgbox "Backup Completed"
End Sub

Function ErrorCheck
  ' check to see if an error was generated
  ErrorCheck = false
  if err then msgbox "Invalid File Name": ErrorCheck = true
  err.clear
End Function

Function ErrorCheckBackup
  ' check to see if an error was generated while performing backup
  ErrorCheckBackup = false
  if err then
    msgbox "Error backing up files." & VbCrLf & "Please reload program or try again later."
    ErrorCheckBackup = true
  end if
  err.clear
End Function


' ---------- execution --------------

window.resizeTo screen.availWidth/1.75, screen.availHeight/1.65
window.moveTo 200,200
CheckForNotesFolder()
CheckForOptionsFile()
GetFileList()
