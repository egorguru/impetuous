# Impetuous
Impetuous is simple and fast Node.js Router for building web applications.

Impetuous uses Map and the freestyle implementation of Radix Tree for different types of routes. Due to this you achieve very high speed in all cases.

# Installation
```bash
$ npm install impetuous
```

# How to Use?

```js
const http = require('http')
const Impetuous = require('impetuous')

const router = new Impetuous()

// Static route without params
router.add('GET', '/path', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.parse({ message: 'Hello World' }))
})

// Dinamic route with params
router.add('GET', '/path/:param', (req, res, params) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.parse({ message: params.param }))
})

// Route with query params
router.add('GET', '/path', (req, res, params, query) => {
  // Handler Function can be what you want
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.parse({ message: query.param }))
})

http
  .createServer((req, res) => {
    const { method, url } = req
    const route = router.find(method, url)
    if (route === null) {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.parse({ message: 'Not Found' }))
    } else {
      const { handler, params, query } = route
      handler(req, res, params, query) // Handler Function can be what you want
    }
  })
  .listen(8080)
```

# API
### add(method, path, handler)
`add` adds a new handler for the method and path.

`method` Type: `String`

`path` Type: `String`

`handler` Type: `Any` what you need

### find(method, path)
`find` finds the handler for the method and path.

`method` Type: `String`

`path` Type: `String`

Returns Object with the following fields:

`handler` Type: `Any` what you added

`params` Type: `Object` contains params from path `/path/:param` <- like this

`query` Type: `Object` contains params from query `/path?param=HiThere` <- like this

# Usage Example

Library/Framework [Dragonrend](https://github.com/EgorRepnikov/dragonrend) uses Impetuous as Router. Extension example: [class Router](https://github.com/EgorRepnikov/dragonrend/blob/master/lib/Router.js)

# Author
**Egor Repnikov** - [GitHub](https://github.com/EgorRepnikov)

# License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

