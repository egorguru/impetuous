const decodeUri = require('fast-decode-uri-component')
const urlParser = require('fast-url-parser')
const qs = require('querystringparser')

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
    this.routes = new Map()
  }

  add(method, path, handler) {
    if (!this.routes.has(method)) {
      this.routes.set(method, new RootNode())
    }
    if (path.charAt(path.length - 1) === '/') {
      path = path.slice(0, path.length - 1)
    }
    const { dinamicRoutes, staticRoutes } = this.routes.get(method)
    if (path.includes(':')) {
      this._addDinamic(dinamicRoutes, path, handler)
      this._addDinamic(dinamicRoutes, path + '/', handler)
    } else {
      this._addStatic(staticRoutes, path, handler)
      this._addStatic(staticRoutes, path + '/', handler)
    }
    return this
  }

  _addStatic(root, path, handler) {
    root.set(path, handler)
  }
  
  _addDinamic(root, path, handler) {
    let current = root
    const paths = path.split('/')
    const params = []
    for (let i = 0; i < paths.length; i++) {
      const p = paths[i]
      if (p.charAt(0) === ':') {
        params.push({ number: i, name: p.slice(1, p.length) })
        if (current.routes.has('__dinamic__')) {
          current = current.routes.get('__dinamic__')
        } else {
          const newNode = new Node()
          current.routes.set('__dinamic__', newNode)
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
    const routes = this.routes.get(method)
    if (routes === undefined) {
      return null
    }
    const staticHandler = this._findStatic(routes.staticRoutes, pathname)
    if (staticHandler !== undefined) {
      result.handler = staticHandler
    } else {
      const dinamic = this._findDinamic(routes.dinamicRoutes, pathname)
      if (dinamic !== undefined) {
        result.handler = dinamic.handler
        result.params = dinamic.params
      } else {
        return null
      }
    }
    return result
  }

  _findStatic(map, path) {
    return map.get(path)
  }
  
  _findDinamic(node, path) {
    const paths = path.split('/')
    let current = node
    for (let i = 0; i < paths.length; i++) {
      const p = paths[i]
      current = current.routes.get(p) || current.routes.get('__dinamic__')
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
