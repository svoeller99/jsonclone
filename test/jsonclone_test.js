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

exports.jsonclone = {
  setUp: function(done) {
    // setup here
    done();
  },
  'jsonclone - preserve properties': function(test) {
    test.expect(1);
    // tests here
    var theClone = jsonclone.clone(new MyStuff('sean', 'voeller'));
    test.equal(theClone.sayMyName(), 'sean voeller', 'should be sean voeller');
    //test.equal(jsonclone.jsonclone(), 'awesome', 'should be awesome.');
    test.done();
  }
};
