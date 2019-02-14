var brain = require("brain.js");
var fs = require("fs");

const mysql = require('mysql');

const client = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'aspuser',
    password: 'asp1234!',
    database: 'aspdb'
});

var Train_net = new brain.NeuralNetwork({
    hiddenLayers: [5, 3],
    activation: 'sigmoid'
});

var Test_net = new brain.NeuralNetwork();

function trainAI() {
    var error = 0;
    var trainSet = [];
    client.query('SELECT dry_id, material FROM dry_machine', (err, rows) => {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            for (var i in rows) {
                client.query('SELECT dew_point, drying_temp, moisture_ratio, regen_temp, error_state FROM measure_data WHERE dry_id="' + rows[i].dry_id + '"', (err, rows2) => {
                    if (err) {
                        console.log(err);
                        callback(err);
                    } else {
                        for (var j in rows2) {
                            if ([rows2[j].error_state] == '01') {
                                error = 0;
                            } else { error = 1; }
                            trainSet[i * j] = { input: [rows[i].dry_id, rows[i].material, rows2[j].dew_point, rows2[j].drying_temp, rows2[j].moisture_ratio, rows2[j].regen_temp], output: [rows2[j].error_state] };
                        }
                    }
                });
            }
        }
    });
    Train_net.train(trainSet);

}
function runAI(dry_id, material, dew_point, drying_temp, moisture_ratio, regen_temp) {
    REST_obj = {
        host: "127.0.0.1",
        port: 8080,
        path: "/gwsvc/analysisResult",
        method: "POST"
    };

    client.query('SELECT dry_id, material FROM dry_machine', (err, rows) => {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            for (var i in rows) {
                client.query('SELECT dew_point, drying_temp, moisture_ratio, regen_temp FROM measure_data WHERE dry_id="' + rows[i].dry_id + '" ORDERBY date DESC limit 1', (err, rows2) => {
                    if (err) {
                        console.log(err);
                        callback(err);
                    } else {
                        for (var j in rows2) {
                            var output = net.run([rows[i].dry_id, rows[i].material, rows2[j].dew_point, rows2[j].drying_temp, rows2[j].moisture_ratio, rows2[j].regen_temp]);
                            if (output[0] >= 1) {

                                sendMsgcallback = function (response) {
                                    console.log('HTTP Response Code : ' + response.statusCode);		   //리턴코드를 분석하여 상태 확인
                                    if (response.statusCode != 200) {
                                        console.log('Error Response!');

                                        req.on('error', (e) => {
                                            console.error(`problem with request: ${e.message}`);
                                        });
                                    } else {
                                        let serverdata = '';
                                        response.on('data', function (chunk) {							//응답 데이터를 JSON형태로 파싱함
                                            console.log(chunk);
                                            serverdata += chunk;
                                        });
                                        response.on('end', function () {			    				//응답이 끝났을 시 데이터 추출
                                            console.log(serverdata);
                                            callback(serverdata.toString());
                                        });
                                    }
                                }
                                let req = http.request(REST_obj, sendMsgcallback);						//POST요청 전송
                                console.log('AI Warning request Sent');
                                req.on('error', function (error) {
                                    console.log('관리서버와 연결할 수 없습니다.');
                                    //console.log(error);		// 서버와 연결 불가능할 때에 오류 체크
                                    callback(error, REST_obj, data);
                                });

                                //req.setHeader("data", data);		                                    //헤더에 데이터 첨부		

                                req.end(rows[i].dry_id[i]);
                            }
                            else {
                                //do nothing
                            }
                        }
                    }
                });
            }
        }
    });
}


setImmediate(() => {
    trainAI();
}, 3600000)

setInterval(() => {
    runAI();
}, 5000)