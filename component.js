var assert = require('assert')
var Trie = require('wayfarer/trie')

const CACHE_SIZE = 400

var _trie = Trie()

var box = require('component-box')
box.cache(require('nanolru')(CACHE_SIZE))

module.exports = cache

function cache (route) {
  var node = _trie.match(route)
  if (!node) return null
  var args = Object.values(node.params)
  for (var i = 1; i < arguments.length; i++) {
    args.push(arguments[i])
  }
  var _id = id.call(id, route, args)
  return box(node._route, _id)
}

cache.register = function (route, Component) {
  assert.equal(
    typeof route,
    'string',
    'component.register: route should be a string'
  )
  assert.equal(
    typeof Component,
    'function',
    'component.register: component should be type function'
  )
  var obj = {}
  obj[route] = function () {
    return new Component()
  }
  box.use(obj)
  var node = _trie.create(route)
  node.Component = Component
  node._route = route
}

cache.render = function (route) {
  var node = _trie.match(route)
  if (!node) return null
  var args = Object.values(node.params)
  for (var i = 1; i < arguments.length; i++) {
    args.push(arguments[i])
  }
  var _id = id.call(id, route, args)
  var el = box(node._route, _id)
  return el.render.apply(el, args)
}

cache.params = function (route) {
  var node = _trie.match(route)
  if (!node) return []
  return Object.values(node.params)
}

cache.cache = box.cache

function id (route, args) {
  var node = _trie.match(route)
  assert.ok(
    node && node.Component,
    'component: component name must be registered'
  )
  var Component = node.Component
  assert.equal(
    typeof Component.identity,
    'function',
    'component: Component.id should be type function'
  )
  var id = Component.identity.apply(Component, args)
  assert.equal(
    typeof id,
    'string',
    'component: Component.id should return a string'
  )
  return id
}
