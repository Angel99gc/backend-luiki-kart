const express = require('express');
const app = express();


const ctrlSQL = require('./Controlador/ctrlSQL.js') ;

//Variables guardadas en la app.
app.set('puerto', process.env.PORT || 3000);

//Aun no estoy seguro
// app.use((Request, Response, next)=>{
//     Response.status(200).json({
//         message: 'It works'
//     })
// });


//Los get y post.
app.use('/ranking', ctrlSQL);
app.get('/api/courses',(request, response)=>{
    response.send([1, 2, 3])
});

app.use(express.json());
//app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    next();
});

app.use('/ranking', ctrlSQL);

/**
 * Manejo de errores.
 */
app.use(function(err, req, res, next) {
    res.status(err.status || 500)
        .json({ error: err.message });
});

module.exports = app;
