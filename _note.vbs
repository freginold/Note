' Settings (saved in config file):
' 1. Time Stamp: hide/show
' 2. Background Color: gray/yellow/white/pink/green/blue/orange/charcoalgray/forestgreen/navyblue/brown/black
' 3. Note Font: p1-serif/p2-sans serif/uf0/uf1/uf2/uf3
' 4. Note Font Size: small/medium/large
' 5. User Font 1
' 6. User Font 2
' 7. User Font 3
' 8. User Font 4
' 9. Window Postion: mm-centered/cc-custom
' 10. Custom x coord
' 11. Custom y coord
' 12. Status Bar: hide/show
' 13. Backup Location: current folder or user choice
' 14. Window width
' 15. Window height
' 16. Pinned note: <note name>/%none%


' ----- set up variables, constants, & objects ------

Option Explicit
Dim fs, NewFileWithPath, rfile, afile, tfile, rofile, line, BackupLoc
Dim Opt1, Opt2, Opt3, Opt4, Opt5, Opt6, Opt7, Opt8, Opt9, Opt10, Opt11, Opt12, Opt13, Opt14, Opt15, Opt16
Dim NoteWidth, NoteHeight, MidXPos, MidYPos
Dim EditedString

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
Const Default12 = "show"
Const Default13 = ".\"
' no Default14/Default15; use NoteWidth & NoteHeight
Const Default16 = "%none%"
Const OptionsFile = "config.txt"
Const EOFConst = "<<<EOF>>>"
Const BackupPrefix = "backup_notes_"
Const BadCharString = "':*?;<>|{}[]%$/\""()"
Const NotesFolderErrorMsg = "<br /><p style='vertical-align: middle; text-align: center;'>File System Access Error... can not create/access notes subfolder.</p>"
Const OptionsFileErrorMsg1 = "File System Access Error..."
Const OptionsFileErrorMsg2 = "Can not create/access configuration file."
Const OptionsFileErrorMsg3 = "Default configuration will be used."
Const InvalidFNMsg1 = "Invalid File Name."
Const InvalidFNMsg2 = "The following characters are prohibited:"

NewFileWithPath = ""
NoteWidth = round(screen.availWidth/1.47)
NoteHeight = round(screen.availHeight/1.31)
EditedString = ""

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
Opt12 = Default12
Opt13 = Default13
Opt14 = NoteWidth      ' <-- get the correct values later, after determine default h&w
Opt15 = NoteHeight
Opt16 = Default16


' ------ subroutines & functions -----------

Sub GetFileList
  Dim file
  NoteList.innerHTML = ""
  for each file in fs.GetFolder(notesDir).Files
    if fs.GetExtensionName(file) = "txt" then
	  if NOT fs.GetBaseName(file) = Opt16 then
	      NoteList.innerHTML = NoteList.innerHTML + "<button class='noteButton' id='" + fs.GetBaseName(file) + "' onclick='showNotes(this.id)'>" + fs.GetBaseName(file) + "</button>"
	  end if
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
  msgbox OptionsFileErrorMsg1 + VbCrLf + OptionsFileErrorMsg2 + VbCrLf + VbCrLf + OptionsFileErrorMsg3, 48
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
  if fs.FileExists(FileName) then
  	set rfile=fs.opentextfile(FileName, 1)
  else
  	ShowFNFMsg(FileName)
  end if
End Sub

Sub CloseRFile(FileName)
  FileName = NotesDir + FileName + ".txt"
  rfile.close
End Sub

Sub ShowFNFMsg(MissingFile)
  msgbox MissingFile & " was not found.", 48
End Sub

Function GetLine(dummyVar)
  ' pull each line out of the note file, format it & return it
  line = ""
  Select Case rfile.AtEndOfStream
    Case false
      line = rfile.Readline
      if LCase(Opt1) = "hide" then line = HideStamp(line)
      ' preserve spacing but don't prevent line breaking
      line = Replace(line, "    ", "  ")
      line = Replace(line, "   ", " ")
      line = Replace(line, "  ", " ")
    Case Else
      line = EOFConst
  End Select
  GetLine = line
End Function

