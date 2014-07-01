% Create distribution package
% zedesk.net
% July 2014

# Introduction

The process to create distribution package is describe in the [node-webkit wiki](https://github.com/rogerwang/node-webkit/wiki/How-to-package-and-distribute-your-apps).

The "zdk-markdown-viewer" application uses the last version of node-webkit, even the RC version. 

In the previous version, I use grunt "grunt-node-webkit-builder". This grunt package is very helpfull, but doesn't create the modified version of the application for ubuntu 13.04 and above, and use only the last stable version of node.

# process to create an application package

Get node-webkit : 

