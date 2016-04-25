% Todo list
% [zedesk.net](<dev@dev.zedesk.net>)
% June 2014

Bugs (nw 0.14)
---------------
  - review image links
  - review the drawer panel
  -

General
-------

   - allows email address in the header block
   - keep the last opened files
   - adds a editor panel
   - create builder scripts for the different platforms
   - add history nav buttons
   - add toast on document update
   - update to last Polymer version
   - update [highlightjs](https://highlightjs.org/)
   -


## Editor

  - save updates
  - preview button
  - remove line numbers gutter
  - on editor, hide the goto top button
  -

> __Nota :__
>
>   - https://github.com/Aluxian/nwjs-starter
>   - http://blog.aluxian.com/how-to-create-cross-platform-desktop-apps-with-nw-js/
>   - https://github.com/Gisto/nwjs-shell-builder
>   - http://docs.nwjs.io/en/latest/For%20Users/Package%20and%20Distribute/
>   -

Header block
------------

Today the only header block supported is the pandoc title block :

~~~
% My title with `markdown` *emphasis*
% John MacFarlane
  John Doe
% September 6, 2004
~~~

it will be great to support :

   - MMD header block

   ~~~
   Title:  A New MultiMarkdown Document  
   Author: Fletcher T. Penney  
           John Doe  
   Date:   July 25, 2005  
   ~~~

   - YAML Header block

   ~~~
   title: My title with `markdown` *emphasis*
   author:
      - John MacFarlane
      - John Doe
   doi: 10.234234.23424/x
   date: September 6, 2004
   abstract: |
        A formatted abstract here.

        May contain multiple paragraphs.
   ~~~

External links
--------------

   - shows the page title and url in the header
   - adds a loader image

Tree view
---------

   - ~~Add a refresh button to refresh the tree view~~
   - ~~better watch change on the opened folder~~
   - ~~Adds The folder name~~
   - ~~indicates the folder path~~
   - adds a history view
   - allows to create a new file ( need editor )
   - allows to create an index file
   - ~~on changing folder, select the file if available~~

Distribution
------------

   - create a download site
   - check update version

Bugs
----

   - add a panel to send bugs or feature

History view
------------

 The idea is to maintain an ordered list of opened files, useful to go back.

 Display the file title, file path and from now time.
