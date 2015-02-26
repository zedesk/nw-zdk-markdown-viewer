% Create distribution package
% zedesk.net
% July 2014

# Introduction

The process to create distribution package is describe in the [node-webkit wiki](https://github.com/rogerwang/node-webkit/wiki/How-to-package-and-distribute-your-apps).

The "zdk-markdown-viewer" application uses the last version of node-webkit, even the RC version. 

In the previous version, I use grunt "grunt-node-webkit-builder". This grunt package is very helpfull, but doesn't create the modified version of the application for ubuntu 13.04 and above, and use only the last stable version of node.

# process to create an application package

Get node-webkit : 

The zdk-Markdown-Viewer app use the last version of node-webkit ( v0.10.2 )

To know what version to install

	ls /lib/x86_64-linux-gnu/libudev.so.1

if libudev.so.1 exists install the ubuntu64 version, else linux64 version.

Preparation pour linux Ubuntu depuis la 13.04

	sed -i 's/udev\.so\.0/udev.so.1/g' zdk-Markdown-Viewer

Add a VERSION file

~~~
zdk-Markdown-viewer
dev@zedesk.net
v0.0.6
~~~

On linux, when lauching the programm there is no menu entry.

On linux, the package will be installed in the `/opt` folder.

Create a `markdown-viewer.desktop` file :

~~~
[Desktop Entry]
Version=0.0.6
Type=Application
Name=Markdown-Viewer
Icon=/opt/zdk-Markdown-Viewer/MMD.png
Exec=/opt/zdk-Markdown-Viewer/zdk-Markdown-Viewer
NoDisplay=false
Categories=Utility;
StartupNotify=false
Terminal=false
~~~

Le rendre executable

	chmod a+x markdown-viewer.desktop


	sudo cp /mnt/hgfs/fablec/Sites/nw-zdk-markdown-viewer/markdown-mime.xml zdk-Markdown-Viewer.xml

Répertoire /usr/share

 - __/applications__
   - _appName_.desktop
   - mimeapps.list
 - __/appName__

 Répertoire /usr/bin

 a appName file : symlink to the real application file in /usr/share/appName/appName

__/appName__

we find here the application folder ( nw )

__mimeapps.list__

	[Default Applications]
	text/x-markdown=Haroopad.desktop

_application_.desktop

	[Desktop Entry]
	Name=appName
	Version=0.12.2
	Exec=appName
	Comment=The Next Document processor based on Markdown
	Icon=appName
	Type=Application
	Terminal=false
	StartupNotify=true
	Encoding=UTF-8
	Categories=Development;GTK;GNOME;

File `control` ( declaration du package )

~~~
Package: appANme
Version: 0.12.2
Installed-Size: 75394
Section: office
Maintainer: 
Homepage: 
Priority: extra
Architecture: amd64
Description: 
~~~

script `postinst

~~~
#!/bin/bash
paths=(
  "/lib/x86_64-linux-gnu/libudev.so.1" # Ubuntu, Xubuntu, Mint
  "/usr/lib64/libudev.so.1" # SUSE, Fedora
  "/usr/lib/libudev.so.1" # Arch, Fedora 32bit
  "/lib/i386-linux-gnu/libudev.so.1" # Ubuntu 32bit
)
for i in "${paths[@]}"
do
  res=$(echo $i | sed "s/so.1/so.0/g")
  if [ -f $i ]
  then
    ln -sf "$i" "$res"
    break
  fi
done
~~~

The DEB file is an archive containing :

  - debian-binary
  - control.tar.gz
  - data.tar.gz

extract the DEB file : `dpkg-deb –extract mypackage.deb foobar`

If you want to modify the package:

	dpkg-deb –extract mypackage.deb foobar
	dpkg-deb -e mypackage.deb foobar/DEBIAN
	# modify files in foobar directory
	dpkg-deb -b foobar

