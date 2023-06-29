# Note

[![GitHub release](https://img.shields.io/github/release/freginold/Note.svg)](https://img.shields.io/github/release/freginold/Note.svg) [![GitHub Release Date](https://img.shields.io/github/release-date/freginold/Note.svg)](https://img.shields.io/github/release-date/freginold/Note.svg) [![GitHub top language](https://img.shields.io/github/languages/top/freginold/Note.svg)](https://github.com/freginold/Note/) [![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/freginold/Note.svg)](https://github.com/freginold/Note)

Note is a very basic Windows GUI note/task app.  It is free, open source, and in the public domain.  It uses VBScript and JavaScript/JScript with an .HTA interface.

You can create new notes -- each one saved as a separate text file -- and add individual note items to each note/file.  New note items can be added at the bottom of the list, or inserted anywhere in an existing note list.  Each note item can be deleted individually (i.e. for a to-do list).  Individual note items can be moved up or down on the list.  They can also be edited in-line.  Note files can be renamed or deleted.

Note saves all notes/tasks in a `notes` subfolder.  It uses a `config.txt` file to store configuration settings; background color, text font, text size, window position, window size, status bar display, backup folder location, and pinned note name. If either the `notes` subfolder or the `config.txt` file are not present, Note will create one on launch.

![screen shot](https://github.com/freginold/Note/blob/master/note_ss.png)

### Installation:
On a Windows computer with Internet Explorer or Edge installed:

  - Download either the latest release ([zip](https://github.com/freginold/Note/archive/v3.4.zip) | [tarball](https://github.com/freginold/Note/archive/v3.4.tar.gz)) or the current version ([zip](https://github.com/freginold/Note/archive/master.zip)) of Note
  - Unzip the files into the folder of your choice
  - Double-click the `note.hta` file to run the program

If you get the "Unknown Publisher" message, click <b>Run</b> to bypass it.  You can uncheck the box marked "Always ask before opening this file" so the message won't appear again.

### Usage:
To create a new note, click the <b>New Note</b> button in the upper right corner.  Notes are saved as plain text files.  To add list items to a note, open that note by clicking on its name along the top of the window, then type in the text you want to add and either press <kbd>ENTER</kbd> or click <b>Add at Bottom</b>.  To insert a new note item into an existing list (rather than add it to the bottom) type the text that you want to add, then click <b>Insert Above...</b> and select where you would like to insert the new item.

You can edit an existing note item by double clicking on it.  Make the changes you want, then press <kbd>ENTER</kbd> or click <b>Change</b>.  Changes are saved immediately.

Notes and user configuration settings can be backed up to any accessible local or network folder.  Clicking the <b>Backup...</b> button on the Options screen allows you to choose a backup location (or keep the default location -- the current Note source directory) and perform a backup.

An undelete feature has been added, to restore the last deleted item.  The restore button can be found on the Options screen.  If the note that contained the deleted item has since been deleted itself, or if Note has been closed and reopened, you won't be able to restore a deleted item.

Note allows up to four user-defined local fonts to be specified.  Any font installed on the local computer can be used.  All four selections, once made, will be saved.  Spelling counts but capitalization does not.

To move or resize Note, simply drag it around the screen or drag the corners and edges to position it how you want it.  Any changes will be saved and remembered the next time you launch Note.  You can change the background color, font, and text size on the Options screen (accessed by clicking the <b>Options</b> button in the upper right corner).

If there are more notes than will fit across the list bar at the top, you can scroll side to side between notes.  You can "pin" one note, so that its button will always be displayed in the upper left corner and you won't have to scroll to find it.  To pin a note, select that note and click the <b>Pin</b> button to the left of the note's title.  Click <b>Unpin</b> to unpin the note, or you can replace it with another note by selecting a different note and clicking the <b>Pin</b> option for that note. If there is a pinned note, Note will load it on launch; otherwise it will default to the About screen.

Note supports some (very) basic markup formatting:
- **Code formatting**  
  \`test\` will be displayed as `test` (minus the change in background color)
- **Italic**  
  \*test\* will be displayed as *test*
- **Bold**  
  \*\*test\*\* will be displayed as **test**
- **Bold italic**  
  \*\*\*test\*\*\* will be displayed as ***test***
- **Underline**  
  \_test\_ will be displayed underlined (Markdown doesn't support underline so can't show an example here)

One formatting symbol by itself won't trigger a formatting change; only a pair will change the formatting.

Note now allows the use of horizontal divider lines between items.  To insert or append a divider line, type `---` as the text for that line.

Note supports the <kbd>Home</kbd> key as a shortcut to reposition Note in the center of the screen.  This method won't work if focus is currently on an input box -- i.e. if you can see the cursor. Click somewhere outside of the input box and press the <kbd>Home</kbd> key again, or press <kbd>Tab</kbd> and then <kbd>Home</kbd>.

Although every effort has been taken to avoid the chance of note files becoming corrupted or erroneously deleted, regular backups should be performed (from the Settings menu) to ensure notes and settings are preserved.

As of v3.0.3, Note is versioned using [Semantic Versioning](http://semver.org/).

### Tested on:
Note has been tested and runs well on:
- Windows 7 32-bit / IE 11
- Windows 7 64-bit / IE 11
- Windows 10 64-bit / EdgeHTML 14, EdgeHTML 15, Edge 97, Edge 114.0.1823.58

### Limitations:
- Note files must be kept in the `notes` subfolder, with a `.txt` file extension, to be recognized.  When a new note is created, it is automatically saved there.
- If the system is shut down with Note open and the program tries to reopen when the computer restarts, it will launch from the Windows system folder, rather than the folder where Note resides, resulting in default options and no notes appearing. Closing and reopening Note will resolve the issue.
- Note may not run correctly on Windows Vista.  (Seems to be an issue with something in the VBScript code.)

### Troubleshooting:
If Note gets corrupted, or if a weird setting persists and won't change, delete the `config.txt` file and relaunch Note.  All settings will be reset.

If you open Note and the icon/name appear in the taskbar, but you don't see the Note window, it could be positioned off-screen.  (Windows seems to cause this sometimes.)  Press the <kbd>Home</kbd> key to recenter Note.

*Side note:* HTA files run as "trusted" programs in Windows.  They are good for sysadmin work and local scripting, but be aware of the security concerns before making use of an HTA file, especially one downloaded from an unfamiliar source.
