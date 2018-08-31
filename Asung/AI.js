var brain = require("brain.js");
var fs = require("fs");

var net = new brain.NeuralNetwork({
    hiddenLayers: [5, 3],
    activation: 'sigmoid'
});

function saveFile() {
    fs.writeFile("network.json", JSON.stringify(net.toJSON()), function (err) {
        if (err)
            return console.log(err);

        console.log("The file was saved");
    });
}

net.train([{ input: { x축_가속도: -13, y축_가속도: 97, z축_가속도: -459, x축_자이로: -13, y축_자이로: 97, z축_자이로: -459, x축_지자기: -1130, y축_지자기: 812, z축_지자기: 1226 }, output: { Walking: 1 } },
{ input: { x축_가속도: -566, y축_가속도: 1286, z축_가속도: 584, x축_자이로: -558, y축_자이로: 1286, z축_자이로: 584, x축_지자기: -961, y축_지자기: 305, z축_지자기: 810 }, output: { Walking: 1 } },
]);

saveFile();
/*
var output = net.run({x축_가속도: -298, y축_가속도: 1290, z축_가속도: 176, 
x축_자이로: -298, y축_자이로: 1290, z축_자이로: 199, 
x축_지자기: -666, y축_지자기: 255, z축_지자기: 107});   // Standing Data
*/

console.log(output);