const connexionSql = require('../Conexion/conexionSQLServer.js');

exports.getRanking = async () => {
    try {
        const connexion = await connexionSql.getPoolConnexion();
        const result = await connexion.request()
            .execute('getRanking');

        return result;
    } catch (err) {
        throw err;
    }

};
