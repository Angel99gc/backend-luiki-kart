const express = require('express');
const app = express();
//const logger = require('morgan');
//const cookieParser = require('cookie-parser');


const ctrlSQL = require('./Controlador/ctrlSQL.js') ;

//Variables guardadas en la app.
app.set('puerto', process.env.PORT || 3000);






app.use(express.json());
//app.use(logger('dev'));
//app.use(cookieParser());
// Para utilizar un directorio en el backend en el frontend.
//app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT, DELETE");
    next();
});

// Para realizar pruebas de funcionalidad
// devuelve un message en json siempre.
// app.use((Request, Response, next)=>{
//     Response.status(200).json({
//         message: 'It works'
//     })
// });

app.use('/ranking', ctrlSQL);
//Los get y post.
app.get('/api/courses',(request, response)=>{
    response.send([1, 2, 3])
});
/**
 * Manejo de errores.
 */
app.use(function(err, req, res, next) {
    res.status(err.status || 500)
        .json({ error: err.message });
});

module.exports = app;
