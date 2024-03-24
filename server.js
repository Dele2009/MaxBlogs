const http = require('http')
const fs = require('fs')
const _ = require('lodash')

const server = http.createServer((req, res) => {
  console.log(req.url, req.method)
  res.setHeader('Content-Type', 'text/html')

  // res.write("Welcome to Dele's server now running")
  // res.end()

  //send html file
  const num = _.random(0,20);
  console.log(num)


  let path = './pages/'
  switch (req.url) {
    case '/':
      path += 'test.html'
      res.statusCode = 200
      break
    case '/about':
      path += 'about.html'
      res.statusCode = 200
      break
    case '/about-me':
      res.setHeader('Location','/about')
      res.statusCode = 301
      res.end()
      break
    default:
      path += '404.html'
      res.statusCode = 404
      break
  }
  fs.readFile(path, (err, data) => {
    if (err) {
      console.log(err)
      res.end()
    } else {
      // res.write(data)
      res.end(data)
    }
  })
})

//RESPONSE CODES
// 200-OK
// 301-RESOURCE MOVED
// 404-NOT FOUND
// 500-INTERNAL SERVER Error

//RESPONSE CODE RANGE
// 100 RANGE - Information responses
// 200 RANGE -success responses
// 300 RANGE - codes for redirects
// 400 RANGE - User or client error codes
// 500 range - server error codes

server.listen(4000, 'localhost', () => {
  console.log('server now running')
})
