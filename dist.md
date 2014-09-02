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


