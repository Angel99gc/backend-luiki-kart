 
CREATE DATABASE KART
GO
USE KART ;  
GO 
/* Tabla de datos de los ganadores de cada carrera */
CREATE TABLE CARRERA (
    ID Int Identity(1,1),
    GANADOR varchar(100),
    PISTA varchar(100),
    TIEMPO TIME,
    VUELTAS INT
);
GO

/**** Procedimiento para obtener todos los ganadores de cada carrera ****/
CREATE PROCEDURE getRanking
AS
	BEGIN
		SELECT * FROM CARRERA;
	END
GO
