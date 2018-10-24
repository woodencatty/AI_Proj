var brain = require("brain.js");
var fs = require("fs");
var request = require('request');

//예측해서 경광등으로 알려주자!
//그럼 게이트웨이로 보내야하는데 게이트웨이 정보를 알아야하네?


var Train_net = new brain.NeuralNetwork({
    hiddenLayers: [5, 3],
    activation: 'sigmoid'
});

var Test_net = new brain.NeuralNetwork();

const http = require('http');


    function trainAI(){
        var trainSet = [];

        request(
            {
                method: 'GET'
                , uri: '127.0.0.1:8080/ai/data/all'
            }
            , function (error, response, body) {
                // body is the decompressed response body
                console.log('server encoded the data as: ' + (response.headers['content-encoding'] || 'identity'));
                console.log('the decoded data is: ' + body);
            }
        )
            .on('data', function (data) {

                console.log('decoded chunk: ' + data);
                let drydata = data.split('@');
                for (var i in drydata) {
                    let drydata_split = JSON.parse(drydata[i]);
                    let isOK = 0;
                    if (drydata_split.moist_now < drydata_split.moist_target) {
                        isOK = 1;
                    }
                    trainSet.push({ input: { meterial: drydata_split.material, moist_start: drydata_split.moist_start, dry_time: drydata_split.dry_time, dry_temp: drydata_split.dry_temp, air: drydata_split.air }, output: { isOK: isOK } });
                }
            })

        Train_net.train(trainSet);

        fs.writeFile("network.json", JSON.stringify(Train_net.toJSON()), function (err) {
            if (err)
                return console.log(err);

            console.log("The train file was saved");
        });

    }

    function runAI(device, material, moist_start, moist_now, dry_time, dry_time, air){


        var obj = JSON.parse(fs.readFileSync('network.json', 'utf8'));
        Test_net.fromJSON(obj);
        console.log("file loaded");


        var output = net.run({ meterial: material, moist_start: moist_start, dry_time: dry_time, dry_temp: dry_temp, air: air });   // Data

        request.post({ url: '127.0.0.1:8080/ai/save/analysisResult', formData: formData }, function optionalCallback(err, httpResponse, body) {
            if (err) {
                return console.error('upload failed:', err);
            }
            console.log('Upload successful!  Server responded with:', body);
        });

    }

    
AI_Server();
