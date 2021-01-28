const Partida = require('./Clases/Partida');

const chalk = require('chalk');
const Socket = require('socket.io');
const debug = require('debug')('backend:server');
const querySQL = require('./Consultas/consultaSQL');


/**
 * Module dependencies.
 */
const server = require('./appHTTP');
//const server = require('./appSocket');


//Servidor HTTP
server.listen(3000, onListening);
server.on('error', onError);


// Se crea socket agregando el server que esta escuchando y sus cors
const io = Socket(server, {
     cors: {
          origin: "*",
          methods: ["GET", "POST"]
     }
});
let partidaprueba = new Partida(1, 'espera','Carrera', '1:30','Bosque',8, 2, '1:30');
let partidaprueba2 = new Partida(2, 'espera', 'Contratiempo','1:30','Desierto',10, 10, '1:30');
let partidaprueba3 = new Partida(2, 'espera', 'Carrera', '1:30','Fuego',10, 10, '1:30');

let partidas = [partidaprueba, partidaprueba2, partidaprueba3];
let idSala = 1;
io.on('connection', socket => {
     console.log("Nueva conexion de socket. ID: " + socket.id);

     //obtiene las partidas en espera
     const getPartidasEspera = () => {
          let partidasEspera = []
          partidas.forEach( (data) => {
               if(data.estado === 'espera'){
                    partidasEspera.push(data);
               }
          });
          return partidasEspera;
     };
     socket.on("getPartida", id => {

         socket.emit("document", documents[docId]);
     });

     //crea una nueva sala e incrementa el id.
     socket.on('crearSala', configSala => {
          socket.join('sala-' + idSala.toString());
          console.log(configSala);
          partidas.push(new Partida(idSala, 'espera', configSala._tipo, configSala._contratiempo, configSala._pista, configSala._vueltas, configSala._cantJugadores, configSala._tiempoSala))
          socket.emit('getPartidasEspera', getPartidasEspera());
          idSala++;
     });
     socket.on('unirseSala', data =>{
          socket.join('sala-'+ data.id.toString());
          partidas.forEach( partida =>{
               if(partida.id === data.id){
                    partida.jugadores.push(new Jugador(data.nombre, data.carro))
                    console.log(partidas.jugadores)
               }
          })
     })

     socket.on('getJugadores', id => {
          partidas.forEach( partida => {
               if(partida.id===id){
                    //devuelvo lista de jugadores del id partida
                    //socket.emit('getJugadores',partida.jugadores);
               }
          })
     });

     //emite las partidas en espera mientras este conectado.
     socket.emit('getPartidasEspera', getPartidasEspera());

     socket.on('disconnect', () => {
          console.log('Usuario desconectado');
     });
});



/**
 * Evento para el manejo de errores del servidor HTTP.
 */

function onError(error) {
     if (error.syscall !== 'listen') {
          throw error;
     }
     // handle specific listen errors with friendly messages
     switch (error.code) {
          case 'EACCES':
               console.error(bind + ' requires elevated privileges');
               process.exit(1);
               break;
          case 'EADDRINUSE':
               console.error(bind + ' is already in use');
               process.exit(1);
               break;
          default:
               throw error;
     }
}

/**
 * Evento que se ejecuta cuando el servidor este funcionando o escuchando.
 */

function onListening() {
     debug('Escuchando en puerto: ' + 3000);
     console.log(`Escuchando en puerto: ${chalk.green('3000')}`)

}


