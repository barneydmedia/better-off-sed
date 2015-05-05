# Better Off SED
##Purpose
The original purpose of this program was to enable simple and fast replacements on text files that are too large for a GUI to edit. The test file was 40MB, and contained tens of thousands of matches for each regex. For this reason, a progress bar and other timely feedback was added into the original design.
##Installation
In terminal/shell:  
`npm install -g better-off-sed`
##Usage
Proper syntax looks like:

```
bosed -r ".*a JS regex here.*" -l gi -f ~/filepath.txt -s "string replacement text" -n ~/newFilePath.txt
```
```
   -f [required] file path, can be relative or absolute
   -r [required] regex pattern, no delimiters, escape properly
   -l [optional] replacement flags, ex. "gi" for replace all, disregard letter case in matching
   -s [optional] replacement string, ex. "some string"
   -v [optional] verbose mode, echoes all matches being replaced instead of a simpler progress bar
```

If a replacement string is not supplied, all matches are echoed to terminal. Providing a `-n` path will result in a new file being created from the results of the operation, whereas not providing one will overwrite the original file. All regexs must be properly escaped for terminal and JS (you'll get an error if this is an issue).

##TODO
* Add support for recursively/asynchronously working on multiple files