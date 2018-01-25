# choo-resource [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5]
[![downloads][8]][9] [![js-standard-style][10]][11]

simple resource management for choo apps

## Installation

```
$ npm install choo-resource
```

## Usage

```js
// index.js
var choo = require('choo')
var html = require('choo/html')
var link = require('choo-resource/link')

var app = choo()

app.use(require('choo-resource'))

// registers '/posts' and '/posts/:id' routes
// registers Post and Posts components in component cache
app.resource(
  '/posts',
  require('./views/posts'),
  require('./components/posts')
  )
app.resource(
  '/posts/:id'
  require('./views/post'),
  require('./components/post'),
  )

app.route('/', (state, emit) => {
  return html`<body>
    <ul>
      <li>${link('All posts', '/posts')}</li>
      <li>${link('Post 1', '/posts/1')}</li>
      <li>${link('Post 2', '/posts/2')}</li>
    </ul>
  </body>`
})

app.mount('body')
```

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/choo-resource.svg?style=flat-square
[3]: https://npmjs.org/package/choo-resource
[4]: https://img.shields.io/travis/s3ththompson/choo-resource/master.svg?style=flat-square
[5]: https://travis-ci.org/s3ththompson/choo-resource
[8]: http://img.shields.io/npm/dm/choo-resource.svg?style=flat-square
[9]: https://npmjs.org/package/choo-resource
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard

