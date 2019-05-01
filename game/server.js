// https://stackoverflow.com/questions/16333790/node-js-quick-file-server-static-files-over-http
const http = require('http')
const fs = require('fs')
const path = require('path')
const socketio = require('socket.io')

const PORT = 8000

const server = http.createServer((request, response) => {
    console.log('REQUEST TO: ' + request.url)

    let filePath = '.' + request.url
    
    switch(filePath) {
      case './': 
        filePath = './part1.html'
        break
    }

    const extname = path.extname(filePath)
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
  console.log('SOCKET CONNECTED: <' + socket.id + '>')
  console.log('  | URL: ' + socket.handshake.query.url)

  socket.on('disconnect', (reason) => {
    console.log("DISCONNECT: <" + reason + ">")
    console.log('  | URL: ' + socket.handshake.query.url)
  });

  const on = (name, callback) => socket.on(name, (data) => {
    console.log("RECIEVED: <" + name + ">")
    if (data) { console.log("  | DATA: " + data) }
    callback(data)
  })

  const emit = (name, callback) => {
    console.log("EMITTING: <" + name + ">")
    socket.broadcast.emit(name)
  }

  on('activate-part1', () => {
    emit('client-to-part1')
  })

  on('activate-part2', () => {
    emit('client-to-part2')
  })

  on('activate-video', () => {
    emit('video-to-play')
  })
})

server.listen(PORT)
console.log('Server started at: http://localhost:' + PORT)


