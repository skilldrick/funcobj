funcobj
=======

I'll probably come up with a better name at some point.

Have you ever wished that you could create objects in JavaScript without using
JavaScript objects? No? Well, neither have I really, but I wanted to see if it
was possible.

The rules
---------

I've set myself two major limitations:

1. Don't create any plain old JavaScript objects (functions, arrays etc. are allowed)
2. Don't use the dot operator.

The second rule is tricky, because there are calls to JavaScript built-ins
(e.g. `Array.prototype.call`) which are impossible without dots. So I've
allowed myself a few functions at the top of the file that map these operations
to straight function calls.

The implementation
------------------

Basically, I wanted to keep the object/inheritance engine separate from the
method definitions, so I made a function called `objMaker`, which makes
objects, based on a set of methods, arguments for initializing those methods,
and an optional super object.

To avoid using object literals, the mapping from method name to method body is
done via a switch statement. A methods function takes a string and returns a
method. That method is passed `self` (which represents the current object), as
in Python.

If you call a method on an object that doesn't exist, the `dispatch` function
checks to see if a super object is defined. If it is, that object is called
with the same method name, and with `self` set to the current `self`. This
means that a method called on a super object can still access methods defined
on the original message receiver (which is how OO is meant to work).

Disclaimer
----------

This is just a silly experiment. I'm not expecting anyone to use it for
anything, and I know it's probably got horrible performance implications. But
sometimes it's fun just to see how far you can shape the language.

For a slightly saner alternative technique, have a look at [Peter Michaux's SICP Classes for
JavaScript](http://peter.michaux.ca/articles/sicp-classes-for-javascript).
