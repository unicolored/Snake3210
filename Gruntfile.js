// matching one level down:
// 'test/spec/{,*/}*.js'
// recursively match all subfolders:
// 'test/spec/**/*.js'
module.exports = function( grunt ) {
    'use strict';
    // Module qui affiche le temps d'éxécution de chaque tâche.
    // Utile pour détecter des anomalies et vérifier la performance des tâches.
    require( 'time-grunt' )( grunt );
    var mozjpeg = require( 'imagemin-mozjpeg' );
    // Config
    grunt.initConfig( {
        /*************************************************************************************************************************************************/
        pkg: grunt.file.readJSON( 'package.json' ),
        //////////// Project settings
        gh: {
            /* VARIABLES DU PROJET */
            app: require( './bower.json' ).appPath || '',
            themename: 'Snake3210',
            themeuri: 'https://www.gilleshoarau.com/apps/Snake3210/',
            themeauthor: 'Gilles Hoarau',
            themeauthoruri: 'https://www.gilleshoarau.com',
            themetemplate: 'Bootstrap',
            themetextdomain: '',
            /* PATHS */
            distPath: 'dist/',
            distCsspath: 'dist/css/',
            distJspath: 'dist/js/',
            distImgpath: 'dist/img/',
            /**/
            devPath: 'dev/',
            devCsspath: 'dev/css/',
            devJspath: 'dev/js/',
            devLesspath: 'dev/less/',
            devImgpath: 'dev/img/',
            /**/
            logspath: 'changelogs/',
            libspath: 'bower_components/',
            sslpath: 'ssl/',
            temppath: 'tmp/',
            testpath: 'test/',
            /**/
            /* ASSETS */
            htmlAssets: [ '<%= gh.distPath %>index.html', '<%= gh.distPath %>dev.html' ],
            fontAssets: [ '<%= gh.temppath %>fonts/font1.css', '<%= gh.temppath %>fonts/font2.css', '<%= gh.temppath %>fonts/font3.css' ],
            jsAssets: [ '<%= gh.devJspath %>totoro.js', '<%= gh.devJspath %>angular/*.js' ],
            jsScripts: [ '<%= gh.devJspath %>scripts/analytics.js' ],
            iconAssets: ''
        },
        humans_txt: {
            external_file: {
                options: {
                    intro: "Bonjour, ça va ?",
                    commentStyle: 'u',
                    content: grunt.file.readJSON( 'humans.json' ),
                    includeUpdateIn: 'string',
                },
                dest: '<%= gh.distpath %>humans.txt',
            },
        },
        /*
        ########   ## ##       ######  ##     ## ########  ##
        ##         ## ##      ##    ## ##     ## ##     ## ##
        ##       #########    ##       ##     ## ##     ## ##
        ######     ## ##      ##       ##     ## ########  ##
        ##       #########    ##       ##     ## ##   ##   ##
        ##         ## ##      ##    ## ##     ## ##    ##  ##
        ########   ## ##       ######   #######  ##     ## ########
        */
        // DEBUG // BACKGROUND
        curl: {
            fonts1: {
                dest: '<%= gh.devCsspath %>font1.css',
                src: 'https://fonts.googleapis.com/css?family=VT323'
            },
            ga: {
                dest: '<%= gh.devJspath %>tmp/analytics.js',
                src: 'https://www.google-analytics.com/analytics.js'
            }
        },
        /*
        ##          ###     ######   ######  ######## ########  ######
        ##         ## ##   ##    ## ##    ## ##          ##    ##    ##
        ##        ##   ##  ##       ##       ##          ##    ##
        ##       ##     ##  ######   ######  ######      ##     ######
        ##       #########       ##       ## ##          ##          ##
        ##       ##     ## ##    ## ##    ## ##          ##    ##    ##
        ######## ##     ##  ######   ######  ########    ##     ######
        */
        /*
        ########   ## ##       ######   ######   ######
        ##         ## ##      ##    ## ##    ## ##    ##
        ##       #########    ##       ##       ##
        ######     ## ##      ##        ######   ######
        ##       #########    ##             ##       ##
        ##         ## ##      ##    ## ##    ## ##    ##
        ########   ## ##       ######   ######   ######
        */
        /*************************************************************************************************************************************************/
        // GENERATION DU CSS
        less: {
            options: {
                compress: false,
                yuicompress: false,
            },
            // COMPILATION des deux fichiers .less principaux : bootstrap et style
            dev: {
                files: {
                    "<%= gh.devCsspath %>page.css": "<%= gh.devLesspath %>page.less"
                }
            }
        },
        // AUTOPREFIXER
        autoprefixer: {
            options: {
                browsers: [ 'last 2 versions', 'ie 8', 'ie 9' ]
            },
            dev: {
                src: '<%= gh.devCsspath %>page.css',
                dest: '<%= gh.devCsspath %>page.ap.css'
            },
        },
        // MINIFICATION
        cssmin: {
            style: {
                options: {
                    banner: '/*\nTheme Name: <%= gh.themename %>\nTheme URI: <%= gh.themeuri %>\nDescription: <%= pkg.description %>\nAuthor: <%= gh.themeauthor %>\nAuthorURI: <%= gh.themeauthoruri %>\nTemplate: <%= gh.themetemplate %>\nVersion: <%= pkg.version %>\nText Domain: <%= gh.themetextdomain %>\n*/'
                },
                files: {
                    "<%= gh.distPath %>page.css": [ "<%= gh.devCsspath %>font1.css", "<%= gh.devCsspath %>page.ap.css" ]
                }
            }
        },
        /*
        ########   ## ##            ##  ######
        ##         ## ##            ## ##    ##
        ##       #########          ## ##
        ######     ## ##            ##  ######
        ##       #########    ##    ##       ##
        ##         ## ##      ##    ## ##    ##
        ########   ## ##       ######   ######
        */
        /*************************************************************************************************************************************************/
        // NORMALISE le code pour un développement plus aisé
        jsbeautifier: {
            options: {
                js: {
                    spaceInParen: true,
                    wrapLineLength: 0,
                    preserveNewlines: false,
                    keepArrayIndentation: true,
                    keepFunctionIndentation: true,
                }
            },
            dev: {
                src: [ "<%= gh.devJspath %>{,*/}*.js" ],
            },
            test: {
                src: [ "test/spec/{,*/}*.js" ],
            },
            grunt: {
                src: [ "Gruntfile.js" ]
            }
        },
        jshint: {
            options: {
                reporter: require( 'jshint-stylish' ),
            },
            //beforeconcat: '<%= gh.jsAssets %>',
            dev: [ '<%= gh.devJspath %>{controllers/}*.js' ],
            grunt: [ 'Gruntfile.js' ],
        },
        /*
        ########   ## ##       ######   #######  ##    ##  ######     ###    ########
        ##         ## ##      ##    ## ##     ## ###   ## ##    ##   ## ##      ##
        ##       #########    ##       ##     ## ####  ## ##        ##   ##     ##
        ######     ## ##      ##       ##     ## ## ## ## ##       ##     ##    ##
        ##       #########    ##       ##     ## ##  #### ##       #########    ##
        ##         ## ##      ##    ## ##     ## ##   ### ##    ## ##     ##    ##
        ########   ## ##       ######   #######  ##    ##  ######  ##     ##    ##
        */
        /*************************************************************************************************************************************************/
        // STATIC
        ngAnnotate: {
            options: {
                singleQuotes: true,
            },
            app1: {
                files: {
                    //'<%= gh.devpath %>js/tmp/bower_concat.js': [ '<%= gh.devpath %>js/tmp/bower_concat.js' ],
                    '<%= gh.devJspath %>tmp/snake3210.js': [ '<%= gh.devJspath %>snake3210.js' ],
                    '<%= gh.devJspath %>tmp/controllers/aide.js': [ '<%= gh.devJspath %>tmp/controllers/aide.js' ],
                    '<%= gh.devJspath %>tmp/controllers/classement.js': [ '<%= gh.devJspath %>tmp/controllers/classement.js' ],
                    '<%= gh.devJspath %>tmp/controllers/play.js': [ '<%= gh.devJspath %>tmp/controllers/play.js' ]
                }
            }
        },
        // Concaténation devant être appellée par sécurité avant un build
        bower_concat: {
            all: {
                dest: '<%= gh.devJspath %>bower_concat.js',
                // je ne charge pas les css de bower actuellement
                cssDest: '<%= gh.devCsspath %>bower_concat.css',
                exclude: [ 'json3', 'es5-shim' ],
                dependencies: {
                    'jquery': 'angular',
                    'jquery.easing': 'jquery',
                    'bootstrap': 'jquery',
                },
                bowerOptions: {
                    relative: false
                },
                mainFiles: {
                    'angular': [ 'angular.min.js' ],
                    'angular-local-storage': [ 'dist/angular-local-storage.min.js' ]
                }
            },
        },
        // CONCATENATION JS
        concat: {
            options: {
                separator: ' ',
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("dd-mm-yyyy") %> [FR] */',
                process: function( src, filepath ) {
                    return '\n//####' + filepath + '\n' + src;
                },
                nonull: true,
            },
            dist: {
                files: {
                    '<%= gh.distPath %>game.js': [ '<%= gh.devJspath %>tmp/bower_concat.js', '<%= gh.devJspath %>tmp/snake3210.js', '<%= gh.devJspath %>controllers/*.js', '<%= gh.jsScripts %>' ]
                }
            }
        },
        uglify: {
            options: {
                preserveComments: 'some'
            },
            my_target: {
                files: {
                    '<%= gh.distPath %>game.min.js': [ '<%= gh.devJspath %>tmp/game.js' ],
                }
            }
        },
        /*
        ########   ## ##      #### ##     ##    ###     ######   ########  ######
        ##         ## ##       ##  ###   ###   ## ##   ##    ##  ##       ##    ##
        ##       #########     ##  #### ####  ##   ##  ##        ##       ##
        ######     ## ##       ##  ## ### ## ##     ## ##   #### ######    ######
        ##       #########     ##  ##     ## ######### ##    ##  ##             ##
        ##         ## ##       ##  ##     ## ##     ## ##    ##  ##       ##    ##
        ########   ## ##      #### ##     ## ##     ##  ######   ########  ######
        */
        /*************************************************************************************************************************************************/
        // OPTIMISATION D'IMAGES
        imagemin: { // Task
          dynamic: { // Another target
            options: {
              optimizationLevel: 3,
              svgoPlugins: [ {
                removeViewBox: false
              } ],
              use: [ mozjpeg() ]
            },
            files: [ {
              expand: true, // Enable dynamic expansion
              cwd: '<%= gh.devImgpath %>', // Src matches are relative to this path
              src: [ '**/*.{png,jpg,gif,ico,svg}' ], // Actual patterns to match
              dest: '<%= gh.distImgpath %>' // Destination path prefix
            } ]
          },
        },
        webp: {
          images: {
            options: {
              //binpath: 'C:/Users/Administrator/AppData/Roaming/npm/node_modules/webp-bin/bin',
              binpath: 'C:/Program Files (x86)/Webp/bin/cwebp',
              preset: 'default',
              verbose: true,
              quality: 80,
              alphaQuality: 70,
              compressionMethod: 3,
              segments: 4,
              psnr: 42,
              sns: 50,
              filterStrength: 0,
              filterSharpness: 3,
              //simpleFilter: true,
              partitionLimit: 50,
              analysisPass: 6,
              multiThreading: true,
              lowMemory: false,
              alphaMethod: 0,
              alphaFilter: 'best',
              alphaCleanup: true,
              noAlpha: false,
              lossless: true,
              force: true
            },
            files: [ {
              expand: true,
              cwd: '<%= gh.distImgpath %>',
              src: [ '**/*.{jpg,png,gif,ico}' ],
              dest: '<%= gh.distImgpath %>'
            } ],
          }
        },
        /*
        ########   ## ##      ##     ## ######## ##     ## ##
        ##         ## ##      ##     ##    ##    ###   ### ##
        ##       #########    ##     ##    ##    #### #### ##
        ######     ## ##      #########    ##    ## ### ## ##
        ##       #########    ##     ##    ##    ##     ## ##
        ##         ## ##      ##     ##    ##    ##     ## ##
        ########   ## ##      ##     ##    ##    ##     ## ########
        */
        /*************************************************************************************************************************************************/
        prettify: {
            options: {
                indent: 4,
                indent_char: ' ',
                wrap_line_length: 78,
                brace_style: 'expand',
                //unformatted: [ 'a', 'sub', 'sup', 'b', 'i', 'u' ]
                unformatted: [ 'php' ]
            },
            // -------------- Views
            views: {
                expand: true,
                cwd: '<%= gh.distPath %>',
                ext: '.html',
                src: [ '*.html' ],
                dest: '<%= gh.distPath %>'
            }
        },
        htmlhint: {
            options: {
                'tag-pair': true, // Tag must be paired.
                'tagname-lowercase': true, //Tagname must be lowercase.
                'attr-lowercase': true,
                'attr-value-double-quotes': true,
                'attr-value-not-empty': true,
                'attr-no-duplication': true,
                'doctype-first': true,
                'doctype-html5': true,
                'tag-self-close': true,
                'spec-char-escape': true,
                'id-unique': true,
                'src-not-empty': true,
                //Perfomance
                'head-script-disabled': true,
                'img-alt-require': true,
                'id-class-value': true,
                'style-disabled': true,
                'space-tab-mixed-disabled': true,
                'id-class-ad-disabled': true, // Id and class can not use ad keyword, it will blocked by adblock software.
                'href-abs-or-rel': false,
                'attr-unsafe-chars': true,
            },
            html: {
                src: '<%= gh.htmlAssets %>'
            }
        },
        /*
        ########   ## ##      ##     ##    ###    ##       #### ########     ###    ######## ####  #######  ##    ##
        ##         ## ##      ##     ##   ## ##   ##        ##  ##     ##   ## ##      ##     ##  ##     ## ###   ##
        ##       #########    ##     ##  ##   ##  ##        ##  ##     ##  ##   ##     ##     ##  ##     ## ####  ##
        ######     ## ##      ##     ## ##     ## ##        ##  ##     ## ##     ##    ##     ##  ##     ## ## ## ##
        ##       #########     ##   ##  ######### ##        ##  ##     ## #########    ##     ##  ##     ## ##  ####
        ##         ## ##        ## ##   ##     ## ##        ##  ##     ## ##     ##    ##     ##  ##     ## ##   ###
        ########   ## ##         ###    ##     ## ######## #### ########  ##     ##    ##    ####  #######  ##    ##
        */
        /*************************************************************************************************************************************************/
        validation: {
            options: {
                reset: grunt.option( 'reset' ) || false,
                stoponerror: true,
                doctype: 'HTML5',
                charset: 'utf-8',
            },
            files: {
                src: '<%= gh.htmlAssets %>'
            }
        },
        pagespeed: {
            options: {
                nokey: true,
                url: "<%= gh.themeuri %>"
            },
            gh: {
                options: {
                    url: "<%= gh.themeuri %>",
                    locale: "fr_FR",
                    strategy: "desktop",
                    threshold: 80
                }
            }
        },
        /*
        ########   ## ##       ######  ##       ########    ###    ##    ##
        ##         ## ##      ##    ## ##       ##         ## ##   ###   ##
        ##       #########    ##       ##       ##        ##   ##  ####  ##
        ######     ## ##      ##       ##       ######   ##     ## ## ## ##
        ##       #########    ##       ##       ##       ######### ##  ####
        ##         ## ##      ##    ## ##       ##       ##     ## ##   ###
        ########   ## ##       ######  ######## ######## ##     ## ##    ##
        */
        /*************************************************************************************************************************************************/
        // Empties folders to start fresh
        clean: {
            serve: {
                src: [ "<%= gh.temppath %>*", "<%= gh.libspath %>**/*.md", "<%= gh.libspath %>**/*LICENSE", "<%= gh.libspath %>**/*.txt", "<%= gh.libspath %>**/*.json", "<%= gh.libspath %>**/*.hbs", "<%= gh.libspath %>**/*.gzip", "<%= gh.libspath %>**/*.map", "<%= gh.libspath %>**/*.coffee", "<%= gh.libspath %>**/CHANGES", "<%= gh.libspath %>**/Makefile", ]
            },
            changelog: {
                src: [ "./CHANGELOG.md" ]
            },
            webapp: {
                src: [ "./dist/manifest.webapp", "./dist/offline.appcache" ]
            },
            images: {
              src: [ "<%= gh.distImgpath %>**/*.jpg", "<%= gh.distImgpath %>**/*.png", "<%= gh.distImgpath %>**/*.gif", "<%= gh.distImgpath %>**/*.ico", "<%= gh.distImgpath %>**/*.webp" ]
            },
        },
        /*
        ########   ## ##      ########  ######## ########  ##        #######  ##    ##
        ##         ## ##      ##     ## ##       ##     ## ##       ##     ##  ##  ##
        ##       #########    ##     ## ##       ##     ## ##       ##     ##   ####
        ######     ## ##      ##     ## ######   ########  ##       ##     ##    ##
        ##       #########    ##     ## ##       ##        ##       ##     ##    ##
        ##         ## ##      ##     ## ##       ##        ##       ##     ##    ##
        ########   ## ##      ########  ######## ##        ########  #######     ##
        */
        /*************************************************************************************************************************************************/
        // DIST
        changelog: {
            options: {
                // Task-specific options go here.
            }
        },
        /*************************************************************************************************************************************************/
        /*************************************************************************************************************************************************/
        /*************************************************************************************************************************************************/
        /*
        ########   ## ##      ##      ##    ###    ########  ######  ##     ##
        ##         ## ##      ##  ##  ##   ## ##      ##    ##    ## ##     ##
        ##       #########    ##  ##  ##  ##   ##     ##    ##       ##     ##
        ######     ## ##      ##  ##  ## ##     ##    ##    ##       #########
        ##       #########    ##  ##  ## #########    ##    ##       ##     ##
        ##         ## ##      ##  ##  ## ##     ##    ##    ##    ## ##     ##
        ########   ## ##       ###  ###  ##     ##    ##     ######  ##     ##
        */
        // SURVEILLANCE
        // WATCH : Cette tâche en appelle d'autres dès qu'elle détecte des changements sur les fichiers définis
        // Watches files for changes and runs tasks based on the changed files
        watch: {
            options: {
                nospawn: true,
                livereload: true // activation du reload
            },
            // Gruntfile.js mise à jour, je reload
            mygruntfile: {
                options: {
                    livereload: false // activation du reload
                },
                files: [ 'Gruntfile.js' ],
                tasks: [ 'jshint:grunt', 'jsbeautifier:grunt' ],
            },
            // STYLES
            lessEdited: { // Au changement d'un fichier .less, on appelle la tâche de compilation
                files: [ '<%= gh.devpath %>less/{,*/,*/*/}*.less' ],
                tasks: [ 'less:style', 'cssmin:devtheme' ],
            },
            // SCRIPTS
            scriptsEdited: {
                options: {
                    nospawn: true,
                    livereload: true // activation du reload
                },
                // Au changement d'un fichier .less, on appelle la tâche de compilation
                files: [ '<%= gh.devJspath %>{,controllers/}*.js', 'test/spec/{,*/}*.js' ], // which files to watch
                tasks: [ 'jshint:dev', 'jsbeautifier:dev' ],
            },
            // LIVERELOAD : fichiers modifiés qui n'appellent pas d'autres tâches que le reload
            livereload: {
                files: [ '<%= gh.distPath %>{,*/}*.html', 'htdocs/.htaccess' ]
            }
        },
        /*
        ########   ## ##       ######   #######  ##    ## ##    ## ########  ######  ########
        ##         ## ##      ##    ## ##     ## ###   ## ###   ## ##       ##    ##    ##
        ##       #########    ##       ##     ## ####  ## ####  ## ##       ##          ##
        ######     ## ##      ##       ##     ## ## ## ## ## ## ## ######   ##          ##
        ##       #########    ##       ##     ## ##  #### ##  #### ##       ##          ##
        ##         ## ##      ##    ## ##     ## ##   ### ##   ### ##       ##    ##    ##
        ########   ## ##       ######   #######  ##    ## ##    ## ########  ######     ##
        */
        /*************************************************************************************************************************************************/
        // SERVEUR : configuration de connect
        connect: {
            options: { // Port 8000 par défaut
                protocol: 'https',
                port: 9000,
                hostname: 'gilleshoarau.com',
                livereload: 35729,
                base: '',
                key: grunt.file.read( 'ssl/monserveur.key' ).toString(),
                cert: grunt.file.read( 'ssl/certificate-96884.crt' ).toString()
            },
            livereload: {
                options: {
                    open: '<%= gh.themeuri %>',
                    //open:true,
                    //protocol: 'https',
                    base: '<%= gh.dist %>',
                    key: grunt.file.read( 'ssl/monserveur.key' ),
                    cert: grunt.file.read( 'ssl/certificate-96884.crt' )
                }
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function( connect ) {
                        return [
          connect.static( '.tmp' ),
          connect.static( 'test' ),
          connect().use( '/bower_components', connect.static( './bower_components' ) ),
          connect.static( '<%= gh.distPath %>' )
          ];
                    }
                }
            },
        },
        phantom: {
            options: {
                port: 4444
            },
            your_target: {
                src: '<%= gh.themeuri %>'
            }
        },
        /*************************************************************************************************************************************************/
        /*************************************************************************************************************************************************/
        /*************************************************************************************************************************************************/
        /*
        ########   ## ##       ######   #######  ########  ##    ##
        ##         ## ##      ##    ## ##     ## ##     ##  ##  ##
        ##       #########    ##       ##     ## ##     ##   ####
        ######     ## ##      ##       ##     ## ########     ##
        ##       #########    ##       ##     ## ##           ##
        ##         ## ##      ##    ## ##     ## ##           ##
        ########   ## ##       ######   #######  ##           ##
        */
        // BODYROCK
        copy: {
            libsFonts: {
                files: [
        // makes all src relative to cwd
                    {
                        src: '<%= gh.devPath %>fonts/icomoon.eot',
                        dest: '<%= gh.distCsspath %>fonts/icomoon.<%= pkg.version %>.eot',
        },
                    {
                        src: '<%= gh.devPath %>fonts/icomoon.woff',
                        dest: '<%= gh.distCsspath %>fonts/icomoon.<%= pkg.version %>.woff',
        },
                    {
                        src: '<%= gh.devPath %>fonts/icomoon.ttf',
                        dest: '<%= gh.distCsspath %>fonts/icomoon.<%= pkg.version %>.ttf',
        },
                    {
                        src: '<%= gh.devPath %>fonts/icomoon.svg',
                        dest: '<%= gh.distCsspath %>fonts/icomoon.<%= pkg.version %>.svg',
        },
      ],
            },
            changelog: {
                files: [
      // makes all src relative to cwd
                    {
                        src: 'CHANGELOG.md',
                        dest: 'changelogs/CHANGELOG-<%= pkg.version %>.md'
      },
      ],
            },
            versioning: {
                files: [
      // makes all src relative to cwd
                    {
                        src: '<%= gh.distPath %>page.css',
                        dest: '<%= gh.distPath %>page.<%= pkg.version %>.css',
      },
                    {
                        src: '<%= gh.distPath %>game.min.js',
                        dest: '<%= gh.distPath %>game.<%= pkg.version %>.min.js',
      },
      ],
            },
            webapp: {
                files: [
      // makes all src relative to cwd
                    {
                        src: 'manifest.webapp',
                        dest: '<%= gh.distPath %>manifest.webapp',
      },
                    {
                        src: 'offline.appcache',
                        dest: '<%= gh.distPath %>offline.appcache',
      },
      ],
            },
            versioningImg: {
              files: [
              // makes all src relative to cwd
              {
                src: '0.0.0<%= gh.devImgpath %>ico/logo.svg',
                dest: '0.0.0<%= gh.devImgpath %>ico/logo.<%= pkg.version %>.svg',
              },
              {
                src: '0.0.0<%= gh.devImgpath %>ico/gravatar.jpg',
                dest: '0.0.0<%= gh.devImgpath %>ico/gravatar.<%= pkg.version %>.jpg',
              },
              {
                src: '0.0.0<%= gh.devImgpath %>ico/favicon.ico',
                dest: '0.0.0<%= gh.devImgpath %>ico/favicon.<%= pkg.version %>.ico',
              },
              {
                src: '0.0.0<%= gh.devImgpath %>ico/144.png',
                dest: '0.0.0<%= gh.devImgpath %>ico/144.<%= pkg.version %>.png',
              },
              {
                src: '0.0.0<%= gh.devImgpath %>ico/16.png',
                dest: '0.0.0<%= gh.devImgpath %>ico/16.<%= pkg.version %>.png',
              },
              {
                src: '0.0.0<%= gh.devImgpath %>ico/48.png',
                dest: '0.0.0<%= gh.devImgpath %>ico/48.<%= pkg.version %>.png',
              },
              {
                src: '0.0.0<%= gh.devImgpath %>ico/128.png',
                dest: '0.0.0<%= gh.devImgpath %>ico/128.<%= pkg.version %>.png',
              }
              ],
            },
        },

    } );
    /*************************************************************************************************************************************************/
    /*************************************************************************************************************************************************/
    /*************************************************************************************************************************************************/
    /*************************************************************************************************************************************************/
    /*************************************************************************************************************************************************/
    /*************************************************************************************************************************************************/
    /*
    ########   ## ##      ##     ## ########  ######     ########    ###     ######  ##     ## ########  ######
    ##         ## ##      ###   ### ##       ##    ##       ##      ## ##   ##    ## ##     ## ##       ##    ##
    ##       #########    #### #### ##       ##             ##     ##   ##  ##       ##     ## ##       ##
    ######     ## ##      ## ### ## ######    ######        ##    ##     ## ##       ######### ######    ######
    ##       #########    ##     ## ##             ##       ##    ######### ##       ##     ## ##             ##
    ##         ## ##      ##     ## ##       ##    ##       ##    ##     ## ##    ## ##     ## ##       ##    ##
    ########   ## ##      ##     ## ########  ######        ##    ##     ##  ######  ##     ## ########  ######
    */
    // Import des modules inclus dans package.json
    require( 'load-grunt-tasks' )( grunt );
    // TRANSITION dev/prod
    grunt.registerTask( 'dev', function( target ) {
        switch ( target ) {
            default:
            /*
            Preparation du mode développement
            - copie du fichier yesimlocal.php dans /dev/
            - suppression du manifest.xml et du .appcache dans /htdocs/
            */
                grunt.task.run( [ 'clean:webapp' ] );
            break;
            case 'prod':
                /*
                Préparation du mode production
                - suppression du fichier imlocal.php dans /dev/
                - copie des fichiers manifest.xml et .appcache dans /htdocs/
                */
                    grunt.task.run( [ 'copy:webapp' ] );
                break;
        }
        //grunt.task.run( [ 'curl:fonts1', 'curl:fonts2', 'curl:fonts3', 'copy:libsFonts' ] );
    } );
    // MES TACHES
    grunt.registerTask( 'reloadImg', function( target ) {
      grunt.task.run( [ 'clean:images', 'copy:versioningImg', 'imagemin:dynamic', 'webp:images' ] );
    } );
    grunt.registerTask( 'reloadFonts', function( target ) {
        grunt.task.run( [ 'curl:fonts1' ] );
    } );
    grunt.registerTask( 'reloadCss', function( target ) {
        grunt.task.run( [ 'less', 'autoprefixer', 'cssmin' ] );
    } );
    grunt.registerTask( 'reloadJs', function( target ) {
        grunt.task.run( [ 'jsbeautifier', 'jshint', 'ngAnnotate', 'concat', 'uglify' ] );
    } );
    grunt.registerTask( 'reloadHtml', function( target ) {
        grunt.task.run( [ 'prettify', 'htmlhint', 'validation', 'pagespeed' ] );
    } );
    ///// ETAPE DE RELEASE
    grunt.registerTask( 'release', function( target ) {
        grunt.task.run( [ 'humans_txt', 'reloadFonts', 'reloadCss', 'reloadJs', 'pagespeed', 'copy:changelog', 'clean:changelog', 'changelog', 'copy:versioning', 'dev:prod' ] );
    } );
    grunt.registerTask( 'production', function( target ) {
        grunt.task.run( [ 'release' ] );
    } );
    // CREER UN SERVEUR persistant avec connect et livereload
    grunt.registerTask( 'serve', function( target ) {
        grunt.task.run( [ 'connect:livereload', 'watch' ] );
    } );
    // TACHE PAR DEFAUT
    grunt.registerTask( 'default', [ 'serve' ] );
    // ************************
    // TACHES EN COURS D'INTEGRATION :
    grunt.registerTask( 'mochatest', function( target ) {
        grunt.task.run( [ 'phantom', 'mocha' ] );
    } );
};
