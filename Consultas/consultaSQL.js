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

exports.addRanking = async (req) => {
    try{
        const pool = await connexionSql.getPoolConnexion();
        const result = await pool.request()
            .input('ganador', sql.VarChar(100), req.ganador)
            .input('pista', sql.VarChar(100), req.pista)
            .input('tiempo', sql.VarChar(1000), req.tiempo)
            .input('vueltas', sql.Int, req.vueltas)
            .input('tipo', sql.VarChar(1000), req.tipo)
            .execute('addRanking');
        return result;
    } catch (err) {
        throw err;
    }

};
