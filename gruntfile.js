module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      main: {
        files: ['src/less/**', 'src/*.html', 'src/js/*.js'],
        tasks: ['build']
      }
    },

    'ftp-deploy': {
      main: {
        auth: {
          host: 'freakzero.com',
          port: 21,
          authKey: 'frk0'
        },
        src: 'build',
        dest: 'www/home',
        exclusions: ['build/**/Thumbs.db']
      }
    },

    less: {
      main: {
        options: {
          sourceMap: true,
          sourceMapFilename: 'build/website/style/style.css.map',
        },

        files: {
          'build/website/style/style.css': 'src/less/style.less'
        }
      }
    },

    browserSync: {
      dev: {
        bsFiles: {
          src: [
            'build/website/*.html',
            'build/website/style/style.min.css'
          ]
        },
        options: {
          proxy: "localhost:8080",
          watchTask: true
        }
      }
    },

    autoprefixer: {
      main: {
        options: {
          map: true,
          browsers: ['last 2 versions', 'ie 9']
        },

        src: 'build/website/style/style.css',
        dest: 'build/website/style/style.css'
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [
          'src/js/jquery.min.js',
          'src/js/wow.js',
          'src/js/transformicon.js',
          'src/js/fss.js',
          'src/js/main.js',
          'src/js/header.js'
        ],
        dest: 'build/website/build.js',
      },
    },
    uglify: {
      options: {
        mangle: false
      },
      dist: {
        files: {
          'build/website/build.js': ['build/website/build.js']
        }
      }
    },
    cssmin: {
      main: {
        options: {
          keepSpecialComments: 0
        },
        files: [{
          expand: true,
          cwd: 'build/website/style',
          src: ['*.css', '!*.min.css'],
          dest: 'build/website/style',
          ext: '.min.css'
        }]
      }
    },

    copy: {
      main: {
        expand: true,
        cwd: 'src/',
        src: ['*.html', '*.ico'],
        dest: 'build'
      },

      scripts: {
        expand: true,
        cwd: 'src/scripts',
        src: ['**/*.*'],
        dest: 'build/website'
      },
      
      assets: {
        expand: true,
        cwd: 'src/assets',
        src: ['**'],
        dest: 'build/website/style/assets/'
      },
      fonts: {
        expand: true,
        cwd: 'src/fonts',
        src: ['**'],
        dest: 'build/website/style/fonts/'
      }
    }
  });

  // Plugins
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-ftp-deploy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('build', ['cssbuild', 'copy', 'concat', 'uglify']);
  grunt.registerTask('cssbuild', ['less', 'autoprefixer', 'cssmin']);
  grunt.registerTask('default', ['browserSync', 'watch']);

  grunt.registerTask('deploy', ['build', 'ftp-deploy']);

};