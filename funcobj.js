//Keep all those horrible object methods stashed away - this will eventually go
//into a separate file so you don't have to see a single dot.
function callSlice(array, argument) {
  return Array.prototype.slice.call(array, argument);
}

function apply(method, args) {
  return method.apply(null, args);
}

function applyWithSelf(method, self, args) {
  args = callSlice(args, 0);
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



//This is a dot operator and object free zone:

function animalMethods(type) {
  return function (methodName) {
    switch (methodName) {
    case 'type':
      return function () {
        return 'This animal is a ' +  type;
      };
    case 'typeAndName':
      return function (self) {
        return self('introduce')() + ' and I am a ' + type;
      };
    }
  };
}

function dogMethods(name) {
  return function (methodName) {
    //dogMethods
    switch (methodName) {
    case 'bark':
      return function (self) {
        return self('introduce')() + ' and I say WOOF WOOF';
      };
    case 'introduce':
      return function () {
        return 'My name is ' + name;
      };
    case 'sayHello':
      return function (self, otherName) {
        return 'Hello, ' + otherName;
      }
    }
  };
}

function yappyDogMethods() {
  return function (methodName) {
    //yappyDogMethods
    switch (methodName) {
    case 'bark':
      return function (self) {
        return self('introduce')() + ' and I say yip yip yip!';
      };
    }
  };
}



//methodsInitializer: a function that returns methods for the new object
//initArgs: initialization arguments for the methodsInitializer
//superObject: an optional object to inherit methods
function objMaker(methodsInitializer, initArgs, superObject) {
  var methods = apply(methodsInitializer, initArgs);

  function dispatch(methodName, self) {
    self = self || dispatch; //if self given use it, otherwise use this function
    var dispatchArguments = arguments;
    var method = methods(methodName);
    if (method) {
      return function () {
        return applyWithSelf(method, self, arguments);
      };
    }
    if (superObject) { //re-call with superObject (this can happen recursively)
      return function () {
        //when calling super, make sure self is set to the method receiver
        return apply(superObject(methodName, self), arguments);
      }
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

log(fido('bark')());
log(yapper('bark')());
log(yapper('type')());
log(fido('sayHello')('Dave'));
log(fido('typeAndName')());
log(yapper('typeAndName')());
log(yapper('sayHello')('Bob'));
