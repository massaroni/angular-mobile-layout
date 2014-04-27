'use strict';

describe('JS Utils', function () {

  it('replaces 1 %s with 1 string argument', function () {
    expect(Js.formatString('a%s', 'b')).toBe('ab');
  });

  it('replaces 2 %s with 2 string arguments', function () {
    expect(Js.formatString('a%s%s', 'b', 'c')).toBe('abc');
  });

  it('replaces 1 of 2 %s with 1 string arguments', function () {
    expect(Js.formatString('a%s%s', 'b')).toBe('ab%s');
  });

  it('replaces 1 %s with 1 number argument', function () {
    expect(Js.formatString('a%s', 123)).toBe('a123');
  });

  it('replaces 1 %s with 1 number argument, and ignores the superfluous argument', function () {
    expect(Js.formatString('a%s', 123, 'extra arg')).toBe('a123');
  });

  it('dosn\'t handle %s valued inputs', function () {
    expect(Js.formatString('a%s%s', '%s', 'x')).toBe('ax%s');
  });

  it('strings containing just digits should be valid integers', function () {
    expect(Js.isInteger('123')).toBe(true);
  });

  it('functions are functions', function () {
    expect(Js.isFunction(function () {})).toBe(true);
  });

  it('numbers are not functions', function () {
    expect(Js.isFunction(123)).toBe(false);
  });

  it('strings are not functions', function () {
    expect(Js.isFunction("s")).toBe(false);
  });

  it('objects are not functions', function () {
    expect(Js.isFunction({})).toBe(false);
  });

  it('arrays are not functions', function () {
    expect(Js.isFunction([])).toBe(false);
  });

  it('Preconditions global should be defined', function () {
    expect(!!Preconditions).toBe(true);
  });

  it('Preconditions.checkArgument global should be a function', function () {
    expect(Js.isFunction(Preconditions.checkArgument)).toBe(true);
  });

  it('Preconditions.checkState global should be defined', function () {
    expect(Js.isFunction(Preconditions.checkState)).toBe(true);
  });

  it('Function.prototype.bind should be defined', function () {
    expect(Js.isFunction(Function.prototype.bind)).toBe(true);
  });

  it('should not throw an exception for true', function () {
    expect(Preconditions.checkArgument.bind(null, true, 'error message')).not.toThrow();
  });

  it('should not throw an exception for object', function () {
    expect(Preconditions.checkArgument.bind(null, {}, 'error message')).not.toThrow();
  });

  it('should not throw an exception for 0', function () {
    expect(Preconditions.checkArgument.bind(null, 0, 'error message')).not.toThrow();
  });

  it('should not throw an exception for -1', function () {
    expect(Preconditions.checkArgument.bind(null, -1, 'error message')).not.toThrow();
  });

  it('should throw an exception for undefined', function () {
    expect(Preconditions.checkArgument.bind(null, undefined, 'error message')).toThrow(new Error('Illegal Argument: error message'));
  });

  it('should throw an exception for null', function () {
    expect(Preconditions.checkArgument.bind(null, null, 'error message')).toThrow(new Error('Illegal Argument: error message'));
  });

  it('should throw an exception for false', function () {
    expect(Preconditions.checkArgument.bind(null, false, 'error message')).toThrow(new Error('Illegal Argument: error message'));
  });

  it('integer numbers are obviously valid integers', function () {
    expect(Js.isInteger(123)).toBe(true);
  });

  it('strings with mixed characters are not valid integers', function () {
    expect(Js.isInteger('123x')).toBe(false);
  });

  it('strings with floats are not valid integers', function () {
    expect(Js.isInteger('123.2')).toBe(false);
  });

  it('floats are not valid integers', function () {
    expect(Js.isInteger(123.2)).toBe(false);
  });

  it('null is not a valid integer', function () {
    expect(Js.isInteger(null)).toBe(false);
  });

  it('undefined is not a valid integer', function () {
    expect(Js.isInteger(undefined)).toBe(false);
  });

  it('undefined is not a string', function () {
    expect(Js.isString(undefined)).toBe(false);
  });

  it('null is not a string', function () {
    expect(Js.isString(null)).toBe(false);
  });

  it('a number is not a string', function () {
    expect(Js.isString(123)).toBe(false);
  });

  it('a string of digits is a string', function () {
    expect(Js.isString('123')).toBe(true);
  });

  it('a string of digits is not an integer number', function () {
    expect(Js.isIntegerNumber('123')).toBe(false);
  });

  it('a float is not an integer number', function () {
    expect(Js.isIntegerNumber(123.4)).toBe(false);
  });

  it('an integer number is an integer number', function () {
    expect(Js.isIntegerNumber(123)).toBe(true);
  });

  it('null is not an an integer number', function () {
    expect(Js.isIntegerNumber(null)).toBe(false);
  });

  it('undefined is not an an integer number', function () {
    expect(Js.isIntegerNumber(undefined)).toBe(false);
  });

  it('an object is not an an integer number', function () {
    expect(Js.isIntegerNumber({number: 123})).toBe(false);
  });

  it('an empty array', function () {
    expect(Js.isArray([])).toBe(true);
  });

  it('an array with something in it', function () {
    expect(Js.isArray([5, 'something'])).toBe(true);
  });

  it('an empty map', function () {
    expect(Js.isArray({})).toBe(false);
  });

  it('an integer', function () {
    expect(Js.isArray(2)).toBe(false);
  });

  it('a string', function () {
    expect(Js.isArray('abc')).toBe(false);
  });

  it('null is not an array', function () {
    expect(Js.isArray(null)).toBe(false);
  });

  it('undefined is not an array', function () {
    expect(Js.isArray(undefined)).toBe(false);
  });

  it('no arguments is not an array', function () {
    expect(Js.isArray()).toBe(false);
  });

  it('a new array', function () {
    expect(Js.isArray(new Array())).toBe(true);
  });

  it('a new array is not an object', function () {
    expect(Js.isObject(new Array())).toBe(false);
  });

  it('an empty array is not an object', function () {
    expect(Js.isObject([])).toBe(false);
  });

  it('a string is not an object', function () {
    expect(Js.isObject('foo')).toBe(false);
  });

  it('a number is not an object', function () {
    expect(Js.isObject(123)).toBe(false);
  });

  it('null is not an object', function () {
    expect(Js.isObject(null)).toBe(false);
  });

  it('undefined is not an object', function () {
    expect(Js.isObject(undefined)).toBe(false);
  });

  it('an object is an object', function () {
    expect(Js.isObject({x:1})).toBe(true);
  });

});
