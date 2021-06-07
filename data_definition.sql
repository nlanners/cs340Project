-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 11, 2021 at 11:50 PM
-- Server version: 10.4.18-MariaDB-log
-- PHP Version: 7.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs340_bailemer`
--

-- --------------------------------------------------------

--
-- Table structure for table `CharacterItems`
--

DROP TABLE IF EXISTS `CharacterItems`;
CREATE TABLE `CharacterItems` (
  `characterID` int(11) NOT NULL,
  `itemID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `CharacterItems`
--

INSERT INTO `CharacterItems` (`characterID`, `itemID`) VALUES
(1, 3),
(2, 4),
(3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Characters`
--

DROP TABLE IF EXISTS `Characters`;
CREATE TABLE `Characters` (
  `characterID` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `health` int(11) NOT NULL,
  `enemiesKilled` int(11) NOT NULL,
  `magic` int(11) NOT NULL,
  `strength` int(11) NOT NULL,
  `money` int(11) NOT NULL,
  `regionID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Characters`
--

INSERT INTO `Characters` (`characterID`, `name`, `health`, `enemiesKilled`, `magic`, `strength`, `money`, `regionID`) VALUES
(1, 'Leroy Jenkins', 10, 0, 5, 12, 50, 1),
(2, 'Aragorn', 20, 20, 0, 25, 5, 2),
(3, 'Dalinar Kholin', 50, 55, 20, 60, 100, 3);

-- --------------------------------------------------------

--
-- Table structure for table `Enemies`
--

DROP TABLE IF EXISTS `Enemies`;
CREATE TABLE `Enemies` (
  `enemyID` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `health` int(11) NOT NULL,
  `strength` int(11) NOT NULL,
  `itemID` int(11) DEFAULT NULL,
  `dropChance` double(3,2) DEFAULT NULL,
  `money` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Enemies`
--

INSERT INTO `Enemies` (`enemyID`, `name`, `health`, `strength`, `itemID`, `dropChance`, `money`) VALUES
(1, 'Orc', 27, 5, 4, 0.90, 1),
(2, 'Goblin', 35, 7, 2, 0.60, 2),
(3, 'Serpent', 47, 10, 1, 0.40, 4),
(4, 'Shadowmancer', 55, 9, 5, 0.25, 6),
(5, 'Demon', 60, 10, 3, 0.30, 10);

-- --------------------------------------------------------

--
-- Table structure for table `Items`
--

DROP TABLE IF EXISTS `Items`;
CREATE TABLE `Items` (
  `itemID` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `damage` int(11) NOT NULL,
  `cost` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Items`
--

INSERT INTO `Items` (`itemID`, `name`, `damage`, `cost`) VALUES
(1, 'Fiery War Axe', 8, 25),
(2, 'Goblin Smasher', 7, 20),
(3, 'Bloodied Bow', 10, 32),
(4, 'Rusty Sword', 3, 8),
(5, 'Cursed Club', 5, 20);

-- --------------------------------------------------------

--
-- Table structure for table `RegionEnemies`
--

DROP TABLE IF EXISTS `RegionEnemies`;
CREATE TABLE `RegionEnemies` (
  `enemyID` int(11) NOT NULL,
  `regionID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `RegionEnemies`
--

INSERT INTO `RegionEnemies` (`enemyID`, `regionID`) VALUES
(1, 3),
(5, 3),
(3, 2),
(4, 5);

-- --------------------------------------------------------

--
-- Table structure for table `Regions`
--

DROP TABLE IF EXISTS `Regions`;
CREATE TABLE `Regions` (
  `regionID` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Regions`
--

INSERT INTO `Regions` (`regionID`, `name`) VALUES
(1, 'Jade Lakes'),
(2, 'The Enchantments'),
(3, 'Gothic Basin'),
(4, 'Ruby Beach'),
(5, 'Spooky Gulch'),
(6, 'Valley of the Gods'),
(7, 'Red Cliffs');

-- --------------------------------------------------------

--
-- Table structure for table `Spells`
--

DROP TABLE IF EXISTS `Spells`;
CREATE TABLE `Spells` (
  `spellID` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `buyCost` int(11) NOT NULL,
  `upgradeCost` int(11) NOT NULL,
  `strength` int(11) NOT NULL,
  `characterID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Spells`
--

INSERT INTO `Spells` (`spellID`, `name`, `buyCost`, `upgradeCost`, `strength`, `characterID`) VALUES
(1, 'Magic Missile', 10, 10, 5, 1),
(2, 'Bondsmithing', 20, 50, 20, 3),
(3, 'Reckless Attack', 5, 15, 25, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `CharacterItems`
--
ALTER TABLE `CharacterItems`
  ADD PRIMARY KEY (`characterID`,`itemID`),
  ADD KEY `itemID` (`itemID`);

--
-- Indexes for table `Characters`
--
ALTER TABLE `Characters`
  ADD PRIMARY KEY (`characterID`);

--
-- Indexes for table `Enemies`
--
ALTER TABLE `Enemies`
  ADD PRIMARY KEY (`enemyID`),
  ADD KEY `itemID` (`itemID`);

--
-- Indexes for table `Items`
--
ALTER TABLE `Items`
  ADD PRIMARY KEY (`itemID`);

--
-- Indexes for table `RegionEnemies`
--
ALTER TABLE `RegionEnemies`
  ADD KEY `enemyID` (`enemyID`),
  ADD KEY `regionID` (`regionID`);

--
-- Indexes for table `Regions`
--
ALTER TABLE `Regions`
  ADD PRIMARY KEY (`regionID`);

--
-- Indexes for table `Spells`
--
ALTER TABLE `Spells`
  ADD PRIMARY KEY (`spellID`),
  ADD KEY `characterID` (`characterID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Characters`
--
ALTER TABLE `Characters`
  MODIFY `characterID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Enemies`
--
ALTER TABLE `Enemies`
  MODIFY `enemyID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `Items`
--
ALTER TABLE `Items`
  MODIFY `itemID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `Regions`
--
ALTER TABLE `Regions`
  MODIFY `regionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `Spells`
--
ALTER TABLE `Spells`
  MODIFY `spellID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Characters`
--
ALTER TABLE `Characters`
  ADD CONSTRAINT `Characters_ibfk_1` FOREIGN KEY (`regionID`) REFERENCES `Regions` (`regionID`) ON DELETE SET NULL;

--
-- Constraints for table `CharacterItems`
--
ALTER TABLE `CharacterItems`
  ADD CONSTRAINT `CharacterItems_ibfk_1` FOREIGN KEY (`characterID`) REFERENCES `Characters` (`characterID`) ON DELETE CASCADE,
  ADD CONSTRAINT `CharacterItems_ibfk_2` FOREIGN KEY (`itemID`) REFERENCES `Items` (`itemID`) ON DELETE CASCADE;

--
-- Constraints for table `Enemies`
--
ALTER TABLE `Enemies`
  ADD CONSTRAINT `Enemies_ibfk_1` FOREIGN KEY (`itemID`) REFERENCES `Items` (`itemID`) ON DELETE SET NULL;

--
-- Constraints for table `RegionEnemies`
--
ALTER TABLE `RegionEnemies`
  ADD CONSTRAINT `RegionEnemies_ibfk_1` FOREIGN KEY (`enemyID`) REFERENCES `Enemies` (`enemyID`) ON DELETE CASCADE,
  ADD CONSTRAINT `RegionEnemies_ibfk_2` FOREIGN KEY (`regionID`) REFERENCES `Regions` (`regionID`) ON DELETE CASCADE;

--
-- Constraints for table `Spells`
--
ALTER TABLE `Spells`
  ADD CONSTRAINT `Spells_ibfk_1` FOREIGN KEY (`characterID`) REFERENCES `Characters` (`characterID`)ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
