function callSlice(array, argument) {
  return Array.prototype.slice.call(array, argument);
}

function apply(method, args) {
  return method.apply(null, args);
}

function log() {
  var args = Array.prototype.slice.call(arguments);
  console.log(args);
}


var xMethods = (function () {
  //instance variables go here
  var x;

  //methods go here
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
})();

var yMethods = (function () {
  var y;

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
})();

function objMaker(methods) {
  return function (methodName) {
    var args = callSlice(arguments, 1);
    var method = methods(methodName);
    if (method) {
      return apply(method, args);
    }
    else {
      log("Method", methodName, "not known");
    }
  };
}

xObj = objMaker(xMethods);
xObj('x=', 100);
var x = xObj('x');
log(x);

yObj = objMaker(yMethods);
yObj('y=', 50);
var y = yObj('y');
log(y);
