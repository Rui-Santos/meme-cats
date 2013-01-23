wheres-my-stuff
===============


##installation

Get the .env file then:

1. install nodejs or update to latest:
	http://nodejs.org/

2. Install Heroku toolbelt

3. git clone the project:
	https://github.com/jsturgis/wheres-my-stuff

4. open .env and change NODE_ENV to:
	NODE_ENV=development

5. run "npm install" from the terminal

6. run "git submodule init" from the terminal

7. run "git submodule update" from the terminal

8. for the auth to work you will need to edit your /etc/hosts file and add:
	127.0.0.1	dev.secure-temple-6054.herokuapp.com