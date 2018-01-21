var html = require('bel')
var assert = require('assert')

var c = require('./component')

module.exports = link

var _emit = null
var _loading = null

// TODO: central queue to avoid overuse, make queue lifo
// TODO: add opts to control max concurrent (or cap at like 2)
function link (text, name, action) {
  var args = []
  for (var i = 1, len = arguments.length; i < len; i++) {
    args.push(arguments[i])
  }
  var url = c.url.apply(c.url, args)
  var component = c.apply(c, args)
  return html`<a href="${url}" onclick=${preload}>${text}</a>`

  function preload (e) {
    if (!component.prefetch) return
    e.preventDefault()
    if (_loading && _loading !== url && _emit) {
      _emit('progress:remove')
    }
    _loading = url
    var _started = false
    var timer = setTimeout(() => {
      _started = true
      if (_emit) _emit('progress:start')
    }, 100)
    var args2 = args.slice(2) // remove name & action and add cb
    args2.push(cb)
    component.prefetch.apply(component, args2)

    // TODO: handle error
    function cb () {
      clearTimeout(timer)
      if (_loading == url) {
        if (_started && _emit) {
          _emit('progress:done')
          _emit('progress:remove')
        }
        _loading = null
        if (_emit) _emit('pushState', url)
      }
    }
  }
}

link.emitter = function (emitter) {
  assert.equal(typeof emitter, 'object', 'link.emitter: emitter should be an object')
  _emit = emitter.emit.bind(emitter)
}
