'use strict';

module.exports = function find(array, predicate) {
    var length = array.length;

    var index = 0;
    for (; index < length; index++) {
        if (predicate(array[index], index, array)) {
            return array[index];
        }
    }
};
