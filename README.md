meme-cats
===============

[![Build Status](https://secure.travis-ci.org/jsturgis/meme-cats.png)](http://travis-ci.org/jsturgis/meme-cats)

##installation

1. install nodejs or update to latest:
	http://nodejs.org/

2. copy the env.json file to the config folder (request from jeff or pat)

3. git clone the project:
	https://github.com/jsturgis/meme-cats --recursive

4. run "npm install" from the terminal

5. for the auth to work you will need to edit your /etc/hosts file and add:
	127.0.0.1	dev.jsturgis.meme-cats.jit.su

6. cp pre-commit.sh .git/hooks/pre-commit && chmod 755 .git/hooks/pre-commit

7. '''shell
	sudo npm install -g jshint
	'''

8. sudo npm install -g grunt-cli

9. (windows only) from windows run grunt jshint before committing and fix any errors, all other OS will do this automatically via a pre-commit hook.

##Start the app

node app.js

##To lint and run tests

grunt test

##To build locally

grunt requirejs:buildLocal

this will build to the tmpbuild dir, after testing you should run grunt exec:clean to remove the dir or delete it manually.