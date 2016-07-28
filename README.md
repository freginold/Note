# Note
Note is a very basic Windows GUI note app.  It is free, open source, and in the public domain (no copyright).  It uses VBScript and JavaScript/JScript with an .HTA interface.

Note relies on a "notes" subfolder in the same directory.  It uses the "options.txt" file to store configuration settings -- currently whether time stamp display is on or off, and what the background color is set to.

![screen shot]
(https://github.com/freginold/Note/blob/master/note_ss.png)

### Limitations:
- Placing any files other than .txt files in the "notes" subfolder will cause those files to show up in the note list.  If they are clicked on, a script error will be thrown.
- Note files must be kept in the "notes" subfolder.
- The options file ("options.txt") must be kept in the main folder with the program files.


*Side note:* .HTA files run as "trusted" programs in Windows.  They are good for sysadmin work and local scripting, but be aware of the security concerns before making use of an .HTA file, especially one downloaded from an unfamiliar source.
