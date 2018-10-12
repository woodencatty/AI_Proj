var brain = require("brain.js");
var fs = require("fs");

var net = new brain.NeuralNetwork({
    hiddenLayers: [5, 3],
    activation: 'sigmoid'
});

/*
var output = net.run({x축_가속도: -298, y축_가속도: 1290, z축_가속도: 176, 
x축_자이로: -298, y축_자이로: 1290, z축_자이로: 199, 
x축_지자기: -666, y축_지자기: 255, z축_지자기: 107});   // Standing Data
*/
module.exports = {
    saveFile: () => {
        fs.writeFile("network.json", JSON.stringify(net.toJSON()), function (err) {
            if (err)
                return console.log(err);
    
            console.log("The file was saved");
        });
    },

    train4analyze: () => {
        
net.train([{ input: { material : 1, moist_start : 0.3, drytime : 60, try_temp : 80, air : 30}, output: { TargetReached : 1 } },
    { input: { material : 1, moist_start : 0.3, drytime : 60, try_temp : 80, air : 30}, output: { TargetUnReached : 1 } },
    ]);
    
    }
}