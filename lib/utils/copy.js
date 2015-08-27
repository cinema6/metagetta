'use strict';

module.exports = function copy(object) {
    return JSON.parse(JSON.stringify(object));
};
