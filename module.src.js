/*!
 * $script.js Async loader & dependency manager
 * https://github.com/ded/script.js
 * (c) Dustin Diaz, Jacob Thornton 2011
 * License: MIT
 */
(function(a,b,c){typeof c["module"]!="undefined"&&c.module.exports?c.module.exports=b():typeof c["define"]!="undefined"&&c["define"]=="function"&&c.define.amd?define(a,b):c[a]=b()})("$script",function(){function p(a,b){for(var c=0,d=a.length;c<d;++c)if(!b(a[c]))return j;return 1}function q(a,b){p(a,function(a){return!b(a)})}function r(a,b,i){function o(a){return a.call?a():d[a]}function t(){if(!--n){d[m]=1,l&&l();for(var a in f)p(a.split("|"),o)&&!q(f[a],o)&&(f[a]=[])}}a=a[k]?a:[a];var j=b&&b.call,l=j?b:i,m=j?a.join(""):b,n=a.length;return setTimeout(function(){q(a,function(a){if(h[a])return m&&(e[m]=1),h[a]==2&&t();h[a]=1,m&&(e[m]=1),s(!c.test(a)&&g?g+a+".js":a,t)})},0),r}function s(c,d){var e=a.createElement("script"),f=j;e.onload=e.onerror=e[o]=function(){if(e[m]&&!/^c|loade/.test(e[m])||f)return;e.onload=e[o]=null,f=1,h[c]=2,d()},e.async=1,e.src=c,b.insertBefore(e,b.firstChild)}var a=document,b=a.getElementsByTagName("head")[0],c=/^https?:\/\//,d={},e={},f={},g,h={},i="string",j=!1,k="push",l="DOMContentLoaded",m="readyState",n="addEventListener",o="onreadystatechange";return!a[m]&&a[n]&&(a[n](l,function t(){a.removeEventListener(l,t,j),a[m]="complete"},j),a[m]="loading"),r.get=s,r.order=function(a,b,c){(function d(e){e=a.shift(),a.length?r(e,d):r(e,b,c)})()},r.path=function(a){g=a},r.ready=function(a,b,c){a=a[k]?a:[a];var e=[];return!q(a,function(a){d[a]||e[k](a)})&&p(a,function(a){return d[a]})?b():!function(a){f[a]=f[a]||[],f[a][k](b),c&&c(e)}(a.join("|")),r},r},this)

/*! module.js Module system
  (c) jkal@gmx.net, https://github.com/jkalbhenn/module.js
  License: GPLv3 or later */
var module = (function () {
  var loadPath = ""
  var namespaceDelimiter = "."
  var namespaceDelimiterRegExp = /\./g
  var root = this
  var loading = {}

  function setDefined (name) {
    if (loading[name] !== undefined) {
      loading[name].forEach(function (ele) { ele() }); delete loading[name]
    }
  }

  function ensureTrailingSlash (str) {
    return str.charAt(str.length - 1) == "/" ? str : str + "/"
  }

  function namespace (name) {
    return name.split(namespaceDelimiter).reduce(
      function (prev, ele) { return prev[ele] || (prev[ele] = {}) },
      root
    )
  }

  function namespaceExistsNot (name) {
    var prev = root
    return !name.split(namespaceDelimiter).every(function (ele) {
      return prev = prev[ele]
    })
  }

  function nameToFullPath (arg) {
    return loadPath + arg.replace(namespaceDelimiterRegExp, "/") + ".js"
  }

  function simpleObjectMerge (target, source) {
    for (var key in source) { target[key] = source[key] }
  }

  function module (imports, ready) {
    if (!Array.isArray(imports)) { imports = [imports] }
    var imports = imports.filter(namespaceExistsNot)
    if (imports.length) {
      var count = imports.length
      var importPaths = []
      imports.forEach(function (ele) {
	var afterLoad = function () { count == 1 ? ready() : count -= 1 }
	if (loading[ele] !== undefined) { loading[ele].push(afterLoad) }
	else {
	  loading[ele] = [afterLoad]
	  importPaths.push(nameToFullPath(ele))
	}
      })
      $script(importPaths)
    }
    else { ready() }
  }

  module.loadPath = function (arg) {
    return arg ? loadPath = ensureTrailingSlash(arg) : loadPath
  }

  module.define = function (name, imports, body) {
    if (!body) { body = imports; imports = [] }
    if (!loading[name]) { loading[name] = [] }
    module(imports, function () {
      body(function (exports) {
        if (exports) { simpleObjectMerge(namespace(name), exports) }
        setDefined(name)
      })
    })
  }

  module.wrap = function (name, nonModulePath, body) {
    module.define(name, function (exports) {
      $script(loadPath + nonModulePath, body ? function () { body(exports) } : exports)
    })
  }

  return module
})()
