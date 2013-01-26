#!/usr/bin/env node

var exec = require('child_process').exec,
    fail = '\x1B[31mfailed!\x1B[39m',
    ok = '\x1B[32mok\x1B[39m',
    path,
    notfound = '\x1B[33mn/a\x1B[39m (no script found)',
    
    gitRoot = exec('git rev-parse --show-toplevel');

gitRoot.stdout.on('data', function (data) {
    path = data.toString().trim();
    init();
});

gitRoot.stderr.on('data', function(error){
    if (error) {
        console.log('failed to find git root');
        process.exit(1);
    }
});

// stash
exec('git stash -q --keep-index', { cwd: path });

function init(){

    var files = exec('git diff-index --cached HEAD --name-only');

    files.stdout.on('data', function(data){
        var fileArr = data.toString().trim().split(/\r\n|\r|\n/);

        fileArr.forEach(function(file){
            if(file.match(/.js$/)){
                runJshint(file);
            }
        });
    });

    files.stderr.on('data', function(data){
        console.log(data.toString());
    });    
}

function clearStash(callback){
    var clear = exec('git stash drop');

    clear.stdout.on('data', function(data){
        callback();
    });

    clear.stderr.on('data', function(data){
        callback();
    });    
}

function runJshint(file) {

    var jsHintConf = path + '/jshintconf.json',
        jsHint = exec('jshint --config ' + jsHintConf + ' ' + path+'/'+file, { cwd: path }),
        errors = 0;

    // js errors
    jsHint.stdout.on('data', function (data) {
        var lines = data.toString().trim().split(/\r\n|\r|\n/),
            errorCount = lines.length;

            errors = errorCount;

            console.error(data.toString());
            console.error(fail+': Commit aborted, fix js errors listed above');
            clearStash(function(){
                process.exit(1);
            });

    });

    // jshint error
    jsHint.stderr.on('data', function(data){
        console.log('errors');
        console.log('jshint: ' + fail);
        errors = 1;
        clearStash(function(){
            process.exit(1);
        });
    });

    // no errors file passed validation
    jsHint.on('exit', function(code){
        if(!errors){
            console.log('jshint: ' + ok + ' - ' + file);
            clearStash(function(){
                process.exit(0);
            });
        }
    });

}

console.log('running pre-commit checks...');