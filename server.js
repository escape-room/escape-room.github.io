// https://stackoverflow.com/questions/16333790/node-js-quick-file-server-static-files-over-http
const http = require('http')
const fs = require('fs')
const path = require('path')
const socketio = require('socket.io')

const PORT = 8000

const server = http.createServer((request, response) => {
    console.log('Request starting...')

    let filePath = '.' + request.url
    
    switch(filePath) {
      case './': 
        filePath = './newspaper1.html'
        break
      case './gamemasters-only':
        filePath = './controller.html'
        break
    }

    let extname = path.extname(filePath)
    let contentType = 'text/html'
    switch (extname) {
        case '.js':
            contentType = 'text/javascript'
            break
        case '.css':
            contentType = 'text/css'
            break
        case '.jpg':
            contentType = 'image/jpg'
            break
    }

    fs.readFile(filePath, (error, content) => {
      if (error) {
        response.end("Error!")
      }
      else {
        response.writeHead(200, { 'Content-Type': contentType })
        response.end(content, 'utf-8')
      }
  })

})

io = socketio(server)
io.on('connection', (socket) => {
  console.log('Socket.io connected!')

  socket.on('time-travel', () => {
    console.log('Time travel!')
    socket.broadcast.emit('change-newspaper')
  })
})

server.listen(PORT)
console.log('Server started at: http://localhost:' + PORT)


