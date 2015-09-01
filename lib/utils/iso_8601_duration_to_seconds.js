'use strict';

module.exports = function iso8601DurationToSeconds(duration) {
    if (typeof duration !== 'string') {
        throw new Error('Not a String.');
    }

    if (!(/^P(\d*Y)?(\d*M)?(\d*D)?T?(\d*H)?(\d*M)?(\d*S)?$|^P\d+W$/).test(duration)) {
        throw new Error('Not a valid ISO 8601 duration.');
    }

    if (!(/PT/.test(duration))) {
        throw new Error('Cannot convert a duration with a month, year, week or day.');
    }

    return duration.match(/PT(\d*H)?(\d*M)?(\d*S)?$/).slice(1)
        .reduce(function(total, value, index) {
            var multiplier = Math.pow(60, Math.abs(index - 2));
            var time = parseInt(value || 0);

            return total + (time * multiplier);
        }, 0);
};
