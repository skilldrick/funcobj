function animalMethods(type) {
  function getType() {
    return 'This animal is a ' +  type;
  }

  function typeAndName(self) {
    return self('introduce')() + ' and I am a ' + type;
  }

  return function (methodName) {
    //animalMethods
    switch (methodName) {
    case 'type':
      return getType;
    case 'typeAndName':
      return typeAndName;
    }
  };
}

function dogMethods(name) {
  function bark(self) {
    return self('introduce')() + ' and I say WOOF WOOF';
  }

  function introduce() {
    return 'My name is ' + name;
  }

  function sayHello(self, otherName) {
    return 'Hello, ' + otherName;
  }

  return function (methodName) {
    //dogMethods
    switch (methodName) {
    case 'bark':
      return bark;
    case 'introduce':
      return introduce;
    case 'sayHello':
      return sayHello;
    }
  };
}

function yappyDogMethods() {
  function bark(self) {
    return self('introduce')() + ' and I say yip yip yip!';
  }
    
  return function (methodName) {
    //yappyDogMethods
    switch (methodName) {
    case 'bark':
      return bark;
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
