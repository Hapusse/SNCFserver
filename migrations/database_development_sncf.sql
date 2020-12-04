
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
) ;

INSERT INTO `repartitions` (`id`, `idTRAJET`, `idVOITURE`, `positionDansTrain`, `nb_places_couloir`, `nb_places_fenetre`) VALUES
(1, 1, 1, 1, 38, 37),
(2, 1, 2, 2, 28, 28),
(3, 1, 5, 3, 36, 36),
(4, 2, 3, 1, 32, 32),
(5, 2, 4, 2, 35, 35),
(6, 2, 6, 3, 48, 48),
(7, 3, 1, 1, 38, 38),
(8, 3, 2, 2, 28, 28),
(9, 3, 5, 3, 36, 36);




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
) ;

INSERT INTO `billets` (`id`, `idTRAJET`, `idPLACE`, `idCLIENT`, `prix_billet`) VALUES
(1, 1, 1, 1, 5060);

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
);

INSERT INTO `clients` (`id`, `idREDUCTION`, `prenom`, `nom`, `date_naissance`, `email`, `password`, `isAdmin`) VALUES
(1, 1, 'Admin', 'Istrator', NULL, 'admin@sncfproject.fr', '$2b$05$hZNgwjcf1DiQRTkFLP0.buyePL9KaU7cDSv7jxlQekV5kV47eehMy', 1);

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
) ;

INSERT INTO `trajets` (`id`, `idGAREDEPART`, `idGAREARRIVEE`, `idTRAIN`, `heure_depart`, `heure_arrivee`, `prix_initial`) VALUES
(1, 1, 3, 3, '2020-12-08 08:10:00', '2020-12-08 11:22:00', 4600),
(2, 4, 1, 5, '2020-12-08 08:50:00', '2020-12-08 17:22:00', 8000),
(3, 3, 1, 3, '2020-12-19 08:11:00', '2020-12-19 11:22:00', 4600);



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
) ;

INSERT INTO `gares` (`id`, `nom`, `ville`) VALUES
(1, 'Marseille Saint-Charles', 'Marseille'),
(3, 'Bordeaux Saint-Jean', 'Bordeaux'),
(4, 'Gare du Nord', 'Paris'),
(5, 'Perrache', 'Lyon');

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
) ;

