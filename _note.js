
// ------- declare variables ----------

var noteBody = document.getElementById('noteBody'),
  inputDiv = document.getElementById('inputDiv'),
  inputBox = document.getElementById('inputBox'),
  newNoteDiv = document.getElementById('newNoteDiv'),
  newNoteForm = document.getElementById('newNoteForm'),
  noteTitle = document.getElementById('noteTitle'),
  optionsDiv = document.getElementById('optionsDiv'),
  aboutDiv = document.getElementById('aboutDiv'),
  backupDiv = document.getElementById('backupDiv'),
  backupDispDiv = document.getElementById('backupDispDiv'),
  newNoteInputBox = document.getElementById('newNoteInputBox'),
  coords = document.getElementById('coords'),
  undeleteButton = document.getElementById('undeleteButton'),
  statusBar = document.getElementById('statusBar'),
  statusBarText = document.getElementById('statusBarText'),
  pinBox = document.getElementById('pinBox'),
  localFontDiv = [
    document.getElementById('localFontDiv0'),
    document.getElementById('localFontDiv1'),
    document.getElementById('localFontDiv2'),
    document.getElementById('localFontDiv3')
],
  localFontCheckBox = [
    document.getElementById('localFontCheckBox0'),
    document.getElementById('localFontCheckBox1'),
    document.getElementById('localFontCheckBox2'),
    document.getElementById('localFontCheckBox3')
],
  localFontForm = [
    document.getElementById('localFontForm0'),
    document.getElementById('localFontForm1'),
    document.getElementById('localFontForm2'),
    document.getElementById('localFontForm3')
],
  localFontBox = [
    document.getElementById('localFontBox0'),
    document.getElementById('localFontBox1'),
    document.getElementById('localFontBox2'),
    document.getElementById('localFontBox3')
],
  localFontShow = [
    document.getElementById('localFontShow0'),
    document.getElementById('localFontShow1'),
    document.getElementById('localFontShow2'),
    document.getElementById('localFontShow3')
],
  localFontShowP = [
    document.getElementById('localFontShowP0'),
    document.getElementById('localFontShowP1'),
    document.getElementById('localFontShowP2'),
    document.getElementById('localFontShowP3')
],
  localFontSetButton = [
    document.getElementById('localFontSetButton0'),
    document.getElementById('localFontSetButton1'),
    document.getElementById('localFontSetButton2'),
    document.getElementById('localFontSetButton3'),
],
  inputs = [],
  items = [],
  uFont = ['', '', '', ''],
  delItem = {
    text: '',
    num: '',
    note: '',
    scroll: 0 },
  xElBeg = "<button class='x smallFont moveButtons' onclick='DelLine(this)' id='X",
  xElEnd = "'>X</button>",
  renButtonHTML = "<button class='upperRightButton' onclick='RenameThisNote()'><span class='btnIcon'>&#9998;</span>Rename</button>",
  delButtonHTML = "<button class='upperRightButton' onclick='deleteNote();'><span class='btnIcon'>&#10799;</span> Delete</button>",
  pinButtonHTML = "<button class='upperLeftButton' onclick='pinBox.innerHTML = \"\"; pin();'><span class='btnIcon'>&#128204;</span> Pin</button>",
  unpinButtonHTML = "<button class='upperLeftButton' onclick='unpin();'><span class='btnIcon'>&#127811;</span>Unpin</button>",
  moveButtonsHTMLBeg = "<button class='moveButtons smallFont uBut' id='u",
  moveButtonsHTMLMid = "' onclick='MoveItem(this, true)'>&uarr;</button> <button class='moveButtons smallFont dBut' id='d",
  moveButtonsHTMLEnd = "' onclick='MoveItem(this, false)'>&darr;</button>",
  lineStartHTML = "<span class='serif'>&sdot; </span>",
  statusBarHTML = "&nbsp;",
  expandAllButtonHTML = "<button class='upperRightButton' id='expandAllButton' onclick='expandAll()'>&#9196; Expand All</button>",
  collapseAllButtonHTML = "<button class='upperRightButton' id='collapseAllButton' onclick='collapseAll();'>&#9195; Collapse All</button>",
  noteFont = 'serif',
  fgColor = 'black',		// default foreground color
  bgColor = "lightgray",	// default background color
  firstCoordCheck = true,
  selectedFlag = [false, false, false, false],
  uneditedString = '',
  license = 'Public Domain',
  timer = 0,
  lastScrollPos = 0,
  firstCall = true,
  small = 0.8,
  medium = 1,
  large = 1.3,
  aboutInterval = false,
  flip = false,
  defTextSize = 1,
  sectionsCollapsed = 0,
  sectionsTotal = 0,
  origText = [],			// array to store unformatted text strings for user editing
  fColor = [
	"black",	// black text for lightgray; default
	"black",	// black text for yellow
	"black",	// black text for white
	"black",	// black text for pink
	"black",	// black text for green
	"black",	// black text for blue
	"black",	// black text for orange
	"#ffffff",	// white text for charcoalgray
	"#ffffff",	// white text for forestgreen
	"#ffffff",	// white text for navyblue
	"#ffffff",	// white text for brown
	"#eeeeee"	// duller white text for black
	],
  bColor = [
	"lightgray",// lightgray; default
	"#f0f0b3",	// yellow
	"#fefefe",	// white
	"#ff90aa",	// pink
	"#bfe9bf",	// green
	"#a9d6df",	// blue
	"#ffcf5f",	// orange
	"#555555",	// charcoalgray
	"#228542",	// forestgreen
	"#000060",	// navyblue
	"#a88042",	// brown
	"#222222"	// black
],
currentNote, dummyVar, i, currentX, currentY, oldX, oldY, offsetX, offsetY, lastLine,
	itemToEdit, itemTotal, statusTimer, prevNote, aboutCounter, pinned, pinOrUnpinHTML;


