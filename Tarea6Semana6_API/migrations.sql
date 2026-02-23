CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(150) NOT NULL,
    `ProductVersion` varchar(32) NOT NULL,
    PRIMARY KEY (`MigrationId`)
);

START TRANSACTION;
CREATE TABLE `Facturas` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `NumeroFactura` longtext NOT NULL,
    `Fecha` datetime(6) NOT NULL,
    `CedulaRuc` longtext NOT NULL,
    `NombreCliente` longtext NOT NULL,
    `Direccion` longtext NULL,
    `Telefono` longtext NULL,
    `Descripcion` longtext NULL,
    `Subtotal` decimal(18,2) NOT NULL,
    `Iva` decimal(18,2) NOT NULL,
    `Total` decimal(18,2) NOT NULL,
    `Estado` longtext NOT NULL,
    PRIMARY KEY (`Id`)
);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260222223225_NuevaMigracion', '10.0.3');

COMMIT;

