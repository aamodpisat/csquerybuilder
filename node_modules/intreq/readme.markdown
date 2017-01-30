# intreq

Compress require paths down to integers in
[module-deps](https://npmjs.org/package/module-deps) streams.

[![build status](https://secure.travis-ci.org/substack/intreq.png)](http://travis-ci.org/substack/intreq)

# example

before:

```
$ browserify example/main.js
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function (n) { return n * 111 }

},{}],2:[function(require,module,exports){
var bar = require('./bar.js');
module.exports = function (n) { return n * bar(1) };

},{"./bar.js":1}],3:[function(require,module,exports){
var foo = require('./foo.js');

console.log(foo(5));

},{"./foo.js":2}]},{},[3])
```

after:

```
$ browserify example/main.js | browser-unpack | intreq | browser-pack
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function (n) { return n * 111 }


},{}],2:[function(require,module,exports){
var bar = require(1);
module.exports = function (n) { return n * bar(1) };
},{"1":1}],3:[function(require,module,exports){
var foo = require(1);

console.log(foo(5));
},{"1":2}]},{},[3])
```

Note how the `require('./bar.js')` and `require('./foo.js')` were collapsed down
to `require(1)` in each instance.

# methods

``` js
var intreq = require('intreq')
```

## var r = intreq()

Return a transform stream `r` that takes
[module-deps](https://npmjs.org/package/module-deps) row objects as input and
collapses the require calls to integers in the output.

# install

To get the `intreq` command, with [npm](https://npmjs.org) do:

```
npm install -g intreq
```

or to get the library, do:

```
npm install intreq
```

# license

MIT
