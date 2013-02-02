wheres-my-stuff
===============

[![Build Status](https://secure.travis-ci.org/jsturgis/wheres-my-stuff.png)](http://travis-ci.org/jsturgis/wheres-my-stuff)

##installation

1. install nodejs or update to latest:
	http://nodejs.org/

2. git clone the project:
	https://github.com/jsturgis/wheres-my-stuff

3. switch to dev branch "git checkout development"

4. run "npm install" from the terminal

5. run "git submodule init" from the terminal

6. run "git submodule update" from the terminal

7. for the auth to work you will need to edit your /etc/hosts file and add:
	127.0.0.1	dev.jsturgis.wheres-my-stuff.jit.su

8. cp pre-commit.sh .git/hooks/pre-commit & chmod 755 .git/hooks/pre-commit

9. sudo npm install jshint -g

##Start the app

node app.js