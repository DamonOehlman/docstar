Getting Started
===============

Getting started with DocStar is simple.  Firstly install it using NPM::

	npm install -g docstar

Once installed you should then be able to run it from the command-line.  For example, running ``docstar --help`` should yield something like::

	Usage: docstar [options]

	Options:

	  -h, --help         output usage information
	  -V, --version      output the version number
	  -p, --path [path]  Target output path (default to current directory)

OK, so given you have docstar installed and available, the first thing to do is to scaffold a sphinx docs directory for your project.  The process I would recommend is:

1.  Change to your node project folder (i.e. the folder that has a ``package.json`` for the project).  DocStar takes care of a few things like keeping configs in sync through working with your package.json file.

2.  Create a new boilerplate config with the following command::

	docstar config create

If this is a new project, then a docs folder will be created, and a template ``conf.py`` file dropped into that folder.  Additionally, the config will be synchronized with data (version, author, name) from your package.json file.
