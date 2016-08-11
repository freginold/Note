
// ------- declare variables ----------

var noteBody = document.getElementById('noteBody');
var inputDiv = document.getElementById('inputDiv');
var inputBox = document.getElementById('inputBox');
var newNoteDiv = document.getElementById('newNoteDiv');
var noteTitle = document.getElementById('noteTitle');
var optionsDiv = document.getElementById('optionsDiv');
var newNoteInputBox = document.getElementById('newNoteInputBox');
var localFontCheckBox = document.getElementById('localFontCheckBox');
var localFontForm = document.getElementById('localFontForm');
var localFontBox = document.getElementById('localFontBox');
var localFontShow = document.getElementById('localFontShow');
var localFontShowP = document.getElementById('localFontShowP');
var localFontSetButton = document.getElementById('localFontSetButton');
var aboutDiv = document.getElementById('aboutDiv');
var inputs = [];
var items = [];
var xElBeg = "<div class='x' onclick='DelLine(this)' id='X";
var renButtonHTML = "<button class='upperRightButton' onclick='RenameThisNote()'>Rename</button>";
var delButtonHTML = "<button class='upperRightButton' onclick='deleteNote();'>Delete</button>";
var xElEnd = "'>X</div>";
var noteFont = 'serif';
var localFont = '';
var selectedFlag = false;
var currentVer = 'Note v2.2.1\nPublic Domain';
var noteText, currentNote, dummyVar, showTimeStamp, bgColor, bgColorNum, textSize;


// ------- declare functions ----------

function applyOptions() {
  // apply options on load & on change
  if (!!CheckForOptionsFile()) { GetOptions(dummyVar) }
  else { return; }
  showTimeStamp = GetOption(1).toLowerCase();
  var bgColorText = GetOption(2).toLowerCase();
  switch (bgColorText) {
    case "yellow":
      bgColor = "#f0f0b3";
      break;
    case "white":
      bgColor = "fefefe";
      break;
    case "pink":
      bgColor = "#ff90aa";
      break;
    case "green":
      bgColor = "#bfe9bf";
      break;
    case "blue":
      bgColor = "#a9d6df";
      break;
    default:
      bgColor = "lightgray";
      break;
}
  document.body.style.backgroundColor=bgColor;
  noteFont = GetOption(3).toLowerCase();
  if (noteFont.slice(-2)=='#l') { localFont=noteFont.slice(0,-2); }
  textSize = GetOption(4).toLowerCase();
}

function saveOptions() {
  // save options to disk on change
  // option 1 - time stamp
  if (document.getElementsByName('timeStamp')[1].checked) { showTimeStamp='Show'; }
  else { showTimeStamp = 'Hide'; }
  // option 2 - background color
  if (document.getElementsByName('bg')[0].checked) { bgColorNum=1; }
  else if (document.getElementsByName('bg')[1].checked) { bgColorNum=2; }
  else if (document.getElementsByName('bg')[2].checked) { bgColorNum=3; }
  else if (document.getElementsByName('bg')[3].checked) { bgColorNum=4; }
  else if (document.getElementsByName('bg')[4].checked) { bgColorNum=5; }
  else if (document.getElementsByName('bg')[5].checked) { bgColorNum=6; }
  // option 3 - font
  if (document.getElementsByName('font')[0].checked) { noteFont='georgia'; }
  else if (document.getElementsByName('font')[1].checked) { noteFont='tahoma'; }
  else if (document.getElementsByName('font')[2].checked) { noteFont='sans'; }
  else if (document.getElementsByName('font')[3].checked) { noteFont='serif'; }
  else if (document.getElementsByName('font')[4].checked) { noteFont=localFont + '#l'; }
  // option 4 - font size
  if (document.getElementsByName('textSize')[0].checked) { textSize='small'; }
  else if (document.getElementsByName('textSize')[1].checked) { textSize='medium'; }
  else if (document.getElementsByName('textSize')[2].checked) { textSize='large'; }
  WriteOptions(showTimeStamp, bgColorNum, noteFont, textSize)
  applyOptions();
  showOptions();
}

