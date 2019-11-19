const http = require('http')
//var Meshblu = require('meshblu-xmpp');
var Meshblu = require('./src/meshblu-xmpp.coffee');
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
    token: devices[3].token, 
    uuid: devices[3].uuid
}
var  myCredentials =
    {
        key: fs.readFileSync('F:\\NODEJS\\MessPlat\\cert\\client.d123456.key'),
        cert: fs.readFileSync('F:\\NODEJS\\MessPlat\\cert\\client.d123456.crt'),
        ca: fs.readFileSync('F:\\NODEJS\\MessPlat\\cert\\ca.crt')
    }
var config1 = {
    hostname: '192.168.105.222',
    port: 5222,
    credentials: myCredentials,
    uuid: devices[1].uuid
}
var config = {
    hostname: '127.0.0.1',
    port: 5222,
    token: devices[0].token, 
    uuid: devices[0].uuid
}

var conn, conn2, conn1;
conn1 = new Meshblu(config1)
conn1.on('message',(ms)=>{
    console.log('### 1-RECEIVE: ', ms)
    console.log(ms.metadata.route)
    //console.timeEnd("start1")
    conn1.updateMessageStatus(config1.uuid, ms.data.id, 1, function(error){
        console.log("update message status: " + ms.data.id)
        if (error) {
            console.log(error);
        }
    });
})
conn1.connect(err=>{
    console.log("conn1 connected")
    //console.time("start1")
    conn1.claimOfflineMessages(config1.uuid, function(error) {
        if (error) {
            console.log(error);
        }
    });
})

// conn2 = new Meshblu(config2)
// conn2.on('message',(ms)=>{
//     console.log('### 2-RECEIVE: ', ms)
//     console.timeEnd("start2")    
// })
// conn2.connect(err=>{
//     console.log("conn2 connected")
//     console.time("start2")
    
    // var subscription = {
    //     "subscriberUuid" : config2.uuid,
    //     "emitterUuid": config1.uuid,
    //     "type": 'message.sent'
    // };
    // conn2.subscribe(config2.uuid, subscription, function(error, result){
    //     if (error) {
    //         panic(error);
    //     }
    //     var subscription = {
    //         "subscriberUuid" : config2.uuid,
    //         "emitterUuid": config2.uuid,
    //         "type": 'message.received'
    //       };
    //     conn2.subscribe(config2.uuid, subscription, function(error, result){
    //         if (error) {
    //             panic(error);
    //         }
    //     });
    // })
// })

// conn = new Meshblu(config)
// conn.connect(err=>{
//     var message = {
//         "devices": [config1.uuid,config2.uuid],
//         "payload": "this is a message"
//       };
//     conn.message(message, function(error){
//     if (error) {
//         panic(error);
//     }
//     console.log('Sent Message');
//     });
// })

    // const postData = JSON.stringify({
    //     "targetType":"device",
    //     "pushProfile":"push profile 1",
    //     "targets":[config1.uuid,config2.uuid], //["1102e314-4417-41e9-9caf-fc0c59004109",]
    //     "payload":"msg from http req",
    //     "priority":0,
    //     "expirationDate":"2018-07-27 23:59:59",
    //     "messageId": "dxop",
    //     "version":123
    // })
    // const options ={
    //     host: '192.168.105.222',
    //     port: 8080,
    //     path: '/messaging/devices/messages/send/',
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //         // 'Content-Length': Buffer.byteLength(postData)
    //     }
    // }
    // const req = http.request(options,(res)=>{
    //     console.log(`STATUS: ${res.statusCode}`);
    //     //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    //     res.setEncoding('utf8');
    //     let rawData = ''
    //     res.on('data', (chunk) => {
    //     rawData+=chunk
    //     });
    //     res.on('end', () => {
    //         console.log(JSON.parse(rawData))
    //     console.log('No more data in response.');
    //     });
    // })
    // req.on('error', (e) => {
    //     console.error(`problem with request: ${e.message}`);
    // });  
    // req.write(postData);
    // req.end();

