% README
% zedesk.net
% June 2014

# Presentation

zdk-markdown is a markdown viewer, based on the [marked.js](https://github.com/chjj/marked) library, with some adjustments. 

# Markdown syntax

The following paragraph is a copy of the content of [Mardown: Syntax](http://daringfireball.net/projects/markdown/syntax)

## PARAGRAPHS AND LINE BREAKS

A paragraph is simply one or more consecutive lines of text, separated by one or more blank lines. (A blank line is any line that looks like a blank line — a line containing nothing but spaces or tabs is considered blank.) Normal paragraphs should not be indented with spaces or tabs.

The implication of the “one or more consecutive lines of text” rule is that Markdown supports “hard-wrapped” text paragraphs. This differs significantly from most other text-to-HTML formatters (including Movable Type’s “Convert Line Breaks” option) which translate every line break character in a paragraph into a <br /> tag.

When you do want to insert a `<br/>` break tag using Markdown, you end a line with two or more spaces, then type return.

> __Nota__ : Some editors remove tralling spaces at end of lines, so be aware of configuring your editor to keep these spaces.

Yes, this takes a tad more effort to create a `<br/>`, but a simplistic “every line break is a `<br/>`” rule wouldn’t work for Markdown. Markdown’s email-style blockquoting and multi-paragraph list items work best — and look better — when you format them with hard breaks.

## HEADERS

Markdown supports two styles of headers, Setext and atx.

Setext-style headers are “underlined” using equal signs (for first-level headers) and dashes (for second-level headers). For example:

~~~
This is an H1
=============

This is an H2
-------------
~~~

Any number of underlining =’s or -’s will work.

Atx-style headers use 1-6 hash characters at the start of the line, corresponding to header levels 1-6. For example:

~~~
# This is an H1

## This is an H2

###### This is an H6
~~~

Optionally, you may “close” atx-style headers. This is purely cosmetic — you can use this if you think it looks better. The closing hashes don’t even need to match the number of hashes used to open the header. (The number of opening hashes determines the header level.) :

~~~
# This is an H1 #

## This is an H2 ##

### This is an H3 ######
~~~

## BLOCKQUOTES

Markdown uses email-style > characters for blockquoting. If you’re familiar with quoting passages of text in an email message, then you know how to create a blockquote in Markdown. It looks best if you hard wrap the text and put a > before every line:

~~~
> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
> consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
> Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.
> 
> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
> id sem consectetuer libero luctus adipiscing.
~~~

Markdown allows you to be lazy and only put the > before the first line of a hard-wrapped paragraph:

~~~
> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.

> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
id sem consectetuer libero luctus adipiscing.
~~~

will be rendered as :

> This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.

> Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
id sem consectetuer libero luctus adipiscing.

Blockquotes can be nested (i.e. a blockquote-in-a-blockquote) by adding additional levels of >:

~~~
> This is the first level of quoting.
>
> > This is nested blockquote.
>
> Back to the first level.
~~~~

and will be rendered as :

> This is the first level of quoting.
>
> > This is nested blockquote.
>
> Back to the first level.

Blockquotes can contain other Markdown elements, including headers, lists, and code blocks:

~~~
> ## This is a header.
> 
> 1.   This is the first list item.
> 2.   This is the second list item.
> 
> Here's some example code:
> 
>     return shell_exec("echo $input | $markdown_script");
~~~

The result will be :

> ## This is a header.
> 
> 1.   This is the first list item.
> 2.   This is the second list item.
> 
> Here's some example code:
> 
>     return shell_exec("echo $input | $markdown_script");

Any decent text editor should make email-style quoting easy. For example, with BBEdit, you can make a selection and choose Increase Quote Level from the Text menu.

# LISTS

Markdown supports ordered (numbered) and unordered (bulleted) lists.

Unordered lists use asterisks, pluses, and hyphens — interchangably — as list markers:

~~~
*   Red
*   Green
*   Blue
~~~

is equivalent to:

~~~
+   Red
+   Green
+   Blue
~~~

and:

~~~
-   Red
-   Green
-   Blue
~~~

Ordered lists use numbers followed by periods:

~~~
1.  Bird
2.  McHale
3.  Parish
~~~

It’s important to note that the actual numbers you use to mark the list have no effect on the HTML output Markdown produces. The HTML Markdown produces from the above list is:

~~~
<ol>
<li>Bird</li>
<li>McHale</li>
<li>Parish</li>
</ol>
~~~

If you instead wrote the list in Markdown like this:

~~~
1.  Bird
1.  McHale
1.  Parish
~~~

or even:

~~~
3. Bird
1. McHale
8. Parish
~~~~

you’d get the exact same HTML output. The point is, if you want to, you can use ordinal numbers in your ordered Markdown lists, so that the numbers in your source match the numbers in your published HTML. But if you want to be lazy, you don’t have to.

If you do use lazy list numbering, however, you should still start the list with the number 1. At some point in the future, Markdown may support starting ordered lists at an arbitrary number.

List markers typically start at the left margin, but may be indented by up to three spaces. List markers must be followed by one or more spaces or a tab.

To make lists look nice, you can wrap items with hanging indents:

~~~
*   Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
    Aliquam hendrerit mi posuere lectus. Vestibulum enim wisi,
    viverra nec, fringilla in, laoreet vitae, risus.
*   Donec sit amet nisl. Aliquam semper ipsum sit amet velit.
    Suspendisse id sem consectetuer libero luctus adipiscing.
~~~

But if you want to be lazy, you don’t have to:

~~~
*   Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
Aliquam hendrerit mi posuere lectus. Vestibulum enim wisi,
viverra nec, fringilla in, laoreet vitae, risus.
*   Donec sit amet nisl. Aliquam semper ipsum sit amet velit.
Suspendisse id sem consectetuer libero luctus adipiscing.
~~~

If list items are separated by blank lines, Markdown will wrap the items in <p> tags in the HTML output. For example, this input:

~~~
*   Bird
*   Magic
~~~~

will turn into:

~~~
<ul>
<li>Bird</li>
<li>Magic</li>
</ul>
~~~~

But this:

~~~
*   Bird

*   Magic
~~~

will turn into:

~~~
<ul>
<li><p>Bird</p></li>
<li><p>Magic</p></li>
</ul>
~~~

List items may consist of multiple paragraphs. Each subsequent paragraph in a list item must be indented by either 4 spaces or one tab:

~~~
1.  This is a list item with two paragraphs. Lorem ipsum dolor
    sit amet, consectetuer adipiscing elit. Aliquam hendrerit
    mi posuere lectus.

    Vestibulum enim wisi, viverra nec, fringilla in, laoreet
    vitae, risus. Donec sit amet nisl. Aliquam semper ipsum
    sit amet velit.

2.  Suspendisse id sem consectetuer libero luctus adipiscing.
~~~

It looks nice if you indent every line of the subsequent paragraphs, but here again, Markdown will allow you to be lazy:

~~~
*   This is a list item with two paragraphs.

    This is the second paragraph in the list item. You're
only required to indent the first line. Lorem ipsum dolor
sit amet, consectetuer adipiscing elit.

*   Another item in the same list.
~~~

To put a blockquote within a list item, the blockquote’s > delimiters need to be indented:

~~~
*   A list item with a blockquote:

    > This is a blockquote
    > inside a list item.
~~~
    
To put a code block within a list item, the code block needs to be indented twice — 8 spaces or two tabs:

~~~
*   A list item with a code block:

        <code goes here>
~~~
        
It’s worth noting that it’s possible to trigger an ordered list by accident, by writing something like this:

~~~
1986. What a great season.
~~~

In other words, a number-period-space sequence at the beginning of a line. To avoid this, you can backslash-escape the period:

~~~
1986\. What a great season.
~~~


