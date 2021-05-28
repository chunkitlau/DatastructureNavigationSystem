-- MySQL dump 10.13  Distrib 8.0.23, for Win64 (x86_64)
--
-- Host: localhost    Database: navigationsystem
-- ------------------------------------------------------
-- Server version	8.0.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `edgetable`
--

DROP TABLE IF EXISTS `edgetable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `edgetable` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` int NOT NULL,
  `fromid` int NOT NULL,
  `toid` int NOT NULL,
  `efficiency` float NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=393 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `edgetable`
--

LOCK TABLES `edgetable` WRITE;
/*!40000 ALTER TABLE `edgetable` DISABLE KEYS */;
INSERT INTO `edgetable` VALUES (1,0,13,18,1),(3,2,18,19,1.1),(5,1,29,39,2.5),(6,1,39,40,2),(7,1,40,41,1.5),(8,1,41,42,1.1),(9,1,42,38,1.2),(10,1,19,20,1),(11,0,20,15,1),(12,0,15,14,1.2),(13,0,14,16,1.1),(14,0,17,16,1.8),(15,0,15,17,1.2),(16,1,20,21,1.3),(17,1,22,21,1.3),(19,1,30,23,2.5),(20,1,30,29,3),(21,0,22,24,1),(22,0,23,43,1),(23,0,30,26,1),(24,2,19,44,1.5),(25,2,29,44,1.4),(26,0,44,25,1),(27,0,44,45,1),(28,0,20,3,1),(29,1,22,46,1),(30,1,23,46,1),(31,0,30,6,1),(32,0,23,28,1),(33,0,7,28,1),(34,0,43,33,1),(35,0,33,12,1),(36,0,28,33,1),(37,0,28,47,1),(38,2,29,51,2),(39,0,28,51,1),(40,2,51,31,2),(41,2,31,50,2),(42,1,36,50,1.5),(43,1,50,34,1),(44,1,49,34,1),(45,1,49,48,1),(46,0,33,48,1),(47,0,47,49,1),(48,0,47,8,1),(49,0,31,8,1),(50,0,49,1,1),(51,0,34,1,1),(52,1,50,35,1),(53,1,36,37,1),(54,0,52,122,1),(55,0,53,122,1),(56,0,54,125,1),(57,1,219,125,1),(58,0,123,121,1),(59,1,219,123,1),(60,1,122,123,1.2),(61,0,122,55,1),(62,1,122,124,1),(63,1,118,124,1),(64,2,118,139,1.2),(65,2,137,139,1.5),(66,2,220,135,1.5),(67,1,219,136,1.1),(68,1,220,136,1.1),(69,0,55,136,1),(70,0,55,139,1),(71,0,60,125,1),(72,0,60,126,1),(73,1,219,126,1.3),(74,0,59,126,2),(75,0,59,135,2),(76,1,126,129,1.5),(77,1,128,129,1.5),(78,1,128,127,1.5),(79,1,129,133,1),(80,1,129,144,1.5),(81,2,135,144,1.5),(82,1,145,144,1.3),(83,0,145,72,1.5),(84,0,145,70,2),(85,1,145,153,2.2),(86,1,151,153,1.3),(87,1,151,150,1),(88,1,149,150,1),(89,0,149,58,1),(90,0,150,155,1.3),(91,1,150,156,1),(92,1,157,156,1),(93,1,157,93,1.2),(94,1,157,221,1),(96,1,222,158,1),(97,0,221,92,1),(98,1,221,158,1),(99,1,222,159,1),(100,0,90,222,1),(101,1,159,223,1),(102,0,91,223,1),(103,1,160,223,1),(104,1,160,164,1),(105,1,161,164,1),(106,0,89,164,1),(107,0,94,164,1),(108,1,165,161,1),(109,2,165,191,1.5),(110,0,165,224,1),(111,0,107,224,1),(112,2,191,192,1),(113,2,229,228,1),(114,2,227,228,1),(115,2,227,226,1),(116,2,225,226,1),(117,2,225,191,1),(118,1,228,157,1),(119,1,227,158,1),(120,1,226,159,1),(121,1,225,160,1),(122,0,165,170,1.2),(123,0,116,170,1.2),(124,2,165,167,1.5),(125,0,168,167,1.2),(126,0,168,85,1.2),(127,2,167,230,1.5),(128,2,173,230,1.5),(129,1,169,230,1.2),(130,1,169,171,1),(131,0,169,85,1.2),(132,1,171,193,1),(133,1,217,193,1),(135,1,182,193,1),(136,0,193,115,1),(138,1,193,231,1),(139,0,218,231,1.2),(140,1,182,181,1),(141,1,182,238,1),(142,1,208,178,1),(143,1,208,180,1),(144,0,97,209,1),(145,0,180,209,1),(146,1,180,181,1),(147,1,180,179,1),(148,2,110,179,1.5),(149,2,232,179,1.5),(150,2,232,177,1.5),(151,2,176,177,1.5),(152,2,176,175,1.5),(153,2,194,175,1.5),(154,2,194,196,1),(155,2,174,196,1.5),(156,2,174,148,1.5),(157,2,143,241,1.5),(158,2,143,144,1.5),(159,2,173,202,1.5),(160,2,174,202,1.5),(162,2,175,189,1.5),(163,2,185,189,1.5),(164,2,185,247,1.5),(165,2,113,184,2),(166,2,183,184,1.5),(167,2,183,243,1.5),(168,2,179,213,1.5),(169,1,183,234,1),(170,1,177,234,1),(171,0,96,234,1.3),(172,0,96,233,1.3),(173,0,232,233,1.3),(174,1,177,235,1),(175,0,232,207,1.2),(176,0,95,207,1.2),(177,0,95,208,1.2),(178,0,95,206,1.2),(179,0,235,206,1.2),(180,0,235,178,1),(181,0,184,103,1.3),(182,0,102,103,1.3),(183,0,102,176,1),(184,0,114,176,1),(185,0,114,104,1),(186,0,205,104,1),(187,0,205,87,1.5),(188,0,189,103,1.3),(189,0,103,234,1.3),(190,0,139,56,1),(191,0,139,57,1.2),(192,1,137,138,1),(193,0,220,69,1),(194,0,57,138,1),(195,0,155,71,1),(196,1,151,138,1.2),(197,0,119,236,1),(198,1,156,236,1),(199,1,229,236,1),(200,0,154,71,1),(201,0,154,153,1.2),(202,1,147,153,2),(203,1,147,163,2),(204,1,162,163,2),(205,1,162,166,1.3),(206,1,173,166,1.1),(207,1,173,201,1),(208,1,172,201,1.1),(209,1,172,214,1.1),(210,1,178,214,1),(211,0,88,214,1),(212,0,88,216,1),(213,0,237,216,1),(214,0,215,88,1),(215,1,238,178,1),(216,0,215,238,1),(217,0,218,98,1.3),(218,0,217,98,1.3),(219,0,127,61,1.1),(220,1,128,132,1.1),(221,1,131,132,1),(222,1,131,140,1),(224,0,68,131,1),(225,0,140,188,1),(226,1,185,188,1),(227,1,140,141,1),(228,0,66,141,1),(229,1,190,141,1),(230,1,190,142,1),(231,0,67,142,1),(232,1,174,142,1),(233,1,190,133,1),(234,1,130,133,1),(235,1,130,132,1),(236,0,130,105,1),(237,1,133,134,1),(238,0,106,134,1),(239,2,241,148,1),(240,1,131,239,1),(241,1,240,239,1),(242,0,240,65,1),(243,0,239,64,1),(244,1,240,241,1),(245,1,134,143,1),(246,0,62,130,1),(247,0,63,134,1),(248,0,241,77,1),(249,1,143,146,1),(250,1,163,146,1.5),(251,0,73,146,1),(252,0,74,147,1.3),(253,0,203,148,1),(254,0,203,76,1.3),(255,0,78,174,1.5),(256,1,204,162,1),(257,0,204,75,1.5),(258,0,163,75,1.5),(259,0,166,86,1.2),(260,0,108,86,1.2),(261,0,108,109,1.2),(262,0,86,109,1.2),(263,0,167,109,1.2),(264,0,80,189,1.3),(265,0,80,188,1.2),(266,0,80,187,1.2),(267,0,194,187,1),(268,0,194,195,1),(269,0,84,195,1.2),(270,0,84,197,1.2),(271,0,84,198,1.2),(272,0,198,83,1.2),(273,0,199,83,1.2),(274,0,199,202,1),(275,0,196,81,1),(276,0,196,82,1),(277,0,81,82,1),(278,1,175,242,1),(279,1,172,242,1),(280,0,197,242,1),(281,0,84,200,1.2),(282,0,201,200,1),(283,1,172,237,1),(284,1,171,237,1),(285,2,111,213,1),(286,2,243,213,1),(287,0,99,245,1),(288,0,100,245,1),(289,1,244,245,1),(290,1,244,246,1),(291,2,244,110,1),(292,0,246,120,1),(293,0,79,188,1.1),(294,2,247,184,1),(295,0,112,247,1),(296,0,248,101,1),(297,2,248,244,1),(298,1,231,192,1),(299,1,204,161,1.1),(300,2,249,18,1.3),(301,2,249,251,1),(302,2,251,250,1.2),(303,2,137,220,1.4),(304,1,35,265,1),(305,0,35,252,1.5),(306,0,253,252,1.3),(307,0,253,254,1.3),(308,0,255,254,1.3),(309,0,255,256,1.2),(310,0,257,256,1.1),(311,0,257,258,1),(312,0,259,258,1),(313,0,259,260,1),(314,0,261,260,1.1),(315,0,261,262,1.2),(316,0,263,262,1.1),(317,0,263,264,1),(318,0,264,265,1),(319,0,252,268,1),(320,0,252,266,1),(321,0,253,267,1),(322,0,254,269,1),(323,0,254,270,1),(324,0,255,271,1),(325,0,255,272,1),(326,0,256,273,1),(327,0,257,274,1),(328,0,258,275,1),(329,0,259,276,1),(330,0,260,277,1),(331,0,260,278,1),(332,0,261,279,1),(333,0,261,285,1),(334,0,262,280,1),(335,0,262,281,1),(336,0,263,282,1),(337,0,264,284,1),(338,0,264,283,1),(339,0,41,286,1.3),(340,0,305,286,1),(341,0,305,306,1),(342,0,307,306,1),(343,0,307,308,1),(344,0,309,308,1),(345,0,309,310,1),(346,0,311,308,1),(347,0,312,307,1),(348,0,313,306,1),(349,0,314,305,1),(350,0,286,287,1),(351,0,288,287,1),(352,0,288,289,1),(353,0,290,289,1),(354,0,290,291,1),(355,0,292,291,1),(356,0,292,293,1),(357,0,294,293,1),(358,0,294,295,1),(359,0,296,295,1),(360,0,296,297,1),(361,0,298,297,1),(362,0,298,333,1),(363,0,297,332,1),(364,0,296,331,1),(365,0,296,330,1),(366,0,295,329,1),(367,0,295,328,1),(368,0,294,327,1),(369,0,294,326,1),(370,0,293,325,1),(371,0,293,324,1),(372,0,292,323,1),(373,0,292,322,1),(374,0,291,321,1),(375,0,291,320,1),(376,0,290,319,1),(377,0,290,315,1),(378,0,289,318,1),(379,0,288,317,1),(380,0,287,316,1),(381,0,286,299,1),(382,0,334,299,1),(383,0,335,300,1),(384,0,336,301,1),(385,0,337,302,1),(386,0,338,303,1),(387,0,339,304,1),(388,0,299,300,1),(389,0,301,300,1),(390,0,301,302,1),(391,0,303,302,1),(392,0,303,304,1);
/*!40000 ALTER TABLE `edgetable` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-28 15:20:03
