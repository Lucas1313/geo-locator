module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg : grunt.file.readJSON('packageLuc.json'),

        /**
         * Project banner
         */
        tag: {
          banner: '/*!\n' +
                  ' * <%= pkg.name %>\n' +
                  ' * <%= pkg.title %>\n' +
                  ' * <%= pkg.url %>\n' +
                  ' * @author <%= pkg.author %>\n' +
                  ' * @version <%= pkg.version %>\n' +
                  ' * Copyright <%= pkg.copyright %>. <%= pkg.license %> licensed.\n' +
                  ' */\n'
        },

        sass
         : {
            dev : {
                options : {
                    style : 'expanded',
                    banner: '<%= tag.banner %>',
                    'line-numbers': true
                },
                files : [
                            
                            {
                                '../www/css/dev/screen.css' : '../www/css/sass/screen.scss'
                            },
                        ]
            },
            prod : {
                options : {
                    style : 'compressed'
                },
                files : {
                    '../www/css/min/screen.css' : '../www/css/sass/screen.scss'
                }
            }
        },
        watch : {
            sass : {
                files : ['../www/css/sass/{,*/}*.{scss,sass}','../www/css/sass/{,*/}*.{scss,sass}', ],
                tasks : ['sass:dev']
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['sass']);

};