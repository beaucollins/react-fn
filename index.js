'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.not = exports.log = exports.everyCount = exports.times = exports.actionDispatcher = exports.pipe = exports.each = exports.all = exports.any = exports.first = exports.when = exports.propEquals = exports.propExists = exports.pure = undefined;

var _object = require('lodash/object');

var _lang = require('lodash/lang');

var pure = exports.pure = function pure(value) {
  return function () {
    return value;
  };
};

/*
 * Returns a function that checks for props that have a truthy `propkey` (uses lodash/object/get
 * to check for key). Example:
 *
 * const nameExists = propExists( 'name' )
 * nameExists( { name: 'Gabrielle' } ) // => true
 * nameExists( { name: true } ) // true
 * nameExists( {} ) // false
 * nameExists() // false
 */
var propExists = exports.propExists = function propExists(propKey) {
  return function (props) {
    return (0, _object.get)(props, propKey);
  };
};

/*
 * Returns a function that returns true if `propKey` of props is equal to `propValue` (uses ===).
 *
 * const userNameIsSam = propEquals( 'user.name', 'Sam' )
 * const userNameIsSam( { user: { name: 'Sam' } } ) // => true
 * const userNameIsSam( { user: { name: 'Frodo' } } ) // => false
 * const userNameIsSam() // => false
 */
var propEquals = exports.propEquals = function propEquals(propKey, propValue) {
  return function (props) {
    return (0, _object.get)(props, propKey) === propValue;
  };
};

/*
 * Returns a function that calls condition and checks for truthiness and calls `ifTrue`, other wise calls
 * `ifFalse` which defaults to a function that returns `null`. Example:
 *
 * const logRealNumbers = when(
 *		( msg ) => /^[\d]+$/.test( msg ),
 *		console.log.bind( console, 'is a real number' ),
 *		console.log.bind( console, 'is not a real number' )
 * )
 *
 * logRealNumbers( 5.1 ) // => 5.1 'is not a real number'
 * logReslNumbers( 5 ) // => 5 'is a real number'
 */
var when = exports.when = function when(condition, ifTrue) {
  var ifFalse = arguments.length <= 2 || arguments[2] === undefined ? function () {
    return null;
  } : arguments[2];
  return function () {
    return condition.apply(undefined, arguments) ? ifTrue.apply(undefined, arguments) : ifFalse.apply(undefined, arguments);
  };
};

/*
 * Returns the result of the first function to return a truthy value
 */

var first = exports.first = function first() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return function () {
    var i, result;
    for (i = 0; i < fns.length; i++) {
      result = fns[i].apply(fns, arguments);
      if (result) return result;
    }
  };
};

/*
 * Returns a function that returns true if any of the provided `fns` return a truthy value. Example:
 *
 * const oddOrLessThan10 = any(
 *		( n ) => n % 2 === 1,
 *		( n ) => n < 10
 * )
 *
 * oddOrLessThan10( 15 ) // => true
 * oddOrLessThan10( 8 ) // => true
 * oddOrLessThan10( 12 ) // => false
 */
var any = exports.any = function any() {
  for (var _len2 = arguments.length, fns = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    fns[_key2] = arguments[_key2];
  }

  return function () {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return fns.find(function (fn) {
      return fn.apply(undefined, args);
    });
  };
};

/*
 * Returns a function that returns true when all provided functions return a truthy value. Example:
 *
 * const lessThan10AndGreaterThan4AndEven = all(
 *		( n ) => n < 10,
 *		( n ) => n > 4,
 *		( n ) => n % 2 === 0
 * )
 * lessThan10AndGreaterThan2AndEven( 7 ) // => false
 * lessThan10AndGreaterThan2AndEven( 8 ) // => true
 * lessThan10AndGreaterThan2AndEven( 2 ) // => false
 */
var all = exports.all = function all() {
  for (var _len4 = arguments.length, fns = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    fns[_key4] = arguments[_key4];
  }

  return function () {
    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    return !fns.find(function (fn) {
      return !fn.apply(undefined, args);
    });
  };
};

/*
 * Returns a function that iterates through each function and calls it. Example:
 *
 *	const log = console.log.bind( console )
 *	const maths = each(
 *		( n ) => log( '*2', n * 2),
 *		( n ) => log( '+2', n + 2 )
 *	)
 *
 *  maths( 3 )
 *  // => '*2', 6
 *  // => '+2', 5
 */
var each = exports.each = function each() {
  for (var _len6 = arguments.length, fns = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    fns[_key6] = arguments[_key6];
  }

  return function () {
    for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
    }

    return fns.forEach(function (fn) {
      return fn.apply(undefined, args);
    });
  };
};

exports.pipe = each;
var actionDispatcher = exports.actionDispatcher = function actionDispatcher(action) {
  return function () {
    var mapArgs = arguments.length <= 0 || arguments[0] === undefined ? function () {
      for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        args[_key8] = arguments[_key8];
      }

      return [args];
    } : arguments[0];
    return function (dispatch) {
      return function () {
        return dispatch(action(mapArgs.apply(undefined, arguments)));
      };
    };
  };
};

/*
 * Executes provided function ( `fn` ) `count` times. Example:
 *
 *	const log5 = times( console.log.bind( log, 'hello' ), 5 )
 *	log5() // => 'hello', 'hello', 'hello', 'hello', 'hello'
 */
var times = exports.times = function times(count, fn) {
  return function () {
    var results = [];
    var i;
    for (i = 0; i < count; i++) {
      results = results.concat(fn.apply(undefined, arguments));
    }
    return results;
  };
};

/*
 * Returns a function that will call the wrapped `fn` every `count` times the function is called.
 *
 * Example:
 *	const log = everyCount( 3, console.log.bind( console, 'hello' ) )
 *  // first and second `log` call, nothing logged
 *  log()
 *  log()
 *  // third log call logs the message
 *  log() // => 'hello'
 *  // fourth and fifth, nothing called, then sixth logs ( etc. )
 *  log(); log(); log(); // => 'hello'
 */
var everyCount = exports.everyCount = function everyCount(count, fn) {
  var current = 1;
  return function () {
    if (current % count === 0) fn.apply(undefined, arguments);
    current++;
  };
};

/*
 * Given a logger or tag, returns a function that wraps a function and logs the
 * arguments and return value of the wrapped function.
 *
 * Example:
 *
 * 	const debug = require( 'debugger' )( 'my:tag' )
 * 	const hello = ( name ) => `hello ${ name }`
 * 	const logger = log( debug )
 * 	const debugHello = logger( hello )
 *
 * 	debugHello( 'Janelle' )
 *
 * Will result in a console debug message of:
 * => 'my:tag', 'input': [ 'Janelle' ], 'output', 'hello Janelle'
 */
var log = exports.log = function log(tag) {
  var d = (0, _lang.isFunction)(tag) ? tag : console.log.bind(console, tag);
  return function (msg, fn) {
    return function () {
      for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        args[_key9] = arguments[_key9];
      }

      var result = fn.apply(undefined, args);
      d(msg, 'input', args, 'output', result);
      return result;
    };
  };
};

/**
 * Returns a function that inverts a result of the given function
 *
 * @param {Function} fn Function wrap and invert the result of
 * @returns Function that will execute the wrapped function and invert the result
 * @type Function
 */
var not = exports.not = function not(fn) {
  return function () {
    return !fn.apply(undefined, arguments);
  };
};
