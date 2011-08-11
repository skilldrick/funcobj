describe('objMaker', function () {
  describe('methods initializer', function () {
    it('calls the methods initializer', function () {
      var methodsInit = jasmine.createSpy('methods initializer');
      objMaker(methodsInit);
      expect(methodsInit).toHaveBeenCalled();
    });

    it('passes arguments to methods initializer', function () {
      var methodsInit = jasmine.createSpy('methods initializer');
      objMaker(methodsInit, [1, 'name', ['array']]);
      expect(methodsInit).toHaveBeenCalledWith(1, 'name', ['array']);
    });
  });

  describe('an object made with object maker', function () {
    function exampleMethods() {
      return function (methodName) {
        if (methodName == 'doSomething') {
          return function () {
            return 'Did something';
          };
        }
      }
    }

    beforeEach(function () {
      this.obj = objMaker(exampleMethods);
    });

    it('responds to known messages', function () {
      expect(this.obj('doSomething')()).toEqual('Did something');
    });

    it('throws on unknown messages', function () {
      var that = this;
      expect(function () {
        that.obj('doSomethingUnknown')();
      }).toThrow('Method doSomethingUnknown not known');
    });
  });

  describe('an object with inheritance', function () {
    function xMethods() {
      return function (methodName) {
        if (methodName == 'x') {
          return function () {
            return 'This is X';
          };
        }
      }
    }

    function yMethods() {
      return function (methodName) {
        if (methodName == 'y') {
          return function () {
            return 'This is Y';
          };
        }
      }
    }

    beforeEach(function () {
      this.x = objMaker(xMethods);
      this.y = objMaker(yMethods, [], this.x);
    });

    it('responds to a message on top-level object', function () {
      expect(this.x('x')()).toEqual('This is X');
    });

    it('responds to a message on a super object', function () {
      expect(this.y('y')()).toEqual('This is Y');
    });
  });

  describe('a method on a superobject', function () {
    function personMethods(name) {
      return function (methodName) {
        if (methodName == 'name') {
          return function () {
            return name;
          };
        }
        else if (methodName == 'greet') {
          return function (self) {
            return 'Hello, my name is ' + self('name')();
          }
        }
      }
    }

    function happyPersonMethods(name) {
      return function (methodName) {
        if (methodName == 'name') {
          return function () {
            return name + '!!!';
          };
        }
      }
    }

    beforeEach(function () {
      this.dave = objMaker(personMethods, ['Dave']);
      this.happyDave = objMaker(happyPersonMethods, ['Dave'], this.dave);
    });

    it('should call an overridden method defined on subobject', function () {
      expect(this.dave('greet')()).toEqual('Hello, my name is Dave');
      expect(this.happyDave('greet')()).toEqual('Hello, my name is Dave!!!');
    });
  });

  describe('an overridden method', function () {
    function personMethods(name) {
      return function (methodName) {
        if (methodName == 'name') {
          return function () {
            return name;
          };
        }
      }
    }

    function happyPersonMethods(name) {
      return function (methodName) {
        if (methodName == 'name') {
          return function () {
            return name + '!!!';
          };
        }
      }
    }

    beforeEach(function () {
      this.dave = objMaker(personMethods, ['Dave']);
      this.happyDave = objMaker(happyPersonMethods, ['Dave'], this.dave);
    });

    it('should be able to call a method on super', function () {
      expect(this.happyDave('name')()).toEqual('Dave!!!');
      expect(this.happyDave('name', true)()).toEqual('Dave');
    });
  });
});
