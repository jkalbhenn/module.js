/*!
 * $script.js JS loader & dependency manager
 * https://github.com/ded/script.js
 * (c) Dustin Diaz 2014 | License MIT
 */
(function(e,t){typeof module!="undefined"&&module.exports?module.exports=t():typeof define=="function"&&define.amd?define(t):this[e]=t()})("$script",function(){function h(e,t){for(var n=0,i=e.length;n<i;++n)if(!t(e[n]))return r;return 1}function p(e,t){h(e,function(e){return!t(e)})}function d(e,t,n){function g(e){return e.call?e():u[e]}function y(){if(!--m){u[o]=1,s&&s();for(var e in f)h(e.split("|"),g)&&!p(f[e],g)&&(f[e]=[])}}e=e[i]?e:[e];var r=t&&t.call,s=r?t:n,o=r?e.join(""):t,m=e.length;return setTimeout(function(){p(e,function(e){if(e===null)return y();if(l[e])return o&&(a[o]=1),l[e]==2&&y();l[e]=1,o&&(a[o]=1),v(!/^https?:\/\//.test(e)&&c?c+e+".js":e,y)})},0),d}function v(n,i){var u=e.createElement("script"),a=r;u.onload=u.onerror=u[o]=function(){if(u[s]&&!/^c|loade/.test(u[s])||a)return;u.onload=u[o]=null,a=1,l[n]=2,i()},u.async=1,u.src=n,t.insertBefore(u,t.lastChild)}var e=document,t=e.getElementsByTagName("head")[0],n="string",r=!1,i="push",s="readyState",o="onreadystatechange",u={},a={},f={},l={},c;return d.get=v,d.order=function(e,t,n){(function r(i){i=e.shift(),e.length?d(i,r):d(i,t,n)})()},d.path=function(e){c=e},d.ready=function(e,t,n){e=e[i]?e:[e];var r=[];return!p(e,function(e){u[e]||r[i](e)})&&h(e,function(e){return u[e]})?t():!function(e){f[e]=f[e]||[],f[e][i](t),n&&n(r)}(e.join("|")),d},d.done=function(e){d([null],e)},d})

/*! module.js Module system
  (c) jkal@posteo.eu 2012-2016, https://github.com/jkalbhenn/module.js
  License: gpl3 or later */
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
    if (!body) {
      if (!imports) { namespace(name); return }
      body = imports; imports = []
    }
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
