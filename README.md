# module.js
A clean and simple module system for javascript

  - Provides a concise syntax for the creation and use of modular code
  - Module code is not executed unless all dependencies are ready
  - A module is a set of variables which are stored in separate predictably named global objects
  - Because only selected bindings of a module are accessible to module users, internal utility bindings can not create name conflicts in the top-level namespace ([information encapsulation](http://en.wikipedia.org/wiki/Information_hiding))
  - Multiple modules can be defined in a single file
  - More functional, simpler and easier to use than RequireJS
  - Non-modules can be made to be a module quickly without changing their code
  - Autoload for modules that are not already loaded. Maps module names to directory structures and uses a load path

# Usage Examples
Let ```/srv/http``` be our web server root, it could be any path

In file ``/srv/http/lib/javascript/a/b/c.js``, defining a module:
```javascript
module.define("a.b.c", function (export) {

  var myvariable = 1

  export({myvariable: myvariable})
})
```

In another file, say ``/srv/http/x.js``, including the module:
```javascript
module.loadPath("/lib/javascript/")

module("a.b.c", function () {

  console.log("a variable from module a.b.c: ", a.b.c.myvariable)

  // all a.b.c bindings are available in the object a.b.c

})
```

Defining a module named "a.b.c" with dependencies on other modules, named "d" and "e.f":
```javascript
module.define("a.b.c", ["d", "e.f"], function (export) {

  var a = 1

  export({a: a})
})
```

Including multiple modules:
```javascript
module(["a.b.c", "d.e", "f"], function () {
  //module bindings available in the objects a.b.c, d.e and f
})
```

Wrapping a plain javascript file:
```javascript
module.wrap("jquery", "plain/jquery.js")
```

Or if the plain javascript file is already loaded, defining an empty module:
```javascript
module.define("jquery")
```

## Installation
Include ``module.js`` or ``module.compat.js`` in the code of your web application.
For example in an html file "index.html":

```html
<script src="module.js"></script>
<script src="yourcode.js"></script>
```

# Syntax
## Module definition
```javascript
module.define(name, imports, body)
// module.define :: string, [string\Array(string, ...)], function(function)
```
or:
```javascript
module.define(name, body)
```
or:
```javascript
module.define(name)
```

The last form always creates an empty object for the namespace specified in "name" if it did not previously exist

### Wrapping plain javascript files
#### Without file-loading
Use module.define().
For example when the plain javascript file has already been loaded you can define an empty module
```javascript
module.define(name)
```

#### With file-loading
```javascript
module.wrap(name, nonModulePath, body)
// module.wrap :: string, string, [function(function)]
```
or:
```javascript
module.wrap(name, nonModulePath)
```

``nonModulePath`` is a typical filesystem path with "/" and filename extension, relative to ``loadPath``.
By wrapping a file with the second form, the bindings of the plain javascript file will not be created in an object named like the module.
Instead the file is evaluated as if it was included at the toplevel. This can also be archieved with the first form by calling "export" without arguments

## Module loading
```javascript
module(imports, body)
// module :: string\Array(string, ...), function
```

## Setting the load path
```javascript
module.loadPath("/lib/javascript")
// module.loadPath :: string
```

Usually relative to a web server root. The default load path is the current directory.
Setting the load path would only be necessary once, in a toplevel javascript file that only includes modules

## Module names
Names are strings of arbitrary length, corresponding to relative paths under load path which identify javascript files, with "/" replaced by dots and without filename extensions

### Example
- Load path: "/lib/javascript/"
- Module path: "/lib/javascript/a/b/c.js"
- Module name:
    "a.b.c"

## Compatibility
There are two builds with equivalent functionality - one only for modern browsers, and one for modern and older browsers

``module.js`` runs only on browsers supporting at least javascript 1.8, that is, all common, up to date browsers in the year 2012

``module.compat.js`` is like ``module.js`` but includes support for older browser versions, for example microsoft internet explorer before version 9

## Implementation
module.js is implemented in plain javascript, ~1300 bytes minified and gzipped, and uses [ded/script.js](https://github.com/ded/script.js) for autoloading dependencies

- Modules are never imported multiple times
- Dependencies are loaded asynchronuously

## License
- module.js part of the code: [GPL v3](http://www.gnu.org/licenses/gpl-3.0.txt) or later. ``module.src.js`` contains easily visible comments for detailed licensing information
- module.js documentation including this text: [CC BY-SA](http://creativecommons.org/licenses/by-sa/4.0/)
