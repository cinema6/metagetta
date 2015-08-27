var index = require('../../index');
var metagetta = require('../../lib/metagetta');

describe('index', function() {
    it('should be the metagetta export', function() {
        expect(index).toBe(metagetta);
    });
});
