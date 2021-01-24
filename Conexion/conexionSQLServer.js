const sql = require('mssql');
const sqlConfig = require('./config');
let connexionPool = null;

const getPoolConnexion = () => {
    if (connexionPool) return connexionPool;
    connexionPool = new Promise((resolve, reject) => {
        const conn = new sql.ConnectionPool(sqlConfig);
        conn.on('close', () => {
            connexionPool = null;
        });
        conn.connect()
            .then(pool => {
                console.log("SQL connected.");
                return resolve(pool);
            })
            .catch(err => {
                connexionPool = null;
                return reject(err);
            });
    });
    return connexionPool;
}
module.exports = { sql, getPoolConnexion };
