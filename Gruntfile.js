module.exports = function(grunt) {
    // load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: {
                src: ['app/**/*.js']
            }
        },
        browserify: {
            js: {
                src: [
                    'app/templates/*.hbs',
                    'app/index.js',
                    'app/js/**/*.js'
                ],
                dest: './bundle.js'
            },
            options: {
                transform: ['hbsfy']
            }
        },
        uglify: {
            bundle : {
                options : {
                    sourceMap : true,
                    sourceMapName : 'sourceMap.map'
                },
                src : './bundle.js',
                dest : './bundle.js'
            }
        },
        cssmin: {
            dist: {
                options: {
                    banner: '/*! MyLib.js 1.0.0 | Aurelio De Rosa (@AurelioDeRosa) | MIT Licensed */'
                },
                files: {
                    'app/assets/css/style.min.css': ['app/assets/css/**/*.css']
                }
            }
        },
        watch: {
            files: [ "app/**/*.js","app/**/**/*.js", "app/templates/**.hbs"],
            tasks: [ 'jshint', 'browserify' ]
        },
        browserSync: {
            dev: {
                files: {
                    src : [
                        'app/assets/*.css',
                        '*.hbs',
                        '*.js'
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: "./"
                    }
                }
            }
        }
    });

    grunt.registerTask('setup', ['cssmin']);
    grunt.registerTask('default', ['jshint', 'browserify', 'browserSync', 'watch']);
    grunt.registerTask('syncwithcss', ['jshint', 'browserify', 'cssmin', 'browserSync', 'watch']);
    grunt.registerTask('build', ['jshint', 'browserify', 'cssmin', 'uglify' ]);
};