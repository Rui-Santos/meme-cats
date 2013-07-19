module.exports = {
    config: {
        appDir: "./tmpbuild/meme-cats",
        baseUrl: "./public/js/app/",
        dir: "./tmpbuild/build",
        //Comment out the optimize line if you want
        //the code minified by UglifyJS
        optimize: "none",

        paths: {
            jquery: "empty:",
            backbone: "empty:",
            lodash: "empty:"
        },

        mainConfigFile: './public/js/app/main.js',

        modules: [
            //Optimize the application files. jQuery is not
            //included since it is already in require-jquery.js
            {
                name: "main"
            }
        ]
    },

    configLocal: {
          options: {
          appDir: "./",
          baseUrl: "./public/js/app/",
          dir: "./tmpbuild",
          //Comment out the optimize line if you want
          //the code minified by UglifyJS
          optimize: "none",

          paths: {
          jquery: "empty:",
          backbone: "empty:",
          lodash: "empty:"
          },

          mainConfigFile: './public/js/app/main.js',

          modules: [
          //Optimize the application files. jQuery is not
          //included since it is already in require-jquery.js
          {
              name: "main"
          }
          ]
        }
      }
};