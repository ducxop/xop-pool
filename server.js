//import MeshbluXmPP from 'meshblu-xmpp' 
var onSigint = require('./src/on-sigint.js').onSigint
onSigint(()=>{
    console.log()
})
var Meshbu = require('meshblu-xmpp')

const express = require('express');

const app = express();

const port = process.env.PORT || 5000;

var count=0
var mess=[]
var config20 = {
  hostname: '192.168.105.222',
  port: 5222,
  token: "b5423372083ddab564d3fd1f7b517106ad4228ff", 
  uuid: "1102e314-4417-41e9-9caf-fc0c59004109"
}
var config10 = {
  hostname: '192.168.105.222',
  port: 5222,
  token: "4f8b6fd78f532bfaf080c09a54f8ecb8e1fdeb5d", 
  uuid: "db3e57cd-66d0-47d1-82d6-8b065e1ebfc6"
}
var config = {
  hostname: '192.168.105.222',
  port: 5222,
  token: "14fc2e1668410784f75ba8c946e4a4b6cac3989f", 
  uuid: "037dd8ef-19e7-4b44-8172-f2813f0c245c"
}
var clients = []
var conn = new Meshbu(config)
conn.connect(function(error){
  if (error) {
    console.log(error)
  }
  console.log('sender connected')
})

// var conn2 = new Meshbu(config20)
// conn2.on('message',(ms)=>{
//   console.log('### Conn2: ', ms.data.payload)  
//   if (typeof ms.data.payload == 'string'){
//     console.log('emit-ing...')
//     socket.emit('message', ms.data.payload)
//     //socket.broadcast.emit('message', ms.data.payload)
//   }
// })
// logout = (client,cb)=>{
//   if(conn2.connection !== undefined){
//     conn2.close()
//   }
//   cb(true)
// }
// login = (client,cb)=>{
//   config = {
//     hostname: '192.168.105.222',
//     port: 5222,
//     token: client.token, 
//     uuid: client.uuid
//   }  
//   conn2 = new Meshbu(config)
//   conn2.connect(err=>{
//     console.log('login ')
//   })
//   conn2.on('message',(ms)=>{
//     console.log('#-ReceivE-#: ', ms.data.payload)  
//     if (typeof ms.data.payload == 'string'){
//       //console.log('emit-ing...')
//       //socket.emit('message', ms.data.payload)
//       //socket.broadcast.emit('message', ms.data.payload)
//     }
//   })
//   cb(true)
// }

//var http = require('http')
const server = require('http').Server(app);
var io = require('socket.io').listen(server)

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

io.sockets.on('connection', (socket)=>{
    console.log('a client is connected')
    //socket.emit('message', 'emit message')
    socket.on('send',(msg)=>{
      console.log('on send')
      let message = {
        "devices": [config10.uuid,config20.uuid],
        "payload": msg
      };
      conn.message(message, err=>{
        if (err) {
        }
        console.log("sent", msg)
      })
    })
    socket.on('disconnect', ()=>{
      console.log('a client is disconnected')
      if (socket.conn2) socket.conn2.close()
    })
    
    socket.on('login', (client, cb)=>{    
      
      //console.log('client in ',client)
      if (clients.indexOf(client.uuid)<0){
        clients.push(client.uuid)
        socket.config = {
          hostname: '192.168.105.222',
          port: 5222,
          token: client.token, 
          uuid: client.uuid
        }
        socket.conn2 = new Meshbu(socket.config)
        socket.conn2.connect(err=>{
          console.log('login ')
          socket.conn2.claimOfflineMessages(socket.config.uuid, function(error) {
            if (error) {
                console.log(error);
            }
          })
        })
        socket.conn2.on('message',(ms)=>{
          console.log('### RECEIVE: ', ms.data.payload)  
          socket.conn2.updateMessageStatus(socket.config.uuid, ms.data.id, 1, function(error){
            console.log("update message status: " + ms.data.id)
            if (error) {
                console.log(error);
            }
        });
          if (typeof ms.data.payload == 'string'){
            console.log('emit-ing...')
            socket.emit('message', ms.data.payload)
            //socket.broadcast.emit('message', ms.data.payload)
          }
        })
        cb(true)
      }
      else
        cb(false)
    })

    socket.on('logout', (client, cb)=>{
      //console.log('client out',client)
      //console.log(socket.config.uuid)
      //if (socket.config.uuid == client.uuid){
      var index = clients.indexOf(client.uuid);
      if (index>=0){
        clients.splice(index, 1);
        console.log('logout ',client.uuid)
        socket.conn2.close()
        cb(true)
      }
      else
       cb(false)
    })
    app.post('/api/login_', (req,res)=>{
      if (clients.indexOf(client.uuid)<0){
        clients.push(client.uuid)
        socket.config = {
          hostname: '192.168.105.222',
          port: 5222,
          token: client.token, 
          uuid: client.uuid
        }
        socket.conn2 = new Meshbu(socket.config)
        socket.conn2.connect(err=>{
          console.log('login ')
          res.end()
        })
        socket.conn2.on('message',(ms)=>{
          console.log('### RECEIVE: ', ms)  
          if (typeof ms.data.payload == 'string'){
            console.log('emit-ing...')
            socket.emit('message', ms.data.payload)
            //socket.broadcast.emit('message', ms.data.payload)
          }
        })
        res.status(200)
      }
      else
        res.status(202)
      res.end()
      
    })
    app.post('/api/logout_', (req,res)=>{
      console.log(socket.config.uuid)
      if (socket.config.uuid == req.body.uuid){
        var index = clients.indexOf(req.body.uuid);
        clients.splice(index, 1);
        console.log('logout ',req.body.uuid)
        socket.conn2.close()
        res.status(200)
      }
      else
        res.status(202)
      res.end()
    
    })
})
//server.listen(8080)
 
app.get('/api/hello', (req, res) => {
  res.send({ express: 'Meshblu XMPP Testing' });
});
server.listen(port, () => console.log(`Listening on port ${port}`)); //socket.io----instead of app.listen()

