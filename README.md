% README
% zedesk.net
% May 2014

# Introduction

This little program aims to display markdown files that are on your hard disk. 

Later, I will add supports for some cloud services like Google drive and Dropbox.

This program uses [node-webkit](https://github.com/rogerwang/node-webkit) as backend.

# Using the sources

Some pre-requisites : 

   - node-webkit ( v0.9.2 )
   - nodejs ( v0.10.28 )
   - npm global modules
      - bower
      - jsdoc
      - grunt-cli

I assume that you have all the above pre-requisites installed and configured on your environnement.

> __Nota__ : for more convenience, I create symlinks of node, npm and nw in /usr/local/bin
>
    sudo ln -sfn /opt/node/bin/* /usr/local/bin
    sudo ln -sfn /opt/node-webkit/node-webkit.app/Contents/MacOS/node-webkit /usr/local/bin/nw

so, now install all dependencies with the following command :

    npm install

then you can execute the application :

    nw src
    
[Markdown Syntax](src/README.md)