// ------- declare functions ----------

function applyOptions() {
  // apply options on load & on change
  if (!!CheckForOptionsFile()) {
  	GetOptions(dummyVar);
	if (Opt2 < 0 || Opt2 > bColor.length) { Opt2 = Default2; }
  }
  applyTheme();		// set foreground/background colors
  switch (Opt3) {
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
  if (Opt9 == 'cc') { currentX = Opt10; currentY = Opt11; }
  if (Opt12 == 'hide') { statusBar.style.display = 'none'; }
  else { statusBar.style.display = 'inline-block'; }
  pinned = getPinned();
}

function saveOptions() {
  // save options to disk on change
  // option 2 - background color
  if (document.getElementsByName('bg')[0].checked) { Opt2 = 0 }
  else if (document.getElementsByName('bg')[1].checked) { Opt2 = 1; }
  else if (document.getElementsByName('bg')[2].checked) { Opt2 = 2; }
  else if (document.getElementsByName('bg')[3].checked) { Opt2 = 3; }
  else if (document.getElementsByName('bg')[4].checked) { Opt2 = 4; }
  else if (document.getElementsByName('bg')[5].checked) { Opt2 = 5; }
  else if (document.getElementsByName('bg')[6].checked) { Opt2 = 6; }  
  else if (document.getElementsByName('bg')[7].checked) { Opt2 = 7; }
  else if (document.getElementsByName('bg')[8].checked) { Opt2 = 8; }
  else if (document.getElementsByName('bg')[9].checked) { Opt2 = 9; }
  else if (document.getElementsByName('bg')[10].checked) { Opt2 = 10; }    
  else if (document.getElementsByName('bg')[11].checked) { Opt2 = 11; }
  // option 3 - font
  Opt3 = 'p1';
  if (localFontCheckBox[0].checked) { Opt3 = 'uf0'; }
  if (localFontCheckBox[1].checked) { Opt3 = 'uf1'; }
  if (localFontCheckBox[2].checked) { Opt3 = 'uf2'; }
  if (localFontCheckBox[3].checked) { Opt3 = 'uf3'; }
  if (document.getElementById('sansRadio').checked) { Opt3 = 'p2'; }
  // option 4 - font size
  if (document.getElementsByName('textSize')[0].checked) { Opt4 = 'small'; }
  else if (document.getElementsByName('textSize')[1].checked) { Opt4 = 'medium'; }
  else if (document.getElementsByName('textSize')[2].checked) { Opt4 = 'large'; }
  // option 5 - user font 0
  Opt5 = uFont[0];
  // option 6 - user font 1
  Opt6 = uFont[1];
  // option 7 - user font 2
  Opt7 = uFont[2];
  // option 8 - user font 3
  Opt8 = uFont[3];
  if (document.getElementsByName('screenPos')[1].checked) {
    Opt9 = 'cc';
    Opt10 = currentX - offsetX;
    Opt11 = currentY - offsetY;
  }
  else { Opt9 = 'mm'; Opt10 = 0; Opt11 = 0; }
  if (document.getElementsByName('statusOption')[0].checked) { Opt12 = 'hide'; }
  else { Opt12 = 'show'; }
  WriteOptions();
  applyOptions();
  showOptions();
}

function savePos() {
  // stripped-down save function to only save screen position
  if (document.getElementsByName('screenPos')[1].checked) { Opt9 = 'cc'; }
  else { Opt9 = 'mm'; }
  Opt10 = currentX - offsetX;
  Opt11 = currentY - offsetY;
  WriteOptions();
  if (optionsDiv.style.display != 'none') { showOptions(); }
}

function saveSize() {
  // stripped-down save function to only save screen size -- will combine this w/ savePos in the future
  WriteOptions();
  if (optionsDiv.style.display != 'none') { showOptions(); }
}

function showOptions() {
  clearAll();
  noteTitle.innerHTML = "<div class='optionsButtonBox'>" + expandAllButtonHTML + collapseAllButtonHTML + "</div>" + "Options:";
  checkCollapseExpandButtons();
  optionsDiv.style.display = 'block';
  for (i = 0; i < document.getElementsByTagName('td').length; i++) {
    if (document.getElementsByTagName('td')[i].className == 'optionsColumn') {
      document.getElementsByTagName('td')[i].style.width = (document.body.clientWidth / 3);
    }
  }
  document.getElementsByName('bg')[Opt2].checked = true;
  var fonts = document.getElementsByName('font');
  // populate user font boxes, if they've been saved
  var foundFont = false;
  for (i = 0; i < uFont.length; i++) {
    if (fonts[i].value.toLowerCase() == Opt3) { fonts[i].checked = true; foundFont = true; }
    if (uFont[i] == '') {
      localFontShow[i].style.display = 'none';
      localFontDiv[i].style.display = 'inline';
    }
    else {
      localFontDiv[i].style.display = 'none';
      localFontShow[i].style.display = 'inline';
      if (uFont[i].length >= 14) { localFontShowP[i].innerText = uFont[i].slice(0, 11) + "..."; }
      else { localFontShowP[i].innerText = uFont[i]; }
      localFontShowP[i].style.fontFamily = "'" + uFont[i] + "', serif";
    }
  }
  if (Opt3 == 'p2') { fonts[4].checked = true; noteFont = 'sans-serif'; foundFont = true; }
  if (!foundFont) { fonts[5].checked = true; noteFont = 'serif'; }
  var sizes = document.getElementsByName('textSize');
  // ---- use this method for other options too ----
  for (i = 0; i < sizes.length; i++) {
    if (sizes[i].value == Opt4) { sizes[i].checked = true; }
  }
  if (Opt9 == 'cc') { document.getElementsByName('screenPos')[1].checked = true; }
  else {
    document.getElementsByName('screenPos')[0].checked = true;
	document.getElementById('screenPosResetButton').disabled = true;
  }
  if (Opt12 == 'hide') { document.getElementsByName('statusOption')[0].checked = true; }
  else { document.getElementsByName('statusOption')[1].checked = true; }
  if (Opt14 == NoteWidth && Opt15 == NoteHeight) {
    // default width and height
	document.getElementById('screenSizeResetButton').disabled = true;
  }
  checkCoords();
}

function clearAll() {
  // clear all text/fields
  firstCall = false;
  setTimeout(function() { firstCall = true; } , 250);
  GetFileList();
  if (Opt16 != Default16) { pinBox.style.display = "none"; pinBox.firstChild.className = "noteButton"; pin(Opt16); }
  newNoteDiv.style.display = 'none';
  optionsDiv.style.display = 'none';
  inputDiv.style.display = 'none';
  aboutDiv.style.display = 'none';
  backupDiv.style.display = 'none';
  noteBody.style.display = 'none';
  noteBody.innerText = '';
  noteTitle.innerText = '';
  newNoteInputBox.value = '';
  inputBox.value = '';
  items[0] = 'clear';
  for (i in items) {
    items[i] = '';
  }
  for (i = 0; i < localFontBox.length; i++) {
    localFontBox[i].value = uFont[i];
  }
  itemTotal = 0;
  origText = [];
}

function applyTheme() {
  // set colors
  fgColor = fColor[Opt2];
  bgColor = bColor[Opt2];
  document.body.style.backgroundColor = bgColor;
  document.body.style.color = fgColor;
  document.getElementById('clock').style.color = fgColor;
}

function previewTheme(pNum) {
  // temporarily apply theme for preview
  document.body.style.backgroundColor = bColor[pNum];
  document.body.style.color = fColor[pNum];
  document.getElementById('clock').style.color = fColor[pNum];
}

function showNotes(cNote) {
  // load note file
  clearAll();
  noteBody.style.display = 'block';
  prevNote = currentNote;
  currentNote = cNote;
  editing = false;
  if (!window[currentNote]) { ShowFNFMsg(currentNote); onStart(); return; }		// if current note clicked but file not found
  window[currentNote].className = 'noteButton activeNote';
  var currentNoteDisplay = currentNote;
  if (currentNote == "&") { currentNoteDisplay = "&#38;"; }    // to deal w/ & as only char in title
  noteTitle.innerHTML = "<div id='pinButton'></div><div class='delBox'>" + renButtonHTML + delButtonHTML + "</div>" + "<span ondblclick='RenameThisNote()'>" + currentNoteDisplay + "</span>";
  showPinButton();
  getLines(currentNote);
  if (currentNote == prevNote) {
    // if reloading the same note
    noteBody.scrollTop = lastScrollPos;
  }
  else { noteBody.scrollTop = 0; }
  var firstBut = document.getElementById('u0'),
    lastBut = window['d' + (lastLine - 1)];
  // disable & darken 1st 'move up' button & last 'move down' button
  if (firstBut != null) {
    document.getElementById('u0').disabled = true;
    document.getElementById('u0').style.filter = "alpha(opacity = 25)";
    document.getElementById('u0').style.opacity = .25;
  }
  if (lastBut != null) {
    window['d' + (lastLine - 1)].disabled = true;
    window['d' + (lastLine - 1)].style.filter = "alpha(opacity = 25)";
    window['d' + (lastLine - 1)].style.opacity = .25;
  }
  inputDiv.style.display = 'block';
  inputBox.focus();
}

function getLines(thisNote) {
  // loop through file, get each line from note and add X and arrow buttons to it, wrap it in a <tr> and add it to the HTML
  noteBody.innerHTML = noteBody.innerHTML + "<div><table id='itemTable'>";
  var currentLine,
    noteNum = 0,
    FileEnd = false,
    localFontHTML = " style='font-family: &#34;" + noteFont + "&#34;, serif;'",
    currentClasses = 'item ' + Opt4 + 'Font',
    lineVar, lineStartVar, processedLine;
  lastLine = 0;
  OpenRFile(thisNote);
  while (!FileEnd) {
    currentLine = GetLine(dummyVar)
    if (currentLine == EOFConst) {
      FileEnd = true;
      lastLine = noteNum;
    }
    else if (currentLine != "") {
	  if (currentLine == "---") {
	  	lineVar = "'><hr style='display: inline; width: 85%; text-align: left;'>";		// divider
		lineStartVar = "<span>&nbsp;&nbsp;</span>";
	  }
      else {
	  	processedLine = remHTML(currentLine);
		// preserve original formatting so it's not lost on edit
		origText[noteNum] = currentLine;
	  	lineVar = "' ondblclick='goEdit(" + noteNum + ");'>" + applyFormatting(processedLine);
		lineStartVar = lineStartHTML;
	  }
	  noteBody.innerHTML = noteBody.innerHTML + "<tr class='" + currentClasses + "' id='item" + noteNum + "'" + localFontHTML + "><td>" + xElBeg + noteNum + xElEnd + "&nbsp;&nbsp;" + moveButtonsHTMLBeg + noteNum + moveButtonsHTMLMid + noteNum + moveButtonsHTMLEnd + lineStartVar + "</td><td id='text" + noteNum + lineVar + "</td></tr>";
	  checkOverflow("item" + noteNum);
      noteNum++;
    }
  }
  itemTotal = noteNum;
  CloseRFile(currentNote);
  noteBody.innerHTML = noteBody.innerHTML + "</table></div>";
}

function onSubmitted(tempVar) {
  event.returnValue = false;
  AddNote(tempVar);
  noteBody.scrollTop = noteBody.scrollHeight;
}

function showNewNoteBox() {
  clearAll();
  noteTitle.innerText = 'Name for new note:';
  newNoteDiv.style.display = 'block';
  centerNewNoteForm();
  newNoteInputBox.focus();
}

function createNewNote(newNoteName) {
  // create a new note file
  event.returnValue = false;
  newNoteName = checkForLeadingSpaces(newNoteName);
  newNoteName = checkForTrailingSpaces(newNoteName);
  if (newNoteName == '') { showNewNoteBox(); showStatus("No text entered"); return; }
  if (checkFor1stCharNum(newNoteName.slice(0, 1))) { return; }  // if 1st char is a number
  var fileCreated = CreateNewFile(newNoteName);
  if (!!fileCreated) { showNotes(newNoteName); showStatus("New note, " + AbbrevText(newNoteName) + " created"); }
  else { newNoteInputBox.value = ''; }
}

function centerNewNoteForm() {
  // manually center the input box on the new note screen
  newNoteForm.style.left = document.documentElement.clientWidth / 2 - (newNoteForm.firstChild.size * 6 + 10);
}

function getLocalFont(n) {
  localFontShow[n].style.display = 'none';
  localFontDiv[n].style.display = 'inline';
  localFontCheckBox[n].onclick = 'setLocalFont(' + n + ');';
  localFontBox[n].value = uFont[n];
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
    uFont[n] = localFontBox[n].value;
    localFontCheckBox[n].checked = true;
    saveOptions();
  }
}

