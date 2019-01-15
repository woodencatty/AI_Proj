var brain = require("brain.js");
var fs = require("fs");

const mysql = require('mysql');
var originPerfectSleep = {};
try {
fs.readFile('PerfectSleep.json', 'utf8', function (err, data) {
    console.log(data);
    originPerfectSleep = JSON.parse(data);
});
} catch (error) {
    console.log(error);
}

const client = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'sleep_info_db'
});

var Train_net = new brain.NeuralNetwork({
    hiddenLayers: [5, 3],
    activation: 'sigmoid'
});

var Test_net = new brain.NeuralNetwork();
    
    module.exports = {
    
        trainAI: ()=>{

        
    
    var trainSet = [];
    var sleepDisorder = 0;
    client.query('SELECT TEMPERATURE, HUMIDITY, LIGHT, SOUND, POSE, MOVING_COUNT, SNORING_COUNT, SLEEP_CHECK FROM SLEEP_INFO', function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].SLEEP_CHECK == 0) {
                    if (rows[i].MOVING_COUNT > 4) {
                        if (rows[i].SNORING_COUNT > 4) {
                            sleepDisorder = 1
                        } else {
                            sleepDisorder = 1
                        }
                    } else if (rows[i].SNORING_COUNT > 4) {
                        sleepDisorder = 1
                    }
                }
                trainSet[i] = { input: [rows[i].TEMPERATURE, rows[i].HUMIDITY, rows[i].LIGHT, rows[i].SOUND, rows[i].POSE], output: [sleepDisorder] };
    
            }
            console.log(trainSet);
            client.destroy();
            console.log("train");
            Train_net.train(trainSet);
            console.log("trained");
            fs.writeFile("network.json", JSON.stringify(Train_net.toJSON()), function (err) {
                if (err)
                    return console.log(err);
                console.log("The train file was saved");
    
            });
        }
    });
    
    },
    runAI: (TEMPERATURE, HUMIDITY, LIGHT, SOUND, POSE, MOVING_COUNT, SNORING_COUNT) => {

        var sleepDisorder = 0;

        var obj = JSON.parse(fs.readFileSync('network.json', 'utf8'));
        Test_net.fromJSON(obj);
        console.log("file loaded");
    
        if (MOVING_COUNT > 1) {
            if (SNORING_COUNT > 1) {
                sleepDisorder = 1
            } else {
                sleepDisorder = 1
            }
        } else if (SNORING_COUNT > 1) {
            sleepDisorder = 1
        }
    
        var output = Test_net.run([TEMPERATURE, HUMIDITY, LIGHT, SOUND, POSE]);   // Data
    
        if (sleepDisorder === output[0]) {
    
            let perfectsleep = {
                TEMPERATURE: (originPerfectSleep.TEMPERATURE + TEMPERATURE) / 2,
                HUMIDITY: (originPerfectSleep.HUMIDITY + HUMIDITY) / 2,
                LIGHT: (originPerfectSleep.LIGHT + LIGHT) / 2,
                SOUND: (originPerfectSleep.SOUND + SOUND) / 2,
                POSE: POSE
            }
    
            fs.writeFile("PerfectSleep.json", JSON.stringify(perfectsleep),'utf8', function (err) {
                if (err)
                    return console.log(err);
    
                console.log("The perfect sleep file was saved");
            });
        }
    
    }
}
 
