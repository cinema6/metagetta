'use strict';

// Karma configuration
// Generated on Tue Aug 25 2015 16:17:18 GMT-0400 (EDT)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '..',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['browserify', 'jasmine'],


        // list of files / patterns to load in the browser
        files: [
            { pattern: 'test/polyfill.js', watched: false },
            { pattern: 'test/spec/**/*.ut.js', watched: false },
            { pattern: 'test/spec/**/*.browser-ut.js', watched: false }
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'test/polyfill.js': 'browserify',
            'test/spec/**/*.ut.js': 'browserify',
            'test/spec/**/*.browser-ut.js': 'browserify'
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values:
        // config.LOG_DISABLE|config.LOG_ERROR|config.LOG_WARN|config.LOG_INFO|config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        browserify: {
            debug: true,
            transform: ['brfs'],
            plugin: ['proxyquire-universal']
        }
    });
};
