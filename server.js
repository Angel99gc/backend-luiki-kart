const Partida = require('./Clases/Partida');
const Jugador = require('./Clases/Jugador');


const chalk = require('chalk');
const Socket = require('socket.io');
const debug = require('debug')('backend:server');
const querySQL = require('./Consultas/consultaSQL');


/**
 * Module dependencies.
 */
const server = require('./serverHTTP');
//const server = require('./appSocket');

//Servidor HTTP escuchando
server.listen(3000, onListening);
server.on('error', onError);



// Se crea socket agregando el server que esta escuchando y sus cors
const io = Socket(server, {
     cors: {
          origin: "*",
          methods: ["GET", "POST"]
     }
});
//Datos quemados para pruebas
// let jugador1 = new Jugador('Angel','Rojo');
// let jugador2 = new Jugador('Randall','Azul');
// let jugador3 = new Jugador('Cesar','Verde');
// let jugador4 = new Jugador('Andrey','Verde');
// let jugador5 = new Jugador('Alonso','Rojo');
// let jugador6 = new Jugador('GamersCostaRica','Amarillo');

// let partidaprueba = new Partida(1, 'espera','Carrera', '1:30','Bosque',8, 2, '1:30');
// partidaprueba.addJugador(jugador1);
// partidaprueba.addJugador(jugador2);
// partidaprueba.addJugador(jugador3);
// let partidaprueba2 = new Partida(2, 'espera', 'Contratiempo','1:30','Desierto',10, 10, '1:30');
// partidaprueba2.addJugador(jugador4);
// partidaprueba2.addJugador(jugador5);
// let partidaprueba3 = new Partida(3, 'espera', 'Carrera', '1:30','Fuego',10, 10, '1:30');
// partidaprueba3.addJugador(jugador6);

//Lista de partidas creadas sin finalizar y el id de cada sala creada.
let partidas = [];
let idSala = 1;

io.on('connection', socket => {
     console.log("Nueva conexion de socket. ID: " + socket.id);
     let idPartida;
     const getPartida = () => {
          partidas.forEach( partida =>{
               if(partida.id === idPartida){
                    return partida;
               }
          })
          return null;
     }
     //VISTA UNIRSE A PARTIDA
     //emite las partidas en espera y que ya se haya unido el jugador que la creo.
     socket.emit('getPartida', getPartida());
     //emite las partidas en espera y que ya se haya unido el jugador que la creo.
     socket.emit('getPartidasEspera', getPartidasEspera());

     //PARA CREAR UN NUEVO JUEGO.
     //crea una nueva sala e incrementa el id.
     socket.on('crearSala', configSala => {
          socket.join('sala-' + idSala.toString());
          partidas.push(new Partida(idSala, 'espera', configSala._tipo, configSala._contratiempo, configSala._pista, configSala._vueltas, configSala._cantJugadores, configSala._tiempoSala))
          /**FALTA LA PARTE DE ACTUALIZAR LA LISTA DE LOS INGRESADOS.**/
          /** -------------------io.to(sala).emit()------------------**/
          //mensaje a todos los conectados a la sala
          //io.in('sala-' + idSala.toString()).emit('Partidas', getPartidasEspera());
          idPartida = idSala;
          idSala++;
          console.log(partidas);

     });
     //Se une a una sala para el juego
     socket.on('unirseSala', data => {
          //se une a la sala un nuevo usuario
          if(data.idPartida!==0){
               console.log('sala creada')
               socket.join('sala-'+ data.idPartida.toString());
               idPartida=data.idPartida;
          }
          console.log(idPartida)
          partidas.forEach( partida => {
               if(partida.id === parseInt(idPartida)){
                    console.log('agregoa a jugador'+socket.id)
                    partida.addJugador(new Jugador(socket.id, data.nombre, data.carro));
               }
          })
          console.log(partidas);
          io.emit('getPartidasEspera', getPartidasEspera());
          io.to('sala-'+idPartida).emit('getPartida', getPartida());
     })


     socket.on('disconnect', () => {
          //console.log(idPartida);
          console.log(socket.id);
          //partidas[idPartida].deleteJugador(socket.id);
          console.log('Usuario desconectado');
     });
});



//Funciones logicas para el juego.
//obtiene las partidas en espera
const getPartidasEspera = () => {

     let partidasEspera = []
     partidas.forEach( (data) => {
          if(data.estado === 'espera' && data.jugadores.length!==0){
               partidasEspera.push(data);
          }
     });
     return partidasEspera;
};


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


