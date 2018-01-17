var Nanofetcher = require('nanofetcher')
var html = require('choo/html')
var request = require('request')

module.exports = Post

function Post () {
  if (!(this instanceof Post)) return new Post()
  Nanofetcher.call(this)
}
Post.prototype = Object.create(Nanofetcher.prototype)
Post.prototype.constructor = Post

Post.identity = function (postID) {
  return String(postID)
}

Post.prototype.init = function (postID) {
  this.postID = postID
}

Post.prototype.placeholder = function () {
  return html`<div>Loading...</div>`
}

Post.prototype.hydrate = function (postData) {
  return html`<div>
    <h1>${postData.title}</h1>
    ${postData.body.split('\n').map(p => {
      return html`<p>${p}</p>`
    })}
  </div>`
}

Post.prototype.fetch = function (cb) {
  var url = `https://jsonplaceholder.typicode.com/posts/${this.postID}`
  request(url, { json: true}, (err, resp, postData) => {
    if (err) return cb(err)
    if (resp.statusCode !== 200) return cb(new Error(`${resp.statusCode}: ${postData.message}`))
    cb(null, postData)
  })
}

Post.prototype.update = function (postID) {
  return postID !== this.postID
}
