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


function xMethods(x) {
  return function (methodName) {
    switch (methodName) {
    case 'x=':
      return function (newX) {
        x = newX;
      };
    case 'x':
      return function () {
        return x;
      };
    }
  };
}

function yMethods(y) {
  return function (methodName) {
    switch (methodName) {
    case 'y=':
      return function (newY) {
        y = newY;
      };
    case 'y':
      return function () {
        return y;
      }
    }
  };
}

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

yObj = objMaker(yMethods, [100]); //initialize y with 100
xAndYObj = objMaker(xMethods, [5], yObj); //initialize x with 5

log(xAndYObj('x'));
log(xAndYObj('y'));

xAndYObj('x=', 25);
xAndYObj('y=', 30);
log(xAndYObj('x'));
log(xAndYObj('y'));