INSERT INTO `places` (`id`, `idVOITURE`, `numero_place`, `cote_couloir`) VALUES
(1, 1, '1', 1),
(2, 1, '2', 0),
(3, 1, '3', 0),
(4, 1, '4', 1),
(5, 1, '5', 1),
(6, 1, '6', 0),
(7, 1, '7', 0),
(8, 1, '8', 1),
(9, 1, '9', 1),
(10, 1, '10', 0),
(11, 1, '11', 0),
(12, 1, '12', 1),
(13, 1, '13', 1),
(14, 1, '14', 0),
(15, 1, '15', 0),
(16, 1, '16', 1),
(17, 1, '17', 1),
(18, 1, '18', 0),
(19, 1, '19', 0),
(20, 1, '20', 1),
(21, 1, '21', 1),
(22, 1, '22', 0),
(23, 1, '23', 0),
(24, 1, '24', 1),
(25, 1, '25', 1),
(26, 1, '26', 0),
(27, 1, '27', 0),
(28, 1, '28', 1),
(29, 1, '29', 1),
(30, 1, '30', 0),
(31, 1, '31', 0),
(32, 1, '32', 1),
(33, 1, '33', 1),
(34, 1, '34', 0),
(35, 1, '35', 0),
(36, 1, '36', 1),
(37, 1, '37', 1),
(38, 1, '38', 0),
(39, 1, '39', 0),
(40, 1, '40', 1),
(41, 1, '41', 1),
(42, 1, '42', 0),
(43, 1, '43', 0),
(44, 1, '44', 1),
(45, 1, '45', 1),
(46, 1, '46', 0),
(47, 1, '47', 0),
(48, 1, '48', 1),
(49, 1, '49', 1),
(50, 1, '50', 0),
(51, 1, '51', 0),
(52, 1, '52', 1),
(53, 1, '53', 1),
(54, 1, '54', 0),
(55, 1, '55', 0),
(56, 1, '56', 1),
(57, 1, '57', 1),
(58, 1, '58', 0),
(59, 1, '59', 0),
(60, 1, '60', 1),
(61, 1, '61', 1),
(62, 1, '62', 0),
(63, 1, '63', 0),
(64, 1, '64', 1),
(65, 1, '65', 1),
(66, 1, '66', 0),
(67, 1, '67', 0),
(68, 1, '68', 1),
(69, 1, '69', 1),
(70, 1, '70', 0),
(71, 1, '71', 0),
(72, 1, '72', 1),
(73, 1, '73', 1),
(74, 1, '74', 0),
(75, 1, '75', 0),
(76, 1, '76', 1),
(77, 2, '1', 1),
(78, 2, '2', 0),
(79, 2, '3', 0),
(80, 2, '4', 1),
(81, 2, '5', 1),
(82, 2, '6', 0),
(83, 2, '7', 0),
(84, 2, '8', 1),
(85, 2, '9', 1),
(86, 2, '10', 0),
(87, 2, '11', 0),
(88, 2, '12', 1),
(89, 2, '13', 1),
(90, 2, '14', 0),
(91, 2, '15', 0),
(92, 2, '16', 1),
(93, 2, '17', 1),
(94, 2, '18', 0),
(95, 2, '19', 0),
(96, 2, '20', 1),
(97, 2, '21', 1),
(98, 2, '22', 0),
(99, 2, '23', 0),
(100, 2, '24', 1),
(101, 2, '25', 1),
(102, 2, '26', 0),
(103, 2, '27', 0),
(104, 2, '28', 1),
(105, 2, '29', 1),
(106, 2, '30', 0),
(107, 2, '31', 0),
(108, 2, '32', 1),
(109, 2, '33', 1),
(110, 2, '34', 0),
(111, 2, '35', 0),
(112, 2, '36', 1),
(113, 2, '37', 1),
(114, 2, '38', 0),
(115, 2, '39', 0),
(116, 2, '40', 1),
(117, 2, '41', 1),
(118, 2, '42', 0),
(119, 2, '43', 0),
(120, 2, '44', 1),
(121, 2, '45', 1),
(122, 2, '46', 0),
(123, 2, '47', 0),
(124, 2, '48', 1),
(125, 2, '49', 1),
(126, 2, '50', 0),
(127, 2, '51', 0),
(128, 2, '52', 1),
(129, 2, '53', 1),
(130, 2, '54', 0),
(131, 2, '55', 0),
(132, 2, '56', 1),
(133, 3, '1', 1),
(134, 3, '2', 0),
(135, 3, '3', 0),
(136, 3, '4', 1),
(137, 3, '5', 1),
(138, 3, '6', 0),
(139, 3, '7', 0),
(140, 3, '8', 1),
(141, 3, '9', 1),
(142, 3, '10', 0),
(143, 3, '11', 0),
(144, 3, '12', 1),
(145, 3, '13', 1),
(146, 3, '14', 0),
(147, 3, '15', 0),
(148, 3, '16', 1),
(149, 3, '17', 1),
(150, 3, '18', 0),
(151, 3, '19', 0),
(152, 3, '20', 1),
(153, 3, '21', 1),
(154, 3, '22', 0),
(155, 3, '23', 0),
(156, 3, '24', 1),
(157, 3, '25', 1),
(158, 3, '26', 0),
(159, 3, '27', 0),
(160, 3, '28', 1),
(161, 3, '29', 1),
(162, 3, '30', 0),
(163, 3, '31', 0),
(164, 3, '32', 1),
(165, 3, '33', 1),
(166, 3, '34', 0),
(167, 3, '35', 0),
(168, 3, '36', 1),
(169, 3, '37', 1),
(170, 3, '38', 0),
(171, 3, '39', 0),
(172, 3, '40', 1),
(173, 3, '41', 1),
(174, 3, '42', 0),
(175, 3, '43', 0),
(176, 3, '44', 1),
(177, 3, '45', 1),
(178, 3, '46', 0),
(179, 3, '47', 0),
(180, 3, '48', 1),
(181, 3, '49', 1),
(182, 3, '50', 0),
(183, 3, '51', 0),
(184, 3, '52', 1),
(185, 3, '53', 1),
(186, 3, '54', 0),
(187, 3, '55', 0),
(188, 3, '56', 1),
(189, 3, '57', 1),
(190, 3, '58', 0),
(191, 3, '59', 0),
(192, 3, '60', 1),
(193, 3, '61', 1),
(194, 3, '62', 0),
(195, 3, '63', 0),
(196, 3, '64', 1),
(197, 4, '1', 1),
(198, 4, '2', 0),
(199, 4, '3', 0),
(200, 4, '4', 1),
(201, 4, '5', 1),
(202, 4, '6', 0),
(203, 4, '7', 0),
(204, 4, '8', 1),
(205, 4, '9', 1),
(206, 4, '10', 0),
(207, 4, '11', 0),
(208, 4, '12', 1),
(209, 4, '13', 1),
(210, 4, '14', 0),
(211, 4, '15', 0),
(212, 4, '16', 1),
(213, 4, '17', 1),
(214, 4, '18', 0),
(215, 4, '19', 0),
(216, 4, '20', 1),
(217, 4, '21', 1),
(218, 4, '22', 0),
(219, 4, '23', 0),
(220, 4, '24', 1),
(221, 4, '25', 1),
(222, 4, '26', 0),
(223, 4, '27', 0),
(224, 4, '28', 1),
(225, 4, '29', 1),
(226, 4, '30', 0),
(227, 4, '31', 0),
(228, 4, '32', 1),
(229, 4, '33', 1),
(230, 4, '34', 0),
(231, 4, '35', 0),
(232, 4, '36', 1),
(233, 4, '37', 1),
(234, 4, '38', 0),
(235, 4, '39', 0),
(236, 4, '40', 1),
(237, 4, '41', 1),
(238, 4, '42', 0),
(239, 4, '43', 0),
(240, 4, '44', 1),
(241, 4, '45', 1),
(242, 4, '46', 0),
(243, 4, '47', 0),
(244, 4, '48', 1),
(245, 4, '49', 1),
(246, 4, '50', 0),
(247, 4, '51', 0),
(248, 4, '52', 1),
(249, 4, '53', 1),
(250, 4, '54', 0),
(251, 4, '55', 0),
(252, 4, '56', 1),
(253, 4, '57', 1),
(254, 4, '58', 0),
(255, 4, '59', 0),
(256, 4, '60', 1),
(257, 4, '61', 1),
(258, 4, '62', 0),
(259, 4, '63', 0),
(260, 4, '64', 1),
(261, 4, '65', 1),
(262, 4, '66', 0),
(263, 4, '67', 0),
(264, 4, '68', 1),
(265, 4, '69', 1),
(266, 4, '70', 0),
(267, 5, '1', 1),
(268, 5, '2', 0),
(269, 5, '3', 0),
(270, 5, '4', 1),
(271, 5, '5', 1),
(272, 5, '6', 0),
(273, 5, '7', 0),
(274, 5, '8', 1),
(275, 5, '9', 1),
(276, 5, '10', 0),
(277, 5, '11', 0),
(278, 5, '12', 1),
(279, 5, '13', 1),
(280, 5, '14', 0),
(281, 5, '15', 0),
(282, 5, '16', 1),
(283, 5, '17', 1),
(284, 5, '18', 0),
(285, 5, '19', 0),
(286, 5, '20', 1),
(287, 5, '21', 1),
(288, 5, '22', 0),
(289, 5, '23', 0),
(290, 5, '24', 1),
(291, 5, '25', 1),
(292, 5, '26', 0),
(293, 5, '27', 0),
(294, 5, '28', 1),
(295, 5, '29', 1),
(296, 5, '30', 0),
(297, 5, '31', 0),
(298, 5, '32', 1),
(299, 5, '33', 1),
(300, 5, '34', 0),
(301, 5, '35', 0),
(302, 5, '36', 1),
(303, 5, '37', 1),
(304, 5, '38', 0),
(305, 5, '39', 0),
(306, 5, '40', 1),
(307, 5, '41', 1),
(308, 5, '42', 0),
(309, 5, '43', 0),
(310, 5, '44', 1),
(311, 5, '45', 1),
(312, 5, '46', 0),
(313, 5, '47', 0),
(314, 5, '48', 1),
(315, 5, '49', 1),
(316, 5, '50', 0),
(317, 5, '51', 0),
(318, 5, '52', 1),
(319, 5, '53', 1),
(320, 5, '54', 0),
(321, 5, '55', 0),
(322, 5, '56', 1),
(323, 5, '57', 1),
(324, 5, '58', 0),
(325, 5, '59', 0),
(326, 5, '60', 1),
(327, 5, '61', 1),
(328, 5, '62', 0),
(329, 5, '63', 0),
(330, 5, '64', 1),
(331, 5, '65', 1),
(332, 5, '66', 0),
(333, 5, '67', 0),
(334, 5, '68', 1),
(335, 5, '69', 1),
(336, 5, '70', 0),
(337, 5, '71', 0),
(338, 5, '72', 1),
(339, 6, '1', 1),
(340, 6, '2', 0),
(341, 6, '3', 0),
(342, 6, '4', 1),
(343, 6, '5', 1),
(344, 6, '6', 0),
(345, 6, '7', 0),
(346, 6, '8', 1),
(347, 6, '9', 1),
(348, 6, '10', 0),
(349, 6, '11', 0),
(350, 6, '12', 1),
(351, 6, '13', 1),
(352, 6, '14', 0),
(353, 6, '15', 0),
(354, 6, '16', 1),
(355, 6, '17', 1),
(356, 6, '18', 0),
(357, 6, '19', 0),
(358, 6, '20', 1),
(359, 6, '21', 1),
(360, 6, '22', 0),
(361, 6, '23', 0),
(362, 6, '24', 1),
(363, 6, '25', 1),
(364, 6, '26', 0),
(365, 6, '27', 0),
(366, 6, '28', 1),
(367, 6, '29', 1),
(368, 6, '30', 0),
(369, 6, '31', 0),
(370, 6, '32', 1),
(371, 6, '33', 1),
(372, 6, '34', 0),
(373, 6, '35', 0),
(374, 6, '36', 1),
(375, 6, '37', 1),
(376, 6, '38', 0),
(377, 6, '39', 0),
(378, 6, '40', 1),
(379, 6, '41', 1),
(380, 6, '42', 0),
(381, 6, '43', 0),
(382, 6, '44', 1),
(383, 6, '45', 1),
(384, 6, '46', 0),
(385, 6, '47', 0),
(386, 6, '48', 1),
(387, 6, '49', 1),
(388, 6, '50', 0),
(389, 6, '51', 0),
(390, 6, '52', 1),
(391, 6, '53', 1),
(392, 6, '54', 0),
(393, 6, '55', 0),
(394, 6, '56', 1),
(395, 6, '57', 1),
(396, 6, '58', 0),
(397, 6, '59', 0),
(398, 6, '60', 1),
(399, 6, '61', 1),
(400, 6, '62', 0),
(401, 6, '63', 0),
(402, 6, '64', 1),
(403, 6, '65', 1),
(404, 6, '66', 0),
(405, 6, '67', 0),
(406, 6, '68', 1),
(407, 6, '69', 1),
(408, 6, '70', 0),
(409, 6, '71', 0),
(410, 6, '72', 1),
(411, 6, '73', 1),
(412, 6, '74', 0),
(413, 6, '75', 0),
(414, 6, '76', 1),
(415, 6, '77', 1),
(416, 6, '78', 0),
(417, 6, '79', 0),
(418, 6, '80', 1),
(419, 6, '81', 1),
(420, 6, '82', 0),
(421, 6, '83', 0),
(422, 6, '84', 1),
(423, 6, '85', 1),
(424, 6, '86', 0),
(425, 6, '87', 0),
(426, 6, '88', 1),
(427, 6, '89', 1),
(428, 6, '90', 0),
(429, 6, '91', 0),
(430, 6, '92', 1),
(431, 6, '93', 1),
(432, 6, '94', 0),
(433, 6, '95', 0),
(434, 6, '96', 1);

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
);

INSERT INTO `reductions` (`id`, `nom`, `pourcentage`) VALUES
(1, 'Aucune réduction', 0),
(2, 'Carte Avantage Jeunes', 25),
(3, 'Carte Avantage Vieux', 20),
(4, 'Billets -12 ans', 50),
(5, 'Billets -4 ans', 80);



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
) ;

INSERT INTO `trains` (`id`, `numero`, `type`) VALUES
(1, '86384', 'TER'),
(2, '86358', 'TER'),
(3, '7623', 'TGV'),
(4, '1326', 'TGV'),
(5, '4623', 'OUIGO'),
(6, '9623', 'OUIGO');
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
) ;

INSERT INTO `voitures` (`id`, `nb_places_couloir`, `nb_places_fenetre`, `classe`) VALUES
(1, 38, 38, 1),
(2, 28, 28, 1),
(3, 32, 32, 1),
(4, 35, 35, 2),
(5, 36, 36, 2),
(6, 48, 48, 2);

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



-- Création d'un profil administrateur :



