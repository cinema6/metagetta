var childProcess = require('child_process');
var getVideoMetadata = require('../../lib/utils/get_video_metadata');

describe('getVideoMetadata', function() {
    var child;
    
    beforeEach(function() {
        child = {
            kill: jasmine.createSpy('kill()')
        };
        spyOn(childProcess, 'exec').and.returnValue(child);
        clearTimeout = jasmine.createSpy('clearTimeout()');
        setTimeout = jasmine.createSpy('setTimeout()').and.returnValue('the timeout');
    });
    
    it('should spawn a child process with the correct command', function() {
        getVideoMetadata('video.mp4');
        expect(childProcess.exec).toHaveBeenCalledWith('ffprobe -print_format json -loglevel error -show_entries format=duration -i video.mp4', jasmine.any(Function));
    });
    
    it('should set a timeout', function() {
        getVideoMetadata('video.mp4');
        expect(setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 30000);
    });
    
    it('should fulfill with properly formatted metadata', function(done) {
        childProcess.exec.and.callFake(function(cmd, callback) {
            process.nextTick(function() {
                callback(null, '{"format": {"duration": "15.185000"}}');
            });
        });
        getVideoMetadata('video.mp4').then(function(meta) {
            expect(meta).toEqual({
                duration: 15.185
            });
            expect(clearTimeout).toHaveBeenCalledWith('the timeout');
            done();
        }).catch(done.fail);
    });
    
    it('should reject if the command throws an error', function(done) {
        childProcess.exec.and.callFake(function(cmd, callback) {
            process.nextTick(function() {
                callback(new Error(), null, 'epic fail');
            });
        });
        getVideoMetadata('video.mp4').then(done.fail).catch(function(error) {
            expect(error).toBe('epic fail');
            expect(clearTimeout).toHaveBeenCalledWith('the timeout');
            done();
        });
    });
    
    it('should reject on the timeout', function(done) {
        setTimeout.and.callFake(function(callback) {
            callback();
        });
        getVideoMetadata('video.mp4').then(done.fail).catch(function(error) {
            expect(child.kill).toHaveBeenCalled();
            expect(error).toBe('metadata for the video could not be found');
            done();
        });
    });
});
