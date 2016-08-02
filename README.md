# Note
Note is a very basic Windows GUI note app.  It is free and open source.  It uses VBScript and JavaScript/JScript with an .HTA interface.

Note relies on a `notes` subfolder in the same directory.  It uses the `options.txt` file to store configuration settings -- currently whether time stamp display is on or off, and what the background color is set to.

You can create note files to group notes, and add individual lines to each one.  Lines can be deleted individually.

![screen shot]
(https://github.com/freginold/Note/blob/master/note_ss.png)

### Installation / Execution:
On a Windows computer with Internet Explorer installed:
  - Download the `note.hta`, `_note.js`, `_note.css` and `_note.vba` files into one directory
  - Create a `notes` sub-directory
  - Double-click the `note.hta` file to run the program

### Limitations:
- Note files must be kept in the `notes` subfolder.  When you create a new note, it is automatically saved there.
- The options file (`options.txt`) must be kept in the main folder with the program files.  (If it's missing or corrupted, a default options file will be created on launch.)
- May not run right on Windows Vista or older operating systems


*Side note:* HTA files run as "trusted" programs in Windows.  They are good for sysadmin work and local scripting, but be aware of the security concerns before making use of an HTA file, especially one downloaded from an unfamiliar source.
