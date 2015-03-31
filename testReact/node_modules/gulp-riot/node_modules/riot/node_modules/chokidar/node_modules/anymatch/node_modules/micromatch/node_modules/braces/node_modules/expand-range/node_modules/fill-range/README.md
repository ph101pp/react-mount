# fill-range [![NPM version](https://badge.fury.io/js/fill-range.svg)](http://badge.fury.io/js/fill-range)  [![Build Status](https://travis-ci.org/jonschlinkert/fill-range.svg)](https://travis-ci.org/jonschlinkert/fill-range) 

> Fill in a range of numbers or letters, optionally passing an increment or multiplier to use.

## Install with [npm](npmjs.org)

```bash
npm i fill-range --save
```

## Usage

```js
var range = require('fill-range');

range('a', 'e');
//=> ['a', 'b', 'c', 'd', 'e']
```

**Params**

```js
range(start, stop, step, options, fn);
```

 - `start`: **{String|Number}** the number or letter to start with
 - `end`: **{String|Number}** the number or letter to end with
 - `step`: **{String|Number}** optionally pass the step to use. works for letters or numbers.
 - `options`: **{Object}**:
    + `makeRe`: return a regex-compatible string (still returned as an array for consistency)
    + `step`: pass the step on the options as an alternative to passing it as an argument
    + `silent`: `true` by default, set to false to throw errors for invalid ranges. 
 - `fn`: **{Function}** optionally [pass a function](#custom-function) to modify each character 


**Examples**

```js
range(1, 3)
//=> ['1', '2', '3']

range('1', '3')
//=> ['1', '2', '3']

range('0', '-5')
//=> [ '0', '-1', '-2', '-3', '-4', '-5' ]

range(-9, 9, 3)
//=> [ '-9', '-6', '-3', '0', '3', '6', '9' ])

range('-1', '-10', '-2')
//=> [ '-1', '-3', '-5', '-7', '-9' ]

range('1', '10', '2')
//=> [ '1', '3', '5', '7', '9' ]

range('a', 'e')
//=> ['a', 'b', 'c', 'd', 'e']

range('a', 'e', 2)
//=> ['a', 'c', 'e']

range('A', 'E', 2)
//=> ['A', 'C', 'E']
```

### Invalid ranges

When an invalid range is passed, `null` is returned. 

```js
range('1.1', '2');
//=> null

range('a', '2');
//=> null

range(1, 10, 'foo');
//=> null
```

If you want errors to be throw, pass `silent: false` on the options:


### Custom function

Optionally pass a custom function as the third or fourth argument:

```js
range('a', 'e', function (val, isNumber, pad, i) {
  if (!isNumber) {
    return String.fromCharCode(val) + i;
  }
  return val;
});
//=> ['a0', 'b1', 'c2', 'd3', 'e4']
```

### Special characters

A special character may be passed as the third arg instead of a step increment. These characters can be pretty useful for brace expansion, creating file paths, test fixtures and similar use case.

```js
range('a', 'z', SPECIAL_CHARACTER_HERE);
```

**Supported characters**

 - `+`: repeat the given string `n` times
 - `|`: create a regex-ready string, instead of an array
 - `>`: join values to single array element
 - `?`: randomize the given pattern using [randomatic]

#### `+`

Repeat the first argument the number of times passed on the second argument.

**Examples:**

```js
range('a', 3, '+');
//=> ['a', 'a', 'a']

range('abc', 2, '+');
//=> ['abc', 'abc']
```

#### `|` and `~`

Creates a regex-capable string (either a logical `or` or a character class) from the expanded arguments.

**Examples:**

```js
range('a', 'c', '|');
//=> ['(a|b|c)'

range('a', 'c', '~');
//=> ['[a-c]'

range('a', 'z', '|5');
//=> ['(a|f|k|p|u|z)'
```

**Automatic separator correction**

To avoid this error:

> `Range out of order in character class`

Fill-range detects invalid sequences and uses the correct syntax. For example:

**invalid** (regex)

If you pass these:

```js
range('a', 'z', '~5');
// which would result in this
//=> ['[a-f-k-p-u-z]']

range('10', '20', '~');
// which would result in this
//=> ['[10-20]']
```

**valid** (regex)

fill-range corrects them to this:

```js
range('a', 'z', '~5');
//=> ['(a|f|k|p|u|z)'

range('10', '20', '~');
//=> ['(10-20)'
```


#### `>`

Joins all values in the returned array to a single value.

**Examples:**

```js
range('a', 'e', '>');
//=> ['abcde']

range('5', '8', '>');
//=> ['5678']

range('2', '20', '2>');
//=> ['2468101214161820']
```


#### `?`

Uses [randomatic] to generate randomized alpha, numeric, or alpha-numeric patterns based on the provided arguments.

**Examples:**

_(actual results would obviously be randomized)_

Generate a 5-character, uppercase, alphabetical string:

```js
range('A', 5, '?');
//=> ['NSHAK']
```

Generate a 5-digit random number:

```js
range('0', 5, '?');
//=> ['36583']
```

Generate a 10-character alpha-numeric string:

```js
range('A0', 10, '?');
//=> ['5YJD60VQNN']
```

See the [randomatic] repo for all available options and or to create issues or feature requests related to randomization.


## Run tests

Install dev dependencies:

```bash
npm i -d && npm test
```

## Related

- [micromatch]: wildcard/glob matcher for javascript. a faster alternative to minimatch.
- [expand-range]: uses fill-range for range expansion in strings
- [braces]: uses expand range to do range expansion in glob patterns and braces.


## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/fill-range/issues)

## Author

**Jon Schlinkert**
 
+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert) 

## License
Copyright (c) 2014-2015 Jon Schlinkert  
Released under the MIT license

***

_This file was generated by [verb](https://github.com/assemble/verb) on February 25, 2015._

[randomatic]: https://github.com/jonschlinkert/randomatic

[expand-range]: https://github.com/jonschlinkert/expand-range
[micromatch]: https://github.com/jonschlinkert/micromatch
[braces]: https://github.com/jonschlinkert/braces
