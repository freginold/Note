# Note
Note is a very basic Windows GUI note app.  It is free and open source.  It uses VBScript and JavaScript/JScript with an .HTA interface.

Note relies on a `notes` subfolder in the same directory.  It uses the `options.txt` file to store configuration settings -- time stamp display (on or off), background color, font, and text size.  If no options file is present, Note will create a default options file on launch.

You can create new note files to group individual note items, and add individual lines to each note/file.  Line items can be deleted individually.

![screen shot]
(https://github.com/freginold/Note/blob/master/note_ss.png)

### Installation / Execution:
On a Windows computer with Internet Explorer installed:
  - Download the `note.hta`, `_note.js`, `_note.css` and `_note.vba` files into one directory
  - Create a `notes` sub-directory
  - Double-click the `note.hta` file to run the program

### Limitations:
- Note files must be kept in the `notes` subfolder, with a `.txt` file extension.  When a new note is created, it is automatically saved there.
- The program does not run correctly on Windows Vista systems


*Side note:* HTA files run as "trusted" programs in Windows.  They are good for sysadmin work and local scripting, but be aware of the security concerns before making use of an HTA file, especially one downloaded from an unfamiliar source.
