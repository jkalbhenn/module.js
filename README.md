# module.js
A clean and simple module system for javascript.

  - Provides a concise syntax for defining and using modular code
  - Automatically loads all required modules
  - Supports namespaces and maps namespaces to directory structures

# Usage Examples
Let ```/srv/http``` be our web server root, it could be any path.

In file ``/srv/http/lib/javascript/a/b/c.js``, defining a module:
```javascript
$module.define("a.b.c", function (exports) {

  var myvariable = 1

  exports({myvariable: myvariable})
})
```

In another file, say ``/srv/http/x.js``, including the module:
```javascript
$module.loadPath("/lib/javascript/")

$module("a.b.c", function () {

  console.log("a variable from module a.b.c: ", a.b.c.myvariable)

  // all a.b.c bindings are available in the object a.b.c

})
```

Defining a module named "a.b.c" with dependencies on other modules, named "d" and "e.f":
```javascript
$module.define("a.b.c", ["d", "e.f"], function (exports) {

  var a = 1

  exports({a: a})
})
```

Including multiple modules:
```javascript
$module(["a.b.c", "d.e", "f"], function () {
  //module bindings available in the objects a.b.c, d.e and f
})
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
$module.define(name, imports, body)
// $module.define :: string, [string\Array(string, ...)], function(function)
```
or:
```javascript
$module.define(name, body)
```

## Module loading
```javascript
$module(imports, body)
// $module :: string\Array(string, ...), function
```

## Setting the load path
```javascript
$module.loadPath("/lib/javascript")
// $module.loadPath :: string
```

Usually relative to a web server root. The default load path is the current directory.
Setting the load path would only be necessary once, in a toplevel javascript file that only includes modules.

## Module names
Names are strings of arbitrary length, corresponding to relative paths under load path which identify javascript files, with "/" replaced by dots and without filename extensions.

### Example
- Load path: "/lib/javascript/"
- Module path: "/lib/javascript/a/b/c.js"
- Module name:
    "a.b.c"

## Compatibility
There are two builds with equivalent functionality - one only for modern browsers, and one for modern and older browsers.

``module.js`` runs only on browsers supporting at least javascript 1.8, that is, all common, up to date browsers in the year 2012.

``module.compat.js`` is like ``module.js`` but includes support for older browser versions, for example microsoft internet explorer before version 9.

## Implementation
module.js is implemented in plain javascript, ~1300 bytes minified and gzipped, and uses [ded/script.js](https://github.com/ded/script.js) for loading dependencies.

- Modules are not imported multiple times
- Dependencies are loaded asynchronuously

## License
The module.js part of the code stands under a GPLv3 license. ``module.src.js`` contains comments for detailed licensing information.