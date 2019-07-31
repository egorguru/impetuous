const decodeUri = require('fast-decode-uri-component')
const urlParser = require('fast-url-parser')
const qs = require('querystringparser')

const METHODS = [
  'GET',
  'HEAD',
  'POST',
  'PUT',
  'DELETE',
  'CONNECT',
  'OPTIONS',
  'TRACE',
  'PATCH'
]

class RootNode {
  constructor() {
    this.staticRoutes = new Map()
    this.dinamicRoutes = new Node()
  }
}

class Node {
  constructor() {
    this.handler
    this.params
    this.routes = new Map()
  }
}

module.exports = class Impetuous {

  constructor() {
    this._routes = new Map()
    for (const method of METHODS) {
      this._routes.set(method, new RootNode())
    }
  }

  add(method, path, handler) {
    if (path.charAt(path.length - 1) === '/') {
      path = path.slice(0, path.length - 1)
    }
    const { dinamicRoutes, staticRoutes } = this._routes.get(method)
    if (path.includes(':')) {
      this._addDinamic(dinamicRoutes, path, handler)
      this._addDinamic(dinamicRoutes, path + '/', handler)
    } else {
      staticRoutes.set(path, handler)
      staticRoutes.set(path + '/', handler)
    }
    return this
  }
  
  _addDinamic(root, path, handler) {
    let current = root
    const paths = path.split('/')
    const params = []
    for (let i = 0; i < paths.length; i++) {
      const p = paths[i]
      if (p.charAt(0) === ':') {
        params.push({ number: i, name: p.slice(1, p.length) })
        if (current.routes.has('__')) {
          current = current.routes.get('__')
        } else {
          const newNode = new Node()
          current.routes.set('__', newNode)
          current = newNode
        }
      } else {
        if (current.routes.has(p)) {
          current = current.routes.get(p)
        } else {
          const newNode = new Node()
          current.routes.set(p, newNode)
          current = newNode
        }
      }
    }
    current.params = params
    current.handler = handler
  }

  find(method, path) {
    const { pathname, query } = urlParser.parse(decodeUri(path))
    const result = { query: qs.parse(query) }
    const { staticRoutes, dinamicRoutes } = this._routes.get(method)
    const staticHandler = staticRoutes.get(path)
    if (staticHandler === undefined) {
      const dinamic = this._findDinamic(dinamicRoutes, pathname)
      if (dinamic === undefined) {
        return null
      } else {
        result.handler = dinamic.handler
        result.params = dinamic.params
      }
    } else {
      result.handler = staticHandler
    }
    return result
  }
  
  _findDinamic(node, path) {
    const paths = path.split('/')
    let current = node
    for (let i = 0; i < paths.length; i++) {
      const p = paths[i]
      current = current.routes.get(p) || current.routes.get('__')
      if (current === undefined) {
        return
      }
    }
    if (current.params === undefined) {
      return
    }
    const params = {}
    for (const param of current.params) {
      params[param.name] = paths[param.number]
    }
    return {
      params,
      handler: current.handler
    }
  }
}
