'use strict';

function extend(/*...objects*/) {
    var objects = Array.prototype.slice.call(arguments).filter(function(object) {
        return object instanceof Object;
    });

    if (objects.length < 1) {
        return arguments[arguments.length - 1];
    }

    return objects.reduce(function(result, object) {
        if (object instanceof Array && result instanceof Array) {
            return result.concat(object.filter(function(item) {
                return result.indexOf(item) < 0;
            }));
        }

        return Object.keys(object).reduce(function(result, key) {
            result[key] = extend(result[key], object[key]);
            return result;
        }, result);
    }, new objects[0].constructor());
}

module.exports = extend;
