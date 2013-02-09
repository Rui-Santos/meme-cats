wheres-my-stuff
===============

[![Build Status](https://secure.travis-ci.org/jsturgis/wheres-my-stuff.png)](http://travis-ci.org/jsturgis/wheres-my-stuff)

##installation

1. install nodejs or update to latest:
	http://nodejs.org/

2. copy the env.json file to the config folder

3. git clone the project:
	https://github.com/jsturgis/wheres-my-stuff --recursive

4. switch to dev branch "git checkout development"

5. run "npm install" from the terminal

6. for the auth to work you will need to edit your /etc/hosts file and add:
	127.0.0.1	dev.jsturgis.wheres-my-stuff.jit.su

7. cp pre-commit.sh .git/hooks/pre-commit & chmod 755 .git/hooks/pre-commit

8. sudo npm install jshint -g

##Start the app

node app.js