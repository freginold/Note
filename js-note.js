// JavaScript file for note app

// ------- declare variables ----------

var noteBody = document.getElementById('noteBody');
var inputDiv = document.getElementById('inputDiv');
var inputBox = document.getElementById('inputBox');
var newNoteDiv = document.getElementById('newNoteDiv');
var noteTitle = document.getElementById('noteTitle');
var optionsDiv = document.getElementById('optionsDiv');
var newNoteInputBox = document.getElementById('newNoteInputBox');
var noteText, currentNote, dummyVar, showTimeStamp, bgColor;


// ------- declare functions ----------

function applyOptions() {
  // apply options on load
  GetOptions(dummyVar)
  showTimeStamp = GetOption(1).toLowerCase();
  bgColor = GetOption(2).toLowerCase();
  if (bgColor.slice(0,6) == "light ") {
    bgColor = "light" + bgColor.slice(6);
  }
  // maybe later make a function to remove spaces
  document.body.style.backgroundColor=bgColor;
}

function showNotes(thisVar) {
  noteText='';
  currentNote = thisVar;
  thisVar=".\\notes\\"+thisVar+".txt";
  noteText = LoadFile(thisVar)
  noteTitle.innerText = currentNote;
  noteBody.innerText = noteText;
  newNoteDiv.style.display = 'none';
  optionsDiv.style.display='none';
  inputDiv.style.display='block';
  inputBox.value='';
  inputBox.focus();
}

function hideNotes() {
  noteBody.innerText = '';
  noteTitle.innerText = '';
  inputDiv.style.display = 'none';
  optionsDiv.style.display='none';
}

function onSubmitted(tempVar, thisNote) {
  event.returnValue = false;
  AddNote(tempVar, thisNote)
  // -- vbscript: AddNote inputBox.value, currentNote
}

function addX() {
  // add X next to each note so it can be deleted; will be called from VBScript
}

function showOptions() {
  // show options, save changes
  noteTitle.innerText = 'Options:';
  inputDiv.style.display = 'none';
  newNoteDiv.style.display = 'none';
  showTimeStamp = GetOption(1).toLowerCase();
  bgColor = GetOption(2).toLowerCase();
  optionsDiv.style.display='block';


//  var optTxt = LoadOptions(dummyVar)
//  noteBody.innerText = optTxt;
}

function showNewNoteBox() {
  noteTitle.innerText = 'Name for new note:';
  noteBody.innerText = '';
  inputDiv.style.display = 'none';
  optionsDiv.style.display='none';
  newNoteDiv.style.display = 'block';
  newNoteInputBox.value = '';
  newNoteInputBox.focus();
}

function createNewNote(newNoteName) {
  // create a new note file
  event.returnValue = false;
  newNoteDiv.style.display = 'none';
  optionsDiv.style.display='none';
  CreateNewFile(newNoteName)
  showNotes(newNoteName);
}



