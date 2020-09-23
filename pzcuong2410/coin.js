var request = require('request')
var fs = require('fs')
const replaceString = require('replace-string');
var getLines = require('./modules/readDataLineByLine.js');
var alert = require('alert-node')
const open = require('open');

var cookie = "laravel_session=eyJpdiI6Img3XC9CRTFJaW1UOUthM3MwZlwvV1NGZz09IiwidmFsdWUiOiI4VXJkVE1yNll2bzRnVzJSQkoyQlVZTUJFNHU0UGh6dlFjeEt6K01GRDZ6TVwvZTd1blZFSTE4MExjenBIT09TUCIsIm1hYyI6ImQ5YmZjNjhjNjlkMjA2Yjk3ZjJmMmNmZjk2ZDI1YjFlN2VkOTQ4OGJmMTAwODczNjdhMjA5NWJmMjBmZTQxZTQifQ%3D%3D"

function submit_ads(ads_id) {
  var request_ads = {
    url: 'https://olacity.com/dashboard/view-ads',
    headers: {
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': 1,
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36 Edg/85.0.564.51',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-User': '?1',
      'Sec-Fetch-Dest': 'document',
      'Referer': 'https://olacity.com/dashboard/make-money',
      'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8,zh-CN;q=0.7,zh;q=0.6',
      'Cookie': cookie
    }
  }
  request.get(request_ads, function(err, res, data) {
    fs.writeFileSync('./data/index.html', data)
  });
}

function watch_ads(token, ads_id) {
  var watch_ads_header = {
    url: 'https://olacity.com/surfAds/back_money',
    headers: {
      "X-CSRF-TOKEN": token,
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36 Edg/85.0.564.51',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Origin': 'https://olacity.com',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Dest': 'empty',
      'Referer': 'https://olacity.com/dashboard/view-ads',
      'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8,zh-CN;q=0.7,zh;q=0.6',
      'Cookie': cookie
    },
    form: {
      surf_ads_id: ads_id
    },
    json: true
  }
  request.post(watch_ads_header, function(err, res, data) {
    try {
      if (data.status == 201) { console.log(data.msg) }
    } catch (error) {}
  });
}

setInterval(function(){
  submit_ads()
  setTimeout(function(){
    var readFileData = fs.readFileSync('./data/index.html').toString()
    if (!readFileData.includes("Price")) {
      if (readFileData.includes("You have seen all the advertisements for the day, come back tomorrow!")) {
        alert('Hết quảng cáo rồi :(')
      } else if (readFileData.includes("Sign in")) {
        alert('Token hết hạn')
      } else {
        open('https://olacity.com/dashboard/view-ads');
        //alert('Captcha kìa!')
      };
    } else {
      getLines.getLinesModules("./data/index.html", 2000, function (err, lines) {
        console.log(err);
        var count4adsId = 100
        var count4tokenValue = 100

        while (!lines[count4adsId].includes("surf_ads_id")) {
          count4adsId++
        } 
        while (!lines[count4tokenValue].includes("X-CSRF-TOKEN")) {
          count4tokenValue++
        } 
        
        var ads_id = replaceString(lines[count4adsId].toString(), '"surf_ads_id":', '')
        var token = replaceString(replaceString(lines[count4tokenValue].toString(), "'X-CSRF-TOKEN': ", ''), "'", "")

        console.log(token)

        for (var i=0; i<=100; i++) {
          watch_ads(token, ads_id)
        }
        
      });
    }
  }, 5000)
}, 15000)




