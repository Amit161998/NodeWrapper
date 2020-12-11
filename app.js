//defining all the modules
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const fnData = require('./controllers/wrapperCovid')
const cron = require('node-cron')
const config = require('./config/config')
//specify global variables
global.config = require('./config/config');
global.commonDb = require('./config/dbDetails').commonDb;
global.pool = require('./config/dbDetails').pool;
global.sql = require('./query/sql');

// var task = cron.schedule('*/10 * * * * *', () => {
//     fnData.getCovid()
// });

// task.start();

// function test() {
//     console.log("I am function")
// }


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})

app.use(morgan('short'));

app.use(bodyParser.json());

app.use(require('./routes/covidPath'));

const port = config.App.webServer.port;
app.listen(port, () => console.log(`Server is listening at port ${port}...`));

function removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}


var myArr = [{
    SPCODE: '3000001010',
    GCCODE: '4000000000',
    SHData: [{
        SHNAME: 'ABCXYZ',
        BPData: [{
            BPNAME: 'GAHAHAHA',
            BPCODE: '90909090'
        }]
    }]
}, {
    SPCODE: '3000001010',
    GCCODE: '4000009087',
    SHData: [{
        SHNAME: 'ABCXYZ',
        BPData: [{
            BPNAME: 'GAHAHAHA',
            BPCODE: '90909090'
        }]
    }]
}, {
    SPCODE: '3000001010',
    GCCODE: '4000000000',
    SHData: [{
        SHNAME: 'ABCXYZ',
        BPData: [{
            BPNAME: 'GAHAHAHA',
            BPCODE: '90909090'
        }]
    }]
}];

var x = removeDuplicates(myArr, 'GCCODE');
console.log(x);