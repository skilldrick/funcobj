function callSlice(array, argument) {
  return Array.prototype.slice.call(array, argument);
}

function log() {
  var args = Array.prototype.slice.call(arguments);
  console.log(args);
}


function objMaker () {
  var x;

  return function (method) {
    var args = callSlice(arguments, 1);
    switch (method) {
    case 'setX':
      (function () {
        x = args[0];
      })();
      break;
    case 'getX':
      return (function () {
        return x;
      })();
      break;
    default:
      (function () {
        log("Method", method, "not known");
      })();
    }
  };
}

obj = objMaker();
obj('setX', 100);
log(obj('getX'));