Sub AddNote(TempText)
  ' append TempText to note file
  if TempText = "" then showStatus("Nothing to add") : focusInput : exit sub
  Dim Filename
  FileName = NotesDir + currentNote + ".txt"
  Set afile=fs.openTextFile(FileName, 8, true)
  afile.WriteLine(GetTimeStampedLine(TempText))
  afile.close
  showNotes(currentNote)
  showStatus(AbbrevText(TempText) & " added to bottom")
End Sub

Function GetTimeStampedLine(LineText)
  ' add time stamp to line
  GetTimeStampedLine = VbLf & date & ", " & time & " >       " & LineText
End Function

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
    if fs.FileExists(NewFileWithPath) then msgbox "A file with that name already exists.", 64: exit function
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
    ' get option 1 - time stamp
    ' check for rofile.AtEndOfStream -- if premature, use default values for missing values
    if rofile.AtEndOfStream then rofile.close : OptionsCorrupted(0) : Exit Sub
    Opt1 = LCase(rofile.Readline)
    if (Opt1 <> "show") and (Opt1 <> "hide") then Opt1 = Default1
    ' get option 2 - background color
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
    ' get option 12 - status bar
    if rofile.AtEndOfStream then rofile.close : OptionsCorrupted(11) : Exit Sub
    Opt12 = Lcase(rofile.Readline)
    ' get option 13 - backup location
    if rofile.AtEndOfStream then rofile.close : OptionsCorrupted(12) : Exit Sub
    Opt13 = rofile.Readline
    if Opt13 = "" then Opt13 = Default13
    ' get option 14 - window width
    if rofile.AtEndOfStream then rofile.close : OptionsCorrupted(13) : Exit Sub
    Opt14 = int(rofile.Readline)
	if Opt14 = "" then Opt14 = NoteWidth
    ' get option 15 - window height
    if rofile.AtEndOfStream then rofile.close : OptionsCorrupted(14) : Exit Sub
    Opt15 = int(rofile.Readline)
    if Opt15 = "" then Opt15 = NoteHeight
    ' get option 16 - pinned note
    if rofile.AtEndOfStream then rofile.close : OptionsCorrupted(15) : Exit Sub
    Opt16 = Lcase(rofile.Readline)
    if Opt16 = "" then Opt16 = Default16
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
  if ThisOption = "12" then GetOption = Opt12
  if ThisOption = "13" then GetOption = Opt13
  if ThisOption = "14" then GetOption = Opt14
  if ThisOption = "15" then GetOption = Opt15
  if ThisOption = "16" then GetOption = Opt16
End Function

Sub OptionsCorrupted(numCorr)
  ' if options file not present or not formatted correctly, pass in any missing values & recreate it
  ' numCorr = number of options loaded succesfully
  if numCorr < 16 then Opt16 = Default16
  if numCorr < 15 then Opt15 = NoteHeight
  if numCorr < 14 then Opt14 = NoteWidth 
  if numCorr < 13 then Opt13 = Default13
  if numCorr < 12 then Opt12 = Default12
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
  tfile.WriteLine(Opt12)
  tfile.WriteLine(Opt13)
  tfile.WriteLine(Opt14)
  tfile.WriteLine(Opt15)
  tfile.WriteLine(Opt16)
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
  showStatus("Items #" & cstr(int(NumToBeSwapped)+1) & " and #" & cstr(int(NumToSwap)+1) & " swapped")
End Sub

Sub MoveDown(ThisButton)
  ' move an item down one line, save, then re-display
  Dim NumToSwap, NumToBeSwapped
  ThisButton.disabled = true
  NumToSwap = GetLineNum(ThisButton)
  NumToBeSwapped = NumToSwap + 1
  WriteModifiedFile NumToSwap, NumToBeSwapped
  showStatus("Items #" & cstr(int(NumToSwap)+1) & " and #" & cstr(int(NumToBeSwapped)+1) & " swapped")
End Sub

