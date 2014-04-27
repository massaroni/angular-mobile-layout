'use strict';


var Js = {};

/**
 * shorthand for "is null or undefined"
 * @param x
 */
Js.isNothing = function (x) {
  return x === undefined || x === null;
};

/**
 * shorthand for "is not nothing"
 * @param x
 * @returns {boolean}
 */
Js.isSomething = function (x) {
  return !Js.isNothing(x);
};

Js.isArray = function (x) {
  return x instanceof Array;
};

Js.isObject = function (o) {
  return o !== null && typeof o === 'object' && !(o instanceof Array);
};

Js.isNumber = function (n) {
  return typeof n === 'number' && !isNaN(n) && isFinite(n);
};

/**
 * Check that a string or number is an integer.
 * Note that you can't necessarily to math with all integers.
 * String integers and number integers have different + operators (concat vs add).
 * We have many integer ids, so this is useful to check for valid ids.
 *
 * @param n
 * @returns {boolean} true if n is a string or number representing an integer.
 * strings with dots and letters evaluate to false, and objects are false.
 */
Js.isInteger = function (n) {
  if (n === null) {
    return false;
  }

  if (isNaN(n)) {
    return false;
  }

  return parseInt(n, 10) === parseFloat(n);
};

/**
 * Check that a number is an integer. This will reject strings.
 * Note that you can't necessarily do math with all integers.
 * String integers and number integers have different + operators (concat vs add).
 * We have many integer ids, so this is useful to check for valid ids.
 *
 * @param n
 * @returns {boolean} true if n is a string or number representing an integer.
 */
Js.isIntegerNumber = function (n) {
  if ((typeof n) !== 'number') {
    return false;
  }

  return Js.isInteger(n);
};

/**
 * Check that a string or number is an integer, and it's > 0.
 * Note that you can't necessarily to math with all integers.
 * String integers and number integers have different + operators (concat vs add).
 * We have many integer ids, so this is useful to check for valid ids.
 *
 * @param n
 * @returns {boolean} true if n is a string or number representing an integer.
 * strings with dots and letters evaluate to false, and objects are false.
 */
Js.isPositiveInteger = function (n) {
  if (!Js.isInteger(n)) {
    return false;
  }

  return n > 0;
};

/**
 * Inspired by angular.isBoolean(), which is inaccessible.
 *
 * @param b
 * @returns {boolean}
 */
Js.isBoolean = function (b) {
  return typeof b === 'boolean';
};

Js.isString = function (s) {
  if (s === null) {
    return false;
  }

  if (s === undefined) {
    return false;
  }

  return typeof s === 'string';
};

Js.isFunction = function (f) {
  return typeof f === 'function';
};

Js.isEmptyString = function(s) {
  return !Js.isString(s) || s.length === 0;
};

Js.formatString = function () {
  var str = arguments[0];

  if (!Js.isString(str)) {
    throw 'Expected first argument to be the string format, but was ' + str;
  }

  for (var i = 1; i < arguments.length; i++) {
    var arg = arguments[i];
    str = str.replace('%s', arg);
  }

  return str;
};

Js.printException = function (ex) {
  if (!(ex instanceof Error)) {
    return 'Expected an Error, but was ' + ex;
  }

  return ex.message + '\n' + ex.stack;
};


var Preconditions = {};

/**
 * Throw an error if a condition evaluates to false, like in Guava.
 * The first argument is the condition. The second argument is the error message. All other arguments are used in formatting the error message argument.
 * The error message can be templated, according to Js.formatString(), so this function takes any number of trailing arguments.
 *
 * usage: Preconditions.checkArgument(x === y, 'Bad argument %s x should be y.', 'because')
 */
Preconditions.check = function (isGood, checkTypeMsg, errorMsg, errorMsgArgs) {
  if (!!isGood || isGood === 0) {
    return;
  }

  if (!errorMsg) {
    throw new Error(checkTypeMsg);
  }

  if (!Js.isString(errorMsg)) {
    console.error('Expected a string as the second argument, but was ' + errorMsg);
    return;
  }

  if (!checkTypeMsg) {
    checkTypeMsg = 'Error: ';
  }

  var formattedErrorMsg = Js.formatString.apply(null, errorMsgArgs);
  throw new Error(checkTypeMsg + formattedErrorMsg);
};

Preconditions.checkArgument = function (isGood, errorMsg) {
  var args = Array.prototype.slice.call(arguments);
  var errorMsgArgs = args.slice(1, args.length);

  Preconditions.check(isGood, 'Illegal Argument: ', errorMsg, errorMsgArgs);
};

Preconditions.checkState = function (isGood, errorMsg) {
  var args = Array.prototype.slice.call(arguments);
  var errorMsgArgs = args.slice(1, args.length);

  Preconditions.check(isGood, 'Illegal State: ', errorMsg, errorMsgArgs);
};
