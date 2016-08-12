# Note
Note is a very basic Windows GUI note/task app.  It is free, open source, and in the public domain.  It uses VBScript and JavaScript/JScript with an .HTA interface.

Note saves all notes or task items in a `notes` subfolder, located inside the folder where Note is installed.  It will create the `notes` subfolder if it doesn't already exist.  It uses the `config.txt` file to store configuration settings -- time stamp display (on/off), background color, text font, and text size.  If no configuration file is present, Note will create one on launch.

You can create new note groups, each one saved as a separate text file, and add individual note items to each group/file.  Each note item can be deleted individually (ie. for a to-do list).  Note groups can be deleted or renamed.

Note allows up to four user-defined local fonts to be specified.  Any font installed on the local computer can be used.  All four selections, once made, will be saved.  Spelling counts but capitalization does not.

![screen shot]
(https://github.com/freginold/Note/blob/master/note_ss.png)

### Installation / Execution:
On a Windows computer with Internet Explorer installed:
  - Download the [Note master zip file] (https://github.com/freginold/Note/archive/master.zip)
  - Unzip the files into the folder of your choice
  - Double-click the `note.hta` file to run the program

(If you get the "Unknown Publisher" message, click *Run* to bypass it.  You can uncheck the box marked "Always ask before opening this file" so the message won't appear again.)

The only necessary files are `note.hta`, `_note.js`, `_note.vbs`, and `_note.css`.  The others can be deleted if you want.  The icon file, `note_icon.ico`, will be used if it's there, but Note will run fine without it.

Note files (and configuration settings) can be backed up to a local subfolder.  To backup your note files, click the *Backup* button on the Options screen.

### Limitations:
- Note files must be kept in the `notes` subfolder, with a `.txt` file extension, to be recognized.  When a new note is created, it is automatically saved there.
- Note may not run correctly on Windows Vista PCs.  (Seems to be an issue with something in the VBScript code.) It has been tested successfully on Windows 7 and Windows 10 PCs.


*Side note:* HTA files run as "trusted" programs in Windows.  They are good for sysadmin work and local scripting, but be aware of the security concerns before making use of an HTA file, especially one downloaded from an unfamiliar source.
