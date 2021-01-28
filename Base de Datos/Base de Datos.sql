 /** Se crea la base de datos**/
CREATE DATABASE KART
GO
USE KART ;
GO

/* Tabla de datos de los ganadores de cada carrera */
CREATE TABLE CARRERA (
    ID Int PRIMARY KEY NOT NULL,
    GANADOR varchar(100) NOT NULL,
    PISTA varchar(100) NOT NULL,
    TIEMPO TIME NOT NULL,
    VUELTAS INT NOT NULL,
    TIPO varchar(100) NOT NULL
);
GO

/**** Procedimiento para obtener todos los ganadores de cada carrera ****/
CREATE PROCEDURE getRanking
AS
	BEGIN
		SELECT * FROM CARRERA;
	END
GO


/*** Procedimiento para agregar el ganador a la base de datos  **/
CREATE PROC addRanking
	@GANADOR varchar(100),
    @PISTA varchar(100),
    @TIEMPO TIME,
    @VUELTAS INT,
    @TIPO varchar(100)
AS
	BEGIN
		DECLARE @ID Int;
		SET @ID = (SELECT MAX(ID)+1 FROM CARRERA)
		INSERT INTO CARRERA
		Values(@ID, @GANADOR, @PISTA, @TIEMPO, @VUELTAS, @TIPO);
	END
/*** Inserción de datos **/
INSERT INTO CARRERA
VALUES
	(1, 'Angel','Bosque','19:30:10',9,'Carrera'),
	(2, 'Pedro','Bosque','00:10:10',6,'ContraTiempo'),
	(3, 'Pablo','Bosque','00:05:10',5,'Carrera'),
	(4, 'Allan','Desierto','1:30:10',4,'Carrera'),
	(5, 'Mario','Desierto','00:20:10',5,'Carrera'),
	(6, 'Oscar','Desierto','00:15:10',3,'ContraTiempo'),
	(7, 'Jimena','Fuego','00:18:10',5, 'Carrera'),
	(8, 'Sofia','Fuego','00:12:10',5,'ContraTiempo'),
	(9, 'Patricia','Fuego','00:22:10',2,'ContraTiempo'),
	(10, 'Natalia','Bosque','00:44:10',2,'Carrera'),
	(11, 'Yuli','Desierto','00:22:10',5,'ContraTiempo'),
	(12, 'MAXIMUSGAMER','Fuego','00:10:10',1,'ContraTiempo'),
	(13, 'Angel','Bosque','00:20:10',5,'Carrera'),
	(14, 'Angel','Desierto','00:15:10',1,'ContraTiempo');
