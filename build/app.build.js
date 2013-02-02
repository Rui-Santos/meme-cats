var config = {
    appDir: "../public",
    baseUrl: "js/app/",
    dir: "../../build",
    //Comment out the optimize line if you want
    //the code minified by UglifyJS
    optimize: "none",

    paths: {
        jquery: "empty:",
        backbone: "empty:",
        lodash: "empty:"
    },

    mainConfigFile: '../public/js/app/main.js',

    modules: [
        //Optimize the application files. jQuery is not
        //included since it is already in require-jquery.js
        {
            name: "main"
        }
    ]
},

requirejs = require('requirejs');

requirejs.optimize(config, function (/*buildResponse*/) {
    //buildResponse is just a text output of the modules
    //included. Load the built file for the contents.
    //Use config.out to get the optimized file contents.
    //var contents = fs.readFileSync(config.out, 'utf8');

}, function(/*err*/) {
    //optimization err callback
});