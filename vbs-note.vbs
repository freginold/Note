' note app, HTA version VBScript source


' want it to:
' show all notes at top
' you can pick one, it shows current notes, w/ input box to add note, add it w/ date & time
' able to delete specific notes?


' be sure to close text files as soon as done with them!


' ----- set up variables, constants, & objects ------

Set fs = CreateObject("Scripting.FileSystemObject")
allData = ""
const NotesDir = ".\notes\"
' fileName=notesDir + fileName + ".txt"
Const Default1 = "Show"
Const Default2 = "Light Gray"
Opt1 = Default1
Opt2 = Default2
NewFileWithPath = ""





' ------ subroutines & functions -----------

Sub GetFileList
  NoteList.innerHtml = ""
  for each file in fs.GetFolder(notesDir).Files
'    fs.GetBaseName(file)
    NoteList.innerHtml = NoteList.innerHTML + "<button class='noteButton' id='" + fs.GetBaseName(file) + "' onclick='showNotes(this.id)'>" + fs.GetBaseName(file) + "</button>"
  next
End Sub  


Function LoadFile(FileName)
  'load notes from a text file to display
  allData = ""
  set rfile=fs.opentextfile(FileName, 1)
  do until rfile.AtEndOfStream
    line=rfile.Readline
    if LCase(Opt1) = "hide" then
      ' get line after >
      segments = Split(line, ">")
      i = 0
      line = ""
      for each x in segments
        i = i + 1
        if i > 1 then line = line + x
      next
    end if
    if line <> "" then allData=allData+" "+line+VbCrLf
  loop
  rfile.close
  LoadFile = allData
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
  ' open option file, return formatted text string (for now, till enable changes)
  ' once can enable changes, just use GetOptions to get current settings, show/change w/ JS
  FileName = "options.txt"
  AllData = ""
  set rofile=fs.opentextfile(FileName, 1)
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
  FileName = "options.txt"
  set rofile = fs.opentextfile(FileName, 1)
  ' check for rofile.AtEndOfStream -- if premature, use default values
  if rofile.AtEndOfStream then Exit Sub
  line = rofile.Readline
  ' ignore first line of options file
  if rofile.AtEndOfStream then Exit Sub
  line = LCase(rofile.Readline)
  if (line <> "show") and (line <> "hide") then line = Default1
  Opt1 = line
  if rofile.AtEndOfStream then Exit Sub
  line = rofile.Readline
  Select Case line
    Case "1" Opt2 = "light gray"
    Case "2" Opt2 = "light yellow"
    Case "3" Opt2 = "white"
    Case "4" Opt2 = "pink"
    Case "5" Opt2 = "light green"
    Case "6" Opt2 = "light blue"
    Case Else Opt2 = Default2
  End Select
'  if (line <> "Light Gray") and (line <> "Light Yellow") and (line <> "White") and (line <> "Pink") then line = Default2
  rofile.close
End Sub


Function GetOption(ThisOption)
  'return options one at a time to be applied by JS
  if ThisOption = "1" then GetOption = Opt1
  if ThisOption = "2" then GetOption = Opt2
End Function


Sub OptionsCorrupted
  AllData = "Options file has been corrupted."
  ' recreate options file?
End Sub


