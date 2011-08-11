
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
