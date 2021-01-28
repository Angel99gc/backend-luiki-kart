//Controlador de SQL
var express = require('express');
const router = express.Router();

const querySQL = require('../Consultas/consultaSQL.js');

router.get('/getRanking', (req, res) => {
    try {
            querySQL.getRanking()
            .then(result => {
                let response = {
                    data: result.recordset
                };
                res.send({response, code: 200 });
            })
            .catch(err => {
                res.send({ response:{data:err}, code: 406 });
            })
    } catch (err) {
        res.send({ response:{data:err}, code: 406 });
    }
});
router.post('/addRanking', (req, res) => {
    try {
        querySQL.addRanking(req.body)
            .then(result => {
                let response = {
                    data: result.recordset
                };
                res.send({response, code: 200 });
            })
            .catch(err => {
                res.send({ response:{data:err}, code: 406 });
            })

    } catch(err) {
        res.send({ response:{data:err}, code: 406 });
    }
});

module.exports = router;
