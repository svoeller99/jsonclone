/*
 * jsonclone
 * svoeller99/jsonclone
 *
 * Copyright (c) 2014 Sean Voeller
 * Licensed under the MIT license.
 */

'use strict';

function filterFunctions(obj) {
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

function parseFunction(func) {
  var funcStr = func.toString();
  var newFuncStr = funcStr.substring(funcStr.indexOf('{')+1, funcStr.lastIndexOf('}')).trim();
  return newFuncStr;
}

exports.stringify = function(obj) {
  var clone = JSON.parse(JSON.stringify(obj));
  var metadata = clone.__jsonclone__ = {};

  filterFunctions(obj).forEach(function(func){
    var funcStr = parseFunction(func.val);
    metadata[func.name] = funcStr;
  });
  return JSON.stringify(clone);
};

exports.parse = function(json) {
  var clone = JSON.parse(json);
  var metadata = clone.__jsonclone__;
  for(var funcName in metadata) {
    /*jslint evil: true */
    clone[funcName] = new Function(metadata[funcName]);
  }
  delete clone.__jsonclone__;
  return clone;
};

exports.clone = function(obj) {
  return this.parse(this.stringify(obj));
};
