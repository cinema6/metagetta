'use strict';

var cheerio = require('cheerio');

module.exports = function htmlToText(html) {
    return cheerio.load('<p>' + html + '</p>')('*').text();
};
