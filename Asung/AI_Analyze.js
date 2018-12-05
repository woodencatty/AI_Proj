var brain = require("brain.js");
var fs = require("fs");

const mysql = require('mysql');

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

  function trainAI(){
        var trainSet = [];
        client.query('SELECT dry_id, material FROM dry_machine', (err, rows) => {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                for(var i in rows){
                    client.query('SELECT dew_point, drying_temp, moisture_ratio, regen_temp FROM dry_machine WHERE dry_id="'+rows[i].dry_id+'"', (err, rows2) => {
                        if (err) {
                            console.log(err);
                            callback(err);
                        } else {
                            for(var i in rows2){
                                trainSet.push({ input: { dry_id : rows[i].dry_id, material : rows[i].material, dew_point : rows2[i].dew_point, drying_temp : rows2[i].drying_temp, moisture_ratio : rows2[i].moisture_ratio, regen_temp : rows2[i].regen_temp}, output: { error_state : rows2[i].error_state } });
                            }
                        }
                    });
                }
            }
        });
        
        Train_net.train(trainSet);

    }
    function runAI(dry_id, material, dew_point, drying_temp, moisture_ratio, regen_temp){

        client.query('SELECT dry_id, material FROM dry_machine', (err, rows) => {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                for(var i in rows){
                    client.query('SELECT dew_point, drying_temp, moisture_ratio, regen_temp FROM dry_machine WHERE dry_id="'+rows[i].dry_id+'" ORDERBY date DESC limit 1', (err, rows2) => {
                        if (err) {
                            console.log(err);
                            callback(err);
                        } else {
                            for(var i in rows2){
                                var output = net.run( { dry_id : rows[i].dry_id, material : rows[i].material, dew_point : rows2[i].dew_point, drying_temp : rows2[i].drying_temp, moisture_ratio : rows2[i].moisture_ratio, regen_temp : rows2[i].regen_temp});
                                if(output == true){
                                    //에러메세지 전송
                                }else if(output == false){
                                    //do nothing
                                }
                            }
                        }
                    });
                }
            }
        });
}


setImmediate(()=>{
trainAI();
}, 3600000)

setInterval(()=>{
runAI();
}, 5000)