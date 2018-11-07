var request = require('request');

var jsn = { input: { material : 1, moist_start : 0.3, drytime : 60, try_temp : 80, air : 30}, output: { TargetReached : 1 } };

console.log(jsn);



request
  .get('http://gachon.ac.kr/')
  .on('response', function(response) {
    console.log(response.statusCode) // 200
    console.log(response.headers['content-type'])
    console.log(response.url); // 'image/png'
  })
  .on('data', function(data){
      console.log(data.toString());
  })