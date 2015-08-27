var extend = require('../../lib/utils/extend');

describe('extend(...objects)', function() {
    var one, two, three;
    var result;

    beforeEach(function() {
        one = {
            type: 'person',
            name: 'Josh',
            address: {
                state: 'NJ'
            },
            tags: ['software', 'music']
        };
        two = {
            type: 'male',
            address: {
                street: 'Witherspoon'
            }
        };
        three = {
            age: 24,
            tags: ['radio', 'music']
        };

        result = extend(one, two, three);
    });

    it('should deeply merge the provided objects together', function() {
        expect(result).toEqual({
            type: 'male',
            name: 'Josh',
            address: {
                state: 'NJ',
                street: 'Witherspoon'
            },
            age: 24,
            tags: ['software', 'music', 'radio']
        });
    });

    it('should work on Arrays', function() {
        expect(extend(['foo', 'bar'], ['foo', 'hello'], ['bar', 'world'])).toEqual(['foo', 'bar', 'hello', 'world']);
    });

    it('should be able to extend an object with an Array', function() {
        expect(extend({ foo: 'bar' }, ['foo', 'bar'])).toEqual({ foo: 'bar', 0: 'foo', 1: 'bar' });
    });

    it('should be able to extend an Array with an object', function() {
        var expected = ['foo', 'bar'];
        expected.foo = 'bar';

        expect(extend(['foo', 'bar'], { foo: 'bar' })).toEqual(expected);
    });

    it('should filter out non-objects', function() {
        expect(extend(null, undefined, { foo: 'bar' }, 44, 'hello', { bar: 'foo' }, true, false)).toEqual({ foo: 'bar', bar: 'foo' });
    });

    it('should return the right-most argument if there are no objects provided', function() {
        expect(extend(true, 44, 'hello', null, undefined, 22, false)).toBe(false);
        expect(extend(44, 'hello', null)).toBe(null);
        expect(extend(undefined, 'foo')).toBe('foo');
    });
});
