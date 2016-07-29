// JavaScript file for note app

// ------- declare variables ----------

var noteBody = document.getElementById('noteBody');
var inputDiv = document.getElementById('inputDiv');
var inputBox = document.getElementById('inputBox');
var newNoteDiv = document.getElementById('newNoteDiv');
var noteTitle = document.getElementById('noteTitle');
var optionsDiv = document.getElementById('optionsDiv');
var newNoteInputBox = document.getElementById('newNoteInputBox');
var inputs = [];
var items = [];
var xElBeg = "<div class='x' onclick='delItem(this)' id='X";
var xElEnd = "'>X</div>";
var noteText, currentNote, dummyVar, showTimeStamp, bgColor, bgColorNum;


// ------- declare functions ----------

function applyOptions() {
  // apply options on load & on change
  GetOptions(dummyVar)
  showTimeStamp = GetOption(1).toLowerCase();
  bgColor = GetOption(2).toLowerCase();
  if (bgColor.slice(0,6) == "light ") {
    bgColor = "light" + bgColor.slice(6);
  }
  // maybe later add in function to remove spaces
  document.body.style.backgroundColor=bgColor;
}

function saveOptions() {
  // save options to disk on change
  // embed in a timeout; while saving, disable buttons & make them .2 opaque
  if (document.getElementsByName('timeStamp')[1].checked) { showTimeStamp='Show'; }
  else { showTimeStamp = 'Hide'; }
  if (document.getElementsByName('bg')[0].checked) { bgColorNum=1; }
  else if (document.getElementsByName('bg')[1].checked) { bgColorNum=2; }
  else if (document.getElementsByName('bg')[2].checked) { bgColorNum=3; }
  else if (document.getElementsByName('bg')[3].checked) { bgColorNum=4; }
  else if (document.getElementsByName('bg')[4].checked) { bgColorNum=5; }
  else if (document.getElementsByName('bg')[5].checked) { bgColorNum=6; }
  WriteOptions(showTimeStamp, bgColorNum)
  applyOptions();
}

function clearAll() {
  // clear all text/fields
  GetFileList()
  newNoteDiv.style.display = 'none';
  optionsDiv.style.display='none';
  inputDiv.style.display = 'none';
  noteBody.innerText = '';
  noteTitle.innerText = '';
  newNoteInputBox.value = '';
  inputBox.value='';
  items[0] = 'clear';
  for (var i in items) {
    items[i] = '';
  }
}

function showNotes(cNote) {
  clearAll();
  currentNote = cNote;
  window[currentNote].className='noteButton activeNote';
  noteText='';
  noteText = getLines(currentNote);
//  noteText = LoadFile(currentNote)
  noteTitle.innerText = currentNote;
  noteBody.innerHTML = noteText;
  inputDiv.style.display='block';
  inputBox.focus();
}

function getLines(thisNote) {
  // loop through file, get each line from note and add X to it, return HTML as noteText
  var notesHTML='<div>';
  var currentLine;
  var noteNum = 0;
  var FileEnd = false;
  OpenRFile(thisNote)
  while (!FileEnd) {
    currentLine = GetLine(dummyVar)
    if (currentLine == EOFConst) { FileEnd = true; }
    else if (currentLine != "") {
      notesHTML = notesHTML + "<li class='item' id='item" + noteNum + "' onmouseover='showX(this);' onmouseout='hideX(this);'>" + currentLine +"&nbsp;&nbsp;"+ xElBeg + noteNum + xElEnd + "</li>";
      noteNum++;
    }
  }
  CloseRFile(currentNote);
  notesHTML=notesHTML + "</div>";
  return notesHTML;
}

function onSubmitted(tempVar, thisNote) {
  event.returnValue = false;
  AddNote(tempVar, thisNote)
  // -- vbscript: AddNote inputBox.value, currentNote
}

function showX(self) {
  // show X to right of each item, on mouseover
  thisX = "X"+self.id.slice(4);
  document.getElementById(thisX).style.display='inline';
  
}

function hideX(self) {
  // hide X on mouseout
  thisX = "X"+self.id.slice(4);
  document.getElementById(thisX).style.display='none';
}

function delItem(thisItem) {
  // delete the current item, save the note file, and reopen it

}

function showOptions() {
  // show options, save changes
  clearAll();
  noteTitle.innerText = 'Options:';
  showTimeStamp = GetOption(1).toLowerCase();
  bgColor = GetOption(2).toLowerCase();
  optionsDiv.style.display='block';
  if (showTimeStamp == 'show') { document.getElementsByName('timeStamp')[1].checked=true; }
  else { document.getElementsByName('timeStamp')[0].checked=true; }
  switch (bgColor) {
    case "light gray":
      document.getElementsByName('bg')[0].checked=true;
      break;
    case "light yellow":
      document.getElementsByName('bg')[1].checked=true;
      break;
    case "white":
      document.getElementsByName('bg')[2].checked=true;
      break;
    case "pink":
      document.getElementsByName('bg')[3].checked=true;
      break;
    case "light green":
      document.getElementsByName('bg')[4].checked=true;
      break;
    case "light blue":
      document.getElementsByName('bg')[5].checked=true;
      break;
  }
}

function showNewNoteBox() {
  clearAll();
  noteTitle.innerText = 'Name for new note:';
  newNoteDiv.style.display = 'block';
  newNoteInputBox.focus();
}

function createNewNote(newNoteName) {
  // create a new note file
  event.returnValue = false;
  CreateNewFile(newNoteName)
  showNotes(newNoteName);
}


// ----------- declare event handlers ----------

// option button handlers

inputs = document.getElementsByTagName('input');

for (var i=0; i<inputs.length; i++) {
  if (inputs[i].className == "optionInput") {
    inputs[i].attachEvent('onclick', saveOptions);
  }
}

// item hover handlers - in function, after items are created



// X click handlers




// --------- execution -----------------

applyOptions();

