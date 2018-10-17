var brain = require("brain.js");
var fs = require("fs");

const mysql = require('mysql');
var config = {};
try {
fs.readFile('PerfectSleep.json', 'utf8', function (err, data) {
    console.log(data);
    config = JSON.parse(data);
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

    trainAI: (callback) => {
        var trainSet = [];
        var sleepDisorder = 0;
        client.query('SELECT TEMPERATURE, HUMIDITY, LIGHT, SOUND, POSE, MOVING_COUNT, SNORING_COUNT, SLEEP_CHECK FROM SLEEP_INFO', (err, rows) => {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                if (SLEEP_CHECK == true) {
                    for (var i in rows) {
                        if (rows[i].MOVING_COUNT > 1) {
                            if (rows[i].SNORING_COUNT > 1) {
                                sleepDisorder = 1
                            } else {
                                sleepDisorder = 1
                            }
                        } else if (rows[i].SNORING_COUNT > 1) {
                            sleepDisorder = 1
                        }
                        trainSet.push({ input: { TEMPERATURE: rows[i].TEMPERATURE, HUMIDITY: rows[i].HUMIDITY, LIGHT: rows[i].LIGHT, SOUND: rows[i].SOUND, POSE: rows[i].POSE }, output: { sleepDisorder: sleepDisorder } });
                    }
                }
            }
        });
        /*  var trainSet = [{ input: { material : 1, moist_start : 0.3, drytime : 60, try_temp : 80, air : 30}, output: { sleepDisorder : 1 } },
                { input: { material : 1, moist_start : 0.3, drytime : 60, try_temp : 80, air : 30}, output: { sleepDisorder : 2 } }];
        */
        Train_net.train(trainSet);

        fs.writeFile("network.json", JSON.stringify(Train_net.toJSON()), function (err) {
            if (err)
                return console.log(err);

            console.log("The train file was saved");
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

        var output = net.run({ TEMPERATURE: TEMPERATURE, HUMIDITY: HUMIDITY, LIGHT: LIGHT, SOUND: SOUND, POSE: POSE });   // Data

        if (sleepDisorder === output[0]) {

            let perfectsleep = {
                TEMPERATURE: (config.TEMPERATURE + TEMPERATURE) / 2,
                HUMIDITY: (config.HUMIDITY + HUMIDITY) / 2,
                LIGHT: (config.LIGHT + LIGHT) / 2,
                SOUND: (config.SOUND + SOUND) / 2,
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