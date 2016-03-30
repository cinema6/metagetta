/* jshint camelcase:false */
'use strict';

var LiePromise = require('lie');
var request = require('superagent');
var formatURL = require('url').format;

var FIELD_KEY = {
    type: null,
    id: null,
    uri: null,
    views: null,

    title: 'title',
    description: 'description',
    duration: 'length',
    hd: 'format',
    tags: 'content_category',
    publishedTime: 'created_time',
    thumbnails: 'format'
};
var EXTRACTORS = {
    type: function() {
        return 'facebook';
    },
    id: function(options) {
        return options.id;
    },
    uri: function(options) {
        return options.uri;
    },
    views: function() {
        return null;
    },

    title: function(options, video) {
        return video.title;
    },
    description: function(options, video) {
        return video.description;
    },
    duration: function(options, video) {
        return video.length;
    },
    hd: function(options, video) {
        return video.format.some(function(format) {
            return format.height >= 720;
        });
    },
    tags: function(options, video) {
        return [video.content_category];
    },
    publishedTime: function(options, video) {
        var iso = video.created_time.replace(/\+\d{2}:?\d{2}/, '');
        return new Date(iso);
    },
    thumbnails: function(options, video) {
        var formats = video.format.sort(function(format1, format2) {
            return format1.height-format2.height;
        });
        return {
            small: formats[0].picture,
            large: formats[formats.length-1].picture
        };
    }
};
var DEFAULT_FIELDS = Object.keys(FIELD_KEY);

function performRequest(options, fields) {
    var fbAuth = options.facebook;
    var oauth = formatURL({
        protocol: 'https',
        host: 'graph.facebook.com',
        pathname: 'v2.5/oauth/access_token',
        query: {
            client_id: fbAuth.key,
            client_secret: fbAuth.secret,
            grant_type: 'client_credentials'
        }
    });
    return LiePromise.resolve(request.get(oauth)).then(function(response) {
        var token = response.body.access_token;
        var queryFields = [];
        fields.forEach(function(field) {
            var queryField = FIELD_KEY[field];
            if(queryField && queryFields.indexOf(queryField) === -1) {
                queryFields.push(queryField);
            }
        });
        var video = formatURL({
            protocol: 'https',
            host: 'graph.facebook.com',
            pathname: 'v2.5/' + options.id,
            query: {
                access_token: token,
                fields: queryFields.toString()
            }
        });
        return LiePromise.resolve(request.get(video));
    });
}

function createResponse(fields, options, video) {
    return fields.reduce(function(result, field) {
        result[field] = EXTRACTORS[field](options, video);
        return result;
    }, {});
}

module.exports = function fetchFromFacebook(options) {
    var type = options.type;
    var fields = (options.fields || DEFAULT_FIELDS).filter(function(field) {
        return DEFAULT_FIELDS.indexOf(field) > -1;
    });

    if (type !== 'facebook') { return LiePromise.reject(new Error('Not a Facebook config.')); }

    if (fields.every(function(field) { return !FIELD_KEY[field]; })) {
        return LiePromise.resolve(createResponse(fields, options, null));
    }

    return performRequest(options, fields).then(function extractMetadata(response) {
        var video = JSON.parse(response.text);
        return createResponse(fields, options, video);
    });
};
