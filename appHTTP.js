const express = require('express');
const appHTTP = express();
const http = require('http');

//const logger = require('morgan');
//const cookieParser = require('cookie-parser');

const ctrlSQL = require('./Controlador/ctrlSQL.js') ;

//Variables guardadas en la appHTTP.
appHTTP.set('puerto', process.env.PORT || 3000);






appHTTP.use(express.json());
//appHTTP.use(logger('dev'));
//appHTTP.use(cookieParser());
// Para utilizar un directorio en el backend en el frontend.
//appHTTP.use(express.static(path.join(__dirname, 'public')));

appHTTP.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
    res.header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Credentials", 'true');
    next();
});

// Para realizar pruebas de funcionalidad
// devuelve un message en json siempre.
// appHTTP.use((Request, Response, next)=>{
//     Response.status(200).json({
//         message: 'It works'
//     })
// });


//Los get y post.
appHTTP.use('/ranking', ctrlSQL);
appHTTP.get('/api/courses',(request, response)=>{
    response.send([1, 2, 3])
});

/**
 * Manejo de errores.
 */
appHTTP.use(function(err, req, res, next) {
    res.status(err.status || 500)
        .json({ error: err.message });
});

const server = http.createServer(appHTTP);


module.exports = server;
