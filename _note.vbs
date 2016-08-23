' Settings (saved in config file):
' 1. Time Stamp: hide/show
' 2. Background Color: gray/yellow/white/pink/green/blue/charcoal/black
' 3. Note Font: p1-serif/p2-sans serif/uf0/uf1/uf2/uf3
' 4. Note Font Size: small/medium/large
' 5. User Font 1
' 6. User Font 2
' 7. User Font 3
' 8. User Font 4
' 9. Screen Postion: mm-centered/cc-custom
' 10. Custom x coord
' 11. Custom y coord


' ----- set up variables, constants, & objects ------

'Option Explicit
Dim fs, NewFileWithPath, rfile, afile, tfile, rofile, line
Dim Opt1, Opt2, Opt3, Opt4, Opt5, Opt6, Opt7, Opt8, Opt9, Opt10, Opt11
Dim NoteWidth, NoteHeight, LeftXPos, RightXPos, MidXPos, TopYPos, MidYPos, BottomYPos

Set fs = CreateObject("Scripting.FileSystemObject")
const NotesDir = ".\notes\"
Const NotesDirWOBSlash = "\notes"
Const Default1 = "hide"
Const Default2 = "gray"
Const Default3 = "p1"
Const Default4 = "medium"
Const Default5 = ""
Const Default6 = ""
Const Default7 = ""
Const Default8 = ""
Const Default9 = "mm"
Const Default10 = "0"
Const Default11 = "0"
Const OptionsFile = "config.txt"
Const EOFConst = "<<<EOF>>>"
Const BackupPrefix = "backup_notes_"
Const BadCharString = "':*?;<>|{}[]%$/\""()"
Const NotesFolderErrorMsg = "<br /><p style='vertical-align: middle; text-align: center;'>File System Access Error... can not create/access notes subfolder.</p>"
Const OptionsFileErrorMsg = "<br /><p style='vertical-align: middle; text-align: center;'>File System Access Error... can not create/access configuration file.</p>"
Const InvalidFNMsg1 = "Invalid File Name."
Const InvalidFNMsg2 = "The following characters are prohibited:"

Opt1 = Default1
Opt2 = Default2
Opt3 = Default3
Opt4 = Default4
Opt5 = Default5
Opt6 = Default6
Opt7 = Default7
Opt8 = Default8
Opt9 = Default9
Opt10 = Default10
Opt11 = Default11
NewFileWithPath = ""
NoteWidth = screen.availWidth/1.75
NoteHeight = screen.availHeight/1.65
LeftXPos = 25
RightXPos = screen.availWidth - 25 - NoteWidth
MidXPos = screen.availWidth/2 - NoteWidth/2
TopYPos = 25
MidYPos = screen.availHeight/2 - NoteHeight/2
BottomYPos = screen.availHeight - 25 - NoteHeight


' ------ subroutines & functions -----------

Sub GetFileList
  Dim file
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
  Dim segments, x, i, tempLine
  line = Replace(line, ">       ", ">", 1, 1)
  segments = Split(line, ">")
  i = 0
  tempLine = ""
  for each x in segments
    i = i + 1
    if i > 2 then x = ">" + x
    if i > 1 then tempLine = tempLine + x
  next
  if i = 1 then tempLine = line
  HideStamp = tempLine
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
      ' preserve spacing but don't prevent line breaking
      line = Replace(line, "    ", "&emsp;&ensp;")
      line = Replace(line, "   ", "&emsp;")
      line = Replace(line, "  ", "&ensp;")
    Case Else
      line = EOFConst
  End Select
  GetLine = line
End Function

Sub AddNote(TempText, NoteName)
  ' append TempText to note file
  Dim Filename
  FileName = NotesDir + NoteName + ".txt"
  Set afile=fs.openTextFile(FileName, 8, true)
  afile.WriteLine(VbLf & date & ", " & time & " >       " & TempText)
  afile.close
  showNotes(NoteName)
End Sub

