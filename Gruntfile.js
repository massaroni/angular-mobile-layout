module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    library: grunt.file.readJSON('bower.json'),
    concat: {
      options: {
        separator: ''
      },
      library: {
        options: {
          // remove all 'use strict' statements in the code
          process: function (src, filepath) {
            if (filepath !== 'src/release.prefix' && filepath !== 'src/release.suffix') {
              console.log(filepath);
              return '  // Source: ' + filepath + '\n' +
                src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1')
                  .split(grunt.util.linefeed).map(function (line) {
                    return '  ' + line;
                  }).join(grunt.util.linefeed);
            } else {
              return '// Source: ' + filepath + '\n' + src;
            }
          }
        },
        src: [
          'src/release.prefix',
          'src/release.suffix',
          'src/<%= library.name %>/**/*-module.js',
          'src/<%= library.name %>/**/*.js'
        ],
        dest: 'release/<%= library.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
        sourceMap: true
      },
      release: {
        files: {
          'release/<%= library.name %>.min.js': ['<%= concat.library.dest %>']
        }
      }
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            flatten: true,
            src: [
              'bower.json'
            ],
            dest: 'release/'
          }
        ]
      }
    },
    jshint: {
      beforeConcat: {
        src: ['gruntfile.js', '<%= library.name %>/**/*.js']
      },
      afterConcat: {
        src: [
          '<%= concat.library.dest %>'
        ]
      },
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true,
          angular: true
        },
        globalstrict: false
      }
    },
    watch: {
      options: {
        livereload: true
      },
      files: [
        'Gruntfile.js',
        'src/**/*'
      ],
      tasks: ['default']
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('default', ['jshint:beforeConcat', 'karma:unit', 'concat:library', 'jshint:afterConcat', 'copy', 'uglify']);
  grunt.registerTask('livereload', ['default', 'watch']);

};