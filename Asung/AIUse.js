var brain = require("brain.js");
var fs = require("fs");

var net = new brain.NeuralNetwork();

function loadFile() {
    var obj = JSON.parse(fs.readFileSync('network.json', 'utf8'));
    net.fromJSON(obj);
    console.log("file loaded");
}
 
loadFile(); 


var output = net.run({input: { Noise: -13, Temp: 97, Humi: -459, Lux: -13, Pose: 97 }});   // Walking Data

console.log(output);
