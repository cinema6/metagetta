'use strict';

var LiePromise = require('lie');
var getVideoMetadata = require('../utils/get_video_metadata');
var formatURL = require('url').format;
var jsonp = require('../utils/jsonp');

var IS_LOCAL_KEY = {
    type: true,
    id: true,
    uri: true,
    title: true,

    description: false,
    duration: false,
    hd: false,
    tags: false,
    publishedTime: false
};
var DEFAULT_FIELDS = Object.keys(IS_LOCAL_KEY);
var EXTRACTORS = {
    type: function() {
        return 'instagram';
    },
    id: function(options) {
        return options.id;
    },
    uri: function(options) {
        return options.uri;
    },
    title: function() {
        return null;
    },

    description: function(options, video) {
        return video.data.caption.text;
    },
    tags: function(options, video) {
        return video.data.tags;
    },
    publishedTime: function(options, video) {
        /* jshint camelcase:false */
        return new Date(video.data.created_time * 1000);
        /* jshint camelcase:true */
    },
    duration: function(options, video) {
        if(!('videos' in video.data)) {
            return null;
        }
        var videos = video.data.videos;
        var smallestFile;
        /* jshint camelcase:false */
        if('low_bandwidth' in videos) {
            smallestFile = videos.low_bandwidth.url;
        } else if('low_resolution' in videos) {
            smallestFile = videos.low_resolution.url;
        } else if('standard_resolution' in videos) {
            smallestFile = videos.standard_resolution.url;
        /* jshint camelcase:true */
        } else {
            return null;
        }
        return getVideoMetadata(smallestFile).then(function(meta) {
            return meta.duration;
        }).catch(function() {
            return null;
        });
    },
    hd: function(options, video) {
        if(!('videos' in video.data)) {
            return false;
        }
        var videos = video.data.videos;
        var largestVideo;
        /* jshint camelcase:false */
        if('standard_resolution' in videos) {
            largestVideo = videos.standard_resolution;
        } else if('low_resolution' in videos) {
            largestVideo = videos.low_resolution;
        } else if('low_bandwidth' in videos) {
            largestVideo = videos.low_bandwidth;
        /* jshint camelcase:true */
        }
        return (largestVideo.height >= 720);
    }
};

function createResponse(fields, options, video) {
    var extractableFields = fields.filter(function(field) {
        return (field in EXTRACTORS);
    });
    return LiePromise.all(extractableFields.map(function(field) {
        return EXTRACTORS[field](options, video);
    })).then(function(results) {
        return extractableFields.reduce(function(result, key, index) {
            result[key] = results[index];
            return result;
        }, {});
    });
}

module.exports = function fetchFromInstagram(options) {
    var key = options.instagram.key;
    var fields = (options.fields || DEFAULT_FIELDS)
        .filter(function(field) { return DEFAULT_FIELDS.indexOf(field) > -1; });

    if (options.type !== 'instagram') {
        return LiePromise.reject(new Error('Not an Instagram config.'));
    }

    if (fields.length < 1) {
        return LiePromise.resolve(createResponse(fields, options, null));
    }

    if (fields.every(function(field) { return IS_LOCAL_KEY[field]; })) {
        return LiePromise.resolve(createResponse(fields, options, null));
    }

    return jsonp(formatURL({
        protocol: 'https',
        hostname: 'api.instagram.com',
        pathname: 'v1/media/shortcode/' + options.id,
        /* jshint camelcase:false */
        query: { client_id: key }
        /* jshint camelcase:true */
    })).then(function extractMetadata(response) {
        return createResponse(fields, options, response.body);
    });
};
