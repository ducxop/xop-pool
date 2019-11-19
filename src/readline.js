var fs=require('fs')
var lineReader = require('readline').createInterface({
    input: fs.createReadStream('my-list-ok.txt')
  });
  
lineReader.on('line', function (line) {
    //console.log('Line from file:', line);
    arrOk.push(line)
});
lineReader.on('close',()=>{
    console.log('finish reading...')
})