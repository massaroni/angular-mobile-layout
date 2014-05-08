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
          'src/utils/**/*.js',
          'src/<%= library.name %>/js/**/*-module.js',
          'src/<%= library.name %>/js/**/*.js'
        ],
        dest: 'release/<%= library.name %>.js'
      },
      libraryCss: {
        src: ['.tmp/**/*.css'],
        dest: 'release/<%= library.name %>.css'
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

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: 'src/<%= library.name %>/scss',
        cssDir: '.tmp/css',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: 'src/<%= library.name %>/images',
        javascriptsDir: 'src/<%= library.name %>/js',
        fontsDir: 'src/<%= library.name %>/fonts',
        importPath: 'bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      release: {
        options: {
          generatedImagesDir: 'release/images/generated'
        }
      }
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: '.tmp/css/',
            src: '**/*.css',
            dest: '.tmp/css/'
          }
        ]
      }
    },

    cssmin: {
      combine: {
        files: {
          'release/<%= library.name %>.min.css': ['.tmp/css/**/*.css']
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
    clean: {
      release: {
        files: [
          {
            dot: true,
            src: [
              'release/*', '.tmp/*'
            ]
          }
        ]
      }
    },
    jshint: {
      beforeConcat: {
        src: ['gruntfile.js', '<%= library.name %>/js/**/*.js']
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
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('default',
    ['clean:release',
     'jshint:beforeConcat',
     'karma:unit',

      // css
      'compass:release',
      'autoprefixer',
      'concat:libraryCss',
      'cssmin',

      'concat:library',
      'jshint:afterConcat',
      'copy',
      'uglify']);
  grunt.registerTask('livereload', ['default', 'watch']);

};