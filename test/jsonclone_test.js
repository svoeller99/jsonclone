'use strict';

var jsonclone = require('../lib/jsonclone.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var MyStuff = function(foo, bar) {
  this.foo = foo;
  this.bar = bar;
};

MyStuff.prototype.sayMyName = function() {
  return this.foo + ' ' + this.bar;
};

var testObj = new MyStuff('sean', 'voeller');

exports.jsonclone = {
  setUp: function(done) {
    // setup here
    done();
  },
  'jsonclone - clone preserves function properties': function(test) {
    test.expect(1);
    var theClone = jsonclone.clone(testObj);
    test.equal(theClone.sayMyName(), 'sean voeller', 'should be sean voeller');
    test.done();
  },
  'jsonclone - stringify/parse roundtrip preserves properties': function(test) {
    test.expect(1);
    var stringified = jsonclone.stringify(testObj);
    var theClone = jsonclone.parse(stringified);
    test.equal(theClone.sayMyName(), 'sean voeller', 'should be sean voeller');
    test.done();
  },
  'jsonclone - parse strips metadata object': function(test) {
    test.expect(1);
    var clone = jsonclone.parse(jsonclone.stringify(testObj));
    test.ok(typeof clone.__jsonclone__ === 'undefined');
    test.done();
  }
};
