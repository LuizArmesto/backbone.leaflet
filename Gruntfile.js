module.exports = function(grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);

  var PORT = 8899;

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
      '* <%= pkg.name %>\n' +
      '* v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* (c) <%= pkg.author.name %>;' +
      ' <%= _.pluck(pkg.licenses, "type").join(", ") %> License\n' +
      //'* Created by: <%= _.pluck(pkg.maintainers, "name").join(", ") %>\n' +
      //'* Contributors: <%= _.pluck(pkg.contributors, "name").join(", ") %>\n' +
      '*/\n\n',
    connect: {
      server: {
        options: {
          port: PORT,
          base: '.'
        }
      }
    },
    jshint: {
      all: {
        options: {
          jshintrc: '.jshintrc'
        },
        files: {
          src: [
            'src/**/*.js',
            'test/**/*.js'
          ]
        }
      }
    },
    concat: {
      options: {
        stripBanners: true,
        banner: '<%= banner %>'
      },
      dist: {
        src: ['dist/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js',
      },
    },
    uglify: {
      options: {
        // the banner is inserted at the top of the output
        banner: '<%= banner %>'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    yuidoc: {
      compile: {
        name: "<%= pkg.name %>",
        description: "<%= pkg.description %>",
        version: "<%= pkg.version %>",
        url: "<%= pkg.homepage %>",
        options: {
          paths: [ "src" ],
          outdir: "docs",
          parseOnly: true
        }
      }
    },
    mocha: {
      all: {
        options: {
          urls: ['http://localhost:<%= connect.server.options.port %>/test/test.html'],
          run: true,
          mocha: {
          }
        }
      }
    },

    preprocess: {
      dist: {
        src: 'src/build/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.js'
      }
    },

    watch: {
      files: [
        'src/**/*.js',
        'test/**/*.js'
      ],
      tasks: ['test']
    }
  });

  grunt.registerTask('replace-version', 'replace the version placeholder in backbone.leaflet.js', function() {
    var pkg = grunt.config.get('pkg');
    var filename = 'dist/' + pkg.name + '.js';
    var content = grunt.file.read(filename);
    var rendered = grunt.template.process(content, { pkg : pkg });
    grunt.file.write(filename, rendered);
  });

  grunt.registerTask('verify-bower', function () {
    if (!grunt.file.isDir('./bower_components')) {
      grunt.fail.warn('Missing bower components. You should run `bower install` before.');
    }
  });

  grunt.registerTask('test', ['verify-bower', 'jshint', 'connect', 'mocha']);
  //grunt.registerTask('build', ['test', 'preprocess', 'concat', 'replace-version', 'uglify']);
  grunt.registerTask('build', ['preprocess', 'concat', 'replace-version', 'uglify']);
  grunt.registerTask('default', ['test', 'watch']);
};
