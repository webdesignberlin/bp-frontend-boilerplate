module.exports = function(grunt) {
    'use strict';


    /* + Global Project Vars */
    // Usage: <%= globalConfig.var %>
    var globalConfig = {
        root: '.',
        temp: 'web/assets-temp',
        src:  'web/assets-dev',
        dest: 'web/assets'
    };
    /* = Global Project Vars */

    /* + Preparation */
    require('load-grunt-tasks')(grunt); // Load all grunt tasks matching the `grunt-*` pattern
    grunt.util.linefeed = '\n'; // Force use of Unix newlines
    /* = Preparation */


    /* + Project Configuration */
    grunt.initConfig({
        globalConfig: globalConfig, // include Global Config
        pkg: grunt.file.readJSON('package.json'), // Get NPM data

        /* + Task Config: Clean */
        clean: {
            deps: [
            ]
        },
        /* = Task Config: Clean */

        /* + Task Config: Copy dependency files */

        copy: {

            // local jquery
            jquery: {
                expand: true,
                src: '<%= globalConfig.root %>/bower_components/jquery/dist/*',
                dest: '<%= globalConfig.dest %>/js/vendor/jquery/',
                flatten: true
            }

        },

        /* + Task config: Update json */

        update_json: {
            bower: {
                src: 'package.json',
                dest: 'bower.json',
                fields: [
                    'name',
                    'version'
                ]
            }
        },

        /* + Task Config: Concatenation */
        concat: {
        },

        /* + Task Config: SASS */
        sass: {
            options : {
                precision: 10,
                sourcemap: true,
                trace: true,
                unixNewlines: true,
                cacheLocation: '<%= globalConfig.root %>/.sass-cache'
            },
            styles: {
                files: {
                    '<%= globalConfig.temp %>/css/main.css':
                        '<%= globalConfig.src %>/css/*.scss'
                }
            }
        },

        /* + Task Config: Autoprefixer */
        autoprefixer: {
            options: {
                browsers: [ // @https://github.com/ai/autoprefixer#browsers
                    'last 2 versions'
                ],
                map: false // not supported by cssmin
            },
            styles: {
                src: '<%= globalConfig.temp %>/css/main.css'
            }
        },
        /* = Task Config: Autoprefixer */


        /* + Task Config: CSSMin */
        cssmin: {
            // SourceMaps maybe with 2.1: https://github.com/GoalSmashers/clean-css/issues/125
            styles: {
                files: {
                    '<%= globalConfig.dest %>/css/main.min.css': [
                        '<%= globalConfig.temp %>/css/main.css'
                    ]
                }
            }
        },
        /* = Task Config: CSSMin */


        /* + Task Config: JSHint */
        jshint: {
            options: {
                'indent'   : 4,
                'quotmark' : 'single'
            },
            scripts: {
                src: '<%= globalConfig.src %>js/main.js'
            }
        },
        /* = Task Config: JSHint */


        /* + Task Config: Uglify */
        uglify: {
            options: {
                sourceMap: true,
                sourceMapName: '<%= globalConfig.temp %>/js/main.js.map',
                sourceMapIncludeSources: true
            },
            scripts: {
                files: {
                    '<%= globalConfig.dest %>/js/main.min.js': [
                        '<%= globalConfig.src %>/js/main.js'
                    ]
                },
            }
        },
        /* = Task Config: Uglify */


        /* + Task Config: Watch */
        watch: {
            options: {
                livereload: false
            },
            json: {
                files: [
                    'package.json'
                ],
                tasks: [
                    'build-json'
                ]
            },
            styles: {
                files: [
                    '<%= globalConfig.src %>/css/*.scss',
                    '<%= globalConfig.src %>/css/**/*.scss',
                    '<%= globalConfig.src %>/css/*.css',
                    '<%= globalConfig.src %>/css/**/*.css'
                ],
                tasks: [
                    'build-css'
                ]
            },
            scripts: {
                files: [
                    '<%= globalConfig.src %>/js/*.js',
                    '<%= globalConfig.src %>/js/**/*.js'
                ],
                tasks: [
                    'build-js'
                ]
            },
            grunt: {
                files: [
                    'Gruntfile.js'
                ],
                tasks: [
                    'jshint:grunt'
                ]
            }
        },

    });

    /* + Custom Tasks */

    grunt.registerTask( 'copy-deps', [
        // 'clean:deps',
        'copy'
    ]);
    grunt.registerTask( 'build-css', [
        // 'clean:css',
        'sass',
        'autoprefixer',
        'cssmin'
    ]);
    grunt.registerTask( 'build-js', [
        // 'clean:js',
        'jshint:scripts',
        'uglify'
    ]);
    grunt.registerTask( 'build', [
        'update_json:bower',
        'copy-deps',
        'build-css',
        'build-js'
    ]);
    grunt.registerTask( 'default', [
        'build'
    ]);

};
