
var isFunction = function(value) {
    return typeof value === 'function';
}
var isArray = Array.isArray;

var isNumber = function(value) {
    return typeof value === 'number';
}

var isArrayLike = function(obj) {
  if (obj == null ) return false;
  if (isArray(obj) || isString(obj) ) return true;
  var length = 'length' in Object(obj) && obj.length;
  return isNumber(length) &&
    (length >= 0 && ((length - 1) in obj || obj instanceof Array) || typeof obj.item === 'function');
}

var isBlankObject = function(value) {
  return value !== null && typeof value === 'object' && !Object.getPrototypeOf(value);
}

var forEachCustom = function(obj, iterator, context) {
  var key, length;
  if (obj) {
    if (isFunction(obj)) {
      for (key in obj) {
        if (key !== 'prototype' && key !== 'length' && key !== 'name' && obj.hasOwnProperty(key)) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    } else if (isArray(obj) || isArrayLike(obj)) {
      var isPrimitive = typeof obj !== 'object';
      for (key = 0, length = obj.length; key < length; key++) {
        if (isPrimitive || key in obj) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    } else if (obj.forEach && obj.forEach !== forEach) {
        obj.forEach(iterator, context, obj);
    } else if (isBlankObject(obj)) {
      // createMap() fast path --- Safe to avoid hasOwnProperty check because prototype chain is empty
      for (key in obj) {
        iterator.call(context, obj[key], key, obj);
      }
    } else if (typeof obj.hasOwnProperty === 'function') {
      // Slow path for objects inheriting Object.prototype, hasOwnProperty check needed
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    } else {
      // Slow path for objects which do not have a method `hasOwnProperty`
      for (key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    }
  }
  return obj;
}

var isString = function(value) {
    return typeof value === 'string';
}



function trimString(s) {
  var l=0, r=s.length -1;
  while(l < s.length && s[l] == ' ') l++;
  while(r > l && s[r] == ' ') r-=1;
  return s.substring(l, r+1);
}

function compareObjects(o1, o2) {
  var k = '';
  for(k in o1) if(o1[k] != o2[k]) return false;
  for(k in o2) if(o1[k] != o2[k]) return false;
  return true;
}

function itemExists(haystack, needle) {
  for(var i=0; i<haystack.length; i++) if(compareObjects(haystack[i], needle)) return true;
  return false;
}

function searchFor(toSearch, objects) {
  var results = [];
  toSearch = trimString(toSearch); // trim it
  for(var i=0; i<objects.length; i++) {
    for(var key in objects[i]) {
      if((typeof objects[i][key] !='object') && (typeof objects[i][key] !='undefined') && objects[i][key].toString().toLowerCase().indexOf(toSearch.toLowerCase())!=-1) {
        if(!itemExists(results, objects[i])) results.push(objects[i]);
      }
    }
  }
  return results;
}

function keySearchFor(toSearch, objects, searchKey) {
    var results = [];
    toSearch = trimString(toSearch); // trim it
    for (var i = 0; i < objects.length; i++) {
        for (var key in objects[i]) {
            if ((searchKey == key) && (typeof objects[i][key] != 'object') && (typeof objects[i][key] != 'undefined') && objects[i][key].toString().toLowerCase().indexOf(toSearch.toLowerCase()) != -1) {
                if (!itemExists(results, objects[i])) results.push(objects[i]);
            }
        }
    }
    return results;
}

module.exports = {
    forEachCustom: forEachCustom,
    searchFor: searchFor,
    keySearchFor: keySearchFor
}