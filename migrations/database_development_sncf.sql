
SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));
-- --------------------------------------------------------

--
-- Structure de la table `repartitions`
--

DROP TABLE IF EXISTS `repartitions`;
CREATE TABLE IF NOT EXISTS `repartitions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idTRAJET` int NOT NULL,
  `idVOITURE` int NOT NULL,
  `positionDansTrain` int NOT NULL,
  `nb_places_couloir` int NOT NULL,
  `nb_places_fenetre` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idTRAJET` (`idTRAJET`),
  KEY `idVOITURE` (`idVOITURE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Structure table billets :

DROP TABLE IF EXISTS `billets`;
CREATE TABLE IF NOT EXISTS `billets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idTRAJET` int NOT NULL,
  `idPLACE` int NOT NULL,
  `idCLIENT` int NOT NULL,
  `prix_billet` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idTRAJET` (`idTRAJET`),
  KEY `idPLACE` (`idPLACE`),
  KEY `idCLIENT` (`idCLIENT`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Structure de la table `clients`
--

DROP TABLE IF EXISTS `clients`;
CREATE TABLE IF NOT EXISTS `clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idREDUCTION` int DEFAULT NULL,
  `prenom` varchar(255) DEFAULT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `date_naissance` date DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idREDUCTION` (`idREDUCTION`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Structure de la table `trajets`
--

DROP TABLE IF EXISTS `trajets`;
CREATE TABLE IF NOT EXISTS `trajets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idGAREDEPART` int NOT NULL,
  `idGAREARRIVEE` int NOT NULL,
  `idTRAIN` int NOT NULL,
  `heure_depart` datetime NOT NULL,
  `heure_arrivee` datetime NOT NULL,
  `prix_initial` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idGAREDEPART` (`idGAREDEPART`),
  KEY `idGAREARRIVEE` (`idGAREARRIVEE`),
  KEY `idTRAIN` (`idTRAIN`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



-- --------------------------------------------------------

--
-- Structure de la table `gares`
--

DROP TABLE IF EXISTS `gares`;
CREATE TABLE IF NOT EXISTS `gares` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `ville` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `places`
--

DROP TABLE IF EXISTS `places`;
CREATE TABLE IF NOT EXISTS `places` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idVOITURE` int NOT NULL,
  `numero_place` varchar(255) NOT NULL,
  `cote_couloir` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idVOITURE` (`idVOITURE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `reductions`
--

DROP TABLE IF EXISTS `reductions`;
CREATE TABLE IF NOT EXISTS `reductions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `pourcentage` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



-- --------------------------------------------------------
--
-- Structure de la table `trains`
--

DROP TABLE IF EXISTS `trains`;
CREATE TABLE IF NOT EXISTS `trains` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------



-- --------------------------------------------------------

--
-- Structure de la table `voitures`
--

DROP TABLE IF EXISTS `voitures`;
CREATE TABLE IF NOT EXISTS `voitures` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nb_places_couloir` int NOT NULL,
  `nb_places_fenetre` int NOT NULL,
  `classe` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `billets`
--
ALTER TABLE `billets`
  ADD CONSTRAINT `billets_ibfk_1` FOREIGN KEY (`idTRAJET`) REFERENCES `trajets` (`id`),
  ADD CONSTRAINT `billets_ibfk_2` FOREIGN KEY (`idPLACE`) REFERENCES `places` (`id`),
  ADD CONSTRAINT `billets_ibfk_3` FOREIGN KEY (`idCLIENT`) REFERENCES `clients` (`id`);

--
-- Contraintes pour la table `clients`
--
ALTER TABLE `clients`
  ADD CONSTRAINT `clients_ibfk_1` FOREIGN KEY (`idREDUCTION`) REFERENCES `reductions` (`id`);

--
-- Contraintes pour la table `places`
--
ALTER TABLE `places`
  ADD CONSTRAINT `places_ibfk_1` FOREIGN KEY (`idVOITURE`) REFERENCES `voitures` (`id`);

--
-- Contraintes pour la table `repartitions`
--
ALTER TABLE `repartitions`
  ADD CONSTRAINT `repartitions_ibfk_1` FOREIGN KEY (`idTRAJET`) REFERENCES `trajets` (`id`),
  ADD CONSTRAINT `repartitions_ibfk_2` FOREIGN KEY (`idVOITURE`) REFERENCES `voitures` (`id`);

--
-- Contraintes pour la table `trajets`
--
ALTER TABLE `trajets`
  ADD CONSTRAINT `trajets_ibfk_1` FOREIGN KEY (`idGAREDEPART`) REFERENCES `gares` (`id`),
  ADD CONSTRAINT `trajets_ibfk_2` FOREIGN KEY (`idGAREARRIVEE`) REFERENCES `gares` (`id`),
  ADD CONSTRAINT `trajets_ibfk_3` FOREIGN KEY (`idTRAIN`) REFERENCES `trains` (`id`);

-- Déchargement des tables initiales :

-- Création d'une réduction nulle :

INSERT INTO `reductions` (`id`, `nom`, `pourcentage`) VALUES (1, "Aucune réduction", 0);

-- Création d'un profil administrateur :

INSERT INTO `clients` (`id`, `idREDUCTION`, `prenom`, `nom`, `date_naissance`, `email`, `password`, `isAdmin`) VALUES
(1, 1, 'Admin', 'Istrator', NULL, 'enguerran.vandenbossche@ecl17.ec-lyon.fr', '$2b$05$hZNgwjcf1DiQRTkFLP0.buyePL9KaU7cDSv7jxlQekV5kV47eehMy', 1);



