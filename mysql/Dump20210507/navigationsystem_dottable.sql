-- MySQL dump 10.13  Distrib 8.0.23, for Win64 (x86_64)
--
-- Host: localhost    Database: navigationsystem
-- ------------------------------------------------------
-- Server version	8.0.22

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
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dottable`
--

LOCK TABLES `dottable` WRITE;
/*!40000 ALTER TABLE `dottable` DISABLE KEYS */;
INSERT INTO `dottable` VALUES (1,1,'沙河图书馆',_binary '\0\0\0\0\0\0\0j�QBF]@\\�hDD@',''),(2,2,'雁北园D2区',_binary '\0\0\0\0\0\0\0�[\�]@$J�\�AD@',''),(3,2,'雁北园B区',_binary '\0\0\0\0\0\0\0�\��]@\����D@',''),(4,2,'雁南园S4区',_binary '\0\0\0\0\0\0\04�p\�\']@H0M\�\�D@',''),(5,2,'雁南园S6区',_binary '\0\0\0\0\0\0\09�\�,]@\����D@',''),(6,2,'学生食堂',_binary '\0\0\0\0\0\0\0Ubq�#]@p\�-D@',''),(7,2,'教工食堂',_binary '\0\0\0\0\0\0\0Tbq\�!]@d\�*�?D@',''),(8,3,'学生活动中心',_binary '\0\0\0\0\0\0\0�`�j0]@h��4D@',''),(9,4,'行政办公楼',_binary '\0\0\0\0\0\0\0�`2�,]@�|�FD@',''),(10,1,'教学实验综合楼',_binary '\0\0\0\0\0\0\0�`2H]@�TھD@',''),(11,1,'智能教室楼',_binary '\0\0\0\0\0\0\0�`��l]@�\�D@',''),(12,2,'沙河校医院',_binary '\0\0\0\0\0\0\0�G�z&]@�\�@\�RD@',''),(13,2,'沙河快递站',_binary '\0\0\0\0\0\0\0ҫ#\�]@px�t�D@',''),(14,3,'田径场',_binary '\0\0\0\0\0\0\0�	п\�]@�J�*D@',''),(15,3,'篮球场',_binary '\0\0\0\0\0\0\0\0\nТ�]@,ݨ�\'D@',''),(16,3,'网球场',_binary '\0\0\0\0\0\0\0�	P\�]@0w\�D@',''),(17,3,'排球场',_binary '\0\0\0\0\0\0\0�	\�\��]@8_�\rD@',''),(18,0,'快递站路口',_binary '\0\0\0\0\0\0\0&��\�]@�:9}\�D@',''),(19,0,'国脉西路-鸿雁路路口',_binary '\0\0\0\0\0\0\0\�]@���LD@',''),(20,0,'体育场入口',_binary '\0\0\0\0\0\0\0\"�=]@\��D@',''),(21,0,'国脉西路-雁北路口1',_binary '\0\0\0\0\0\0\03rJ\0]@\�o?*D@',''),(22,0,'雁北园E区入口',_binary '\0\0\0\0\0\0\04r\�\�\n]@t��i.D@',''),(23,0,'宿舍路路口1',_binary '\0\0\0\0\0\0\0o��]@x|��5D@',''),(24,2,'雁北园E区',_binary '\0\0\0\0\0\0\0��\�e]@�\�Y!<D@',''),(25,2,'雁北园A区',_binary '\0\0\0\0\0\0\0��Y]@\�bi�D@',''),(26,2,'雁北园D1区',_binary '\0\0\0\0\0\0\0��\�\Z]@��]�*D@',''),(27,2,'雁北园C区',_binary '\0\0\0\0\0\0\0��Y\�]@ТYm.D@',''),(28,0,'二维码广场',_binary '\0\0\0\0\0\0\0��\�U&]@��,9D@',''),(29,0,'鸿雁路-宿舍路路口',_binary '\0\0\0\0\0\0\0\�F\� ]@xc�D@',''),(30,0,'学生食堂-雁北D1入口',_binary '\0\0\0\0\0\0\0\�]@��{\�*D@',''),(31,0,'学生活动中心入口',_binary '\0\0\0\0\0\0\0�VS\�3]@4��c#D@',''),(32,0,'行政办公楼入口',_binary '\0\0\0\0\0\0\0�VS46]@̚FID@',''),(33,0,'校医院入口',_binary '\0\0\0\0\0\0\0�V\�Y\']@̚FID@',''),(34,0,'图书馆入口',_binary '\0\0\0\0\0\0\0�VS\�:]@�\0�6D@',''),(35,0,'教学实验综合楼入口',_binary '\0\0\0\0\0\0\0�\�*�@]@\�y�D@',''),(36,0,'鸿雁路-东1路路口',_binary '\0\0\0\0\0\0\0�\�\\]@T��e8D@',''),(37,0,'智慧教室楼入口',_binary '\0\0\0\0\0\0\0�\�Uf]@9}D@','');
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

-- Dump completed on 2021-05-07 17:00:22
