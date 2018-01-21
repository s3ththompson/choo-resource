module.exports = url

function url(name, action, id) {
  if (action == 'index') return `/${name}`
  if (action == 'show') return `/${name}/${id}`
  return `/${name}/${id}/${action}`
}
