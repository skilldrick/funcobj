//Keep all those horrible object methods stashed away - this will eventually go
//into a separate file so you don't have to see a single dot.
function callSlice(array, argument) {
  return Array.prototype.slice.call(array, argument);
}

function apply(method, args) {
  return method.apply(null, args);
}

function push(array, arg) {
  return array.push(arg);
}

function log() {
  var args = Array.prototype.slice.call(arguments);
  console.log(args);
}





function animalMethods(type) {
  return function (methodName) {
    switch (methodName) {
    case 'type':
      return function () {
        return 'This animal is a ' +  type;
      };
    }
  };
}

function dogMethods(name) {
  return function (methodName) {
    switch (methodName) {
    case 'bark':
      return function () {
        return 'WOOF WOOF';
      };
    case 'name':
      return function () {
        return 'My name is ' + name;
      };
    }
  };
}

function yappyDogMethods() {
  return function (methodName) {
    switch (methodName) {
    case 'bark':
      return function () {
        return 'yip yip yip!';
      };
    }
  };
}



//methodsInitializer: a function that returns methods for the new object
//initArgs: initialization arguments for the methodsInitializer
//superObject: an optional object to inherit methods
function objMaker(methodsInitializer, initArgs, superObject) {
  var methods = apply(methodsInitializer, initArgs);

  return function (methodName) {
    var args = callSlice(arguments, 1);
    var method = methods(methodName);
    if (method) {
      return apply(method, args);
    }
    if (superObject) {
      return apply(superObject, arguments);
    }
    log("Method", methodName, "not known");
  };
}


var dog = objMaker(animalMethods, ['dog']);
var fido = objMaker(dogMethods, ['fido'], dog);
var yappyFido = objMaker(yappyDogMethods, [], fido);

log(fido('bark'));
log(yappyFido('bark'));
