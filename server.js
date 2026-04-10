const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const path = require('path')

const dev = false // Always production for this server
const hostname = 'localhost'
const port = process.env.PORT || 3000

// In standalone mode, the server is relative to the .next/standalone directory
const app = next({ dev, hostname, port, dir: path.join(__dirname) })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
