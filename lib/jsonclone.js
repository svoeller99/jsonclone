/*
 * jsonclone
 * svoeller99/jsonclone
 *
 * Copyright (c) 2014 Sean Voeller
 * Licensed under the MIT license.
 */

'use strict';

function filterFunctionsOLD(obj) {
  var functions = [],
      propName, prop;
  for(propName in obj) {
    prop = obj[propName];
    if(typeof prop !== 'function') {
      continue;
    }
    functions.push({name:propName, val:prop});
  }
  return functions;
}

function parseFunctionOLD(func) {
  var funcStr = func.toString();
  var newFuncStr = funcStr.substring(funcStr.indexOf('{')+1, funcStr.lastIndexOf('}')).trim();
  return newFuncStr;
}

function stringifyOLD(obj) {
  var clone = JSON.parse(JSON.stringify(obj));
  var metadata = clone.__jsonclone__ = {};

  filterFunctionsOLD(obj).forEach(function(func){
    var funcStr = parseFunctionOLD(func.val);
    metadata[func.name] = funcStr;
  });
  return JSON.stringify(clone);
}

function parseOLD(json) {
  var clone = JSON.parse(json);
  var metadata = clone.__jsonclone__;
  for(var funcName in metadata) {
    /*jslint evil: true */
    clone[funcName] = new Function(metadata[funcName]);
  }
  delete clone.__jsonclone__;
  return clone;
}

function cloneOLD(obj) {
  return parseOLD(stringifyOLD(obj));
}

function getFuncName(func) {
  return /^function\s+([\w\$]+)\s*\(/.exec(func.toString())[1];
}

/**
  * IE monkey patch
  */
if (Function.prototype.name === undefined && Object.defineProperty !== undefined) {
  Object.defineProperty(Function.prototype, 'name', {
    get: function() {
      var funcNameRegex = /function\s([^(]{1,})\(/;
      var results = (funcNameRegex).exec((this).toString());
      return (results && results.length > 1) ? results[1].trim() : "";
    },
    set: function(value) {}
  });
}

var typesMap = {};
var types = {
  add : function() {
    var args = Array.prototype.slice.call(arguments);
    var funcName, func;
    if(typeof args[0] === 'string') {
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
  get : function(name) {
    return typesMap[name];
  }
};

function getConstructorName(obj) {
  return obj.constructor.name;
}

function stringify(obj) {
  function replacer(key, value) {
    if(!key) {
      var typeName = getConstructorName(value);
      value = JSON.parse(JSON.stringify(value));
      value.__jsonCloneType__ = typeName;
    }
    return value;
  }
  var json = JSON.stringify(obj, replacer);
  return json;
}

exports.stringifyOLD = stringifyOLD;
exports.parseOLD = parseOLD;
exports.cloneOLD = cloneOLD;

exports.types = types;
exports.getConstructorName = getConstructorName;
exports.stringify = stringify;