/**
 * Module dependencies.
 */
const app = require('./app');
const debug = require('debug')('backend:server');
const http = require('http');

const server = http.createServer(app);

server.listen(app.get('puerto'));
server.on('error', onError);
server.on('listening', onListening);


/**
 * Evento para el manejo de errores del servidor..
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
     debug('Escuchando en puerto: ' + app.get('puerto'));
     console.log("Escuchando en puerto: " + app.get('puerto'));
}


