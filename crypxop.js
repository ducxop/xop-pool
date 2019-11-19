var onSigint = require('./src/on-sigint.js').onSigint
var getJson = require('./src/http-req.js').getJson
var getJsons = require('./src/http-req.js').getJsons
var apiData = require('./krypxop.json')

const binance = require('node-binance-api');
binance.options({
  APIKEY: apiData.key, //'eqnrZwXfZ2Hro7SrgLyC52u0YZl2XU2JfYbuUVftAu7hRQpkbQOAdIZyOvxvCc6J',
  APISECRET: apiData.sec, //'5rAipPkAx79U3gQkaioJUmzK01OQy9OIEblozqMkLDcn0M0Kdg62rhNkbJslol4x',
  useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
  test: true // If you want to use sandbox mode where orders are simulated
});
// var quantity = 2, price = 1100;
// binance.buy("BCCUSDT", quantity, price, {type:'LIMIT'}, (error, response) => {
//   console.log("err", error)
//   console.log("Limit Buy response", response);
//   console.log("order id: " + response.orderId);
// });x

var links=[
    'https://www.bitstamp.net/api/v2/ticker/btcusd/',
    // 'https://www.bitstamp.net/api/v2/ticker/bchusd/',
    // 'https://www.bitstamp.net/api/v2/ticker/ethusd/',
    'https://www.bitstamp.net/api/v2/ticker/xrpusd/'
    //'https://www.bitstamp.net/api/v2/ticker/eosusd/' //N/A yet...
]
var data=[[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]]
var count = 3
var complete = ()=>{
    if (--count<1){
        console.clear()
        //console.log((new Date()).toLocaleTimeString())
        console.log(data[0])
        console.log(data[1])
        console.log(data[2])
        console.log(data[3])
        console.log(data[4])
        console.log(data[5])
        count = 3
    }
}
var handleCM = res=>{
    data[0][0] = res.data['1'].quotes.USD.price                     //BTC
    data[1][0] = res.data['1321'].quotes.USD.price                  //ETC
    data[2][0] = res.data['2566'].quotes.USD.price                  //ONT
    data[3][0] = res.data['1720'].quotes.USD.price                  //IOTA
    // data[1][0] = res.data['1831'].quotes.USD.price                  //BCH
    // data[2][0] = res.data['1027'].quotes.USD.price                  //ETH
    data[4][0] = Number(res.data['52'].quotes.USD.price.toFixed(5)) //XRP
    data[5][0] = res.data['1765'].quotes.USD.price                  //EOS
    complete()
}
var handleBS = res=>{
    data[0][2] = Number(res[0].last)
    data[1][2] = 0 //Number(res[1].last)
    data[2][2] = 0 //Number(res[2].last)
    data[3][2] = Number(Number(res[1].last).toFixed(5))
    data[4][2] = 0 //res[4].last
    complete()
}

var getData = ()=>{
    binance.prices((error, ticker) => {
        if (!error){
            data[0][1] = Number(ticker.BTCUSDT)
            data[1][1] = Number(ticker.ETCUSDT)
            data[2][1] = Number(ticker.ONTUSDT)
            // data[1][1] = Number(ticker.BCCUSDT)
            // data[2][1] = Number(ticker.ETHUSDT)
            data[3][1] = Number(ticker.IOTAUSDT)
            data[4][1] = Number(Number(ticker.XRPUSDT).toFixed(5))
            data[5][1] = Number(ticker.EOSUSDT)
            
        }
        else{            
            data[0][1] = 0
            data[1][1] = 0
            data[2][1] = 0
            data[3][1] = 0
            data[4][1] = 0
        }
        complete()
    })
    getJson('https://api.coinmarketcap.com/v2/ticker/', handleCM)
    //getJsons(links, handleBS)
    // binance.prevDay("BNBBTC", (error, prevDay, symbol) => {
    //     console.log("BNB change since yesterday: "+prevDay.priceChangePercent+"%")
    //   });
}
getData()
var objItv = setInterval(getData, 2500)

/////////////////////////////////////////////////////////////////////////////////////////
//coinmarketcap

onSigint(()=>{
    //clearInterval(objItv)
})


