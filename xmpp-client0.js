var Meshblu = require('meshblu-xmpp');
var onSigint = require('./src/on-sigint.js').onSigint
onSigint(()=>{
    console.log()
})

var config2 = {
    hostname: '192.168.105.222',
    port: 5222,
    token: "14fc2e1668410784f75ba8c946e4a4b6cac3989f", 
    uuid: "037dd8ef-19e7-4b44-8172-f2813f0c245c"
}
var config = {
    hostname: '192.168.105.222',
    port: 5222,
    token: "b5423372083ddab564d3fd1f7b517106ad4228ff", 
    uuid: "1102e314-4417-41e9-9caf-fc0c59004109"
}

var conn, conn2;

conn2 = new Meshblu(config2)
conn2.on('message',(ms)=>{
    console.log('### RECEIVE: ', ms)
    process.exit(0)
})