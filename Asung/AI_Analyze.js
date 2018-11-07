var request = require('request');


//예측해서 경광등으로 알려주자!
//그럼 게이트웨이로 보내야하는데 게이트웨이 정보를 알아야하네?
//답이없네 이거

var Train_set = [];
var Test_set = [];

var Train_net = new brain.NeuralNetwork({
    hiddenLayers: [5, 3],
    activation: 'sigmoid'
});

var Test_net = new brain.NeuralNetwork();



function sometime_train() {

request('http://gachon.ac.kr', function (error, response, body) {
    if(response.statusCode != 200){
        console.log('error:', error); // Print the error if one occurred
    }else{
        for(var i in body){
            Train_set.push({ input: { TEMPERATURE: rows[i].TEMPERATURE, HUMIDITY: rows[i].HUMIDITY, LIGHT: rows[i].LIGHT, SOUND: rows[i].SOUND, POSE: rows[i].POSE }, output: { Status: OK } })
        }


    }
});
}

function check_use(deviceID) {

}

function makeDeviceInterval(device_ID) {

    check_use(device_ID)

}

sometime_train();

/*
setInterval(() => {



    sometime_train();

    if ("new device added" == 1) {
        makeDeviceInterval(deviceID);
    }

}, 1000 * 60 * 60 * 24);


*/
