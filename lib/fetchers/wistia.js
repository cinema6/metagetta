'use strict';

var LiePromise = require('lie');
var request = require('superagent');
var formatURL = require('url').format;
var htmlToText = require('../utils/html_to_text');

var IS_LOCAL_KEY = {
    type: true,
    id: true,
    uri: true,
    tags: true,

    title: false,
    description: false,
    duration: false,
    hd: false,
    publishedTime: false
};
var EXTRACTORS = {
    type: function() {
        return 'wistia';
    },
    id: function(options) {
        return options.id;
    },
    uri: function(options) {
        return options.uri;
    },
    tags: function() {
        return [];
    },

    title: function(options, video) {
        return video.name;
    },
    description: function(options, video) {
        return htmlToText(video.description);
    },
    duration: function(options, video) {
        return video.duration;
    },
    hd: function(options, video) {
        var originalVideo;
        var assets = video.assets;
        for(var i=0;i<assets.length;i++) {
            if(assets[i].type === 'OriginalFile') {
                originalVideo = assets[i];
                break;
            }
        }
        if(originalVideo) {
            return originalVideo.height >= 720;
        } else {
            return false;
        }
    },
    publishedTime: function(options, video) {
        return new Date(video.created);
    }
};
var DEFAULT_FIELDS = Object.keys(IS_LOCAL_KEY);

function createResponse(fields, options, video) {
    return fields.reduce(function(result, field) {
        result[field] = EXTRACTORS[field](options, video);
        return result;
    }, {});
}

module.exports = function fetchFromWistia(options) {
    var key = options.wistia.key;
    var type = options.type;
    var id = options.id;
    var uri = formatURL({
        protocol: 'https',
        host: 'api.wistia.com',
        pathname: '/v1/medias/' + id + '.json',
        /* jshint camelcase:false */
        query: { api_password: key }
        /* jshint camelcase:true */
    });
    var fields = (options.fields || DEFAULT_FIELDS).filter(function(field) {
        return DEFAULT_FIELDS.indexOf(field) > -1;
    });
    
    if(type !== 'wistia') {
        return LiePromise.reject(new Error('Not a Wistia config.'));
    }
    
    if (fields.every(function(field) { return IS_LOCAL_KEY[field]; })) {
        return LiePromise.resolve(createResponse(fields, options, null));
    }
    
    return LiePromise.resolve(request.get(uri)).then(function extractMetadata(response) {
        return createResponse(fields, options, response.body);
    });
};
