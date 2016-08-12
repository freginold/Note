
// ------- declare variables ----------

var noteBody = document.getElementById('noteBody');
var inputDiv = document.getElementById('inputDiv');
var inputBox = document.getElementById('inputBox');
var newNoteDiv = document.getElementById('newNoteDiv');
var noteTitle = document.getElementById('noteTitle');
var optionsDiv = document.getElementById('optionsDiv');
var newNoteInputBox = document.getElementById('newNoteInputBox');
var localFontDiv = [
  document.getElementById('localFontDiv0'),
  document.getElementById('localFontDiv1'),
  document.getElementById('localFontDiv2'),
  document.getElementById('localFontDiv3')
];
var localFontCheckBox = [
  document.getElementById('localFontCheckBox0'),
  document.getElementById('localFontCheckBox1'),
  document.getElementById('localFontCheckBox2'),
  document.getElementById('localFontCheckBox3')
];
var localFontForm = [
  document.getElementById('localFontForm0'),
  document.getElementById('localFontForm1'),
  document.getElementById('localFontForm2'),
  document.getElementById('localFontForm3')
];
var localFontBox = [
  document.getElementById('localFontBox0'),
  document.getElementById('localFontBox1'),
  document.getElementById('localFontBox2'),
  document.getElementById('localFontBox3')
];
var localFontShow = [
  document.getElementById('localFontShow0'),
  document.getElementById('localFontShow1'),
  document.getElementById('localFontShow2'),
  document.getElementById('localFontShow3')
];
var localFontShowP = [
  document.getElementById('localFontShowP0'),
  document.getElementById('localFontShowP1'),
  document.getElementById('localFontShowP2'),
  document.getElementById('localFontShowP3')
];
var localFontSetButton = [
  document.getElementById('localFontSetButton0'),
  document.getElementById('localFontSetButton1'),
  document.getElementById('localFontSetButton2'),
  document.getElementById('localFontSetButton3'),
];
var aboutDiv = document.getElementById('aboutDiv');
var inputs = [];
var items = [];
var uFont = ['', '', '', ''];
var xElBeg = "<div class='x' onclick='DelLine(this)' id='X";
var renButtonHTML = "<button class='upperRightButton' onclick='RenameThisNote()'>Rename</button>";
var delButtonHTML = "<button class='upperRightButton' onclick='deleteNote();'>Delete</button>";
var xElEnd = "'>X</div>";
var noteFont = 'serif';
var selectedFlag = [false, false, false, false];
var currentVer = 'Note v2.4\nPublic Domain';
var noteText, currentNote, dummyVar, bgColor, bgColorNum;


// ------- declare functions ----------

function applyOptions() {
  // apply options on load & on change
  if (!!CheckForOptionsFile()) { GetOptions(dummyVar) }
  else { return; }
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
  switch (Opt3.toLowerCase()) {
    case "uf0":
      noteFont = Opt5;
      break;
    case "uf1":
      noteFont = Opt6;
      break;
    case "uf2":
      noteFont = Opt7;
      break;
    case "uf3":
      noteFont = Opt8;
      break;
    case "p2":
      noteFont = 'sans-serif';
      break;
    default:
      noteFont = 'serif';
  }    
  if (noteFont == '') { noteFont = 'serif'; Opt3 = 'p1'; }
  uFont[0] = Opt5;
  uFont[1] = Opt6;
  uFont[2] = Opt7;
  uFont[3] = Opt8;
}

function saveOptions() {
  // save options to disk on change
  // option 1 - time stamp
  if (document.getElementsByName('timeStamp')[1].checked) { Opt1='show'; }
  else { Opt1 = 'hide'; }
  // option 2 - background color
  if (document.getElementsByName('bg')[0].checked) { bgColorNum=1; }
  else if (document.getElementsByName('bg')[1].checked) { bgColorNum=2; }
  else if (document.getElementsByName('bg')[2].checked) { bgColorNum=3; }
  else if (document.getElementsByName('bg')[3].checked) { bgColorNum=4; }
  else if (document.getElementsByName('bg')[4].checked) { bgColorNum=5; }
  else if (document.getElementsByName('bg')[5].checked) { bgColorNum=6; }
  Opt2 = bgColorNum;
  // option 3 - font
  Opt3 = 'p1';
  if (localFontCheckBox[0].checked) { Opt3 = 'uf0'; }
  if (localFontCheckBox[1].checked) { Opt3 = 'uf1'; }
  if (localFontCheckBox[2].checked) { Opt3 = 'uf2'; }
  if (localFontCheckBox[3].checked) { Opt3 = 'uf3'; }
  if (document.getElementById('sansRadio').checked) { Opt3 = 'p2'; }
  // option 4 - font size
  if (document.getElementsByName('textSize')[0].checked) { Opt4='small'; }
  else if (document.getElementsByName('textSize')[1].checked) { Opt4='medium'; }
  else if (document.getElementsByName('textSize')[2].checked) { Opt4='large'; }
  // option 5 - user font 0
  Opt5 = uFont[0];
  // option 6 - user font 1
  Opt6 = uFont[1];
  // option 7 - user font 2
  Opt7 = uFont[2];
  // option 8 - user font 3
  Opt8 = uFont[3];
  WriteOptions()
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
  for (i = 0; i < localFontBox.length; i++) {
    localFontBox[i].value=uFont[i];
  }
}

