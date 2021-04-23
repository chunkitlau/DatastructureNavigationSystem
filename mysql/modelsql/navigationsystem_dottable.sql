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
-- Table structure for table `dottable`
--

DROP TABLE IF EXISTS `dottable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dottable` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` int NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `location` point NOT NULL,
  `description` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dottable`
--

LOCK TABLES `dottable` WRITE;
/*!40000 ALTER TABLE `dottable` DISABLE KEYS */;
INSERT INTO `dottable` VALUES (0,1,'操场',_binary '\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0',NULL),(1,2,'教室食堂',_binary '\0\0\0\0\0\0\0\0\0\0\0\0\0\0@\0\0\0\0\0\0�?',NULL),(2,0,NULL,_binary '\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0@',NULL),(3,2,'学生食堂',_binary '\0\0\0\0\0\0\0\0\0\0\0\0\0\0@\0\0\0\0\0\0@',NULL),(4,0,NULL,_binary '\0\0\0\0\0\0\0\0\0\0\0\0\0@\0\0\0\0\0\0\0@',NULL),(5,1,'图书馆',_binary '\0\0\0\0\0\0\0\0\0\0\0\0\0@\0\0\0\0\0\0�?',NULL),(6,1,'教学实验综合楼',_binary '\0\0\0\0\0\0\0\0\0\0\0\0\0 @\0\0\0\0\0\0@',NULL),(7,0,NULL,_binary '\0\0\0\0\0\0\0\0\0\0\0\0\0\0@\0\0\0\0\0\0\0\0',NULL),(8,2,'S3',_binary '\0\0\0\0\0\0\0\0\0\0\0\0\0�?\0\0\0\0\0\0@','雁南园'),(9,2,'S4',_binary '\0\0\0\0\0\0\0\0\0\0\0\0\0�?\0\0\0\0\0\0 @','雁南园');
/*!40000 ALTER TABLE `dottable` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-04-23 15:38:28
