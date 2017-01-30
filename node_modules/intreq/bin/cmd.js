#!/usr/bin/env node

var reqmap = require('../');
var JSONStream = require('JSONStream');

process.stdin
    .pipe(JSONStream.parse([ true ]))
    .pipe(reqmap())
    .pipe(JSONStream.stringify())
    .pipe(process.stdout)
;
