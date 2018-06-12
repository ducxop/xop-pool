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
var config2 = {
  hostname: '192.168.105.222',
  port: 5222,
  token: "b5423372083ddab564d3fd1f7b517106ad4228ff", 
  uuid: "1102e314-4417-41e9-9caf-fc0c59004109"
}
var config1 = {
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
var config3
var conn = new Meshbu(config)
var conn2 = new Meshbu(config2)

conn2.on('message',(ms)=>{
  console.log('### RECEIVE: ', ms)  
  if (typeof ms.data.payload == 'string')
    mess.push(ms.data.payload)//
  //mess =  ms.data.payload
})
conn.connect(function(error){
  if (error) {
    console.log(error)
  }
  console.log('connected')
})

app.get('/api/login', (req,res)=>{
  conn2.connect(err=>{
    console.log('login ')
    res.end()
  })
})
app.get('/api/logout', (req,res)=>{ 
  console.log('logout ') 
  conn2.close()
  res.end()
})
app.get('/api/send', (req,res)=>{
  let message = {
    "devices": config2.uuid,
    "payload": "message no. " + ++count
  };
  conn.message(message, err=>{
    if (err) {
      res.status(202)
      res.end('')
    }
    console.log("sent",count)
    setTimeout(()=>{
      if (mess.length>0)
        res.send({mes: mess})
      else
        res.end('')
    },100)
  })
})
app.get('/api/get',(req,res)=>{
  if (mess.length>0)
    res.send({mes: mess})
  else
    res.status(204)
    res.end('')
  mess = []
})

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Crypxopppp' });
});
app.listen(port, () => console.log(`Listening on port ${port}`));

