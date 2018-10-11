var brain = require("brain.js");
var fs = require("fs");

var net = new brain.NeuralNetwork();

module.exports = {
    loadFile: () => {
        var obj = JSON.parse(fs.readFileSync('network.json', 'utf8'));
    net.fromJSON(obj);
    console.log("file loaded");
    },

    run4analyse: (callback) => {
        var output = net.run({input: { Noise: -13, Temp: 97, Humi: -459, Lux: -13, Pose: 97 }});   // Walking Data

                callback(output);
    }
}