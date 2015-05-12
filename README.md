Search With Categorization
==========================

Search bar with suggestions that categorizes the results.
The category bar will float along with the scroll to maintain the context for users.

<img src="https://raw.githubusercontent.com/Kyeo1983/Search_With_Categorization/master/sample/screenshot.jpg"/>



Demo
=====
See a demo <a href="http://codepen.io/Kyeo1983/full/yohbs" target="_blank">here</a>.



Usage
======

Add this HTML &lt;div&gt; to your page:     &lt;div class="searchform"&gt;&lt;/div&gt;
And import search.css and search.js for the searchbar to initialise.



Getting Started
===============

Data returned to the search bar is assumed to be JSON with 3 properties in each item: key, description and type.
The returned data should already be sorted by type so that categorization will not repeat (i.e. all grouped together if similar type).
key is the value to work with upon select.
description is the label to show on the searchbar's results.



Customization
==============

Handle your own data source at the search.js's _search function.
Handle your own click/select event at the search.js's _select function.
Feel free to change the css for different look and feel.