Function CreateNewFile(FileName)
  Dim c, c2, BadChar
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
    Opt1 = LCase(rofile.Readline)
    if (Opt1 <> "show") and (Opt1 <> "hide") then Opt1 = Default1
    ' get option 2 = background color
    if rofile.AtEndOfStream then rofile.close : OptionsCorrupted(1) : Exit Sub
    Opt2 = LCase(rofile.Readline)
    ' get option 3 - font name
    if rofile.AtEndOfStream then rofile.close : OptionsCorrupted(2) : Exit Sub
    Opt3 = Lcase(rofile.Readline)
    ' get option 4 - font size
    if rofile.AtEndOfStream then rofile.close : OptionsCorrupted(3) : Exit Sub
    Opt4 = Lcase(rofile.Readline)
    ' get option 5 - user font 1
    if rofile.AtEndOfStream then rofile.close : OptionsCorrupted(4) : Exit Sub
    Opt5 = Lcase(rofile.Readline)
    ' get option 6 - user font 2
    if rofile.AtEndOfStream then rofile.close : OptionsCorrupted(5) : Exit Sub
    Opt6 = Lcase(rofile.Readline)
    ' get option 7 - user font 3
    if rofile.AtEndOfStream then rofile.close : OptionsCorrupted(6) : Exit Sub
    Opt7 = Lcase(rofile.Readline)
    ' get option 8 - user font 4
    if rofile.AtEndOfStream then rofile.close : OptionsCorrupted(7) : Exit Sub
    Opt8 = Lcase(rofile.Readline)
    ' get option 9 - screen position
    if rofile.AtEndOfStream then rofile.close : OptionsCorrupted(8) : Exit Sub
    Opt9 = Lcase(rofile.Readline)
    ' get option 10 - custom x coord
    if rofile.AtEndOfStream then rofile.close : OptionsCorrupted(9) : Exit Sub
    Opt10 = rofile.Readline
    ' get option 11 - custom y coord
    if rofile.AtEndOfStream then rofile.close : OptionsCorrupted(10) : Exit Sub
    Opt11 = rofile.Readline
    ' close file
    rofile.close
  Else
    OptionsCorrupted(0)
  End If
End Sub

Function GetOption(ThisOption)
  'return options one at a time to be applied by JS
  if ThisOption = "1" then GetOption = Opt1
  if ThisOption = "2" then GetOption = Opt2
  if ThisOption = "3" then GetOption = Opt3
  if ThisOption = "4" then GetOption = Opt4
  if ThisOption = "5" then GetOption = Opt5
  if ThisOption = "6" then GetOption = Opt6
  if ThisOption = "7" then GetOption = Opt7
  if ThisOption = "8" then GetOption = Opt8
  if ThisOption = "9" then GetOption = Opt9
  if ThisOption = "10" then GetOption = Opt10
  if ThisOption = "11" then GetOption = Opt11
End Function

Sub OptionsCorrupted(numCorr)
  ' if options file not present or not formatted correctly, pass in any missing values & recreate it
  ' numCorr = number of options loaded succesfully
  if numCorr < 11 then Opt11 = Default11
  if numCorr < 10 then Opt10 = Default10
  if numCorr < 9 then Opt9 = Default9
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
  Dim TempFileName, TempFile
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
  tfile.WriteLine(Opt9)
  tfile.WriteLine(Opt10)
  tfile.WriteLine(Opt11)
  tfile.close
  if fs.FileExists(OptionsFile) then fs.DeleteFile(OptionsFile)
  fs.MoveFile TempFile, OptionsFile  
End Sub

Sub MoveUp(ThisButton)
  ' move an item up one line, save, then re-display
  Dim NumToSwap, NumToBeSwapped
  ThisButton.disabled = true
  NumToSwap = GetLineNum(ThisButton)
  NumToBeSwapped = NumToSwap - 1
  WriteModifiedFile NumToBeSwapped, NumToSwap
End Sub

Sub MoveDown(ThisButton)
  ' move an item down one line, save, then re-display
  Dim NumToSwap, NumToBeSwapped
  ThisButton.disabled = true
  NumToSwap = GetLineNum(ThisButton)
  NumToBeSwapped = NumToSwap + 1
  WriteModifiedFile NumToSwap, NumToBeSwapped