function showNotes(cNote) {
  clearAll();
  currentNote = cNote;
  window[currentNote].className='noteButton activeNote';
  noteText='';
  noteText = getLines(currentNote);
  var currentNoteDisplay = currentNote;
  if (currentNote == "&") { currentNoteDisplay = "&#38;"; }    // to deal w/ & as only char in title
  noteTitle.innerHTML = "<div id='delBox'>" + renButtonHTML + delButtonHTML + "</div>" + currentNoteDisplay;
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
  var localFontHTML = '';
  localFontHTML = " style='font-family: &#34;" + noteFont + "&#34;, serif;'";
  var currentClasses = 'item ' + ' ' + Opt4 + 'Font';
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
  clearAll();
  noteBody.style.display='none';
  noteTitle.innerText = 'Options:';
  var bgColorText = GetOption(2).toLowerCase();
  optionsDiv.style.display='block';
  if (Opt1 == 'show') { document.getElementsByName('timeStamp')[1].checked=true; }
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
  var fonts = document.getElementsByName('font');
  // populate user font boxes, if they've been saved
  var foundFont = false;
  for (i = 0; i < uFont.length; i++) {
    if (fonts[i].value.toLowerCase() == Opt3) { fonts[i].checked=true; foundFont = true; }
    if (uFont[i]=='') {
      localFontShow[i].style.display='none';
      localFontDiv[i].style.display='inline';
    }
    else {
      localFontDiv[i].style.display='none';
      localFontShow[i].style.display='inline';
      if (uFont[i].length>=14) { localFontShowP[i].innerText=uFont[i].slice(0,11)+"..."; }
      else { localFontShowP[i].innerText=uFont[i]; }
      localFontShowP[i].style.fontFamily="'"+uFont[i]+"', serif";
    }
  }
  if (Opt3 == 'p2') { fonts[4].checked=true; noteFont = 'sans-serif'; foundFont = true; }
  if (!foundFont) { fonts[5].checked=true; noteFont = 'serif'; }
  var sizes = document.getElementsByName('textSize');
  // ---- use this method for other options too ----
  for (i = 0; i < sizes.length; i++) {
    if (sizes[i].value == Opt4) { sizes[i].checked=true; }
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
  var fileCreated = CreateNewFile(newNoteName)
  if (!!fileCreated) { showNotes(newNoteName); }
  else { newNoteInputBox.value = ''; }
}

function getLocalFont(n) {
  localFontShow[n].style.display='none';
  localFontDiv[n].style.display='inline';
  localFontCheckBox[n].onclick='setLocalFont(' + n + ');';
  localFontBox[n].value=uFont[n];
  localFontBox[n].select();
  selectedFlag[n] = true;
  checkLocalFontInput(n);
  
}

function setLocalFont(n) {
  event.returnValue = false;
  localFontBox[n].value = localFontBox[n].value.replace(/</g, "");
  localFontBox[n].value = localFontBox[n].value.replace(/>/g, "");
  localFontBox[n].value = localFontBox[n].value.replace(/'/g, "");
  localFontBox[n].value = localFontBox[n].value.replace(/"/g, "");
  localFontBox[n].value = localFontBox[n].value.replace(/!/g, "");
  localFontBox[n].value = localFontBox[n].value.replace(/\\/g, "");
  localFontBox[n].value = localFontBox[n].value.replace(/\//g, "");
  localFontBox[n].value = localFontBox[n].value.replace(/%/g, "");
  localFontBox[n].value = checkForLeadingSpaces(localFontBox[n].value);
  localFontBox[n].value = checkForTrailingSpaces(localFontBox[n].value);
  if (localFontBox[n].value != '') {
    uFont[n]=localFontBox[n].value;
    localFontCheckBox[n].checked=true;
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

function checkLocal(n) {
  if (uFont[n] == '') { getLocalFont(n); }
  else { saveOptions(); }
}

function checkLocalFontInput(n) {
  // check to see there is any value in local font text box; if not, Set button remains disabled
  if (!selectedFlag[n]) { localFontBox[n].value = checkForLeadingSpaces(localFontBox[n].value); }
  selectedFlag[n] = false;
  if (localFontBox[n].value != '') { localFontSetButton[n].disabled = false; }
  else { localFontSetButton[n].disabled = true; }
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
  if (inputs[i].value.slice(0,2).toLowerCase() == 'uf') {
    switch (inputs[i].value.slice(2)) {
      case "0":
        inputs[i].attachEvent('onclick', function() { checkLocal(0); });
        break;
      case "1":
        inputs[i].attachEvent('onclick', function() { checkLocal(1); });
        break;
      case "2":
        inputs[i].attachEvent('onclick', function() { checkLocal(2); });
        break;
      case "3":
        inputs[i].attachEvent('onclick', function() { checkLocal(3); });
        break;
    }
  }
  else if (inputs[i].className == "optionInput") {
    inputs[i].attachEvent('onclick', saveOptions);
  }
}

for (i=0;i<localFontBox.length;i++) {
  switch (i) {
    case 0:
      localFontBox[i].attachEvent('onkeyup', function() { checkLocalFontInput(0); });
      break;
    case 1:
      localFontBox[i].attachEvent('onkeyup', function() { checkLocalFontInput(1); });
      break;
    case 2:
      localFontBox[i].attachEvent('onkeyup', function() { checkLocalFontInput(2); });
      break;
    case 3:
      localFontBox[i].attachEvent('onkeyup', function() { checkLocalFontInput(3); });
      break;
  }
}


// --------- execution -----------------

clearAll();
applyOptions();
