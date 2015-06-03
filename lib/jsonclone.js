/*
 * jsonclone
 * svoeller99/jsonclone
 *
 * Copyright (c) 2014 Sean Voeller
 * Licensed under the MIT license.
 */

'use strict';

function getFuncName(func) {
  return /^function\s+([\w\$]+)\s*\(/.exec(func.toString())[1];
}

/**
 * IE monkey patch
 */
if (Function.prototype.name === undefined && Object.defineProperty !== undefined) {
  Object.defineProperty(Function.prototype, 'name', {
    get: function () {
      var funcNameRegex = /function\s([^(]{1,})\(/;
      var results = (funcNameRegex).exec((this).toString());
      return (results && results.length > 1) ? results[1].trim() : "";
    }
  });
}

var typesMap = {};
var types = {
  add: function () {
    var args = Array.prototype.slice.call(arguments);
    var funcName, func;
    if (typeof args[0] === 'string') {
      funcName = args[0];
      func = args[1];
    } else if (typeof args[0] === 'function') {
      func = args[0];
      funcName = getFuncName(func); //func.name;
    } else {
      throw new Error("Unsupported first argument type " + typeof args[0]);
    }
    typesMap[funcName] = func;
  },
  get: function (name) {
    return typesMap[name];
  }
};

function getConstructorName(obj) {
  return obj.constructor.name;
}

function stringify(obj) {
  function replacer(key, value) {
    if (!key) {
      var typeName = getConstructorName(value);
      value = JSON.parse(JSON.stringify(value));
      value.__jsonCloneType__ = typeName;
    }
    return value;
  }

  var json = JSON.stringify(obj, replacer);
  return json;
}

function copyProperties(source, dest) {
  for (var prop in source) {
    if (source.hasOwnProperty(prop)) {
      dest[prop] = source[prop];
    }
  }
}

function parse(json) {
  function reviver(key, value) {
    if (!key) {
      var typeKey = value.__jsonCloneType__;
      var Type = types.get(typeKey);
      if (!Type) {
        throw new Error("No registered type " + typeKey);
      }
      var result = new Type();
      copyProperties(value, result);
      return result;
    }
    return value;
  }

  var obj = JSON.parse(json, reviver);
  return obj;
}

exports.types = types;
exports.getConstructorName = getConstructorName;
exports.stringify = stringify;
exports.parse = parse;