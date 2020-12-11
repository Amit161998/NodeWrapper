const fs = require('fs');
const path = require('path');
const NODE_ENV = process.env.NODE_ENV;
let configBuffer = null;
console.log(" I am env" ,NODE_ENV)
switch(NODE_ENV){
    case 'dev':
        configBuffer = fs.readFileSync(path.resolve(__dirname,'default.json'), 'utf-8');
    default:
        configBuffer = fs.readFileSync(path.resolve(__dirname,'default.json'), 'utf-8');
}

let config = JSON.parse(configBuffer);
console.log(config)
module.exports = config 