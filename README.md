meme-cats
===============

[![Build Status](https://api.travis-ci.org/jsturgis/meme-cats.png?branch=development)](https://api.travis-ci.org/jsturgis/meme-cats.png?branch=development)

##installation

1. install the latest nodejs:
    [Nodejs](http://nodejs.org/ "Nodejs")

2. copy the env.json file to the config folder (must be requested from a contributor)
```shell
cp env.json ./config/env.json
```

3. Clone the project:
```shell
git clone https://github.com/jsturgis/meme-cats --recursive
```

4. Install NPM
```shell
npm install
```

5. for the auth to work you will need to edit your /etc/hosts file and add:
    127.0.0.1   dev.jsturgis.meme-cats.jit.su

6. Copy the precommit file to the git hook dir
```shell
cp pre-commit.sh .git/hooks/pre-commit && chmod 755 .git/hooks/pre-commit
```

7. install global node modules
```shell
sudo npm install -g jshint && sudo npm install -g grunt-cli
```

8. (windows only) from windows run grunt jshint before committing and fix any errors, all other OS will do this automatically via a pre-commit hook.

##Start the app
```shell
node app
```

##To lint and run tests
```shell
grunt test
```

##To build locally
```shell
grunt buildLocal
```

this will build to the tmpbuild dir, after testing you should remove the dir or delete it manually.
```shell
grunt clean
```
