class Jugador{

    constructor(id, nombre, carro) {
        this.id = id;
        this.nombre = nombre;
        this.carro = carro;
        this.direccion = 'izquierda';
        this.x = 400;
        this.y = 100;
    }
}
module.exports = Jugador;
