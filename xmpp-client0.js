var Meshblu = require('meshblu-xmpp');
var onSigint = require('./src/on-sigint.js').onSigint
onSigint(()=>{
    console.log()
})
devices = require('./300kdevices.json').devices
var panic = function(error){
    console.error(error.stack);
    process.exit(1);
  }
var config2 = {
    hostname: '192.168.105.222',
    port: 5222,
    token: devices[100].token, 
    uuid: devices[100].uuid
}
var config1 = {
    hostname: '192.168.105.222',
    port: 5222,
    token: devices[1].token, 
    uuid: devices[1].uuid
}
var config = {
    hostname: '192.168.105.222',
    port: 5222,
    token: devices[0].token, 
    uuid: devices[0].uuid
}

var conn, conn2, conn1;
conn1 = new Meshblu(config1)
conn1.on('message',(ms)=>{
    console.log('### 1-RECEIVE: ', ms)
    console.timeEnd("start1")
})
conn1.connect(err=>{
    console.log("conn1 connected")
})

conn2 = new Meshblu(config2)
conn2.on('message',(ms)=>{
    console.log('### 2-RECEIVE: ', ms)
    console.timeEnd("start2")    
})
conn2.connect(err=>{
    console.log("conn2 connected")
})

conn = new Meshblu(config)
conn.connect(err=>{
    var message = {
        "devices": config1.uuid,
        "payload": "this is a broadcast message"
      };
    console.time("start1")
    console.time("start2")
    conn.message(message, function(error){
    if (error) {
        panic(error);
    }
    console.log('Sent Message');
    });

})