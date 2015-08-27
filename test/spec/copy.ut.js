var copy = require('../../lib/utils/copy');

describe('copy(object)', function() {
    var object;
    var result;

    beforeEach(function() {
        object = { foo: 'bar', bar: { bar: 'foo' } };
        result = copy(object);
    });

    it('should return a deep copy of an object', function() {
        expect(result).toEqual(object);
        expect(result).not.toBe(object);
        expect(result.bar).not.toBe(object.bar);
    });
});
