//Keep all those horrible object methods stashed away - this will eventually go
//into a separate file so you don't have to see a single dot.
function callSlice(array, argument) {
  return Array.prototype.slice.call(array, argument);
}

function apply(method, args) {
  return method.apply(null, args);
}

function applyWithSelf(method, self, args) {
  args.unshift(self); //make self first argument
  return apply(method, args);
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
      return function (self) {
        return self('name') + ' and I say WOOF WOOF';
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
      return function (self) {
        return self('name') + ' and I say yip yip yip!';
      };
    }
  };
}



//methodsInitializer: a function that returns methods for the new object
//initArgs: initialization arguments for the methodsInitializer
//superObject: an optional object to inherit methods
function objMaker(methodsInitializer, initArgs, superObject) {
  var methods = apply(methodsInitializer, initArgs);

  function dispatch(methodName) {
    var args = callSlice(arguments, 1);
    var method = methods(methodName);
    if (method) {
      return applyWithSelf(method, dispatch, args);
    }
    if (superObject) {
      return apply(superObject, arguments);
    }
    log("Method", methodName, "not known");
  }
  return dispatch;
}



function dogMaker(name) {
  var animal = objMaker(animalMethods, ['dog']);
  return objMaker(dogMethods, [name], animal);
}

function yappyDogMaker(name) {
  var dog = dogMaker(name);
  return objMaker(yappyDogMethods, [], dog);
}

var fido = dogMaker('Fido');
var yapper = yappyDogMaker('Yapper');

log(fido('bark'));
log(yapper('bark'));
