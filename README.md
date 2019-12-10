[![Build Status](https://travis-ci.org/EgorRepnikov/impetuous.svg?branch=master)](https://travis-ci.org/EgorRepnikov/impetuous)
[![GitHub license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/EgorRepnikov/impetuous/blob/master/LICENSE)

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

// Third handler argument can be, what you want
router.add('GET', '/path', () => {
  // Handle something
})

router.add('POST', '/path', () => {
  // Handle something
})

// Third handler argument can be, what you want
router.add('DELETE', '/path/:param', [
  () => {
    // Handle something
  },
  () => {
    // Handle something
  }
])

router.find('GET', '/path')
// -> { handler: [Function] }

router.find('GET', '/path/') // <- '/' at the end works
// -> { handler: [Function] }

router.find('GET', '/path?firstParam=Hi&secondParam=There')
// -> { handler: [Function], query: { firstParam: "Hi", secondParam: "There" } }

router.find('POST', '/path')
// -> { handler: [Function] }

router.find('DELETE', '/path/123')
// -> { handler: [[Function, Function]], params: { param: 123 } }

```

# API
### add(method: String, path: String, handler: Any)
Adds a new handler for the method and path.

### find(method: String, path: String)
Finds the handler for the method and path.

Returns Object with the following fields:

`handler: Any` what you added

`params: Object` contains params from path `/path/:param` <- like this

`query: Object` contains params from query `/path?param=HiThere` <- like this

# Usage Example

Library/Framework [Dragonrend](https://github.com/EgorRepnikov/dragonrend) uses Impetuous as Router. Extension example: [class Router](https://github.com/EgorRepnikov/dragonrend/blob/master/lib/routing.js)

# Author
**Egor Repnikov** - [GitHub](https://github.com/EgorRepnikov)

# License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

