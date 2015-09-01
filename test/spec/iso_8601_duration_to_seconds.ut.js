var iso8601DurationToSeconds = require('../../lib/utils/iso_8601_duration_to_seconds');

describe('iso8601DurationToSeconds(duration)', function() {
    it('should exist', function() {
        expect(iso8601DurationToSeconds).toEqual(jasmine.any(Function));
    });

    it('should convert seconds', function() {
        expect(iso8601DurationToSeconds('PT33S')).toEqual(33);
        expect(iso8601DurationToSeconds('PT1S')).toEqual(1);
        expect(iso8601DurationToSeconds('PT59S')).toEqual(59);
    });

    it('should convert minutes', function() {
        expect(iso8601DurationToSeconds('PT3M')).toEqual(180);
        expect(iso8601DurationToSeconds('PT10M')).toEqual(600);
        expect(iso8601DurationToSeconds('PT59M')).toEqual(3540);
    });

    it('should convert hours', function() {
        expect(iso8601DurationToSeconds('PT1H')).toEqual(3600);
        expect(iso8601DurationToSeconds('PT100H')).toEqual(360000);
        expect(iso8601DurationToSeconds('PT4H')).toEqual(14400);
    });

    it('should convert a combination of hours, minutes and seconds', function() {
        expect(iso8601DurationToSeconds('PT1H30M15S')).toEqual(5415);
        expect(iso8601DurationToSeconds('PT10M47S')).toEqual(647);
        expect(iso8601DurationToSeconds('PT5H20S')).toEqual(18020);
        expect(iso8601DurationToSeconds('PT1H20M')).toEqual(4800);
    });

    it('should throw an error if passed a duration with a year/month/week/day', function() {
        var error = new Error('Cannot convert a duration with a month, year, week or day.');

        expect(function() { iso8601DurationToSeconds('P3Y6M4DT12H30M5S'); }).toThrow(error);
        expect(function() { iso8601DurationToSeconds('P3YT12H30M5S'); }).toThrow(error);
        expect(function() { iso8601DurationToSeconds('P3Y6MT12H30M5S'); }).toThrow(error);
        expect(function() { iso8601DurationToSeconds('P4DT12H30M5S'); }).toThrow(error);
        expect(function() { iso8601DurationToSeconds('P3Y6M4D'); }).toThrow(error);
        expect(function() { iso8601DurationToSeconds('P4W'); }).toThrow(error);
        expect(function() { iso8601DurationToSeconds('P11W'); }).toThrow(error);
    });

    it('should throw an error if not passed a valid string', function() {
        var error = new Error('Not a valid ISO 8601 duration.');

        expect(function() { iso8601DurationToSeconds('hello world'); }).toThrow(error);
        expect(function() { iso8601DurationToSeconds(''); }).toThrow(error);
        expect(function() { iso8601DurationToSeconds('Phrase'); }).toThrow(error);
        expect(function() { iso8601DurationToSeconds('PT is at 4!'); }).toThrow(error);
    });

    it('should throw an error if not passed a string', function() {
        var error = new Error('Not a String.');

        expect(function() { iso8601DurationToSeconds(null); }).toThrow(error);
        expect(function() { iso8601DurationToSeconds(undefined); }).toThrow(error);
        expect(function() { iso8601DurationToSeconds(true); }).toThrow(error);
        expect(function() { iso8601DurationToSeconds(false); }).toThrow(error);
        expect(function() { iso8601DurationToSeconds(44); }).toThrow(error);
        expect(function() { iso8601DurationToSeconds({}); }).toThrow(error);
        expect(function() { iso8601DurationToSeconds([]); }).toThrow(error);
    });
});
