var parseFacebookURI = require('../../lib/uris/facebook');

describe('parseFacebookURI(options)', function() {
    var options;
    var result;

    beforeEach(function() {
        options = {};
    });

    it('should exist', function() {
        expect(parseFacebookURI).toEqual(jasmine.any(Function));
    });

    describe('if the uri is not from facebook', function() {
        it('should throw an error', function() {
            expect(function() { parseFacebookURI({ uri: 'https://vimeo.com/85998522' }); }).toThrow();
            expect(function() { parseFacebookURI({ uri: 'http://www.dailymotion.com/video/x338zz6_corgi-wearing-a-samurai-hat-will-make-your-day_fun' }); }).toThrow();
            expect(function() { parseFacebookURI({ uri: 'https://app.mopub.com/dashboard/' }); }).toThrow();
        });
    });

    describe('if the uri prop is not a URI', function() {
        it('should throw an error', function() {
            expect(function() { parseFacebookURI({ uri: true }); }).toThrow();
            expect(function() { parseFacebookURI({ uri: 'kjsdhfu93y4r83h wu7urhg784 f7834gr8' }); }).toThrow();
            expect(function() { parseFacebookURI({ uri: 44 }); }).toThrow();
        });
    });

    describe('if there is no uri', function() {
        it('should throw an error', function() {
            var expectedError = new Error('Must specify a URI for Facebook videos');
            expect(function() { parseFacebookURI({}); }).toThrow(expectedError);
            expect(function() { parseFacebookURI({ type: 'facebook', id: '' }); }).toThrow(expectedError);
            expect(function() { parseFacebookURI({ type: '', id: 'ufGlBv8Z3NU' }); }).toThrow(expectedError);
            expect(function() { parseFacebookURI({ type: 'facebook', id: 'ufGlBv8Z3NU' }); }).toThrow(expectedError);
        });
    });

    describe('if there is a uri', function() {
        beforeEach(function() {
            options.uri = 'https://www.facebook.com/facebook/videos/10153231379946729/';

            result = parseFacebookURI(options);
        });

        it('should decorate the options with a facebook id and return everything', function() {
            expect(result).toBe(options);
            expect(options.id).toBe('10153231379946729');
            expect(options.type).toBe('facebook');
        });
    });
});
