var key = require('./lib/key')
var url = require('./lib/url')
var assert = require('assert')

const CACHE_SIZE = 400

var _components = {}
var _actions = ['index', 'show', 'edit']

var box = require('component-box')
box.cache(require('nanolru')(CACHE_SIZE))

module.exports = cache

function cache(name, action) {
  if (_actions.indexOf(action) === -1) return box(name)
  if (action == 'index') return box(key(name, action))
  var _id = id.apply(id, arguments)
  return box(key(name, action), _id)
}

cache.register = function(name, Component) {
  assert.equal(typeof name, 'string', 'component.register: name should be type string')
  assert.equal(typeof Component, 'function', 'component.register: component should be type function')

  _components[name] = Component
  var obj = {}
  obj[name] = function () {
    return new Component()
  }
  box.use(obj)
}

cache.render = function(name, action) {
  var el = cache.apply(this, arguments)

  var args = []
  var _start = 2
  if (_actions.indexOf(action) === -1) _start = 1
  for (var i = _start, len = arguments.length; i < len; i++) {
    args.push(arguments[i])
  }
  return el.render.apply(el, args)
}

cache.url = function(name, action) {
  // TODO: assert that action is an action
  if (action == 'index') return url(name, action)
  var _id = id.apply(id, arguments)
  return url(name, action, _id)
}

cache.addAction = function(action) {
  assert.equal(typeof action, 'string', 'component.addAction: action must be string')
  if (_actions.indexOf(action) === -1) _actions.push(action)
}


cache.id = id

cache.cache = box.cache

function id (name, action) {
  var Component = _components[key(name, action)]
  assert.ok(Component, 'component: component name must be registered')
  var args = []
  for (var i = 2, len = arguments.length; i < len; i++) {
    args.push(arguments[i])
  }
  assert.equal(typeof Component.identity, 'function', 'component: Component.id should be type function')

  var id = Component.identity.apply(Component, args)
  assert.equal(typeof id, 'string', 'component: Component.id should return a string')
  return id
}
