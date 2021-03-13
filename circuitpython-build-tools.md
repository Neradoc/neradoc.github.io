# How does Build Tools work ?

It is called on a directory of library repositories, or a directory of directories.
It is given a list of prefixes ("adafruit_" by default).

-	The code analyses each repository to find what files to include in the bundle.
-	Each .py file (except setup.py) is examined:
	-	get the part of the file's path that is at the root of the repository ("first parent")
	-	if that parent is "examples", put the file in the bundle's examples directory
	-	if that parent *is a directory* AND starts with any of the given prefixes
		-	put it in the package_files list
	-	otherwise
		-	treat it as a solitary file and put it in the py_files list
	-	if there is more than 1 standalone py file, it's an error

### NOTES:
-	modules are either:
	-	a single .py file, with or without a prefix (adafruit_datetime.py, neopixel.py)
	-	a single directory with a valid prefix (adafruit_magtag)
-	so normally one of package_files or py_files is empty
-	before the fix, single files starting with "adafruit_" were treated as packages
	-	that did not cause any problem as far as the code copying the module files is concerned
-	potential malformed repositories:
	-	repos where the package is a directory that does not start with a prefix are ignored
		-	but their examples are not (making them orphans)
	-	repos that contain more than one prefixed directory are copied
		-	every directory is copied
		-	the requirements file is under the name of only one of them (by glob order most likely)

### The fix for requirements
-	the code to add requirements.txt files got the module name from package_files or py_files
-	it assumed (like me) that packages where always files in directories and took the parent dir name
-	in consequence it was unable to find the names for single file prefixed modules (like datetime)
-	I think the intention of the original code was that packages are directories, which why I chose that fix
-	the fix differentiates between prefixed directories and files by looking at the depth of the path

### So what ?
I believe that there is a problem with the way the bundles are made. There is no way to explicitly identify what files the bundle should copy from the repositories, so it uses the "adafruit_" prefix for the Adafruit bundle, and an inscrutable awk script to guess them in the community bundle.

A solution would be to add a file to declare what needs to be included in the bundle.
-	Let's call it `manifest.txt`, it would contain a single line, for example: `neopixel.py` or `adafruit_magtag`
-	Its presence and validity would be checked in the cookie cutter's pre-commit
-	The script would read the file instead of using the prefixes to find the packages.
-	Maybe it would fall back to prefixes until the community module if fully updated ?

Adafruit libraries could be easily updated automatically, in the same way cookie-cutter updates have been deployed before.
The change in the build tools would only be activated once every module is ready (and tested).