function checkForLeadingSpaces(str) {
  while (str.slice(0, 1) == " ") {
    // remove any spaces from before text
    if (str.length > 1) { str = str.slice(1); }
    else { str = ''; break; }
  }
  return str;
}

function checkForTrailingSpaces(str) {
  while (str.slice(-1) == " ") {
    // remove any spaces from after text
    if (str.length > 1) { str = str.slice(0, -1); }
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
  var conf = '';  
  if (confirm("Are you sure you want to delete\n" + currentNote + "?", conf)) {
		if (Opt16 == currentNote.toLowerCase()) { unpin(); }		// if pinned note is being deleted, unpin it first
  		DeleteThisNote();
	}
  else { return; }
}

function displayAbout() {
  // display license info/help file
  clearAll();
//  noteTitle.innerText = "About Note";
  aboutDiv.style.display = 'block';
  document.getElementById('about_name').innerText = Note.ApplicationName;
  document.getElementById('about_version').innerText = 'v' + Note.version;
  document.getElementById('about_license').innerText = license;
}

function checkCoords() {
  // check current coordinates, also check window size to adjust element sizes
  // check current app height to adjust div heights
  if ((screen.availHeight > 650) && (document.documentElement.clientHeight > 380)) {
    noteBody.style.height = document.documentElement.clientHeight - 360;
      // changed from 350 to 360 b/c Win10 pushing statusBar up against inputDiv
    optionsDiv.style.height = document.documentElement.clientHeight - 300;
    noteList.style.display = 'block';
    if (Opt12 == 'show') { statusBar.style.display = 'inline-block'; }
  }
  else {
    noteBody.style.height = 290;
    noteList.style.display = 'none';
    statusBar.style.display = 'none';
  }
  // set noteBody width
  noteBody.style.width = document.documentElement.clientWidth * 0.96;
  if (opt12 == 'show') {
    // check if too thin for status bar
	if (noteBody.style.width.slice(0, -2) < (NoteWidth / 5)) { statusBar.style.display = 'none'; }
	else {
		statusBar.style.display = 'inline-block';
	    // check if too thin for status bar text
    	if (noteBody.style.width.slice(0, -2) < (NoteWidth / 2.5)) { statusBarText.style.visibility = 'hidden'; }
	    else { statusBarText.style.visibility = 'visible'; }
	}
  }
  // set inputBox length
  var tempSize = 100 - (((NoteWidth - document.documentElement.clientWidth) / NoteWidth) * 100);
  inputBox.size = tempSize;
  if (!!document.getElementById('editBox')) {
    // set edit text box size
  	document.getElementById('editBox').size = inputBox.size * 0.8;
    if (noteBody.scrollWidth >= (noteBody.offsetWidth - 5)) { 
      document.getElementById('editBox').size = inputBox.size * 0.5;
	}
  }
  oldX = currentX;
  oldY = currentY;
  getCoords();
  if (!firstCoordCheck) {
    if ((oldX != currentX) || (oldY != currentY)) {
      if (Opt9 == 'cc') { 	document.getElementById('screenPosResetButton').disabled = false; getCoords(); savePos(); }
      else {
        Opt9 = 'cc';
		document.getElementById('screenPosResetButton').disabled = false;
        document.getElementsByName('screenPos')[1].checked = true;
        getCoords();
        savePos();
      }
    }
  }
  else { firstCoordCheck = false; }
}

function checkTimer() {
  // check status timer & clock
  if (statusBarText.innerHTML != statusBarHTML) {
    statusTimer = statusTimer + 0.5;
    if (statusTimer > 6.5) { clearStatus(); }
  }
  timer = timer + 0.5;
  if (timer % 10 == 0) { getTime(); }
  if (timer >= 1000) { timer = 0; }
  checkCoords();
}

function getCoords() {
  currentX = window.screenLeft;
  currentY = window.screenTop;
}

function getOffset() {
  // determine x & y offset amt at start
  var nowX = window.screenLeft,
    nowY = window.screenTop;
  window.moveTo(nowX, nowY);
  offsetX = window.screenLeft - nowX;
  offsetY = window.screenTop - nowY;
}

function goEdit(num) {
  // add an input box to edit current note item
  itemToEdit = "text" + num;
  uneditedString = origText[num];
  if (!!editing) { showNotes(currentNote); } 
  editing = true;
  var editBoxHTML = "<form name='editForm' onsubmit='event.returnValue=false;SubmitEdit(editBox.value);' action='#'><input type='text' size=50 id='editBox' /><input type='submit' style='color: green; margin-left: 2px;' value='&#10004; Change' /><input type='button' style='color: red; margin-left: 2px;' value='&#10008; Cancel' onclick='canceledEdit();' /></form>";
  document.getElementById(itemToEdit).innerHTML = editBoxHTML;
  document.getElementById('editBox').attachEvent('onkeydown', function(e) {
  	if (e.keyCode == 27) { canceledEdit(); }	// if ESC key pressed while editing
  });
  checkCoords();   // to set editBox size right away
  document.getElementById('editBox').value = uneditedString;
  document.getElementById('editBox').focus();
  document.getElementById('editBox').select();
}

function canceledEdit() {
  // edit canceled, either by clicking Cancel or pressing ESC key
  document.getElementById('editBox').outerHTML = document.getElementById('editBox').outerHTML;		// remove event listener
  showNotes(currentNote);
  showStatus("Edit canceled");
}

function insertItem() {
  // let user pick where to insert new note
  var insertClass = 'insertBlack';
  if (fgColor != 'black') { insertClass = 'insertWhite'; }
  for (i = 0; i < itemTotal; i++) {
    // add "insert" class to item text <td> elements, and onclick handler for insertion
    document.getElementById('text' + i).className = insertClass;
    document.getElementById('text' + i).onclick = function() {
      if (inputBox.value == "") { showNotes(currentNote); showStatus("Nothing to insert"); return; }
      EditedString = inputBox.value;
      WriteModifiedFile((this.id).slice(4), -1)
      showStatus(AbbrevText(EditedString) + " inserted at line #" + (1 * (this.id).slice(4) + 1));
    };
  }
}

function showStatus(statusStr) {
  // show a status message at bottom of window
  if (Opt12 == 'show') {
    statusBarText.innerHTML = statusStr;
    statusTimer = 0;
  }
}

function clearStatus() {
  // clear status bar
  statusBarText.innerHTML = statusBarHTML;
  statusTimer = 0;
}

function remHTML(str) {
  // remove characters that could execute code
  str = str.replace(/&/g, "&amp;");
  str = str.replace(/</g, "&lt;");
  str = str.replace(/>/g, "&gt;");
  str = str.replace(/"/g, "&quot;");
  str = str.replace(/'/g, "&#x27;");
  str = str.replace(/\//g, "&#x2F;");
  return str;
}

function focusInput() {
  // call from VBS file to refocus on inputBox after a status msg display
  inputBox.focus();
}

function highlight(tempNum) {
  // highlight recently-restored note item for a couple seconds
  var tempHL = document.getElementById(('text' + tempNum));
  tempHL.style.backgroundColor = 'yellow';
  if (fgColor != 'black') {
    var tempColor = fgColor;
    tempHL.style.color = 'black';
  }
  setTimeout(function() {
    tempHL.style.backgroundColor = bgColor;
    tempHL.style.color = fgColor;
  }, 2000);
}

function dispBackupDiv() {
  // show backup div: backup button, current backup dir, button to change dir
  clearAll();
  noteTitle.innerText = "Backup";
  backupDiv.style.display = 'block';
  var Opt13Display = Opt13;
  if (Opt13 == Default13) { Opt13Display = showDefaultBackup() }
  if (Opt13Display.length > 50) { Opt13Display = abbrevBackup(Opt13Display); }
  backupDispDiv.innerText = Opt13Display;
}

function abbrevBackup(rawText) {
  // abbreviate backup file path for display
  return rawText.slice(0, 23) + " ... " + rawText.slice(rawText.length - 24);
}

function getTime() {
  // get current time & display it
  var nowDate = new Date(),
    nowTime = nowDate.toLocaleTimeString(),
    timeSections = nowTime.split(":");
  document.getElementById('clock').innerHTML = timeSections[0] + ":" + timeSections[1] + " " + "<span id='clockText'>" + timeSections[2].slice(-2) + "</span>";
}

function checkOverflow(thisLine) {
  // check to see if just-added line causes horizontal scroll
  if (noteBody.scrollWidth >= (noteBody.offsetWidth * 0.98)) {
	// loop through line, if not a group of 19 or more chars w/o a space or hyphen, don't add overflowClass
	var strLength = 0;
	var thisLineText = document.getElementById(thisLine).innerText;
	for (var aa = 6; aa < thisLineText.length; aa++) {
		if ((thisLineText.slice(aa, aa + 1) == " ") || (thisLineText.slice(aa, aa + 1) == "-")) {
			strLength = 0;
		}
		else { strLength++; }
		if (strLength > 19) {
			document.getElementById(thisLine).className = document.getElementById(thisLine).className + " overflowClass";
			break;
		}
	}
  }
}

function getCurrentSize() {
  // get current size w/ document.documentElement
  var tempRect = document.documentElement.getBoundingClientRect();
  Opt14 = tempRect.right - tempRect.left;
  Opt15 = tempRect.bottom - tempRect.top;
  if ((Opt14 == NoteWidth) && (Opt15 == NoteHeight)) { document.getElementById('screenSizeResetButton').disabled = true; }
  else { document.getElementById('screenSizeResetButton').disabled = false; }
}

function checkSize() {
  // get current window size
  if (!firstCall) { return; }
  firstCall = false;
  var oldW = Opt14,
    oldH = Opt15;
  getCurrentSize();
  if ((oldW != Opt14) || (oldH != Opt15)) {
    // size has changed
    saveSize();
	document.getElementById('screenPosResetButton').disabled = false;
    firstCall = true;
  }
  else { firstCall = true; }
  if (newNoteDiv.style.display != "none") { centerNewNoteForm(); }
}

function getDefaultSize() {
  // get default width & height
  window.resizeTo(NoteWidth, NoteHeight);
  var tempRect = document.documentElement.getBoundingClientRect();
//  NoteWidth = NoteWidth + (tempRect.right - tempRect.left - NoteWidth);
//  NoteHeight = NoteHeight + (tempRect.bottom - tempRect.top - NoteHeight);
  var percentW = (NoteWidth / (tempRect.right - tempRect.left)),
    percentH = (NoteHeight / (tempRect.bottom - tempRect.top));  
  newOpt14 = Math.floor(NoteWidth * percentW);
  newOpt15 = Math.floor(NoteHeight * percentH);
}

function resetSize() {
  // reset window size
  getDefaultSize();
  correctSize();
  window.resizeTo(NoteWidth, NoteHeight);
  Opt14 = newOpt14;
  Opt15 = newOpt15;
  saveSize();
  document.getElementById('screenSizeResetButton').disabled = true;
  firstCall = true;
}

function correctSize() {
  // to correct for getBoundingClientRect() and resizeTo() not matching up exactly
  var tempRect = document.documentElement.getBoundingClientRect(),
    percentW = (Opt14 / (tempRect.right - tempRect.left)),
    percentH = (Opt15 / (tempRect.bottom - tempRect.top));  
  newOpt14 = Math.floor(Opt14 * percentW);
  newOpt15 = Math.floor(Opt15 * percentH);
  window.resizeTo(newOpt14, newOpt15);		// set initial size
}

function checkFor1stCharNum(thisChar) {
  // to see if 1st char of file name is a number
  if (!isNaN(thisChar)) {
  	alert('The note title can not start with a number.\nTo use a number, prepend it with "#".');
	return true;
  }
  else { return false; }
}

function resetPos() {
  // reset and center window position
  Opt9 = "mm";
  setPos();
  savePos();
  document.getElementById('screenPosResetButton').disabled = true;  
}

function resetDefault() {
  // restore all settings back to default values
  var beSure = confirm('Are you sure you want to reset all settings?\nAll options will go back to their default values.\
  	\nThis change can not be undone.');
  if (!!beSure) {
  	DelOptionsFile();
	OptionsCorrupted(0);
	resetPos();
	resetSize();
	applyOptions();
	showOptions();
  }
}

function collapse(num) {
	// collapse options section
	document.getElementById('section' + num).style.display = "none";
	document.getElementById('symbol' + num).innerHTML = "&#9654;";
	sectionsCollapsed++;
	checkCollapseExpandButtons();
}

function expand(num) {
	// expand options section
	document.getElementById('section' + num).style.display = "inline";
	document.getElementById('symbol' + num).innerHTML = "&#9662;";
	sectionsCollapsed--;
	checkCollapseExpandButtons();
}

function expandAll() {
	// expand all options settings
	var thisId, thisNum, thisSection;
	for (var i = 0; i < document.getElementsByTagName('label').length; i++) {
		thisId = document.getElementsByTagName('label')[i].id;
		if (thisId.slice(0, 6) === "header") {
			thisNum = thisId.slice(thisId.length - 2, thisId.length);
			thisSection = "section" + thisNum;
			if (document.getElementById(thisSection).style.display == "none") { expand(thisNum); }
		}
	}
	sectionsCollapsed = 0;
	checkCollapseExpandButtons();
}

function collapseAll() {
	// collapse all options settings
	var thisId, thisNum, thisSection;
	for (var i = 0; i < document.getElementsByTagName('label').length; i++) {
		thisId = document.getElementsByTagName('label')[i].id;
		if (thisId.slice(0, 6) === "header") {
			thisNum = thisId.slice(thisId.length - 2, thisId.length);
			thisSection = "section" + thisNum;
			if (document.getElementById(thisSection).style.display !== "none") { collapse(thisNum); }
		}
	}
	sectionsCollapsed = sectionsTotal;
	checkCollapseExpandButtons();
}

function checkCollapseExpandButtons() {
	// if all options either collapsed or expanded, disable the corresponding button
	if (sectionsCollapsed === sectionsTotal) { document.getElementById('collapseAllButton').disabled = true; }
	else { document.getElementById('collapseAllButton').disabled = false; }
	if (sectionsCollapsed === 0) { document.getElementById('expandAllButton').disabled = true; }
	else { document.getElementById('expandAllButton').disabled = false; }	
}

function pin() {
	// pin current active note (if another note pinned, unpin it first)
	if (pinned) { pinBox.style.display = "none"; }
	var activeNote,
	  cond = 'active',
	  Opt16lc = Opt16.toLowerCase();
	if (!!arguments[0]) { cond = 'init'; }
	var buttons = document.getElementsByTagName('button');
	for (var i = 0; i < buttons.length; i++) {
		if (cond == 'init') {		// show pinned note on initialization; not the active note
			if (buttons[i].innerText.toLowerCase() == Opt16lc) {
				activeNote = buttons[i];
				break;
			}
		}
		else {
			if (buttons[i].className == 'noteButton activeNote') {
				activeNote = buttons[i];
				break;
			}
		}
	}
	if (activeNote == undefined) { Opt16 = Default16; return; }	// if pinned note is no longer there
	pinBox.style.display = 'inline-block';
	pinBox.appendChild(activeNote);
	pinned = true;
	if (cond == 'active') {
		Opt16 = activeNote.innerText.toLowerCase();
		WriteOptions();
		showPinButton();
	}
	getFileList();
	inputBox.focus();
}

function unpin() {
	// unpin current pinned note
	pinBox.innerHTML = "";
	pinBox.style.display = "none";
	pinned = false;
	Opt16 = Default16;
	showPinButton();
	WriteOptions();
	GetFileList();
	showNotes(currentNote);
}

function getPinned() {
	// return the currently-pinned note, or false if none
	if (Opt16 == "") { Opt16 = Default16; }
	if (Opt16 == Default16 || pinBox.innerHTML == "") { return false; }
	else {return Opt16.toLowerCase(); }	// loop through notes here; verify Opt16 is a valid note
}

function showPinButton() {
	// show either pin or unpin button
	pinned = getPinned();
	(pinned == currentNote.toLowerCase()) ? (pinOrUnpinHTML = unpinButtonHTML) : (pinOrUnpinHTML = pinButtonHTML);
	document.getElementById('pinButton').innerHTML = pinOrUnpinHTML;
}

function onStart() {
	// load whatever will be displayed on launch: pinned note, splash screen, etc.
	// displayAbout calls clearAll internally; if showing something else, may need to call it here first
	// if a pinned note, load it on start; else load about screen (for now)
	if (Opt16 != Default16) { clearAll(); showNotes(Opt16); }
	else { displayAbout(); }
	
}

function applyFormatting(text) {
	// apply any special formatting styles
	return format(
		format(
			format(
				format(
					format(
						text, "\\*\\*\\*", 3, "<b><i>", "</i></b>"		// bold italic
					),
					"\\*\\*", 2, "<b>", "</b>"							// bold
				),
				"\\*", 1, "<i>", "</i>"									// italic
			),
			"\\_", 1, "<u>", "</u>"									// underlined
		),
		"\\`", 1, "<code>", "</code>");								// code
}

function format(text, char, len, tag1, tag2) {
	// apply any format changes if designating characters are present
	var patt = new RegExp(char, "g"),
		locs = [],	// array to store index #s for found characters
		newStr = text,
		i = 0,
		match, k, cnd1, cnd2, cnd3;
	while (match = patt.exec(text)) {
		// for each match, check for duplicate chars (``, ****, etc.) or escaped chars (\`, etc.)
		if (match.index == 0) { cnd1 = true; }  // skip checking prev char if at beginning of string
		else { cnd1 = (text.substr(match.index - 1, 1) != char.slice(-1)); }		// check for no duplicate char preceding
		cnd2 = (text.substr(match.index + len, 1) != char.slice(-1)); 				// check for no duplicate char succeeding
		cnd3 = (text.substr(match.index - 1, 1) != "\\");						// check for not an escaped char
		if (cnd1 && cnd2 && cnd3) {
			locs[i++] = match.index;
		}
	}	
	if (locs.length % 2 > 0) { locs.pop(); }  // if an odd #, remove the last occurrence
	if (locs.length > 1) {	// if still at least a pair of matching characters
		newStr = text.slice(0, locs[0]);
		for (k = 0; k < locs.length - 1; k += 2) {
			// replace formatting chars w/ html tags
			newStr += tag1 + text.slice(locs[k] + len, locs[k + 1]) + tag2;		// add text w/ html formatting added in
			if (k < (locs.length - 2)) {
				newStr += text.slice(locs[k + 1] + len, locs[k + 2]);			// add string of non-formatted text (if any)
			}
		}
		newStr += text.slice(locs[k - 1] + len);
	}
	return newStr;
}


// ----------- declare event handlers ----------

// option button handlers
inputs = document.getElementsByTagName('input');
for (i = 0; i < inputs.length; i++) {
  if (inputs[i].value.slice(0, 2).toLowerCase() == 'uf') {		// if a font option
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

for (i = 0; i < localFontBox.length; i++) {
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

for (var i = 0; i < document.getElementsByTagName('label').length; i++) {
	// add click handlers to option headings for expanding/collapsing
	if (document.getElementsByTagName('label')[i].id.slice(0, 6) === "header") {
		sectionsTotal++;
		document.getElementsByTagName('label')[i].onclick = function() {
			var thisNum = this.id.slice(this.id.length - 2, this.id.length);
			var thisSection = "section" + thisNum;
			if (document.getElementById(thisSection).style.display !== "none") { collapse(thisNum); }
			else { expand(thisNum); }
		};
	}
	else if (document.getElementsByTagName('label')[i].firstChild.name === "bg") {	// look for theme setting labels
		// if a theme label, add mouseover listener to preview theme
		document.getElementsByTagName('label')[i].attachEvent('onmouseenter', function(e) {
			previewing = true;
			previewTheme(e.srcElement.firstChild.value);
		});
		// add mouseleave listener to reset theme to current setting
		document.getElementsByTagName('label')[i].attachEvent('onmouseleave', function() {
			previewing = false;
			setTimeout(function() {
				if (!previewing) { applyTheme(); }
			}, 250);
		});
	}
}

// to get current scroll position:
noteBody.attachEvent('onscroll', function() { setTimeout(function() { lastScrollPos = noteBody.scrollTop; }, 250); });

document.attachEvent('onkeyup', function(e) {
	// check if Home key pressed
	if (String.fromCharCode(e.keyCode) == "$") {
		// if Home key pressed, call screen pos reset function
		if (document.activeElement.tagName.toLowerCase() == "input") {
			if (document.activeElement.type.toLowerCase() == "text") {
				return;		// don't fire if focus is on a text box
			}
		}
		resetPos();
		return false;
	}
});


// --------- execution -----------------

clearAll();
getOffset();
applyOptions();
if (Opt16 != Default16) { pin(Opt16); }		// show pinned note if one has been set
getDefaultSize();
window.resizeTo(Opt14, Opt15);		// set initial size
correctSize();		// to get correct window size
setPos();			// set initial position
var checkTimerInt = setInterval(checkTimer, 500);
getTime();
setTimeout(function(){
	window.attachEvent('onresize', checkSize);		// to get new size when edges are dragged
}, 1000);
onStart();
