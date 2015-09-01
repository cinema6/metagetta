var set = require('../../lib/utils/set');

describe('set(props, object)', function() {
    var props, object;
    var result;

    beforeEach(function() {
        props = { foo: 'bar', bar: 'foo' };
        object = { hello: 'world' };

        result = set(props, object);
    });

    it('should copy the specified props to the object and return it', function() {
        expect(result).toBe(object);
        expect(object).toEqual(jasmine.objectContaining(props));
    });
});
