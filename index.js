var assert = require('assert')

var c = require('./component')
var link = require('./link')
var key = require('./lib/key')
var url = require('./lib/url')

module.exports = function (state, emitter, app) {

  app.component = c.register

  link.emitter(emitter)

  app.resource = function (name, actions) {
    if ((arguments.length == 3) &&
      (typeof arguments[3] == 'function') &&
      (typeof actions == 'function')) {
      actions = { index: [component, view]}
    }
    assert.equal(typeof name, 'string')
    assert.equal(typeof actions, 'object')
    for (var action in actions) {
      var component = actions[action][0]
      var view = actions[action][1]
      app.component(key(name, action), component)
      app.route(url(name, action, ':id'), view)
      c.addAction(action)
    }
  }
}
