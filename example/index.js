var choo = require('choo')
var html = require('choo/html')

const CACHE_SIZE = 400
var c = require('component-box')
c.cache(require('nanolru')(CACHE_SIZE))

var Post = require('./post')
c.use({
  post: () => { return new Post() }
})

var app = choo()

app.route('/', (state, emit) => {
  return html`
    <body>
      <h1>Posts</h1>
      <ul>
        ${[1, 2, 3, 4, 5, 6, 7].map(id => {
          return html`<li>${postLink(id, `Post ${id}`, emit)}</li>`
        })}
      </ul>
    </body>
  `
})
app.route('/posts/:id', (state, emit) => {
  var id = state.params.id
  return html`
    <body>
      ${c('post', id).render(id)}
    </body>
  `
})
app.mount('body')

function postLink(id, text, emit) {
  var url = `/posts/${id}`
  return html`<a href="${url}" onclick=${prefetch}>${text}</a>`

  function prefetch(e) {
    e.preventDefault()
    c('post', id).prefetch(id, () => {
      emit('pushState', url)
    })
  }
}