End Sub

Sub WriteModifiedFile(Swap1, Swap2)
  ' after a move, write the new file w/ reordered items
  Dim TempFile, count, Swap1Txt, Swap2Txt
  OpenRFile(currentNote)
  TempFile = MakeTempFile
  count = 0
  do until rfile.AtEndOfStream
    line=rfile.Readline
    if line <> "" then
      Select Case count
        Case Swap1
          Swap1Txt = line
        Case Swap2
          Swap2Txt = line
          tfile.WriteLine(Swap2Txt)
          tfile.WriteLine(swap1Txt)
        Case Else
          tfile.WriteLine(line)
      End Select
      count = count + 1
    end if
  loop
  tfile.close
  CloseRFile(currentNote)
  DeleteAFile(currentNote)
  fs.MoveFile TempFile, NotesDir + currentNote + ".txt"
  showNotes(CurrentNote)  
End Sub

Function MakeTempFile
  Dim TempFileName
  TempFileName = fs.GetTempName
  TempFileName = NotesDir + TempFileName + ".txt"
  set tfile = fs.OpenTextFile(TempFileName, 2, True)
  MakeTempFile = TempFileName
End Function

Sub DelLine(ThisLine)
  Dim LineNum, TempFile, count, currentNoteFile
  LineNum = GetLineNum(ThisLine)
  OpenRFile(currentNote)
  TempFile = MakeTempFile
  count = 0
  do until rfile.AtEndOfStream
    line=rfile.Readline
    if count <> LineNum then tfile.WriteLine(line)
    if line <> "" then count = count + 1
  loop
  tfile.close
  CloseRFile(currentNote)
  DeleteAFile(currentNote)
  fs.MoveFile TempFile, NotesDir + currentNote + ".txt"
  showNotes(CurrentNote)  
End Sub

Sub DeleteThisNote
  ' delete the current note, when Delete button is clicked and confirmed
  DeleteAFile(currentNote)
  GetFileList()
  clearAll()
End Sub

Sub DeleteAFile(thisFile)
  ' note file deletion subroutine
  Dim CurrentFile
  CurrentFile = NotesDir + thisFile + ".txt"
  if fs.FileExists(CurrentFile) then
    fs.DeleteFile(CurrentFile)
  Else
    msgbox "File Error: Operation could not be performed"
  End If  
End Sub

Sub RenameThisNote()
  Dim NewName
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
  Dim d, t, BackupDate, BackupTime, BackupFolder, BackupNotesFolder
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
  BackupNotesFolder = BackupFolder & NotesDirWOBSlash
  On Error Resume Next
  fs.CreateFolder(BackupNotesFolder)
  if ErrorCheckBackup then exit sub
  On Error Resume Next
  for each file in fs.GetFolder(notesDir).Files
    fs.CopyFile file, (BackupFolder & notesDir)
    if ErrorCheckBackup then exit sub
  next
  msgbox "Backup Completed"
End Sub

Function ErrorCheck
  ' check to see if an error was generated
  ErrorCheck = false
  if err then
    msgbox InvalidFNMsg1 & VbCrLf & VbCrLf & InvalidFNMsg2 & VbCrLf & AddSpaces(BadCharString)
    ErrorCheck = true
  end if
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

Function AddSpaces(str)
  ' add 2 spaces in between each char & return new string
  Dim a, newStr
  newStr = ""
  for a = 1 to len(str)
    newStr = newStr + mid(str, a, 1) + "  "
  next
  AddSpaces = newStr
End Function

Function GetLineNum(TempStr)
  ' get line # from an element w/ 1 leading letter in id
  GetLineNum = int(mid(TempStr.id,2))
End Function

Sub SetPos
  ' set screen position according to options
  Select Case Opt9
    Case "cc"
      window.moveTo currentX, currentY
    Case Else
      window.moveTo MidXPos, MidYPos
  End Select
End Sub


' ---------- execution --------------

window.resizeTo NoteWidth, NoteHeight
CheckForNotesFolder()
CheckForOptionsFile()
GetFileList()
