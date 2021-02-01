class Partida{

    constructor(id, estado, tipo, contratiempo, pista, vueltas, cantJugadores, tiempoSala) {
        this.id = id;
        this.estado = estado;
        this.tipo = tipo;
        this.contratiempo = contratiempo;
        this.pista = pista;
        this.vueltas = vueltas;
        this.cantJugadores = cantJugadores;
        this.tiempoSala = tiempoSala;
        this.jugadores = [];
    }
    addJugador(jugador){
        this.jugadores.push(jugador)
    }
}
module.exports = Partida;
