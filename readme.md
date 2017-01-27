# module.js
a clean and simple module system for javascript.

  - provides a concise syntax for the creation and use of modular code
  - more [functional](https://en.wikipedia.org/wiki/Functional_programming), simpler and easier to use than requireJs
  - non-modules can be made to be a module quickly without changing their code
  - because only exported bindings of a module are accessible to module users, internal utility bindings can not create name conflicts in the top-level namespace ([information encapsulation](http://en.wikipedia.org/wiki/information_hiding))
  - modules are sets of variables stored in predictably named global objects
  - multiple modules can be defined in a single file
  - autoload for modules that are not already loaded. maps module names to url paths and uses a load path base url
  - module code is not executed unless all dependencies are ready

# usage examples
let ```/srv/http``` be our web server root, it could be any path.

in file ``/srv/http/lib/javascript/a/b/c.js``, define a module:
```javascript
module.define("a.b.c", function (export) {
  var myvariable = 1
  export({myvariable: myvariable})
})
```

in another file, say ``/srv/http/x.js``, include the module:
```javascript
module.loadPath("/lib/javascript/")

module("a.b.c", function () {
  console.log("a variable from module a.b.c: ", a.b.c.myvariable)
  // all "a.b.c" bindings are available in the global object a.b.c
})
```

define a module named "a.b.c" with dependencies on other modules named "d" and "e.f":
```javascript
module.define("a.b.c", ["d", "e.f"], function (export) {
  var a = 1
  export({a: a})
})
```

include multiple modules:
```javascript
module(["a.b.c", "d.e", "f"], function () {
  // module bindings available in the objects a.b.c, d.e and f
})
```

load and wrap a plain javascript file:
```javascript
module.wrap("jquery", "plain/jquery.js")
```
all bindings will be available as if the javascript file had been loaded separately. an empty global object "jquery" will be created.

or in case the plain javascript file is already loaded, define an empty module:
```javascript
module.define("jquery")
```

## setup
include ``module.js`` or ``module.compat.js`` in the code of your web application.
for example in an html file:

```html
<script src="module.js"></script>
<script src="yourcode.js"></script>
```

# syntax
## module definition
```javascript
module.define(name, imports, body)
// module.define :: string, [string\array(string, ...)], function(function)
```
```javascript
module.define(name, body)
```
```javascript
module.define(name)
```

the last form creates an empty object for the module if an object with the name does not already exist.

### wrapping plain javascript files
unless you wrap javascript code in a ``module.define`` with a list of exports, bindings of the plain javascript file will not be made available in a global object named like the module.
but for dependency resolution it is possible to define an empty module after the code has been loaded.

#### without automatic file loading
use module.define().
for example when the plain javascript file has already been loaded but should be available as a possible module dependency.
```javascript
module.define(name)
```
this is equivalent to using ``module.define`` and calling ``export`` without arguments.

#### with automatic file loading
```javascript
module.wrap(name, nonModulePath, body)
// module.wrap :: string, string, [function(function)]
```
```javascript
module.wrap(name, nonModulePath)
```

``nonModulePath`` is a typical filesystem path with "/" and filename extension, relative to ``loadPath``.
the file will be evaluated as if it was included at the top-level.

## module loading
```javascript
module(imports, body)
// module :: string\array(string, ...), function
```

## setting the load path
```javascript
module.loadPath("/lib/javascript")
// module.loadPath :: string
```

usually relative to a web server root. the default load path is the current directory.
setting the load path would usually only be necessary once.

## module names
names are strings of arbitrary length, corresponding to relative paths under load path which identify javascript files, with "/" replaced by dots and without filename extensions.

### example
- load path: "/lib/javascript/"
- module path: "/lib/javascript/a/b/c.js"
- module name:
    "a.b.c"

## compatibility
there are two builds with equivalent functionality - one only for modern browsers, and one for modern and older browsers.
* ``module.js`` runs only on browsers supporting at least javascript 1.8, that is, all common, up to date browsers in the year 2012.
* ``module.compat.js`` is like ``module.js`` but includes support for older browser versions, for example microsoft internet explorer before version 9.

## implementation
module.js is implemented in plain javascript, ~11 kilobits minified and gzipped, and uses [ded/script.js](https://github.com/ded/script.js) to autoload dependencies.

- modules are never imported multiple times
- dependencies are loaded asynchronuously

## license
- module.js part of the code: [gpl3](http://www.gnu.org/licenses/gpl-3.0.txt) or later versions. ``module.src.js`` contains easily visible comments for detailed licensing information
- module.js documentation including this text: [cc-by-sa](http://creativecommons.org/licenses/by-sa/4.0/)

## alternatives
* [browserify](http://browserify.org/) (mit license) uses modules defined like node.js modules and creates one pre-compiled file
