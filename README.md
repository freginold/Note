# Note
Note is a very basic Windows GUI note/task app.  It is free, open source, and in the public domain.  It uses VBScript and JavaScript/JScript with an .HTA interface.

Note saves all notes or task items in a `notes` subfolder, located inside the folder where Note is installed.  It will create the `notes` subfolder if it doesn't already exist.  It uses the `options.txt` file to store configuration settings -- time stamp display (on/off), background color, text font, and text size.  If no options file is present, Note will create a default options file on launch.

You can create new note groups (each one saved as a separate file) and add individual note items to each group/file.  Each item can be deleted individually.

![screen shot]
(https://github.com/freginold/Note/blob/master/note_ss.png)

### Installation / Execution:
On a Windows computer with Internet Explorer installed:
  - Click the green *"Clone or download"* button above the file list
  - Select *Download ZIP*
  - Unzip the files into the folder of your choice
  - Double-click the `note.hta` file to run the program

The only necessary files are `note.hta`, `_note.js`, `_note.vbs`, and `_note.css`.  The others can be deleted if you want.  The icon file, `note_icon.ico`, will be used if it's there, but Note will run fine without it.

You can use any local or system font you may have installed with Note; just specify it in the options.  Spelling counts but capitalization does not.

### Limitations:
- Note files must be kept in the `notes` subfolder, with a `.txt` file extension, to be recognized.  When a new note is created, it is automatically saved there.
- Note may not run correctly on Windows Vista PCs.  (Seems to be an issue with something in the VBScript code.) It has been tested successfully on Windows 7 and Windows 10 PCs.


*Side note:* HTA files run as "trusted" programs in Windows.  They are good for sysadmin work and local scripting, but be aware of the security concerns before making use of an HTA file, especially one downloaded from an unfamiliar source.
