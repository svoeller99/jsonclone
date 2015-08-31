'use strict';

var jsonclone = require('../lib/jsonclone.js');
var assert = require('chai').assert;

describe('jsonclone', function() {
  function Cog(id) {
    this.id = id;
  }
  Cog.prototype.chirp = function () {
    return "Hello I am cog " + this.id;
  };
  function Wheel() {
  }

  describe('types', function() {
    // FIXME: dependency between setup performed in this test and subsequent tests
    it('should be a registry that stores and serves up types', function() {
      jsonclone.types.add(Cog);
      var CogCtor = jsonclone.types.get('Cog');
      assert.equal(Cog, CogCtor, 'should be the same constructor function');
      var cogChirp = new CogCtor(1).chirp();
      assert.equal(cogChirp, "Hello I am cog 1");

      jsonclone.types.add('myWheel', Wheel);
      var wheel = jsonclone.types.get('myWheel');
      assert.equal(Wheel, wheel, 'should be the same constructor function when registered with specific name');
    });
  });

  describe('getConstructorName', function(){
    it('should determine the name of an object\'s constructor', function(){
      var ctorName = jsonclone.getConstructorName(new Cog());
      assert.equal('Cog', ctorName, 'constructor name');
    });
  });

  describe('stringify', function(){
    it('should serialize type information into json', function(){
      var obj = new Cog(1);

      var json = jsonclone.stringify(obj);

      var parsed = JSON.parse(json);
      assert.equal(parsed.__jsonCloneType__, 'Cog', 'serialized type info');
      assert.equal(typeof obj.__jsonCloneType__, 'undefined', 'should not impact source object');
    });
  });

  describe('parse', function(){
    it('should deserialize type information and use it resolve the appropriate constructor', function(){
      var obj = new Cog(5);

      var json = jsonclone.stringify(obj);
      var parsed = jsonclone.parse(json);

      assert.equal(parsed.chirp(), "Hello I am cog 5");
      assert.equal(parsed.constructor, Cog, "It's a Cog!");
    });
  });

  describe('clone', function(){
    it('should clone objects', function(){
      var obj = new Cog(5);
      var cloned = jsonclone.clone(obj);
      assert.equal(obj.chirp(), cloned.chirp(), 'should have a legit clone here');
    });
  });
});