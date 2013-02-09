wheres-my-stuff
===============

[![Build Status](https://secure.travis-ci.org/jsturgis/wheres-my-stuff.png)](http://travis-ci.org/jsturgis/wheres-my-stuff)

##installation

1. install nodejs or update to latest:
	http://nodejs.org/

2. copy the env.json file to the config folder (request from jeff or pat)

3. git clone the project:
	https://github.com/jsturgis/wheres-my-stuff --recursive

4. switch to dev branch "git checkout development"

5. run "npm install" from the terminal

6. for the auth to work you will need to edit your /etc/hosts file and add:
	127.0.0.1	dev.jsturgis.wheres-my-stuff.jit.su

7. cp pre-commit.sh .git/hooks/pre-commit && chmod 755 .git/hooks/pre-commit

8. sudo npm install -g jshint

9. sudo npm install -g grunt-cli

10. (windows only) from windows run grunt jshint before committing and fix any errors, all other OS will do this automatically via a pre-commit hook.

##Start the app

node app.js

##To lint and run tests

grunt test

##To build locally

grunt requirejs:buildLocal

this will build to the tmpbuild dir, after testing you should run grunt exec:clean to remove the dir or delete it manually.