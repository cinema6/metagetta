'use strict';

var cheerio = require('cheerio');

module.exports = function htmlToText(html) {
    return cheerio.load('<div id="mg-text-wrapper">' + html + '</div>')('#mg-text-wrapper').text();
};
