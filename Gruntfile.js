module.exports = function(grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mocha');

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
        src: ['src/<%= pkg.name %>.js'],
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

  grunt.registerTask('test', ['jshint', 'connect', 'mocha']);
  grunt.registerTask('build', ['test', 'concat', 'replace-version', 'uglify']);
  grunt.registerTask('default', ['test', 'watch']);
};
