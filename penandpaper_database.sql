-- MySQL dump 10.13  Distrib 5.6.22, for osx10.8 (x86_64)
--
-- Host: localhost    Database: penandpaper
-- ------------------------------------------------------
-- Server version	5.6.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Advantageset`
--

DROP TABLE IF EXISTS `Advantageset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Advantageset` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `lockpicking` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `animallover` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `immunesystem` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `temperature` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `cheerful` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `illusionist` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `unscrupulousness` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Advantageset`
--

LOCK TABLES `Advantageset` WRITE;
/*!40000 ALTER TABLE `Advantageset` DISABLE KEYS */;
INSERT INTO `Advantageset` VALUES (1,0,0,0,0,0,0,0);
/*!40000 ALTER TABLE `Advantageset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Attributeset`
--

DROP TABLE IF EXISTS `Attributeset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Attributeset` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `intelligence` tinyint(2) unsigned NOT NULL,
  `intuition` tinyint(2) unsigned NOT NULL,
  `agility` tinyint(2) unsigned NOT NULL,
  `strength` tinyint(2) unsigned NOT NULL,
  `scheming` tinyint(2) unsigned NOT NULL,
  `social` tinyint(2) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Attributeset`
--

LOCK TABLES `Attributeset` WRITE;
/*!40000 ALTER TABLE `Attributeset` DISABLE KEYS */;
INSERT INTO `Attributeset` VALUES (1,1,2,1,3,3,1),(2,3,1,3,1,1,2),(3,1,3,2,1,1,3);
/*!40000 ALTER TABLE `Attributeset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Characters`
--

DROP TABLE IF EXISTS `Characters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Characters` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(70) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `description` varchar(300) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `imagepath` varchar(300) COLLATE utf8_unicode_ci DEFAULT NULL,
  `attributeset` int(11) unsigned NOT NULL,
  `skillset` int(11) unsigned NOT NULL,
  `advantageset` int(11) unsigned NOT NULL,
  `disadvantageset` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Characters`
--

LOCK TABLES `Characters` WRITE;
/*!40000 ALTER TABLE `Characters` DISABLE KEYS */;
INSERT INTO `Characters` VALUES (1,'Kraftprotz','Ein starker Typ der alle umhaut',NULL,1,1,1,1),(2,'Intelligenzbestie','Mit Wissen und Geschick trumpft er auf',NULL,2,2,1,1),(3,'Wahrnehmer','Hat das nötige Gespür für brenzlige Situationen',NULL,3,3,1,1);
/*!40000 ALTER TABLE `Characters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Disadvantageset`
--

DROP TABLE IF EXISTS `Disadvantageset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Disadvantageset` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `pyromaniac` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `analphabet` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `disorientation` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `hemophobia` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `nonswimmer` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `hoggish` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Disadvantageset`
--

LOCK TABLES `Disadvantageset` WRITE;
/*!40000 ALTER TABLE `Disadvantageset` DISABLE KEYS */;
INSERT INTO `Disadvantageset` VALUES (1,0,0,0,0,0,0);
/*!40000 ALTER TABLE `Disadvantageset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `EnemieCategories`
--

DROP TABLE IF EXISTS `EnemieCategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `EnemieCategories` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL DEFAULT '',
  `imagepath` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EnemieCategories`
--

LOCK TABLES `EnemieCategories` WRITE;
/*!40000 ALTER TABLE `EnemieCategories` DISABLE KEYS */;
INSERT INTO `EnemieCategories` VALUES (1,'menschlich','/images/content/enemies/default.png'),(2,'tierisch','/images/content/enemies/default.png'),(3,'pflanzlich','/images/content/enemies/default.png'),(4,'mechanisch','/images/content/enemies/default.png'),(5,'fantastisch','/images/content/enemies/default.png'),(6,'außerirdisch','/images/content/enemies/default.png'),(7,'untot','/images/content/enemies/default.png'),(8,'Sonstige','/images/content/enemies/default.png');
/*!40000 ALTER TABLE `EnemieCategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Enemies`
--

DROP TABLE IF EXISTS `Enemies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Enemies` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL DEFAULT '',
  `description` varchar(200) NOT NULL DEFAULT '',
  `category` int(11) unsigned NOT NULL,
  `imagepath` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Enemies`
--

LOCK TABLES `Enemies` WRITE;
/*!40000 ALTER TABLE `Enemies` DISABLE KEYS */;
INSERT INTO `Enemies` VALUES (1,'Vampir','meidet die Sonne',7,'/dbImages/enemies/img_1434640792097.png'),(2,'Skelett','tot, aber dennoch gefährlich',7,'/dbImages/enemies/img_1434642004355.png'),(3,'Militärmann','kleiner, starker, breiter Mann',1,'/dbImages/enemies/img_1434643459994.png'),(4,'Hai','Jäger der Meere',2,'/dbImages/enemies/img_1434644298162.png'),(5,'Piranha-Pflanze','schnappt schneller als man denkt',3,'/dbImages/enemies/img_1434645430687.png'),(6,'Voodoo-Priesterin','kämpft mit ungewöhnlichen Mitteln',1,'/dbImages/enemies/img_1434646639750.png'),(7,'Drache','mutierte vom Lindwurm zum Drachen',5,'/dbImages/enemies/img_1434648276132.png');
/*!40000 ALTER TABLE `Enemies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ItemCategories`
--

DROP TABLE IF EXISTS `ItemCategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ItemCategories` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL DEFAULT '',
  `imagepath` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ItemCategories`
--

LOCK TABLES `ItemCategories` WRITE;
/*!40000 ALTER TABLE `ItemCategories` DISABLE KEYS */;
INSERT INTO `ItemCategories` VALUES (1,'Nahkampfwaffe','/images/content/items/category1.png'),(2,'Fernkampfwaffe','/images/content/items/category2.png'),(3,'Werkzeug','/images/content/items/category3.png'),(4,'Ausrüstung','/images/content/items/category4.png'),(5,'Essen und Trinken','/images/content/items/category5.png'),(6,'Überlebenshilfe','/images/content/items/category6.png'),(7,'Behälter','/images/content/items/category7.png'),(8,'Heilmittel','/images/content/items/category8.png'),(9,'Magische Gegenstände','/images/content/items/category9.png'),(10,'Sonstige','/images/content/items/category10.png');
/*!40000 ALTER TABLE `ItemCategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Items`
--

DROP TABLE IF EXISTS `Items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Items` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `description` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `category` int(11) unsigned NOT NULL,
  `imagepath` varchar(300) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Items`
--

LOCK TABLES `Items` WRITE;
/*!40000 ALTER TABLE `Items` DISABLE KEYS */;
INSERT INTO `Items` VALUES (1,'Stein','ein schwer, etwa handflächengroß und grau',10,'/dbImages/items/img_1434621371300.png'),(2,'Schwert','ein echtes Ritterschwert',1,'/dbImages/items/img_1434621828040.png'),(3,'Säbel','scharf wie die Zähne eines Säbelzahntigers',1,'/dbImages/items/img_1434622169260.png'),(4,'Stock','ein verzweigter Ast',10,'/dbImages/items/img_1434622381789.png'),(5,'Granate','bumm',2,'/dbImages/items/img_1434623048639.png'),(6,'Gewehrmunition','eine Hand voll Munition für ein Gewehr',2,'/dbImages/items/img_1434623786924.png'),(7,'Pistolenmunition','eine Hand voll Munition für eine Pistole',2,'/dbImages/items/img_1434624070196.png'),(8,'Gewehr','ein Gewehr ohne Munition',2,'/dbImages/items/img_1434624682894.png'),(9,'Pistole','eine Pistole ohne Munition',2,'/dbImages/items/img_1434625440497.png'),(10,'Bogen','handwerklich hochwertig',2,'/dbImages/items/img_1434625766563.png'),(11,'Pfeile','superspitze Pfeile',2,'/dbImages/items/img_1434626282278.png'),(12,'Brotlaib','ein Pfund Schwarzbrot',5,'/dbImages/items/img_1434626481156.png'),(13,'Apfel','ein frischer roter Apfel',5,'/dbImages/items/img_1434626688849.png'),(14,'Karotten','knackig frische Karotten',5,'/dbImages/items/img_1434627039414.png'),(15,'Wasserflasche','eine fast volle Flasche mit Trinkwasser',5,'/dbImages/items/img_1434627391588.png'),(16,'Heilkräuter','frisch gepflückte Kräuter zur Heilung von Wunden',8,'/dbImages/items/img_1434627619416.png'),(17,'Verbandskasten','Erste-Hilfe-Koffer mit Verbänden, Schere und Salbe',8,'/dbImages/items/img_1434628167531.png'),(18,'Verband','ein Verband mit 2 Verbandklammern',8,'/dbImages/items/img_1434628999403.png'),(19,'Serum','20ml-Fläschchen mit Serum',8,'/dbImages/items/img_1434629583485.png'),(20,'Seil','etwa 2 Meter lang',6,'/dbImages/items/img_1434629791447.png'),(21,'Fakel','ein fester Stock mit in Lampenöl getränktem Stoff',6,'/dbImages/items/img_1434630705820.png'),(22,'Taschenlampe','ohne Batterien',6,'/dbImages/items/img_1434631441348.png'),(23,'Gummiband','ein rotes Gummiband',6,'/dbImages/items/img_1434631663188.png'),(24,'Batterien','zwei AA-Batterien',6,'/dbImages/items/img_1434632237850.png'),(25,'Streichhölzer','eine halb volle Schachtel Streichhölzer',6,'/dbImages/items/img_1434633610512.png'),(26,'Kristallkugel','funkelt und leuchtet',9,'/dbImages/items/img_1434634097194.png'),(27,'Voodoo-Puppe','mit drei spitzen Nadeln',9,'/dbImages/items/img_1434634897852.png'),(28,'Hexenbesen','2 Meter langer krummer Besen',9,'/dbImages/items/img_1434635098985.png'),(29,'Karton','handelsüblicher Umzugskarton',7,'/dbImages/items/img_1434635497157.png'),(30,'Eimer','Eimer aus Blech',7,'/dbImages/items/img_1434635788657.png'),(31,'Geldbeutel','Beutel aus Leder voll mit Münzen',6,'/dbImages/items/img_1434636048074.png'),(32,'Topf','ohne Deckel',7,'/dbImages/items/img_1434636458572.png'),(33,'Schild','schwer, aber schützt',4,'/dbImages/items/img_1434637047433.png'),(34,'Wollmütze','flauschige, warme Wollmütze',4,'/dbImages/items/img_1434637422854.png'),(35,'Schal','gestrickter Schal für kalte Tage',4,'/dbImages/items/img_1434637736646.png'),(36,'Schwimmflossen','orange Flossen aus Gummi',4,'/dbImages/items/img_1434638069428.png'),(37,'Kamm','klein und schwarz',10,'/dbImages/items/img_1434638393025.png'),(38,'Kegel','Kegel aus Holz',10,'/dbImages/items/img_1434638572383.png'),(39,'Entchen','gelbes Quietscheentchen',10,'/dbImages/items/img_1434639174932.png'),(40,'Stift','ein grüner gespitzter Buntstift',10,'/dbImages/items/img_1434639452002.png');
/*!40000 ALTER TABLE `Items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SavegameCharacters`
--

DROP TABLE IF EXISTS `SavegameCharacters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SavegameCharacters` (
  `savegameID` int(11) unsigned NOT NULL,
  `characterID` int(11) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SavegameCharacters`
--

LOCK TABLES `SavegameCharacters` WRITE;
/*!40000 ALTER TABLE `SavegameCharacters` DISABLE KEYS */;
/*!40000 ALTER TABLE `SavegameCharacters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SceneCategories`
--

DROP TABLE IF EXISTS `SceneCategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SceneCategories` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL DEFAULT '',
  `imagepath` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SceneCategories`
--

LOCK TABLES `SceneCategories` WRITE;
/*!40000 ALTER TABLE `SceneCategories` DISABLE KEYS */;
INSERT INTO `SceneCategories` VALUES (1,'Stadt','/images/content/scenes/category1.png'),(2,'Wald','/images/content/scenes/category2.png'),(3,'Ebene','/images/content/scenes/category3.png'),(4,'Wüste','/images/content/scenes/category4.png'),(5,'Gebirge','/images/content/scenes/category5.png'),(6,'Dschungel','/images/content/scenes/category6.png'),(7,'Sumpf und Flüsse','/images/content/scenes/category7.png'),(8,'Meer','/images/content/scenes/category8.png'),(9,'Eis und Schnee','/images/content/scenes/category9.png'),(10,'Weltall','/images/content/scenes/category10.png'),(11,'Sonstige','/images/content/scenes/category11.png');
/*!40000 ALTER TABLE `SceneCategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Scenes`
--

DROP TABLE IF EXISTS `Scenes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Scenes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `description` text COLLATE utf8_unicode_ci NOT NULL,
  `keywordsInfo` text COLLATE utf8_unicode_ci,
  `category` int(11) unsigned NOT NULL,
  `imagepath` varchar(300) COLLATE utf8_unicode_ci DEFAULT NULL,
  `soundpath` varchar(300) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Scenes`
--

LOCK TABLES `Scenes` WRITE;
/*!40000 ALTER TABLE `Scenes` DISABLE KEYS */;
INSERT INTO `Scenes` VALUES (1,'Erwachen am Waldcontainer','Ihr erwacht von einem Donnerschlag und findet euch auf dem sumpfigen Boden eines&nbsp;&nbsp;<button name=\"scene_1435724600\">Waldes</button>&nbsp;&nbsp;liegend wieder. Der Himmel ist von Wolken verdunkelt, doch es scheint Tag zu sein. Es regnet in Strömen und hier und da seht ihr Blitze durch die Baumwipfel leuchten, gefolgt von einem lauten Grollen.<br>Zu eurer Linken seht ihr einen kaputten&nbsp;&nbsp;<button name=\"scene_1435724220\">Container</button>&nbsp;&nbsp;im versumpften Boden stecken.&nbsp;&nbsp;<button name=\"scene_1435724398\">...</button>&nbsp;<br>','<div id=\"scene_1435724220\" class=\"\"><h3 contenteditable=\"false\">Container</h3><p contenteditable=\"false\">Der Container ist einen engen Spalt weit geöffnet, so dass eine <b>zierliche Person</b> hindurch passen könnte.<br><br>Im Inneren des Containers sind Reisekoffer und Rucksäcke mit <b>Kleidung</b> und <b>ein bisschen Essen</b>.<br><br>Die Öffnung des Containers zeigt von der Talöffnung weg.</p></div><div id=\"scene_1435724398\" class=\"hide\"><h3 contenteditable=\"false\">... nach etwas Zeit</h3><p contenteditable=\"false\">Ihr hört den Motor eines sich schnell nähernden Fahrzeuges aufheulen und nach kurzer Zeit erblickt ihr hinter dem Berg zur rechten des Containers die Silhouette eines Geländewagens.<br><p contenteditable=\"false\">Der Geländewagen stoppt und <b>drei kräftig gebaute Gestalten</b> kommen schnellen Schrittes auf euch zu.<br><br><br>Die Männer wollen der Gruppe die <b>Wasservorräte</b> klauen und anschließend wieder verschwinden.</p></div><div id=\"scene_1435724600\" class=\"hide\"><h3 contenteditable=\"false\">Waldes</h3><p contenteditable=\"false\">Der Blick reicht auf Grund der dicht gewachsenen Bäume nicht weit.<br><br>Ihr befindet euch in einem zu 3 Seiten geschlossenen Tal.<br><br>In Richtung Talöffnung scheinen es weniger Bäume zu werden.</p></div>',2,'/images/content/scenes/category2.png',NULL),(2,'Seilbahnstation auf dem Berg','Als ihr den Berg bis zur Spitze erklommen habt, trefft ihr auf die&nbsp;&nbsp;<button name=\"scene_1435725623\">Station</button>&nbsp;&nbsp;einer kleinen Seilbahn. Sie scheint seit einiger Zeit unbenutzt zu sein, denn die Gondeln der Seilbahn hängen von Moos bewachsen in den Seilen. Die Öffnung zum Stationsgebäude für die Gondeln ist durch einen Bretterverschlag verschlossen, der Rest des Gebäudes scheint notdürftig repariert worden zu sein.<br><br>BEI LÄRM (z.B. durch die Glocke):<br>Der Lärm schreckt eine große Anzahl an&nbsp;&nbsp;<button name=\"scene_1435725737\">Tauben</button>&nbsp;&nbsp;auf, die nun durch kleine Löcher in Dach und Wänden aus der Gondelstation herausfliegen. Dann hört ihr ein Pfeifen und die Tauben setzen sich wie auf Kommando auf Bäume, Boden und Station.&nbsp;Eine&nbsp;&nbsp;<button name=\"scene_1435725782\">Frau</button>&nbsp;&nbsp;erscheint zwischen den Bäumen und geht auf die Station zu.<br>','<div id=\"scene_1435725623\" class=\"hide\"><h3 contenteditable=\"false\">Station</h3><p contenteditable=\"false\">Am Eingang der Station hängt eine <b>Glocke</b>.<br><br>Momentan ist niemand, außer die <b>Tauben</b>, in der Station.<br><br>Im Inneren der Station hängt eine <b>Gondel voll mit Wasser</b>, daneben eine Leiter an der eine große Schöpfkelle für das Wasser hängt.</p></div><div id=\"scene_1435725737\" class=\"hide\"><h3 contenteditable=\"false\">Tauben</h3><p contenteditable=\"false\">Können im Kollektiv gefährlich werden, denn sie picken.</p></div><div id=\"scene_1435725782\" class=\"\"><h3 contenteditable=\"false\">Frau</h3><p contenteditable=\"false\">Die Frau wohnt in er Gondelstation mit den Tauben.<br><br>Sie hat kein Interesse sich mit Fremden zu unterhalten und ist der Gruppe gegenüber <b>misstrauisch</b>.<br><br>Die Ängste der Frau beruhen auf <b>Überfällen</b>, bei denen Diebe ihre <b>Wasservorräte</b> klauen wollten.</p></div>',5,'/images/content/scenes/category5.png',NULL),(3,'Das Ende der Talöffnung','In Richtung Talöffnung lichtet sich der Wald immer weiter und der Boden wird immer sumpfiger und nasser. Schließlich befindet ihr euch am Rande des Waldes, welcher durch einen&nbsp;&nbsp;<button name=\"scene_1435726524\">Fluss</button>&nbsp;&nbsp;von einer Ebene getrennt ist. In der Mitte der Ebene liegt ein&nbsp;&nbsp;<button name=\"scene_1435726295\">Mann</button>&nbsp;&nbsp;reglos auf dem Rücken.&nbsp;&nbsp;<button name=\"scene_1435726593\">...</button>&nbsp;<br>','<div id=\"scene_1435726295\" class=\"hide\"><h3 contenteditable=\"false\">Mann</h3><p contenteditable=\"false\">Um den Mann sind <b>Schüsseln und Plastikbecher</b> verteilt, in die der Regen tropft.<br><br>Der Mann redet <b>wirr</b> und man kann sich nur schwer mit ihm unterhalten.<br><br>Ein Wort wiederholt er immer wieder: <i><b>\"Wasser\"</b></i><br><br>Er ist völlig vom Regen <b>durchnässt</b>.<br><br>Kommen die Spieler näher, bewegt sich der Mann plötzlich und schreit sie an, sie sollen bloß <b>weg von seinem Wasser</b> bleiben.<br><br>Hört der Mann das laute Summen, rennt er <b>ohne seine Schüsseln und Becher </b>weg und stößt bei der Flucht sogar einige um.</p></div><div id=\"scene_1435726524\" class=\"\"><h3 contenteditable=\"false\">Fluss</h3><p contenteditable=\"false\">Der Fluss ist etwa 8 Meter breit und an der tiefsten Stelle 2 Meter tief.</p></div><div id=\"scene_1435726593\" class=\"hide\"><h3 contenteditable=\"false\">... nach etwas Zeit</h3><p contenteditable=\"false\">Ein <b>lautes Summen</b>, ähnlich dem einer Mücke, nur viel lauter, ist zu hören.<br><br>Als der Mann das Summen hört rennt er <b>ohne seine Schüsseln und Becher</b> weg und stößt bei der Flucht sogar einige um.</p></div>',3,'/images/content/scenes/category3.png',NULL),(4,'Leiche im Wald','Als ihr euch im Wald näher umseht entdeckt ihr einen&nbsp;&nbsp;<button name=\"scene_1435727154\">Maschendrahtzaun</button>&nbsp;&nbsp; der das weitere Waldgebiet von euch abtrennt. Im Zaun hängen Stofffetzen und neben einem Baum liegt ein übel riechendes&nbsp;<button name=\"scene_1435727033\">Stoffknäuel</button>&nbsp;.','<div id=\"scene_1435727033\" class=\"hide\"><h3 contenteditable=\"false\">Stoffknäuel</h3><p contenteditable=\"false\">Das Stoffknäuel ist eine <b>Leiche</b>.<br><br>Die Leiche sieht <b>zusammengefallen</b> aus und <b>die Haut ist schrumpelig</b> wie eine Rosine.</p></div><div id=\"scene_1435727154\" class=\"\"><h3 contenteditable=\"false\">Maschendrahtzaun</h3><p contenteditable=\"false\">Mit bloßen Händen nicht kaputt zu kriegen.<br><br>Etwa <b>2 Meter hoch</b> gebunden.</p></div>',2,'/images/content/scenes/category2.png',NULL),(5,'Berg von dem die Männer kamen','Als ihr den Berg erklommen habt, von dem die Wasserdiebe kamen, seht ihr einen langen und sehr breiten&nbsp;&nbsp;<button name=\"scene_1435727566\">Holzsteg</button>&nbsp;&nbsp; der durch den Wald führt. Das rechte Ende des Stegs verschwindet hinter Bäumen, das linke scheint zu einem kleinen&nbsp;&nbsp;<button name=\"scene_1435727560\">Dorf</button>&nbsp;&nbsp;in dem nun vor euch liegenden Bergtal zu führen.','<div id=\"scene_1435727560\" class=\"\"><h3 contenteditable=\"false\">Dorf</h3><p contenteditable=\"false\">Aus aktueller Sicht scheint das Dorf nicht mehr als <b>10 Häuser</b> zu haben.<br><br>Trotz der durch das Gewitter bedingten Dunkelheit sind die <b>Lichter der Häuser aus</b>.</p></div><div id=\"scene_1435727566\" class=\"hide\"><h3 contenteditable=\"false\">Holzsteg</h3><p contenteditable=\"false\">Auf dem Holzsteg müssen die Wasserdiebe <b>mit dem Auto</b> gefahren sein.</p></div>',2,'/images/content/scenes/category2.png',NULL);
/*!40000 ALTER TABLE `Scenes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Skillset`
--

DROP TABLE IF EXISTS `Skillset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Skillset` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `reflex` tinyint(2) unsigned NOT NULL DEFAULT '0',
  `medicine` tinyint(2) unsigned NOT NULL DEFAULT '0',
  `culture` tinyint(2) unsigned NOT NULL DEFAULT '0',
  `technology` tinyint(2) unsigned NOT NULL DEFAULT '0',
  `readtracks` tinyint(2) unsigned NOT NULL DEFAULT '0',
  `machine` tinyint(2) unsigned NOT NULL DEFAULT '0',
  `crafting` tinyint(2) unsigned NOT NULL DEFAULT '0',
  `bodycontrol` tinyint(2) unsigned NOT NULL DEFAULT '0',
  `shoot` tinyint(2) unsigned NOT NULL DEFAULT '0',
  `throw` tinyint(2) unsigned NOT NULL DEFAULT '0',
  `melee` tinyint(2) unsigned NOT NULL DEFAULT '0',
  `fitness` tinyint(2) unsigned NOT NULL DEFAULT '0',
  `sneak` tinyint(2) unsigned NOT NULL DEFAULT '0',
  `thief` tinyint(2) unsigned NOT NULL DEFAULT '0',
  `lie` tinyint(2) unsigned NOT NULL DEFAULT '0',
  `bargain` tinyint(2) unsigned NOT NULL DEFAULT '0',
  `charisma` tinyint(2) unsigned NOT NULL DEFAULT '0',
  `recognizetrap` tinyint(2) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Skillset`
--

LOCK TABLES `Skillset` WRITE;
/*!40000 ALTER TABLE `Skillset` DISABLE KEYS */;
INSERT INTO `Skillset` VALUES (1,0,0,0,1,0,1,0,0,0,1,1,1,0,0,2,0,0,0),(2,0,2,1,0,1,0,0,1,0,0,0,0,0,1,0,1,0,0),(3,1,0,0,0,0,0,2,0,1,0,0,0,1,0,0,0,1,1);
/*!40000 ALTER TABLE `Skillset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserCharacters`
--

DROP TABLE IF EXISTS `UserCharacters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UserCharacters` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userID` int(11) unsigned NOT NULL DEFAULT '0',
  `name` varchar(70) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `age` int(11) unsigned NOT NULL,
  `occupation` varchar(100) NOT NULL DEFAULT '',
  `origin` varchar(100) NOT NULL DEFAULT '',
  `description` varchar(300) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `startLevel` tinyint(1) unsigned NOT NULL,
  `cp` int(11) unsigned NOT NULL,
  `imagepath` varchar(300) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '/images/content/characters/default.png',
  `attributeset` int(11) unsigned NOT NULL,
  `skillset` int(11) unsigned NOT NULL,
  `advantageset` int(11) unsigned NOT NULL,
  `disadvantageset` int(11) unsigned NOT NULL,
  `minorInjury` tinyint(2) unsigned NOT NULL DEFAULT '0',
  `middleInjury` tinyint(2) unsigned NOT NULL DEFAULT '0',
  `severeInjury` tinyint(2) unsigned NOT NULL DEFAULT '0',
  `health` tinyint(2) unsigned NOT NULL DEFAULT '10',
  `constitution` tinyint(2) unsigned NOT NULL DEFAULT '12',
  `inventory` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserCharacters`
--

LOCK TABLES `UserCharacters` WRITE;
/*!40000 ALTER TABLE `UserCharacters` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserCharacters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserEnemies`
--

DROP TABLE IF EXISTS `UserEnemies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UserEnemies` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userID` int(11) unsigned NOT NULL,
  `name` varchar(30) NOT NULL DEFAULT '',
  `description` varchar(200) NOT NULL DEFAULT '',
  `category` int(11) unsigned NOT NULL,
  `imagepath` varchar(300) DEFAULT '/images/content/enemies/default.png',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserEnemies`
--

LOCK TABLES `UserEnemies` WRITE;
/*!40000 ALTER TABLE `UserEnemies` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserEnemies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserItems`
--

DROP TABLE IF EXISTS `UserItems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UserItems` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userID` int(11) unsigned NOT NULL,
  `name` varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `description` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `category` int(11) unsigned NOT NULL,
  `imagepath` varchar(300) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '/images/content/items/default.png',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserItems`
--

LOCK TABLES `UserItems` WRITE;
/*!40000 ALTER TABLE `UserItems` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserItems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserSavegame`
--

DROP TABLE IF EXISTS `UserSavegame`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UserSavegame` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `gamemasterID` int(11) unsigned NOT NULL,
  `name` varchar(30) DEFAULT 'Unbenannt',
  `sceneHistory` text,
  `currentEnemies` text,
  `saveTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserSavegame`
--

LOCK TABLES `UserSavegame` WRITE;
/*!40000 ALTER TABLE `UserSavegame` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserSavegame` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserScenes`
--

DROP TABLE IF EXISTS `UserScenes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `UserScenes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userID` int(11) unsigned NOT NULL,
  `name` varchar(70) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `description` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `keywordsInfo` text,
  `category` int(11) unsigned NOT NULL,
  `imagepath` varchar(300) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '/images/content/scenes/default.png',
  `soundpath` varchar(300) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserScenes`
--

LOCK TABLES `UserScenes` WRITE;
/*!40000 ALTER TABLE `UserScenes` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserScenes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(70) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `password` char(60) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '',
  `since` date NOT NULL,
  `sound` tinyint(1) DEFAULT '1',
  `tutorialMode` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-07-01  8:58:34
