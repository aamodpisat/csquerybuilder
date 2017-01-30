var Transform = require('stream').Transform;
var inherits = require('inherits');
var falafel = require('falafel');

inherits(IntReq, Transform);
module.exports = IntReq;

function IntReq (mapF, opts) {
    if (!(this instanceof IntReq)) return new IntReq(mapF, opts);
    Transform.call(this, { objectMode: true });
    if (!opts) opts = {};
    
    this._mapF = mapF || function () {
        var n = 0;
        return function (key) { return ++ n };
    };
    this._name = opts.name || 'require';
}

IntReq.prototype._transform = function (row, enc, next) {
    var self = this;
    var keys = Object.keys(row.deps);
    if (keys.length === 0) {
        this.push(row);
        return next();
    }
    
    var mapF = this._mapF();
    var deps = row.deps;
    var mapped = {};
    row.deps = keys.reduce(function (acc, key) {
        var x = mapF(key);
        mapped[key] = x;
        acc[x] = deps[key];
        return acc;
    }, {});
    
    row.source = falafel(row.source, function (node) {
        if (self._isRequire(node)) {
            var key = node.arguments[0].value;
            node.arguments[0].update(JSON.stringify(mapped[key]));
        }
    }).toString();
    
    this.push(row);
    next();
};

IntReq.prototype._flush = function (next) {
    this.push(null);
    next();
};

IntReq.prototype._isRequire = function (node) {
    var c = node.callee;
    return c && node.type === 'CallExpression'
        && c.type === 'Identifier'
        && c.name === this._name
    ;
}
