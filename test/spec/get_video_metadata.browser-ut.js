/* jshint browser:true, node:false, browserify:true */
var getVideoMetadata = require('../../lib/utils/get_video_metadata');

describe('get_video_metadata', function() {
    var mockVideo;
    
    beforeEach(function() {
        mockVideo = {
            setAttribute: jasmine.createSpy('setAttribute()'),
            style: { display: null },
            addEventListener: jasmine.createSpy('addEventListener()'),
            removeEventListener: jasmine.createSpy('removeEventListener()'),
            duration: 123
        };
        spyOn(document, 'createElement').and.callFake(function(name) {
            if(name === 'video') {
                return mockVideo;
            }
        });
        spyOn(document.body, 'appendChild');
        spyOn(document.body, 'removeChild');
        spyOn(window, 'setTimeout');
        spyOn(window, 'clearTimeout');
    });

    it('should create a video element and set a timeout', function() {
        getVideoMetadata('video.mp4');
        expect(document.createElement).toHaveBeenCalledWith('video');
        expect(mockVideo.setAttribute).toHaveBeenCalledWith('src', 'video.mp4');
        expect(mockVideo.style.display).toBe('none');
        expect(mockVideo.addEventListener).toHaveBeenCalledWith('loadedmetadata', jasmine.any(Function), false);
        expect(window.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 30000);
        expect(document.body.appendChild).toHaveBeenCalledWith(mockVideo);
    });
    
    it('should cleanup on the event callback', function() {
        var listenerFn, timeoutFn;
        mockVideo.addEventListener.and.callFake(function(name, handler) {
            listenerFn = handler;
            listenerFn();
        });
        window.setTimeout.and.callFake(function(callback) {
            timeoutFn = callback;
            return 'the timeout';
        });
        getVideoMetadata('video.mp4');
        timeoutFn();
        expect(clearTimeout).toHaveBeenCalledWith('the timeout');
        expect(mockVideo.removeEventListener).toHaveBeenCalledWith('loadedmetadata', listenerFn, false);
        expect(document.body.removeChild).toHaveBeenCalledWith(mockVideo);
    });
    
    it('should cleanup on timeout', function() {
        var listenerFn, timeoutFn;
        mockVideo.addEventListener.and.callFake(function(name, handler) {
            listenerFn = handler;
        });
        window.setTimeout.and.callFake(function(callback) {
            timeoutFn = callback;
            return 'the timeout';
        });
        getVideoMetadata('video.mp4');
        timeoutFn();
        expect(clearTimeout).toHaveBeenCalledWith('the timeout');
        expect(mockVideo.removeEventListener).toHaveBeenCalledWith('loadedmetadata', listenerFn, false);
        expect(document.body.removeChild).toHaveBeenCalledWith(mockVideo);
    });
    
    it('should be able to resolve with metadata', function(done) {
        var fn;
        mockVideo.addEventListener.and.callFake(function(name, handler) {
            fn = handler;
            fn();
        });
        getVideoMetadata('video.mp4').then(function(meta) {
            expect(meta).toEqual({
                duration: 123
            });
            done();
        }).catch(function(error) {
            expect(error).not.toBeDefined();
            done();
        });
    });
    
    it('should be able to reject after a timeout', function(done) {
        window.setTimeout.and.callFake(function(callback) {
            callback();
        });
        getVideoMetadata('video.mp4').then(function(meta) {
            expect(meta).not.toBeDefined();
            done();
        }).catch(function(error) {
            expect(error).toBe('metadata for the video could not be found');
            done();
        });
    });
});
