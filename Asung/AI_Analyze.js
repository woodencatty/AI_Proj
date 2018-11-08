var request = require('request');
var fs = require("fs");


//예측해서 경광등으로 알려주자!
//그럼 게이트웨이로 보내야하는데 게이트웨이 정보를 알아야하네?
//답이없네 이거


function removeDuplicateAry(arr) {
    let hashTable = {};
    return arr.filter((el) => {
        let key = JSON.stringify(el);
        let alreadyExist = !!hashTable[key];
        return (alreadyExist ? false : hashTable[key] = true);
    });
}


var sometime_train = setInterval(()=> {

    var Train_net = new brain.NeuralNetwork({
        hiddenLayers: [5, 3],
        activation: 'sigmoid'
    });

    let Train_set = [];
    let Device_list = [];

    request('127.0.0.1:8080/ai/data/all', function (error, response, body) {
        if (response.statusCode != 200) {
            console.log('error:', error); // Print the error if one occurred
        } else {
            for (var i in body) {

                Device_list.push(body[i].dryID);

                Train_set.push({ input: { dryingTemp: body[i].dryingTemp, moistureRatio: body[i].moistureRatio, dewPoint: body[i].dewPoint, regenTemp: body[i].regenTemp }, output: { isOK: body[i].isOK } })
            }
            Train_net.train(trainSet);

            fs.writeFile("network.json", JSON.stringify(Train_net.toJSON()), function (err) {
                if (err)
                    return console.log(err);

                console.log("The train file was saved");
            });

            fs.writeFile("device_list.json", removeDuplicateAry(Device_list), function (err) {
                if (err)
                    return console.log(err);

                console.log("The train file was saved");
            });

        }
    });

}, 1000*60*60*24);

var setTrainInterval = setInterval(() => {

    trainInterval(deviceID, Test_net);
    makeDeviceInterval();

    var Test_net = new brain.NeuralNetwork();

    var obj = JSON.parse(fs.readFileSync('network.json', 'utf8'));
    Test_net.fromJSON(obj);
    console.log("file loaded");
    var Device_list = fs.readFileSync('device_list.json', 'utf8')

    for (var i in Device_list) {

        request('127.0.0.1:8080/ai/data/' + Device_list[i], function (error, response, body) {
            if (response.statusCode != 200) {
                console.log('error:', error); // Print the error if one occurred
            } else {
                var output = Test_net.run({ dryingTemp: body[i].dryingTemp, moistureRatio: body[i].moistureRatio, dewPoint: body[i].dewPoint, regenTemp: body[i].regenTemp });   // Data

                if (output.isOK < 0.7) {

                    request.post('127.0.0.1:8080/ai/save/analysisResult', { form: { dryID: Device_list[i], isOK: false } });
                }

            }
        });
    }



}, 1000 * 60)