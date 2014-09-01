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

exports.clone = function(obj) {
  var stuff = JSON.parse(JSON.stringify(obj));

  var functions = filterFunctions(obj);
  functions.forEach(function(func){
    var funcStr = parseFunction(func.val);
    
    /*jslint evil: true */
    stuff[func.name] = new Function(funcStr);
  });
  return stuff;
};
