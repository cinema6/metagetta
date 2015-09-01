var parseYouTubeURI = require('../../lib/uris/youtube');

describe('parseYouTubeURI(options)', function() {
    var options;
    var result;

    beforeEach(function() {
        options = {};
    });

    it('should exist', function() {
        expect(parseYouTubeURI).toEqual(jasmine.any(Function));
    });

    describe('if the uri is not from youtube', function() {
        it('should throw an error', function() {
            expect(function() { parseYouTubeURI({ uri: 'https://vimeo.com/85998522' }); }).toThrow();
            expect(function() { parseYouTubeURI({ uri: 'http://www.dailymotion.com/video/x338zz6_corgi-wearing-a-samurai-hat-will-make-your-day_fun' }); }).toThrow();
            expect(function() { parseYouTubeURI({ uri: 'https://app.mopub.com/dashboard/' }); }).toThrow();
        });
    });

    describe('if the uri prop is not a URI', function() {
        it('should throw an error', function() {
            expect(function() { parseYouTubeURI({ uri: true }); }).toThrow();
            expect(function() { parseYouTubeURI({ uri: 'kjsdhfu93y4r83h wu7urhg784 f7834gr8' }); }).toThrow();
            expect(function() { parseYouTubeURI({ uri: 44 }); }).toThrow();
        });
    });

    describe('if there is no uri or type and id', function() {
        it('should throw an error', function() {
            expect(function() { parseYouTubeURI({}); }).toThrow();
            expect(function() { parseYouTubeURI({ type: 'youtube', id: '' }); }).toThrow();
            expect(function() { parseYouTubeURI({ type: '', id: 'ufGlBv8Z3NU' }); }).toThrow();
        });
    });

    describe('if there is a type and id', function() {
        describe('but the type is not youtube', function() {
            it('should throw an error', function() {
                expect(function() { parseYouTubeURI({ type: 'vimeo', id: 'ufGlBv8Z3NU' }); }).toThrow();
                expect(function() { parseYouTubeURI({ type: 'dailymotion', id: 'ufGlBv8Z3NU' }); }).toThrow();
                expect(function() { parseYouTubeURI({ type: 'vast', id: 'ufGlBv8Z3NU' }); }).toThrow();
            });
        });

        describe('and the type is youtube', function() {
            beforeEach(function() {
                options.type = 'youtube';
                options.id = 'ufGlBv8Z3NU';

                result = parseYouTubeURI(options);
            });

            it('should decorate the options with a youtube uri and return them', function() {
                expect(result).toBe(options);
                expect(options.uri).toBe('https://www.youtube.com/watch?v=ufGlBv8Z3NU');
            });
        });
    });

    describe('if the uri is from youtube', function() {
        beforeEach(function() {
            options.uri = 'https://www.youtube.com/watch?v=wusGIl3v044';
            result = parseYouTubeURI(options);
        });

        it('should decorate the options with a youtube type and videoid and return them', function() {
            expect(result).toBe(options);
            expect(options.type).toBe('youtube');
            expect(options.id).toBe('wusGIl3v044');
        });
    });
});
