(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * array-slice <https://github.com/jonschlinkert/array-slice>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 *
 * Copyright 2012-2014 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.6.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */

'use strict';

/**
 * ```js
 * var slice = require('array-slice');
 * ```
 *
 * **Example**
 *
 * ```js
 * var arr = ['a','b','d','e','f','g','h','i','j'];
 * console.log(slice(arr, 3,6));
 * //=> ['e', 'f', 'g']
 * ```
 *
 * @param {Array} `array` The array to slice.
 * @param {number} `[start=0]` The start index.
 * @param {number} `[end=array.length]` The end index.
 * @returns {Array} Returns the slice of `array`.
 */

module.exports = function slice(array, start, end) {
  var index = -1;
  var length = array ? array.length : 0;
  start = start === null ? 0 : +start || 0;
  if (start < 0) {
    start = Math.max(length + start, 0);
  } else if (start > length) {
    start = length;
  }

  end = (typeof end === 'undefined') ? length : +end || 0;
  if (end < 0) {
    end = Math.max(length + end, 0);
  } else if (end > length) {
    end = length;
  }

  length = start > end ? 0 : end - start;
  var result = Array(length);
  while ((index += 1) < length) {
    result[index] = array[start + index];
  }
  return result;
};

},{}]},{},[1])