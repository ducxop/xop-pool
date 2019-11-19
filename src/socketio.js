var http = require('http')
var fs = require('fs')

var server = http.createServer((req,res)=>{
    fs.readFile('./socketio.html', 'utf-8', (error, content)=>{
        res.writeHead(200,{"Content-Type":"text/html"})
        res.end(content)
    })
})

var io = require('socket.io').listen(server)

io.sockets.on('connection', (socket)=>{
    console.log('a client is connected')
    
})

server.listen(8080)