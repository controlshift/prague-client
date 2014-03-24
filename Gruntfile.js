module.exports = function(grunt) {
 
  // configure the tasks
  grunt.initConfig({
    env: {
      production: 'config/production.json',
      staging: 'config/staging.json'
    },

    copy: {
      build: {
        cwd: 'src',
        src: [ '**', '!**/*.scss', '!**/*.coffee' ],
        dest: 'build',
        expand: true
      },

      jasmine: {
        cwd: 'spec',
        src: [ 'jasmine-2.0.0/**', 'SpecRunner.html' ],
        dest: 'build',
        expand: true
      }
    },

    clean: {
      build: {
        src: [ 'build' ]
      },
      stylesheets: {
        src: [ 'build/**/*.css', '.sass-cache', '!build/jquery.donations.css' ]
      },
      scripts: {
        src: [ 'build/**/*.js', '!build/jquery.donations.js', '!build/jquery.donations.loader.js', '!build/jquery.donations.test.js', '!build/spec.js', '!build/features.js' ]
      },
    },

    sass: {
      build: {
        options: {
          compress: false
        },
        files: [{
          expand: true,
          cwd: 'src',
          src: [ '**/*.scss' ],
          dest: 'build',
          ext: '.css'
        }]
      }
    },

    cssmin: {
      build: {
        files: {
          'build/jquery.donations.css': [ 'build/**/*.css' ]
        }
      }
    },

    coffee: {
      spec: {
        expand: true,
        cwd: 'spec',
        src: [ '**/*spec.coffee' ],
        dest: 'build',
        ext: '.js'
      },
      features: {
        expand: true,
        cwd: 'features',
        src: [ '**/*feature.coffee' ],
        dest: 'build',
        ext: '.js'
      },
      build: {
        expand: true,
        cwd: 'src',
        src: [ '**/donations-form.coffee' ],
        dest: 'build',
        ext: '.js'
      },
      buildTest: {
        options: {
          bare: true
        },
        expand: true,
        cwd: 'src',
        src: [ '**/donations-form.coffee' ],
        dest: 'build',
        ext: '.js'
      },
      loader: {
        expand: true,
        cwd: 'src',
        src: [ '**/donations-loader.coffee' ],
        dest: 'build',
        ext: '.js'
      }
    },

    uglify: {
      spec: {
        options: {
          mangle: false
        },
        files: {
          'build/spec.js' : [ 'build/**/*spec.js' ]
        }
      },
      features: {
        options: {
          mangle: false
        },
        files: {
          'build/features.js' : [ 'build/**/*feature.js' ]
        }
      },
      build: {
        options: {
          mangle: { toplevel: false }
        },
        files: {
          'build/jquery.donations.js': [ 'build/**/jquery.payment.js', 'build/**/form2js.js', 'build/**/*.js', '!build/**/*spec.js', '!build/**/*feature.js', '!build/**/*features.js', '!build/**/donations-loader.js' ]
        }
      },
      buildTest: {
        options: {
          mangle: false
        },
        files: {
          'build/jquery.donations.test.js': [ 'build/**/jquery.payment.js', 'build/**/form2js.js', 'build/**/*.js', '!build/**/*spec.js', '!build/**/*feature.js', '!build/**/*features.js', '!build/**/jquery.donations.js', '!build/**/donations-loader.js' ]
        }
      },
      loader: {
        options: {
          mangle: { toplevel: true }
        },
        files: {
          'build/jquery.donations.loader.js': [ 'build/**/donations-loader.js' ]
        }
      }
    },

    watch: {
      stylesheets: {
        files: 'src/**/*.scss',
        tasks: [ 'stylesheets' ]
      },
      scripts: {
        files: 'src/**/*.coffee',
        tasks: [ 'scripts' ]
      },
      copy: {
        files: [ 'src/**', '!src/**/*.scss', '!src/**/*.coffee' ],
        tasks: [ 'copy' ]
      }
    },

    connect: {
      server: {
        options: {
          port: 4000,
          base: 'build',
          hostname: '*'
        }
      }
    },

    ver: {
      myapp: {
        phases: [
          {
            files: [
              'build/jquery.donations.js',
              'build/jquery.donations.css'
            ]
          }
        ],
        versionFile: 'build/version.json'
      }
    },

    replace: {
      dist: {
        options: {
          patterns: [
            {
              match: "jquery.donations.js",
              replacement: "<%= vconfig['jquery.donations.js'] %>"
            },
            {
              match: "jquery.donations.css",
              replacement: "<%= vconfig['jquery.donations.css'] %>"
            }
          ],
          usePrefix: false
        },
        files: [
          {
            src: ['build/jquery.donations.loader.js'], 
            dest: 'build/jquery.donations.loader.js'
          }
        ]
      }
    },

    s3: {
      options: {
        key: '<%= config.aws.key %>',
        secret: '<%= config.aws.secret %>',
        bucket: '<%= config.aws.bucket %>',
        access: 'public-read',
        headers: {
          // Two Year cache policy (1000 * 60 * 60 * 24 * 730)
          "Cache-Control": "max-age=630720000, public",
          "Expires": new Date(Date.now() + 63072000000).toUTCString()
        }
      },
      dev: {
        // These options override the defaults
        options: {
          encodePaths: true,
          maxOperations: 20
        },
        // Files to be uploaded.
        upload: [

          {
            src: 'build/img/*',
            dest: ''
          },

          {
            src: 'build/jquery.donations.*.js',
            dest: ''
          },

          {
            src: 'build/jquery.donations.*.css',
            dest: ''
          }
        ]
      }

    }

  });
 
  // load the tasks
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-s3');
  grunt.loadNpmTasks('grunt-ver');
  grunt.loadNpmTasks('grunt-replace');
 
  // define the tasks
  
  grunt.registerTask(
    'deploy-production', 
    'Deploys the code to production', 
    ['env:production', 's3']
  );

  grunt.registerTask(
    'stylesheets', 
    'Compiles the stylesheets.', 
    [ 'sass', 'cssmin', 'clean:stylesheets' ]
  );

  grunt.registerTask(
    'scripts', 
    'Compiles the JavaScript files.', 
    [ 'coffee', 'uglify', 'clean:scripts' ]
  );

  grunt.registerTask(
    'build', 
    'Compiles all of the assets and copies the files to the build directory.', 
    [ 'clean:build', 'copy:build', 'stylesheets', 'scripts', 'copy:jasmine', 'ver', 'versionread', 'replace' ]
  );

  grunt.registerTask(
    'default', 
    'Watches the project for changes, automatically builds them and runs a server.', 
    [ 'build', 'connect', 'watch' ]
  );

  grunt.registerMultiTask('env', 'Set Environment.', function() {
    var envConfig = grunt.config.get('env.' + this.target)
    grunt.log.writeln('In ' + this.target + ' mode. Config file: ' + envConfig);
    if(grunt.file.exists(envConfig)) {
      grunt.config.set('config', grunt.file.readJSON(envConfig));
    }
  });

  grunt.registerTask('versionread', function() {
    grunt.config.set('vconfig', grunt.file.readJSON('build/version.json'));
  });


};