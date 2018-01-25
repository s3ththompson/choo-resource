var assert = require('assert')

var c = require('./component')
var link = require('./link')

module.exports = function (state, emitter, app) {
  app.component = c.register

  link.emitter(emitter)

  app.resource = function (route, view, component) {
    assert.equal(
      typeof route,
      'string',
      'app.resource: route name must be a string'
    )
    assert.equal(
      typeof view,
      'function',
      'app.resource: view must be a function'
    )
    assert.equal(
      typeof component,
      'function',
      'app.resource: component must be a function'
    )
    app.component(route, component)
    app.route(route, view)
  }
}
