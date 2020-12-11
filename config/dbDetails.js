const mysql = require('mysql');

// let decodedPass = Buffer.from(, 'base64').toString('ascii');

const pool = mysql.createPool({
    connectionLimit: config.MySql.connectionLimit,
    host: config.MySql.host,
    user: config.MySql.user,
    password: config.MySql.password,
    database: config.MySql.database
});

function commonDb(query, value) {
    return new Promise((resolve, reject) => {
        pool.query(query, value, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

module.exports = { commonDb, pool }