Sub WriteModifiedFile(Swap1, Swap2)
  ' after a move, write the new file w/ reordered items
  ' also used to save edited note file; if Swap1 and Swap2 are same #
  ' also used to insert new note or restore deleted note, if Swap2 = -1
  Dim TempFile, count, Swap1Txt, Swap2Txt, Undeleted
  Swap1 = int(Swap1)
  Swap2 = int(Swap2)
  Undeleted = false
  OpenRFile(currentNote)
  TempFile = MakeTempFile
  count = 0
  do until rfile.AtEndOfStream
    line=rfile.Readline
    if (line <> "") and (HideStamp(line) <> "") then
      Select Case count
        Case Swap1
          if Swap1 = Swap2 then
            tfile.WriteLine(GetTimeStampedLine(EditedString))
          else
            if Swap2 = -1 then
              tfile.WriteLine(GetTimeStampedLine(EditedString))
              tfile.WriteLine(line)
              Undeleted = true
            else
              Swap1Txt = line
            end if
          end if
        Case Swap2
          if Swap1 <> Swap2 then
            Swap2Txt = line
            tfile.WriteLine(Swap2Txt)
            tfile.WriteLine(swap1Txt)
          end if
        Case Else
          tfile.WriteLine(line)
      End Select
      count = count + 1
    end if
  loop
  if (Swap2 = -1) and (not Undeleted) then tfile.WriteLine(EditedString) : Undeleted = true
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
  Dim LineNum, TempFile, count, currentNoteFile, TempEl
  LineNum = GetLineNum(ThisLine)
  TempEl = "text" & LineNum
  delItem.text = document.getElementById(TempEl).innerText
  delItem.num = LineNum
  delItem.note = currentNote
  delItem.scroll = noteBody.scrollTop
  undeleteButton.disabled = false
  OpenRFile(currentNote)
  TempFile = MakeTempFile
  count = 0
  do until rfile.AtEndOfStream
    line=rfile.Readline
    if count <> LineNum then tfile.WriteLine(line)
    if (line <> "") and (HideStamp(line) <> "") then count = count + 1
  loop
  tfile.close
  CloseRFile(currentNote)
  DeleteAFile(currentNote)
  fs.MoveFile TempFile, NotesDir + currentNote + ".txt"
  showNotes(CurrentNote)
  showStatus("Item #" & cstr(int(LineNum)+1) & ", " & AbbrevText(delItem.text) & " has been deleted")
End Sub

Sub DeleteThisNote
  ' delete the current note, when Delete button is clicked and confirmed
  DeleteAFile(currentNote)
  if delItem.note = currentNote then undeleteButton.disabled = true
  showStatus(AbbrevText(currentNote) & " has been deleted")
  onStart
End Sub

Sub DeleteAFile(thisFile)
  ' note file deletion subroutine
  Dim CurrentFile
  CurrentFile = NotesDir + thisFile + ".txt"
  if fs.FileExists(CurrentFile) then
    fs.DeleteFile(CurrentFile)
  Else
    msgbox "File Error: Operation could not be performed", 48
  End If  
End Sub

Sub RenameThisNote()
  Dim NewName, OldName, RenamedPinnedNote
  RenamedPinnedNote = ""
  document.selection.empty()
  if editing = true then canceledEdit()
  NewName = InputBox("New name for this note:", "Note", currentNote, screen.availWidth/.45, screen.availWidth/.45)
  if NewName = "" then showStatus("No text entered") : exit sub
  NewName = checkForLeadingSpaces(NewName)
  NewName = checkForTrailingSpaces(NewName)
  if NewName = "" then showStatus("No text entered") : exit sub
  if NewName = currentNote then showStatus("New name is same as current name") : exit sub
  if IsNumeric(NewName) then checkFor1stCharNum(NewName) : exit sub
  if checkFor1stCharNum(mid(NewName,1,1)) then exit sub
  if CreateNewFile(NewName) = false then exit sub
  if Opt16 = currentNote then RenamedPinnedNote = Opt16 : unpin()		' if pinned note is being deleted, unpin it first
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
  if delItem.note = currentNote then delitem.note = NewName
  DeleteThisNote
  OldName = currentNote
  currentNote = NewName
  if RenamedPinnedNote <> "" then Opt16 = currentNote : pin(Opt16) : WriteOptions		' if pinned note is being deleted, unpin it first
  showNotes(currentNote)
  showStatus(AbbrevText(OldName) & " renamed to " & AbbrevText(NewName))
End Sub

