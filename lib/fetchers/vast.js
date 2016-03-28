'use strict';

var LiePromise = require('lie');
var VAST = require('vastacular').VAST;
var find = require('../utils/find');

var EXTRACTORS = {
    type: function() {
        return 'vast';
    },
    id: function(options, ad) {
        return ad.id;
    },
    uri: function(options) {
        return options.uri;
    },
    title: function(options, ad) {
        return ad.title;
    },
    description: function(options, ad) {
        return ad.description;
    },
    duration: function(options, ad, creative) {
        return creative.duration;
    },
    hd: function(options, ad, creative) {
        return Math.max.apply(null, creative.mediaFiles.map(function(mediaFile) {
            return mediaFile.height;
        })) >= 720;
    },
    tags: function() {
        return null;
    },
    publishedTime: function() {
        return null;
    },
    views: function() {
        return null;
    },
    thumbnails: function() {
        return {
            small: null,
            large: null
        };
    }
};
var DEFAULT_FIELDS = Object.keys(EXTRACTORS);
var LOCAL_FIELDS = DEFAULT_FIELDS.filter(function(field) {
    return EXTRACTORS[field].length <= 1;
});

function findAdWithLinearCreative(vast) {
    return vast.find('ads', function(ad) {
        return findLinearCreative(ad);
    });
}

function findLinearCreative(ad) {
    return find(ad.creatives, function(creative) {
        return creative.type === 'linear';
    });
}

function createResponse(fields, options, ad) {
    var creative = ad && findLinearCreative(ad);

    return fields.reduce(function(result, field) {
        result[field] = EXTRACTORS[field](options, ad, creative);
        return result;
    }, {});
}

module.exports = function fetchAsVAST(options) {
    var type = options.type;
    var uri = options.uri;
    var fields = (options.fields || DEFAULT_FIELDS).filter(function(field) {
        return DEFAULT_FIELDS.indexOf(field) > -1;
    });

    if (type && type !== 'vast') {
        return LiePromise.reject(new Error('Not configured for VAST.'));
    }

    if (!uri) {
        return LiePromise.reject(new Error('No URI specified.'));
    }

    if (fields.every(function(field) { return LOCAL_FIELDS.indexOf(field) > -1; })) {
        return LiePromise.resolve(createResponse(fields, options, null));
    }

    return VAST.fetch(uri, { resolveWrappers: true, maxRedirects: 5 })
        .then(function extractMetadata(vast) {
            var ad = findAdWithLinearCreative(vast);
            if (!ad) { throw new Error('VAST has no linear creative.'); }

            return createResponse(fields, options, ad);
        });
};
