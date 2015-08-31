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
      it('should have a registry that stores and serves up types', function() {
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
});