function clearAll() {
  // clear all text/fields
  GetFileList()
  newNoteDiv.style.display = 'none';
  optionsDiv.style.display='none';
  inputDiv.style.display = 'none';
  aboutDiv.style.display = 'none';
  noteBody.style.display='block';
  noteBody.innerText = '';
  noteTitle.innerText = '';
  newNoteInputBox.value = '';
  inputBox.value='';
  items[0] = 'clear';
  for (var i in items) {
    items[i] = '';
  }
  localFontBox.value=localFont;
}

function showNotes(cNote) {
  clearAll();
  currentNote = cNote;
  window[currentNote].className='noteButton activeNote';
  noteText='';
  noteText = getLines(currentNote);
  noteTitle.innerHTML = "<div id='delBox'>" + renButtonHTML + delButtonHTML + "</div>" + currentNote;
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
  var fontClass = noteFont;
  var localFontHTML = '';
  if (noteFont.slice(-2)=='#l') {
    fontClass = '';
    localFontHTML = " style='font-family: &#34;" + localFont + "&#34;, serif;'";
  }
  var currentClasses = 'item ' + fontClass + ' ' + textSize + 'Font';
  OpenRFile(thisNote)
  while (!FileEnd) {
    currentLine = GetLine(dummyVar)
    if (currentLine == EOFConst) { FileEnd = true; }
    else if (currentLine != "") {
      // check input string for < or >, repl w/ &gt; or &lt;
      currentLine = currentLine.replace(/</g, "&lt;");
      currentLine = currentLine.replace(/>/g, "&gt;");
      notesHTML = notesHTML + "<li class='" + currentClasses + "' id='item" + noteNum + "' onmouseover='showX(this);' onmouseout='hideX(this);'" + localFontHTML + ">" + currentLine +"&nbsp;&nbsp;"+ xElBeg + noteNum + xElEnd + "</li>";
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

function showOptions() {
  // show options, save changes
  clearAll();
  noteBody.style.display='none';
  noteTitle.innerText = 'Options:';
  showTimeStamp = GetOption(1).toLowerCase();
  var bgColorText = GetOption(2).toLowerCase();
  optionsDiv.style.display='block';
  if (showTimeStamp == 'show') { document.getElementsByName('timeStamp')[1].checked=true; }
  else { document.getElementsByName('timeStamp')[0].checked=true; }
  switch (bgColorText) {
    case "gray":
      document.getElementsByName('bg')[0].checked=true;
      break;
    case "yellow":
      document.getElementsByName('bg')[1].checked=true;
      break;
    case "white":
      document.getElementsByName('bg')[2].checked=true;
      break;
    case "pink":
      document.getElementsByName('bg')[3].checked=true;
      break;
    case "green":
      document.getElementsByName('bg')[4].checked=true;
      break;
    case "blue":
      document.getElementsByName('bg')[5].checked=true;
      break;
  }
  // ---- use this method for other options too ----
  var fonts = document.getElementsByName('font');
  var noFontYet = true;
  for (i = 0; i < fonts.length; i++) {
    if (fonts[i].value == noteFont) { fonts[i].checked=true; noFontYet = false; break; }
    }
  if (!!noFontYet) { document.getElementsByName('font')[4].checked=true; }
    if (localFont=='') {
      localFontShow.style.display='none';
      localFontDiv.style.display='inline';
    }
    else {
      localFontDiv.style.display='none';
      localFontShow.style.display='inline';
      if (localFont.length>=14) { localFontShowP.innerText=localFont.slice(0,11)+"..."; }
      else { localFontShowP.innerText=localFont; }
      localFontShowP.style.fontFamily="'"+localFont+"', serif";
    }
  var sizes = document.getElementsByName('textSize');
  // ---- use this method for other options too ----
  for (i = 0; i < sizes.length; i++) {
    if (sizes[i].value == textSize) { sizes[i].checked=true; }
  }
}

function showNewNoteBox() {
  clearAll();
  noteBody.style.display='none';
  noteTitle.innerText = 'Name for new note:';
  newNoteDiv.style.display = 'block';
  newNoteInputBox.focus();
}

function createNewNote(newNoteName) {
  // create a new note file
  event.returnValue = false;
  newNoteName = checkForLeadingSpaces(newNoteName);
  newNoteName = checkForTrailingSpaces(newNoteName);
  if (newNoteName == '') { clearAll(); return; }
  CreateNewFile(newNoteName)
  showNotes(newNoteName);
}

function getLocalFont() {
  localFontShow.style.display='none';
  localFontDiv.style.display='inline';
  localFontCheckBox.onclick='setLocalFont();';
  localFontBox.value=localFont;
  localFontBox.select();
  selectedFlag = true;
  checkLocalFontInput();
  
}

function setLocalFont() {
  event.returnValue = false;
  localFontBox.value = localFontBox.value.replace(/</g, "");
  localFontBox.value = localFontBox.value.replace(/>/g, "");
  localFontBox.value = localFontBox.value.replace(/'/g, "");
  localFontBox.value = localFontBox.value.replace(/"/g, "");
  localFontBox.value = localFontBox.value.replace(/!/g, "");
  localFontBox.value = localFontBox.value.replace(/\\/g, "");
  localFontBox.value = localFontBox.value.replace(/\//g, "");
  localFontBox.value = localFontBox.value.replace(/%/g, "");
  localFontBox.value = checkForLeadingSpaces(localFontBox.value);
  localFontBox.value = checkForTrailingSpaces(localFontBox.value);
  if (localFontBox.value != '') {
    localFont=localFontBox.value;
    document.getElementsByName('font')[4].checked=true;
    saveOptions();
  }
}

function checkForLeadingSpaces(str) {
  while (str.slice(0,1)==" ") {
    // remove any spaces from before text
    if (str.length > 1) { str=str.slice(1); }
    else { str = ''; break; }
  }
  return str;
}

function checkForTrailingSpaces(str) {
  while (str.slice(-1)==" ") {
    // remove any spaces from after text
    if (str.length > 1) { str=str.slice(0,-1); }
    else { str = ''; break; }
  }
  return str;
}

function checkLocal() {
  if (localFont == '') { getLocalFont(); }
  else { saveOptions(); }
}

function checkLocalFontInput() {
  // check to see there is any value in local font text box; if not, Set button remains disabled
  if (!selectedFlag) { localFontBox.value = checkForLeadingSpaces(localFontBox.value); }
  selectedFlag = false;
  if (localFontBox.value != '') { localFontSetButton.disabled = false; }
  else { localFontSetButton.disabled = true; }
}

function deleteNote() {
  // confirm, then call a sub in VBScript to delete currentNote
  var conf='';  
  if (confirm("Are you sure you want to delete\n" + currentNote + "?", conf)) { DeleteThisNote() }
  else { return; }
}

function displayAbout() {
  // display license info/help file
  clearAll();
  noteBody.style.display='none';
  noteTitle.innerText = "About Note";
  aboutDiv.style.display = 'block';
  document.getElementById('versionInfo').innerText = currentVer;
}


// ----------- declare event handlers ----------

// option button handlers

inputs = document.getElementsByTagName('input');

for (var i=0; i<inputs.length; i++) {
  if (inputs[i].value=='local') {
    inputs[i].attachEvent('onclick', checkLocal);
  }
  else if (inputs[i].className == "optionInput") {
    inputs[i].attachEvent('onclick', saveOptions);
  }
}

localFontBox.attachEvent('onkeyup', checkLocalFontInput);


// --------- execution -----------------

clearAll();
applyOptions();
