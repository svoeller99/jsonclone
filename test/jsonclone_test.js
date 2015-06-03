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

var MyStuff = function (foo, bar) {
  this.foo = foo;
  this.bar = bar;
};

MyStuff.prototype.sayMyName = function () {
  return this.foo + ' ' + this.bar;
};

var testObj = new MyStuff('sean', 'voeller');

var cogChirp;

function Cog(id) {
  this.id = id;
}
Cog.prototype.chirp = function () {
  return cogChirp = "Hello I am cog " + this.id;
};
function Wheel() {

}

exports.jsonclone = {
  setUp: function (done) {
    // setup here
    done();
  },
  'jsonclone - clone preserves function properties': function (test) {
    test.expect(1);
    var theClone = jsonclone.cloneOLD(testObj);
    test.equal(theClone.sayMyName(), 'sean voeller', 'should be sean voeller');
    test.done();
  },
  'jsonclone - stringify/parse roundtrip preserves properties': function (test) {
    test.expect(1);
    var stringified = jsonclone.stringifyOLD(testObj);
    var theClone = jsonclone.parseOLD(stringified);
    test.equal(theClone.sayMyName(), 'sean voeller', 'should be sean voeller');
    test.done();
  },
  'jsonclone - parse strips metadata object': function (test) {
    test.expect(1);
    var clone = jsonclone.parseOLD(jsonclone.stringifyOLD(testObj));
    test.ok(typeof clone.__jsonclone__ === 'undefined');
    test.done();
  },

  // new stuff
  'jsonclone - has a registry that stores and serves up types': function (test) {
    jsonclone.types.add(Cog);
    var CogCtor = jsonclone.types.get('Cog');
    test.equal(Cog, CogCtor, 'should be the same constructor function');
    new CogCtor(1).chirp();
    test.equal(cogChirp, "Hello I am cog 1");

    jsonclone.types.add('myWheel', Wheel);
    var wheel = jsonclone.types.get('myWheel');
    test.equal(Wheel, wheel, 'should be the same constructor function when registered with specific name');
    test.done();
  },

  'jsonclone - it can get your object\'s constructor function name, man!': function (test) {
    var ctorName = jsonclone.getConstructorName(new Cog());
    test.equal('Cog', ctorName, 'constructor name');
    test.done();
  },

  'jsonclone - it can serialize type name into json': function (test) {
    var obj = new Cog(1);

    var json = jsonclone.stringify(obj);

    var parsed = JSON.parse(json);
    test.equal(parsed.__jsonCloneType__, 'Cog', 'serialized type info');
    test.equal(typeof obj.__jsonCloneType__, 'undefined', 'should not impact source object');
    test.done();
  },

  'jsonclone - it can deserialize and resolve the appropriate prototype': function (test) {
    var obj = new Cog(5);

    var json = jsonclone.stringify(obj);
    var parsed = jsonclone.parse(json);

    test.equal(parsed.chirp(), "Hello I am cog 5");
    test.equal(parsed.constructor, Cog, "It's a Cog!");

    test.done();
  },
};
