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
        var output = net.run({ material : 1, moist_start : 0.3, drytime : 60, try_temp : 80, air : 30});   // Data

                callback(output);
    }
}