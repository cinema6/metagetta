var find = require('../../lib/utils/find');

describe('find(array, predicate)', function() {
    var people, predicate;
    var result;

    beforeEach(function() {
        people = [{ name: 'Josh' }, { name: 'Howard' }, { name: 'Evan' }];
        predicate = jasmine.createSpy('predicate()').and.callFake(function(person) { return person.name === 'Howard'; });

        result = find(people, predicate);
    });

    it('should call the predicate until the result is found', function() {
        expect(predicate.calls.count()).toBe(2);
        predicate.calls.all().forEach(function(call, index) {
            var person = people[index];

            expect(call.args).toEqual([person, index, people]);
        });
    });

    it('should return the first item the predicate returned true for', function() {
        expect(result).toBe(people[1]);
    });
});
