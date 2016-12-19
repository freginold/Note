# Note
Note is a very basic Windows GUI note/task app.  It is free, open source, and in the public domain.  It uses VBScript and JavaScript/JScript with an .HTA interface.

You can create new notes -- each one saved as a separate text file -- and add individual note items to each note/file.  New note items can be added at the bottom of the list, or inserted anywhere in an existing note list.  Each note item can be deleted individually (i.e. for a to-do list).  Individual note items can be moved up or down on the list.  They can also be edited in-line.  Note files can be renamed or deleted.

Note saves all notes/tasks in a `notes` subfolder.  It uses a `config.txt` file to store configuration settings; background color, text font, text size, window position, window size, status bar display, and backup folder location. If either the `notes` subfolder or the `config.txt` file are not present, Note will create one on launch.

![screen shot]
(https://github.com/freginold/Note/blob/master/note_ss.png)

### Installation:
On a Windows computer with Internet Explorer (or Edge) installed:
  - Download the [latest release] (https://github.com/freginold/Note/releases/latest) of Note, as either a tarball or zip file
  - Unzip the files into the folder of your choice
  - Double-click the `note.hta` file to run the program

If you get the "Unknown Publisher" message, click *Run* to bypass it.  You can uncheck the box marked "Always ask before opening this file" so the message won't appear again.

The only necessary files are `note.hta`, `_note.js`, `_note.vbs`, and `_note.css`.  The others can be deleted if you want.  The icon file, `note_icon.ico`, will be used if it's there, but Note will run fine without it.

### Usage:
To create a new note, click the <b>New Note</b> button in the upper right corner.  Notes are saved as plain text files.  To add list items to a note, open that note by clicking on its name along the top of the window, then type in the text you want to add and either press the <b>ENTER</b> key or click <b>Add at Bottom</b>.  To insert a new note item into an existing list (rather than add it to the bottom) type the text that you want to add, then click "*Insert Above...*" and select where you would like to insert the new item.

You can edit an existing note item by double clicking on it.  Make the changes you want, then click <b>Change</b>.  Changes are saved immediately.

Notes and user configuration settings can be backed up to any accessible local or network folder.  Selecting the *Backup...* button on the Options screen allows you to choose a backup location (or keep the default location -- the current Note source directory) and perform a backup.

An undelete feature has been added, to restore the last deleted item.  The restore button can be found on the Options screen. If the note that contained the deleted item has since been deleted itself, or if the program has been closed and reopened, you won't be able to restore a deleted item.

Note allows up to four user-defined local fonts to be specified.  Any font installed on the local computer can be used.  All four selections, once made, will be saved.  Spelling counts but capitalization does not.

As of v3.0.3, Note is versioned using [Semantic Versioning] (http://semver.org/).

### Limitations:
- Note files must be kept in the `notes` subfolder, with a `.txt` file extension, to be recognized.  When a new note is created, it is automatically saved there.
- Note may not run correctly on Windows Vista PCs.  (Seems to be an issue with something in the VBScript code.) It has been tested successfully on Windows 7 and Windows 10 PCs.


*Side note:* HTA files run as "trusted" programs in Windows.  They are good for sysadmin work and local scripting, but be aware of the security concerns before making use of an HTA file, especially one downloaded from an unfamiliar source.
