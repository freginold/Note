' Options:
' 1. Time Stamp: Hide/Show
' 2. Background Color: 1-gray/2-yellow/3-white/4-pink/5-green/6-blue
' 3. Note Font: georgia/calibri/sans/serif/otherLocalFont
' 4. Note Font Size: small/medium/large


' ----- set up variables, constants, & objects ------

Set fs = CreateObject("Scripting.FileSystemObject")
allData = ""
const NotesDir = ".\notes\"
Const Default1 = "Hide"
Const Default2 = "1"
Const Default3 = "serif"
Const Default4 = "medium"
Const OptionsFile = "options.txt"
Const EOFConst = "<<<EOF>>>"
Const NotesFolderErrorMsg = "<br /><p style='vertical-align: middle; text-align: center;'>File System Access Error... can not create/access notes subfolder.</p>"
Const OptionsFileErrorMsg = "<br /><p style='vertical-align: middle; text-align: center;'>File System Access Error... can not create/access configuration file.</p>"
Opt1 = Default1
Opt2 = Default2
Opt3 = Default3
Opt4 = Default4
NewFileWithPath = ""
TempFileName = ""
TempFile = ""
Dim rfile




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
  ' see if options.txt file exists; if not, create it
  CheckForOptionsFile = true
  if fs.FileExists(OptionsFile) then exit function
  OptionsCorrupted
  ' verify options file was created; if not, may have access/permission issues
  if fs.FileExists(OptionsFile) then exit function
  document.getElementById("noteBody").innerHTML = OptionsFileErrorMsg
  document.getElementById("optionsDiv").innerHTML = OptionsFileErrorMsg
  CheckForOptionsFile = false
  ' disable options button?
  document.getElementById("optionsButton").disabled = true
End Function

Function HideStamp(line)
  ' hide time stamp, if configured
  ' get line after >
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
  line = ""
  ' pull each line out of the note file, return it
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


Sub CreateNewFile(FileName)
  ' for now, just do "false" so won't overwrite, but later check to see if exists:
  '    open file for reading, if not EOF then it already has text/exists
  NewFileWithPath = NotesDir + FileName + ".txt"
  fs.CreateTextFile(NewFileWithPath)
  GetFileList
End Sub


Sub GetOptions(dummyVar)
  ' open options file, load options into memory
  if fs.FileExists(OptionsFile) then 
    set rofile = fs.opentextfile(OptionsFile, 1)
    ' get option 1 = time stamp
    ' check for rofile.AtEndOfStream -- if premature, use default values
    if rofile.AtEndOfStream then rofile.close : OptionsCorrupted : Exit Sub
    line = LCase(rofile.Readline)
    if (line <> "show") and (line <> "hide") then line = Default1
    Opt1 = line
    ' get option 2 = background color
    if rofile.AtEndOfStream then rofile.close : OptionsCorrupted : Exit Sub
    line = rofile.Readline
    Opt2 = line
    GetOpt2Text(Opt2)
    ' get option 3 - font
    if rofile.AtEndOfStream then rofile.close : OptionsCorrupted : Exit Sub
    line = rofile.Readline
    Opt3 = line
    ' get option 4 - font size
    if rofile.AtEndOfStream then rofile.close : OptionsCorrupted : Exit Sub
    line = rofile.Readline
    Opt4 = line
    ' close file
    rofile.close
  End If
  if NOT fs.FileExists(OptionsFile) then OptionsCorrupted
End Sub


Function GetOption(ThisOption)
  'return options one at a time to be applied by JS
  if ThisOption = "1" then GetOption = Opt1
  if ThisOption = "2" then GetOption = GetOpt2Text(Opt2)
  if ThisOption = "3" then GetOption = Opt3
  if ThisOption = "4" then GetOption = Opt4
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


Sub OptionsCorrupted
  ' if options file not present or not formatted correctly, pass in the default values & recreate it
  Opt1 = Default1
  Opt2 = Default2
  Opt3 = Default3
  Opt4 = Default4
  WriteOptions Opt1, Opt2, Opt3, Opt4
End Sub


Sub WriteOptions(Opt1, Opt2, Opt3, Opt4)
  ' write options to disk
  ' write to temp file, save temp file, del options.txt, ren temp file to options.txt
  ' open temp file for output
  ' write to temp
  ' close temp
  ' del options
  ' ren temp
  TempFileName = fs.GetTempName
  TempFile = TempFileName + ".txt"
  set tfile = fs.OpenTextFile(TempFile, 2, True)
  tfile.WriteLine(Opt1)
  tfile.WriteLine(Opt2)
  tfile.WriteLine(Opt3)
  tfile.WriteLine(Opt4)
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



' ---------- execution --------------

window.resizeTo screen.availWidth/1.75, screen.availHeight/1.65
window.moveTo 200,200
CheckForNotesFolder()
CheckForOptionsFile()
GetFileList()

