var lintConfNode = require('./build/config/jshintconf.json'),
    lintConfBrowser = require('./build/config/jshintbrowserconf.json'),
    requirejsConfig = require('./build/config/requirejs.config');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    connect: {
        test : {
          port : 8000,
          base: '.'
        }
    },
    jshint: {
      node: {
        options: lintConfNode,
        files: {
          src: ['lib/**/*.js', 'middleware/**/*.js', 'models/*.js', 'routes/*.js', 'app.js', 'test/*.js', 'build/**/*.js']
        }
      },
      browser: {
        options: lintConfBrowser,
        files: {
          src: ['public/js/**/*.js', 'public/js/*.js']
        }
      }
    },
    jasmine: {
      wms: {
        src: 'public/js/app/**/*.js',
        options: {
          specs: 'test/client_specs/**/*.spec.js',
          host: 'http://127.0.0.1:<%= connect.test.port %>/',
          template: require('grunt-template-jasmine-requirejs'),
          templateOptions: {
            requireConfig : {
                baseUrl: "./public/js/app/"
            }
          }
        }
      }
    },
    nodeunit: {
      all: ['test/*.js']
    },
    requirejs: {
      compile: {
        options: requirejsConfig.config
      },
      compileLocal: requirejsConfig.configLocal
    },
    exec: {
      tmpClone: {
        command: 'mkdir ./tmpbuild && cd ./tmpbuild && git clone https://github.com/jsturgis/wheres-my-stuff.git --recursive',
        stdout: true,
        stderr: true
      },
      deploy: {
        command: 'cd ./tmpbuild/build && jitsu deploy --confirm --raw',
        stdout: true,
        stderr: true
      },
      clean: {
        command: 'rm -rf ./tmpbuild',
        stdout: true,
        stderr: true
      }
    }
  });

  // register tasks
  grunt.registerTask('default', ['jshint', 'test']);
  grunt.registerTask('test', ['jshint', 'connect', 'jasmine:wms', 'nodeunit:all']);
  grunt.registerTask('deploy', ['exec:clean', 'test', 'exec:tmpClone', 'requirejs', 'exec:deploy', 'exec:clean']);
  grunt.registerTask('buildLocal', ['exec:clean', 'test','requirejs:compileLocal']);

  // load plugins
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-exec');

};