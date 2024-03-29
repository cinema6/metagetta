'use strict';

var LiePromise = require('lie');
var childProcess = require('child_process');
var ffprobe;
try {
    ffprobe = require('ffprobe-static');
} catch (error) {}

var TIMEOUT = 30000;

function formatMeta(ffmpegMeta) {
    return {
        duration: parseFloat(ffmpegMeta.format.duration)
    };
}

module.exports = function(url) {
    if(!ffprobe) {
        return LiePromise.reject('cannot proceed because ffprobe-static was not found');
    }
    
    var CMD_ARGS = {
        /* jshint camelcase:false */
        print_format: 'json',
        loglevel: 'error',
        show_entries: 'format=duration',
        i: url
        /* jshint camelcase:true */
    };

    var CMD = ffprobe.path + Object.keys(CMD_ARGS).reduce(function(acc, curr) {
        return acc + ' -' + curr + ' ' + CMD_ARGS[curr];
    }, '');

    return new LiePromise(function(resolve, reject) {
        var child, timeout;
        child = childProcess.exec(CMD, function(err, stdout, stderr) {
            clearTimeout(timeout);
            if(err) {
                reject(stderr);
            } else {
                resolve(formatMeta(JSON.parse(stdout)));
            }
        });
        timeout = setTimeout(function() {
            child.kill();
            reject('metadata for the video could not be found');
        }, TIMEOUT);
    });
};
