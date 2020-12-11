var request = require('request');
const cron = require("node-cron"); //cron job
const redis = require('ioredis');
const config = require('../config/config');
const kafka = require('kafka-node');

const Redis = new redis({
    port: config.redisConnection.port,
    host: config.redisConnection.host,
    password: config.redisConnection.password
});


Redis.set('test', 'I am Amit')


function requestEssentials() {
    return new Promise((resolve, reject) => {
        var requestOptions = {
            url: `https://api.covid19india.org/data.json`, //remote API calls
            method: 'GET'
        };

        request.get(requestOptions, (error, response, body) => {
            if (error) {
                console.log('Error', error);
                reject(error);
            } else {
                // let p = JSON.parse(body)
                resolve(JSON.parse(body))
            }
        })
    })
}

function insertIntoseriesTable(dataIn) {
    let x = new Date()
    // let monthData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    let values = [];
    return new Promise((resolve, reject) => {
        for (let i = 0; i < dataIn.length; i++) {
            values.push([
                dataIn[i].dailyconfirmed,
                dataIn[i].dailydeceased,
                dataIn[i].dailyrecovered,
                dataIn[i].date + x.getFullYear(),
                dataIn[i].totalconfirmed,
                dataIn[i].totaldeceased,
                dataIn[i].totalrecovered
            ])
        }

        commonDb(sql.seriesTimeQuery, [values])
            .then((result) => {
                resolve(JSON.parse(JSON.stringify(result)));
            })
            .catch((err) => {
                reject(err);
            });

    })

}

exports.getDB = async (req, res) => {
    try {
        // console.log("IN DB")
        let res1 = await requestEssentials();
        // let res2 = await insertIntoseriesTable(res1.cases_time_series)
        // setDataInRedis('COVID_DATA', JSON.stringify(res1.cases_time_series))
        let x = sendDataTokafka() //JSON.stringify(res1.cases_time_series)
        console.log(x)
        res.json(res1.cases_time_series)
    } catch (e) {
        console.log(e)
    }
}

//Setting covid Data in redis 
const setDataInRedis = (key, value) => {
    console.log("in this fn", key, value)
    Redis.set(key, value, (err, reply) => {

        if (err) {
            console.log("Error in Setting Data in Redis", err)
        } else {
            console.log(reply)
        }
    })
}

function sendDataTokafka(req, res) {
    // return new Promise((resolve, reject) => {
    try {

        let data = {
            'data': 'newtest'
        }

        const Producer = kafka.Producer;
        const client = new kafka.KafkaClient({
            kafkaHost: '127.0.0.1:9092'
        });
        const producer = new Producer(client);

        producer.on('ready', () => {
            console.log('Producer is ready');
            payloads = [{
                topic: 'testData',
                messages: JSON.stringify(data)
            }];
            producer.send(payloads, (err, data) => {
                if (err) {
                    console.log('[kafka-producer -> ' + payloads[0].topic + ']: broker update failed');

                    // reject(err)
                } else {
                    console.log('[kafka-producer -> ' + payloads[0].topic + ']: broker update success');
                    // resolve(data)
                }
            })
        })

        producer.on('error', (err) => {
            console.log('Producer is in error state');
            console.log(err);
            res.json({
                msg: 'failed in error',
                status: 'failed'
            });
            // reject(e);
        });

    } catch (e) {
        console.log(e);
        res.json({
            msg: 'failed in catch',
            status: 'failed'
        });
        // reject(e);
    }
    // })

}

//Getting the covid data from redis 
exports.getDataFromRedis = async (req, res, next) => {
    let key = 'COVID_DATA'
    try {
        Redis.get(key, (err, reply) => {
            // res.json(JSON.parse(reply))
            if (err) {
                console.log("Error in getting Data from Redis", err)
                next()
            } else if (reply !== null) {
                console.log("Sending Data from redis")
                res.json(JSON.parse(reply))
            } else {
                next()
            }
        })
    } catch (e) {
        console.log(e)
    }
}


// var kafka = require('kafka-node'),
Consumer = kafka.Consumer,
    client = new kafka.KafkaClient({
        kafkaHost: '127.0.0.1:9092'
    }),
    consumer = new Consumer(client, [{
        topic: 'testData'
    }], {
        autoCommit: false
    });

consumer.on('message', (message) => {
    console.log(message);
});

consumer.on('error', (err) => {
    console.log('Error:', err);
});

consumer.on('offsetOutOfRange', (err) => {
    console.log('offsetOutOfRange:', err);
});


// exports.getCovid = () => {
//     return data()
// }