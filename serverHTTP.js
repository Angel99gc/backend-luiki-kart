const express = require('express');
const app = express();
const http = require('http');

const ctrlSQL = require('./Controlador/ctrlSQL.js') ;
// const path = require("path");

//Variables guardadas en la app.
app.set('puerto', process.env.PORT || 3000);






app.use(express.json());
// Para utilizar un directorio en el backend en el frontend.
//app.use(express.static(path.join(__dirname, 'public')));

//Header de express con los CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
    res.header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Credentials", 'true');
    next();
});

//Para mostrar estadisticas.
app.use('/ranking', ctrlSQL);

// Para realizar pruebas de funcionalidad
// devuelve un message en json siempre.
// app.use((Request, Response, next)=>{
//     Response.status(200).json({
//         message: 'It works'
//     })
// });
//Los get y post.
//para realizar pruebas si el servidor esta escuchando
// app.use('/',(req, res) =>{
//     res.send('Servidor Funcional');
//     //res.sendFile(path.join(__dirname, 'index.html'));
// })


/**
 * Manejo de errores.
 */
app.use(function(err, req, res, next) {
    res.status(err.status || 500)
        .json({ error: err.message });
});

const server = http.createServer(app);


module.exports = server;
