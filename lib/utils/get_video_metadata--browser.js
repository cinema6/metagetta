/* jshint browser:true, node:false, browserify:true */
'use strict';

var LiePromise = require('lie');
var TIMEOUT = 30000;

module.exports = function(url) {
    var video = document.createElement('video');
    video.setAttribute('src', url);
    video.style.display = 'none';
    return new LiePromise(function(resolve, reject) {
        var timeout;
        var cleanup = function() {
            clearTimeout(timeout);
            video.removeEventListener('loadedmetadata', onMetadata, false);
            document.body.removeChild(video);
        };
        var onMetadata = function() {
            var meta = {
                duration: video.duration
            };
            cleanup();
            resolve(meta);
        };
        video.addEventListener('loadedmetadata', onMetadata, false);
        timeout = setTimeout(function() {
            cleanup();
            reject('metadata for the video could not be found');
        }, TIMEOUT);
        document.body.appendChild(video);
    });
};
