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

    request('127.0.0.1:8080/ai/data/all', function (error, response, body) {
        if (response.statusCode != 200) {
            console.log('error:', error); // Print the error if one occurred
        } else {
            for (var i in body) {
                Train_set.push({ input: { meterial: drydata_split.material, moist_start: drydata_split.moist_start, dry_time: drydata_split.dry_time, dry_temp: drydata_split.dry_temp, air: drydata_split.air }, output: { isOK: isOK } })
            }
            Train_net.train(trainSet);

            fs.writeFile("network.json", JSON.stringify(Train_net.toJSON()), function (err) {
                if (err)
                    return console.log(err);
    
                console.log("The train file was saved");
            });
    
        }
    });
}

function check_use(deviceID) {


    request('127.0.0.1:8080/ai/data/'+deviceID, function (error, response, body) {
        if (response.statusCode != 200) {
            console.log('error:', error); // Print the error if one occurred
        } else {

            
        }
    });

}

function makeDeviceInterval(device_ID) {

setInterval(() => {
    check_use(device_ID)

},  1000 * 60 * 60);



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
