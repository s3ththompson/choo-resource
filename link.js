var html = require('bel')
var assert = require('assert')

var c = require('./component')

module.exports = link

var _emit = null
var _loading = null

// TODO: central queue to avoid overuse, make queue lifo
// TODO: add opts to control max concurrent (or cap at like 2)
function link (text, route) {
  var args = []
  for (var i = 1; i < arguments.length; i++) {
    args.push(arguments[i])
  }
  var component = c.apply(c, args)
  return html`<a href="${route}" onclick=${preload}>${text}</a>`

  function preload (e) {
    if (!component.prefetch) return
    e.preventDefault()
    if (_loading && _loading !== route && _emit) {
      _emit('progress:remove')
    }
    _loading = route
    var _started = false
    var timer = setTimeout(() => {
      _started = true
      if (_emit) _emit('progress:start')
    }, 100)

    var params = c.params(route)
    var args2 = params.concat(args.slice(1)) // remove route
    args2.push(cb) // add cb
    component.prefetch.apply(component, args2)

    // TODO: handle error
    function cb () {
      clearTimeout(timer)
      if (_loading == route) {
        if (_started && _emit) {
          _emit('progress:done')
          _emit('progress:remove')
        }
        _loading = null
        if (_emit) _emit('pushState', route)
      }
    }
  }
}

link.emitter = function (emitter) {
  assert.equal(
    typeof emitter,
    'object',
    'link.emitter: emitter should be an object'
  )
  _emit = emitter.emit.bind(emitter)
}
