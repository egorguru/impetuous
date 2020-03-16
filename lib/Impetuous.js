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
    this.dynamicRoutes = new Node()
  }
}

class Node {
  constructor() {
    this.value
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

  add(method, path, value) {
    if (path.charAt(path.length - 1) === '/') {
      path = path.slice(0, path.length - 1)
    }
    const { dynamicRoutes, staticRoutes } = this._routes.get(method)
    if (path.includes(':')) {
      this._addDynamic(dynamicRoutes, path, value)
      this._addDynamic(dynamicRoutes, path + '/', value)
    } else {
      staticRoutes.set(path, value)
      staticRoutes.set(path + '/', value)
    }
    return this
  }
  
  _addDynamic(root, path, value) {
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
    current.value = value
  }

  find(method, path) {
    const result = {}
    const { staticRoutes, dynamicRoutes } = this._routes.get(method)
    const staticValue = staticRoutes.get(path)
    if (staticValue === undefined) {
      const dynamic = this._findDynamic(dynamicRoutes, path)
      if (dynamic === undefined) {
        return null
      } else {
        result.value = dynamic.value
        result.params = dynamic.params
      }
    } else {
      result.value = staticValue
    }
    return result
  }
  
  _findDynamic(node, path) {
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
      value: current.value
    }
  }
}
