'use strict';

module.exports = function set(props, object) {
    return Object.keys(props).reduce(function(object, key) {
        object[key] = props[key];
        return object;
    }, object);
};
