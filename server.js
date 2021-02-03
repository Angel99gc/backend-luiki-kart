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

     //VISTA UNIRSE A PARTIDA
     //emite el id de la sala nueva
     socket.emit('getIdSala', idSala);
     //emite las partidas en espera y que ya se haya unido el jugador que la creo.
     socket.emit('getPartidasEspera', getPartidasEspera());

     //PARA CREAR UN NUEVO JUEGO.
     //crea una nueva sala e incrementa el id.
     socket.on('crearSala', async configSala => {
          socket.join('sala-' + idSala.toString());
          partidas.push(new Partida(idSala, 'espera', configSala.tipo, configSala.contratiempo, configSala.pista, configSala.vueltas, configSala.cantJugadores, configSala.tiempoSala))
          partidas.forEach( data =>{
               if(data.id===idSala){
                    data.jugadores.push(new Jugador(socket.id, configSala.nombre, configSala.carro))
               }
          })
          let idPartida = idSala;
          idSala++;
          io.emit('getIdSala', idSala);

          //para que espere el intervalo de tiempo y actualice el tiempo de espera.
          let segundos = configSala.tiempoSala/1000;
          let tiempoEspera = setInterval(()=>{
               segundos--;
               io.to('sala-'+idPartida.toString()).emit('tiempoEspera', segundos)
               //se compara para ver si se acaba el tiempo de espera.
               if(segundos===0){
                    partidas.forEach(data=>{
                         if(idPartida===data.id || data.estado==='iniciada'){
                              //si se acabo el tiempo de espera.
                              io.in('sala-'+idPartida.toString()).emit('getPartida',data);
                              clearInterval(tiempoEspera);
                         }
                    })
               }
          },1000);
          /**FALTA LA PARTE DE ACTUALIZAR LA LISTA DE LOS INGRESADOS.**/
          /** -------------------io.to(sala).emit()------------------**/
          //mensaje a todos los conectados a la sala
          //io.in('sala-' + idSala.toString()).emit('Partidas', getPartidasEspera());

     });
     //Se une a una sala para el juego
     socket.on('unirseSala', data => {
          //se une a la sala un nuevo usuario
          console.log('se unio un nuevo jugador a la sala: ', socket.id)
          console.log(data);
          socket.join('sala-'+ data.idPartida.toString());
          partidas.forEach( partida => {
               if(partida.id === parseInt(data.idPartida)){
                    partida.jugadores.push(new Jugador(socket.id, data.nombre, data.carro));
                    io.in('sala-'+data.idPartida.toString()).emit('getPartida',partida);

               }
          })
          io.emit('getPartidasEspera', getPartidasEspera());
     })
     //Al apretar el boton la partida es iniciada.
     socket.on('iniciarPartida', async data => {
          //Inicia la partida.
          console.log('iniciar')
          console.log(data);
          partidas.forEach( partida => {
               console.log(partida);
               if(partida.id === parseInt(data.idPartida)){
                    console.log('entro');
                    partida.estado = 'iniciada';
                    io.in('sala-'+data.idPartida.toString()).emit('getPartida', partida);
                    let segundos = 0;
                    let tiempo = setInterval( () => {
                         segundos++;
                         io.in('sala-'+data.idPartida.toString()).emit('tiempoCarrera', segundos)
                    }, 1000);
               }
          });
          io.emit('getPartidasEspera', getPartidasEspera());
     })
     //cambia la direccion del jugador.
     socket.on('setDireccionJugador', data => {
          partidas.forEach(partida => {
               if (parseInt(data.idPartida) === partida.id){
                    partida.jugadores.forEach( jugador =>{
                         console.log(jugador)
                         if (jugador.nombre === data.nombre){
                              console.log('Jugador con nueva direccion: ', jugador.nombre)
                              jugador.direccion = data.direccion;
                         }
                    })
                    io.in('sala-'+data.idPartida.toString()).emit('getPartida', partida);

               }

          })
     })

     socket.on('avanzarJugador', data => {
          partidas.forEach(partida => {
               if (parseInt(data.idPartida) === partida.id){
                    partida.jugadores.forEach( jugador =>{
                         if (jugador.nombre === data.nombre){
                              console.log('Jugador: ', jugador)
                              console.log('PARTIDA: ', partida);
                              let velocidad = 10;
                              if (data.carro === 'Blanco'){
                                   velocidad = 5;
                              }
                              if (jugador.direccion === 'izquierda'){
                                   if (jugador.x > 0){
                                        if (150 < jugador.y && jugador.y < 700){
                                             if(jugador.x > 650 || jugador.x < 110){
                                                  jugador.x -= velocidad;
                                             }
                                        }else{
                                             jugador.x -= velocidad;
                                        }
                                   }
                              }else if(jugador.direccion === 'derecha'){
                                   if (jugador.x < 750){
                                        if (150 < jugador.y && jugador.y < 700){
                                             if(jugador.x < 100 || jugador.x > 660){
                                                  jugador.x += velocidad;
                                             }
                                        }else{
                                             jugador.x += velocidad;
                                        }
                                   }
                              }else if(jugador.direccion === 'arriba' ){
                                   if (jugador.y > 50){
                                        //dentro del cuadro
                                        if (100 < jugador.x && jugador.x < 650){
                                             if (jugador.y < 160 || jugador.y > 700){
                                                  jugador.y -=velocidad;
                                             }
                                        }else {
                                             jugador.y -= velocidad;
                                        }
                                   }
                              }else if(jugador.direccion === 'abajo') {
                                   if (jugador.y < 800){
                                        //dentro del cuadro
                                        if (100 < jugador.x && jugador.x < 650){
                                             if (jugador.y < 150 || jugador.y > 690){
                                                  jugador.y +=velocidad;
                                             }
                                        }else {
                                             jugador.y += velocidad;
                                        }
                                   }
                              }
                              io.in('sala-'+data.idPartida.toString()).emit('getPartida', partida);

                         }
                    })

               }

          })
     })

     //Actualiza la partida a todos los usuarios de la sala.
     socket.on('updatePartida', id => {
          partidas.forEach( partida => {
               if(partida.id === parseInt(id)){
                    io.to('sala-'+id).emit('getPartida',partida);
               }
          })
          io.emit('getPartidasEspera', getPartidasEspera());
          //io.to('sala-'+data.idPartida).emit('getPartida', getPartida());
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


