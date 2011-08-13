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
      function doSomething() {
        return 'Did something';
      }

      return function (methodName) {
        if (methodName == 'doSomething') {
          return doSomething;
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
      function x() {
        return 'This is X';
      }

      return function (methodName) {
        if (methodName == 'x') {
          return x;
        }
      }
    }

    function yMethods() {
      function y() {
        return 'This is Y';
      }

      return function (methodName) {
        if (methodName == 'y') {
          return y;
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
      function getName() {
        return name;
      }

      function greet(self) {
        return 'Hello, my name is ' + self('name')();
      }

      return function (methodName) {
        if (methodName == 'name') {
          return getName;
        }
        else if (methodName == 'greet') {
          return greet;
        }
      }
    }

    function happyPersonMethods(name) {
      function getName() {
        return name + '!!!';
      }

      return function (methodName) {
        if (methodName == 'name') {
          return getName;
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
      function getName() {
        return name;
      }

      return function (methodName) {
        if (methodName == 'name') {
          return getName;
        }
      }
    }

    function happyPersonMethods(name) {
      function getName() {
        return name + '!!!';
      }

      return function (methodName) {
        if (methodName == 'name') {
          return getName;
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
