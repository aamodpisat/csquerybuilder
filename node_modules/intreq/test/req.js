var test = require('tape');
var intreq = require('../');

var input = require('./files/req.json');
var expected = require('./files/req_expected.json');

test(function (t) {
    t.plan(1);
    
    var r = intreq();
    var rows = [];
    r.on('data', function (row) { rows.push(row) });
    r.on('end', function () {
        t.deepEqual(rows, expected);
    });
    
    input.forEach(function (row) { r.write(row) });
    r.end();
});
