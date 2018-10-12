var brain = require("brain.js");
var fs = require("fs");

var net = new brain.NeuralNetwork({
    hiddenLayers: [5, 3],
    activation: 'sigmoid'
});


var jsn = { input: { material : 1, moist_start : 0.3, drytime : 60, try_temp : 80, air : 30}, output: { TargetReached : 1 } };

console.log(jsn);


module.exports = {
    saveAImodel: () => {
        fs.writeFile("network.json", JSON.stringify(net.toJSON()), function (err) {
            if (err)
                return console.log(err);
    
            console.log("The file was saved");
        });
    },

    trainAI: () => {
        
net.train([{ input: { material : 1, moist_start : 0.3, drytime : 60, try_temp : 80, air : 30}, output: { TargetReached : 1 } },
    { input: { material : 1, moist_start : 0.3, drytime : 60, try_temp : 80, air : 30}, output: { TargetUnReached : 1 } },
    ]);
    
    },

    loadAImodel: () => {
        var obj = JSON.parse(fs.readFileSync('network.json', 'utf8'));
    net.fromJSON(obj);
    console.log("file loaded");
    },

    runAI: (callback) => {
        var output = net.run({input: { Noise: -13, Temp: 97, Humi: -459, Lux: -13, Pose: 97 }});   // Walking Data

                callback(output);
    }
}