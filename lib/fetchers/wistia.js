'use strict';

var LiePromise = require('lie');
var request = require('superagent');
var formatURL = require('url').format;
var htmlToText = require('../utils/html_to_text');
var extend = require('../utils/extend');

var QUERIES_KEY = {
    type: null,
    id: null,
    uri: null,
    tags: null,

    title: 'show',
    description: 'show',
    duration: 'show',
    hd: 'show',
    publishedTime: 'show',
    views: 'stats'
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
    },
    views: function(options, video) {
        return video.stats.pageLoads;
    }
};
var DEFAULT_FIELDS = Object.keys(QUERIES_KEY);

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
    var baseUrlObj = {
        protocol: 'https',
        host: 'api.wistia.com',
        /* jshint camelcase:false */
        query: { api_password: key }
        /* jshint camelcase:true */
    };
    var mediaShowUri = formatURL(extend(baseUrlObj, {
        pathname: '/v1/medias/' + id + '.json'
    }));
    var mediaStatsUri = formatURL(extend(baseUrlObj, {
        pathname: '/v1/medias/' + id + '/stats.json'
    }));
    var fields = (options.fields || DEFAULT_FIELDS).filter(function(field) {
        return DEFAULT_FIELDS.indexOf(field) > -1;
    });
    
    if(type !== 'wistia') {
        return LiePromise.reject(new Error('Not a Wistia config.'));
    }
    
    var requiredQueries = fields.map(function(field) {
        return QUERIES_KEY[field];
    });
    
    var promises = [];
    if(requiredQueries.indexOf('show') !== -1) {
        promises.push(LiePromise.resolve(request.get(mediaShowUri)));
    }
    if(requiredQueries.indexOf('stats') !== -1) {
        promises.push(LiePromise.resolve(request.get(mediaStatsUri)));
    }
    if(promises.length === 0) {
        return LiePromise.resolve(createResponse(fields, options, null));
    }

    return LiePromise.all(promises).then(function extractMetadata(responses) {
        var video = extend.apply(this, responses.map(function(response) {
            return response.body;
        }));
        return createResponse(fields, options, video);
    });
};
