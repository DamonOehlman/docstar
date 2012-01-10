Work Smarter, Not Harder
========================

**Fact 1:** I hate doing anything twice, that could have been done once and automated.
**Fact 2:** See fact one.

It's not uncommon to have to duplicate information within your documentation that is already contained elsewhere in either your code or application meta-data.  Docstar aims to reduce this duplication of information as much as possible, in a variety of ways.

Synchronize package.json with docs config
-----------------------------------------

Certain information in your Sphinx generated documentation comes from placeholders that are defined in your ``conf.py`` file.  In addition to being able to scaffold an initial ``conf.py`` file, docstar can also keep this file in sync with your ``package.json`` file.

Simply run the following command within your Node.js project directory::

	docstar sync
	
This will update particular pieces of information in configuration file.  At this stage the following information is taken from your ``package.json`` file and placed in your ``conf.py`` file:

- package name => project
- package author(s) => copyright
- package version => version & release