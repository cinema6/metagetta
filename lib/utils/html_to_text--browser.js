/* jshint browser:true, node:false, browserify:true */
'use strict';

var parser = document.createElement('p');

module.exports = function htmlToText(html) {
    parser.innerHTML = html;
    return parser.textContent;
};
