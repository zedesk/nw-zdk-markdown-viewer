% Todo list
% [zedesk.net](<dev@dev.zedesk.net>)
% June 2014

General
-------

   - allows email address in the header block
   - keep the last opened files
   - adds a editor panel

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
