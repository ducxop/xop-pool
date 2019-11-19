var request = require('request');
var parseURL=function(req){
    let q=req.split('?'),result={};
    if(q.length>=2){
        result.path = q[0];
        result.params =  [];
        q[1].split('&').forEach((item)=>{
             try {
               result.params[item.split('=')[0]]=item.split('=')[1];
             } catch (e) {
               result.params[item.split('=')[0]]='';
             }
        })
    }
    return result;
}
var urlObject = parseURL("http://192.168.105.222:8080/Publisher/api/client/program?page_no=2&num_per_page=9&category=5&order_type=2&sort_type=1") //{ page_no: 2, num_per_page:10, category:5 };
console.log(urlObject)
request({url:urlObject.path, qs:urlObject.params}, function(err, response, body) {
  if(err) { console.log(err); return; }
  console.log("Get response: " + response.statusCode);
});