Sub Backup
  ' backup note files to notes_backup_date&time folder, in specified folder
  ' use error handling
  ' make folder, copy config.txt & notes subfolder, check that they exist
  Dim d, t, BackupDate, BackupTime, BackupFolder, BackupNotesFolder, FileToCopy
  d = date
  t = time
  BackupDate = month(FormatDateTime(d,2)) & "-" & day(FormatDateTime(d,2)) & "-" & year(FormatDateTime(d,2))
  BackupTime = Hour(Now) & "-" & Minute(Now) & "-" & Second(Now)
  BackupFolder = BackupPrefix & BackupDate & "_" & BackupTime
  BackupFolder = Opt13 & BackupFolder & "\"
  On Error Resume Next
  fs.CreateFolder(BackupFolder)
  if ErrorCheckBackup then exit sub
  On Error Resume Next
  fs.CopyFile OptionsFile, BackupFolder
  if ErrorCheckBackup then exit sub
  BackupNotesFolder = BackupFolder & NotesDirWOBSlash
  On Error Resume Next
  fs.CreateFolder(BackupNotesFolder)
  if ErrorCheckBackup then exit sub
  On Error Resume Next
  for each FileToCopy in fs.GetFolder(notesDir).Files
    fs.CopyFile FileToCopy, (BackupFolder & notesDir)
    if ErrorCheckBackup then exit sub
  next
  msgbox "Backup Completed"
  showOptions
End Sub

Function ErrorCheck
  ' check to see if an error was generated
  ErrorCheck = false
  if err then
    msgbox InvalidFNMsg1 & VbCrLf & VbCrLf & InvalidFNMsg2 & VbCrLf & AddSpaces(BadCharString), 64
    ErrorCheck = true
  end if
  err.clear
End Function

Function ErrorCheckBackup
  ' check to see if an error was generated while performing backup
  ErrorCheckBackup = false
  if err then
    msgbox "Error backing up files." & VbCrLf & "Please reload program or try again later.", 48
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
      MidXPos = screen.availWidth/2 - Opt14/2
      MidYPos = screen.availHeight/2 - Opt15/2
      window.moveTo MidXPos, MidYPos
  End Select
End Sub

Sub SubmitEdit(NewStr)
  ' save edited note & redisplay
  if NewStr = uneditedString then showNotes(currentNote) : showStatus("No changes made") : exit sub
  Dim Temp1, Temp2
  Temp1 = Mid(itemToEdit,5)
  Temp2 = Temp1
  EditedString = NewStr
  WriteModifiedFile Temp1, Temp2
  showNotes(currentNote)
  showStatus("Item #" & (int(Temp1)+1) & " edited")
End Sub

Sub Undelete
  ' subroutine to restore last deleted note item (not saved on exit)
  ' need to save item text, currentNote, line #
  ' on restore, add item to line where it was or at bottom, then show that note
  EditedString = delItem.text
  if EditedString = "" then EditedString = "---"	' if undeleting an <hr> line
  currentNote = delItem.note
  WriteModifiedFile int(delItem.num), -1
  undeleteButton.disabled = true
  showNotes(currentNote)
  noteBody.scrollTop = delItem.scroll
  highlight(delItem.num)
  showStatus("Restored item #" & (int(delItem.num)+1) & ", " & AbbrevText(delItem.text) & ", to " &_
    AbbrevText(delItem.note))
  delItem.text = ""
  delItem.num = ""
  delItem.note = ""
End Sub

Function AbbrevText(AbbrStr)
  ' abbreviate note text for status bar, add quotes and apply non-italic class
  if len(AbbrStr) > 30 then AbbrStr = mid(AbbrStr, 1, 27) & "..."
  AbbrevText = "<span class='nonItalic'>'" & remHTML(AbbrStr) & "'</span>"
End Function

Sub ChangeBackup
  ' change backup location
  dim sh, bFolder
  set sh = CreateObject("shell.application")
  set bFolder = sh.BrowseForFolder(0, "Choose New Backup Location:", 0)
  if (not bFolder is nothing) then
    Opt13 = bFolder.Self.Path & "\"
    WriteOptions
  end if
  set bFolder = nothing
  set sh = nothing
  dispBackupDiv
End Sub

Function ShowDefaultBackup
  ' get path of default backup location for display
  ShowDefaultBackup = fs.GetFolder(Opt13) & "\"
End Function

Sub DelOptionsFile
  ' delete config file to reset options back to default values
  if fs.FileExists(OptionsFile) then
    fs.DeleteFile(OptionsFile)
  Else
    msgbox "File Error: Operation could not be performed", 48
  End If
End Sub


' ---------- execution --------------

CheckForNotesFolder()
GetFileList()
