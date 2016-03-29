'use strict';

var LiePromise = require('lie');
var jsonp = require('../utils/jsonp');
var formatURL = require('url').format;

var IS_LOCAL_KEY = {
    type: true,
    id: true,
    uri: true,
    tags: true,
    publishedTime: true,
    thumbnails: true,

    title: false,
    description: false,
    duration: false,
    hd: false,
    views: false
};
var EXTRACTORS = {
    type: function() {
        return 'vzaar';
    },
    id: function(options) {
        return options.id;
    },
    uri: function(options) {
        return options.uri;
    },
    tags: function() {
        return null;
    },
    publishedTime: function() {
        return null;
    },

    title: function(options, video) {
        return video.title;
    },
    description: function(options, video) {
        return video.description;
    },
    duration: function(options, video) {
        return video.duration;
    },
    hd: function(options, video) {
        return video.height >= 720;
    },
    views: function(options, video) {
        /* jshint camelcase:false */
        return video.play_count;
        /* jshint camelcase:true */
    },
    thumbnails: function(options) {
        var id = options.id;
        var url = 'https://view.vzaar.com/' + id + '/thumb';
        return {
            small: url,
            large: url
        };
    }
};
var DEFAULT_FIELDS = Object.keys(IS_LOCAL_KEY);

function createResponse(fields, options, video) {
    return fields.reduce(function(result, field) {
        result[field] = EXTRACTORS[field](options, video);
        return result;
    }, {});
}

module.exports = function fetchFromVimeo(options) {
    var type = options.type;
    var id = options.id;
    var uri = formatURL({
        protocol: 'http',
        host: 'vzaar.com',
        pathname: 'api/videos/' + id + '.json'
    });
    var fields = (options.fields || DEFAULT_FIELDS).filter(function(field) {
        return DEFAULT_FIELDS.indexOf(field) > -1;
    });

    if (type !== 'vzaar') { return LiePromise.reject(new Error('Not a Vzaar config.')); }

    if (fields.every(function(field) { return IS_LOCAL_KEY[field]; })) {
        return LiePromise.resolve(createResponse(fields, options, null));
    }

    return LiePromise.resolve(jsonp(uri)).then(function extractMetadata(response) {
        return createResponse(fields, options, response.body);
    });
};
