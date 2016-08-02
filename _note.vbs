' note app, HTA version VBScript source


' want it to:
' show all notes at top
' you can pick one, it shows current notes, w/ input box to add note, add it w/ date & time
' able to delete specific notes


' ** del all msgbox commands


' be sure to close text files as soon as done with them!


' ----- set up variables, constants, & objects ------

Set fs = CreateObject("Scripting.FileSystemObject")
allData = ""
const NotesDir = ".\notes\"
Const Default1 = "Hide"
Const Default2 = "Light Gray"
Const OptionsFile = "options.txt"
Const OptionsComment = "1- time stamp: Hide/Show, 2- bg color 1:LiGra/2:LiY/3:Wh/4:Pi/5:LiGre/6:LiBlu. Def: 1-Hide, 2-1."
Const EOFConst = "<<<EOF>>>"
Opt1 = Default1
Opt2 = Default2
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

Function LoadFile(FileName)
  ' *** obsolete, to be deleted ***
  'load notes from a text file to display
  FileName = NotesDir + FileName + ".txt"
  allData = ""
  set rfile=fs.opentextfile(FileName, 1)
  do until rfile.AtEndOfStream
    line=rfile.Readline
    if LCase(Opt1) = "hide" then line = HideStamp(line)
    if line <> "" then allData=allData+" "+line+VbCrLf
  loop
  rfile.close
  LoadFile = allData
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


Function LoadOptions(dummyVar)
  ' *** this function is obsolete, to be deleted ***
  ' open option file, return formatted text string (for now, till enable changes)
  ' once can enable changes, just use GetOptions to get current settings, show/change w/ JS
  AllData = ""
  set rofile=fs.opentextfile(OptionsFile, 1)
  ' check for rofile.AtEndOfStream -- if premature, "options file corrupted" (offer to rebuild?)
  if rofile.AtEndOfStream then 
    OptionsCorrupted
    Exit Function
  End If
  line = rofile.Readline
  ' ignore first line of options file
  if rofile.AtEndOfStream then 
    OptionsCorrupted
    Exit Function
  End If
  line = rofile.Readline
  AllData = "Time Stamp:   " + line + VbCrLf
  if rofile.AtEndOfStream then 
    OptionsCorrupted
    Exit Function
  End If
  line = rofile.Readline
  AllData = AllData + "Background Color:   " + line + VbCrLf
  rofile.close
  LoadOptions = AllData
End Function


Sub GetOptions(dummyVar)
  ' open options file, load options into memory
  if fs.FileExists(OptionsFile) then 
    set rofile = fs.opentextfile(OptionsFile, 1)
    ' check for rofile.AtEndOfStream -- if premature, use default values
    if rofile.AtEndOfStream then rofile.close : OptionsCorrupted : Exit Sub
    line = rofile.Readline
    ' ignore first line of options file
    if rofile.AtEndOfStream then rofile.close : OptionsCorrupted : Exit Sub
    line = LCase(rofile.Readline)
    if (line <> "show") and (line <> "hide") then line = Default1
    Opt1 = line
    if rofile.AtEndOfStream then rofile.close : OptionsCorrupted : Exit Sub
    line = rofile.Readline
    Opt2 = line
    GetOpt2Text(Opt2)
    rofile.close
  End If
  if NOT fs.FileExists(OptionsFile) then OptionsCorrupted
End Sub


Function GetOption(ThisOption)
  'return options one at a time to be applied by JS
  if ThisOption = "1" then GetOption = Opt1
  if ThisOption = "2" then GetOption = GetOpt2Text(Opt2)
End Function


Function GetOpt2Text(Opt2)
  Select Case Opt2
    Case "1" Opt2Text = "light gray"
    Case "2" Opt2Text = "light yellow"
    Case "3" Opt2Text = "white"
    Case "4" Opt2Text = "pink"
    Case "5" Opt2Text = "light green"
    Case "6" Opt2Text = "light blue"
    Case Else Opt2Text = Default2 : Opt2 = 1
  End Select
  GetOpt2Text = Opt2Text
End Function


Sub OptionsCorrupted
  ' if options file not present or not formatted correctly, pass in the default values & recreate it
  Opt1 = Default1
  Opt2 = Default2
  WriteOptions Opt1, Opt2
End Sub


Sub WriteOptions(Opt1, Opt2)
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
  tfile.WriteLine(OptionsComment)
  tfile.WriteLine(Opt1)
  tfile.WriteLine(Opt2)
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

GetFileList()
