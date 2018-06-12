if (process.platform === "win32") {
  var rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
  });    
  rl.on("SIGINT", function () {
    process.emit("SIGINT");
  });
}

var onSigint = (callback)=>{
  process.on("SIGINT", function () {
    console.log('exit-on-sigint...')
    typeof callback === 'function' && callback()
    process.exit();
  });
}

exports.onSigint = onSigint