const https = require('https')

var getJson = (link, callback)=>{
    return new Promise(resolve=>{
        https.get(link, (res) => {
            const { statusCode } = res;
            const contentType = res.headers['content-type'];
    
            let error;
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' +
                                `Status Code: ${statusCode}`);
            } else if (!/^application\/json/.test(contentType)) {
                error = new Error('Invalid content-type.\n' +
                                `Expected application/json but received ${contentType}`);
            }
            if (error) {
                console.error(error.message);
                res.resume();
                return;
            }
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                try {
                    let parsedData = JSON.parse(rawData);
                    resolve(parsedData)
                    typeof(callback)=='function'&&callback(parsedData)
                } catch (e) {
                    console.error(e.message);
                    resolve(null)
                    typeof(callback)=='function'&&callback(null)
                }
            });
        }).on('error', (e) => {
            console.error(`Got error: ${e.message}`);
            resolve(null)
        });
    })    
}
exports.getJson = getJson

exports.getJsons = async (links,callback)=>{
    var promises = []
    for (i=0; i<links.length; i++){
        promises.push(getJson(links[i]))
    }
    Promise.all(promises).then(values=>{
        callback(values)
    })
}

// const querystring = require('querystring')
// const postData = querystring.stringify({
//     "targetType":"device",
//     "pushProfile":"push profile 1",
//     "targets":"1102e314-4417-41e9-9caf-fc0c59004109",
//     "payload":"msg from https req",
//     "priority":0,
//     "expirationDate":"2018-05-27 23:59:59"
// })
// const options ={
//     host: 'api.coinmarketcap.com',
//     path: '/v2/ticker/1/',
//     method: 'GET',
//     headers: {
//         'Content-Type': 'application/json',
//         // 'Content-Length': Buffer.byteLength(postData)
//     }
// }
// const req = https.request(options,(res)=>{
//     console.log(`STATUS: ${res.statusCode}`);
//     //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
//     res.setEncoding('utf8');
//     let rawData = ''
//     res.on('data', (chunk) => {
//       rawData+=chunk
//     });
//     res.on('end', () => {
//         console.log(JSON.parse(rawData))
//       console.log('No more data in response.');
//     });
// })
// req.on('error', (e) => {
//     console.error(`problem with request: ${e.message}`);
//   });  
// // write data to request body
// req.write(postData);
// req.end();

