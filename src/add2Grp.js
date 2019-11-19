const http = require('http')
var devices = require('../300kdevices.json').devices

nD = parseInt(process.argv[2],10)
g = parseInt(process.argv[3],10)
nG = 1
if (process.argv.length > 4)
    nG =  parseInt(process.argv[4],10)
for (id = 0; id<nG; id++){
    items = []
    for (i=id*nD; i<nD*(id+1); i++)
    {
        items.push(devices[i].uuid)
        if (i==id*nD || i==(id+1)*nD-1)
            console.log(i)
    }
    
    const postData = JSON.stringify({
        "addedItems": items
    })
    oPath = `/messaging/admin/devgroup/${g+id}/add/uuid/`
    console.log(oPath);

    const options ={
        host: '192.168.105.33',
        port: 8080,
        path: oPath,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }    
    
    const req = http.request(options,(res)=>{
        console.log(`STATUS: ${res.statusCode}`);
        //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        let rawData = ''
        res.on('data', (chunk) => {
          rawData+=chunk
        });
        res.on('end', () => {
            console.log(JSON.parse(rawData))
          console.log('No more data in response.');
        });
    })
    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
      });  
    // write data to request body
    req.write(postData);
    req.end();        
}

