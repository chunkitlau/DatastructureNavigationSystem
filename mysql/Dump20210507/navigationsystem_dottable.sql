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
INSERT INTO `dottable` VALUES (1,1,'æ²™æ²³å›¾ä¹¦é¦†',_binary '\0\0\0\0\0\0\0jşQBF]@\\ŸhDD@',''),(2,2,'é›åŒ—å›­D2åŒº',_binary '\0\0\0\0\0\0\0¢[\Û]@$J\ÈAD@',''),(3,2,'é›åŒ—å›­BåŒº',_binary '\0\0\0\0\0\0\0¢\Ûú]@\Üÿ‰†D@',''),(4,2,'é›å—å›­S4åŒº',_binary '\0\0\0\0\0\0\04óp\ï\']@H0M\Ú\ïD@',''),(5,2,'é›å—å›­S6åŒº',_binary '\0\0\0\0\0\0\09\ç,]@\èø½ºD@',''),(6,2,'å­¦ç”Ÿé£Ÿå ‚',_binary '\0\0\0\0\0\0\0Ubq”#]@p\Û-D@',''),(7,2,'æ•™å·¥é£Ÿå ‚',_binary '\0\0\0\0\0\0\0Tbq\Ò!]@d\Ë*¹?D@',''),(8,3,'å­¦ç”Ÿæ´»åŠ¨ä¸­å¿ƒ',_binary '\0\0\0\0\0\0\0º`²j0]@h¶´4D@',''),(9,4,'è¡Œæ”¿åŠå…¬æ¥¼',_binary '\0\0\0\0\0\0\0¹`2ı,]@¬|¡FD@',''),(10,1,'æ•™å­¦å®éªŒç»¼åˆæ¥¼',_binary '\0\0\0\0\0\0\0¶`2H]@œTÚ¾D@',''),(11,1,'æ™ºèƒ½æ•™å®¤æ¥¼',_binary '\0\0\0\0\0\0\0´`²ˆl]@´\èŒD@',''),(12,2,'æ²™æ²³æ ¡åŒ»é™¢',_binary '\0\0\0\0\0\0\0ªGªz&]@¤\Ü@\ÆRD@',''),(13,2,'æ²™æ²³å¿«é€’ç«™',_binary '\0\0\0\0\0\0\0Ò«#\Ê]@pxıtşD@',''),(14,3,'ç”°å¾„åœº',_binary '\0\0\0\0\0\0\0ÿ	Ğ¿\è]@˜Jµ*D@',''),(15,3,'ç¯®çƒåœº',_binary '\0\0\0\0\0\0\0\0\nĞ¢ö]@,İ¨À\'D@',''),(16,3,'ç½‘çƒåœº',_binary '\0\0\0\0\0\0\0ÿ	P\ë]@0w\ÖD@',''),(17,3,'æ’çƒåœº',_binary '\0\0\0\0\0\0\0ş	\Ğ\İ÷]@8_\rD@',''),(18,0,'å¿«é€’ç«™è·¯å£',_binary '\0\0\0\0\0\0\0&™¹\Ò]@”:9}\ïD@',''),(19,0,'å›½è„‰è¥¿è·¯-é¸¿é›è·¯è·¯å£',_binary '\0\0\0\0\0\0\0\æ]@À¯”LD@',''),(20,0,'ä½“è‚²åœºå…¥å£',_binary '\0\0\0\0\0\0\0\"™=]@\ë¥D@',''),(21,0,'å›½è„‰è¥¿è·¯-é›åŒ—è·¯å£1',_binary '\0\0\0\0\0\0\03rJ\0]@\äªo?*D@',''),(22,0,'é›åŒ—å›­EåŒºå…¥å£',_binary '\0\0\0\0\0\0\04r\Ş\Ê\n]@tÿ˜i.D@',''),(23,0,'å®¿èˆè·¯è·¯å£1',_binary '\0\0\0\0\0\0\0o…ò]@x|‡¹5D@',''),(24,2,'é›åŒ—å›­EåŒº',_binary '\0\0\0\0\0\0\0ş˜\Ùe]@¸\âY!<D@',''),(25,2,'é›åŒ—å›­AåŒº',_binary '\0\0\0\0\0\0\0ş˜Y]@\ĞbiD@',''),(26,2,'é›åŒ—å›­D1åŒº',_binary '\0\0\0\0\0\0\0ÿ˜\Ù\Z]@˜]ª*D@',''),(27,2,'é›åŒ—å›­CåŒº',_binary '\0\0\0\0\0\0\0ş˜Y\Û]@Ğ¢Ym.D@',''),(28,0,'äºŒç»´ç å¹¿åœº',_binary '\0\0\0\0\0\0\0ÿ˜\ÙU&]@¬¹,9D@',''),(29,0,'é¸¿é›è·¯-å®¿èˆè·¯è·¯å£',_binary '\0\0\0\0\0\0\0\ïF\å ]@xc®D@',''),(30,0,'å­¦ç”Ÿé£Ÿå ‚-é›åŒ—D1å…¥å£',_binary '\0\0\0\0\0\0\0\á¡]@¼º{\é*D@',''),(31,0,'å­¦ç”Ÿæ´»åŠ¨ä¸­å¿ƒå…¥å£',_binary '\0\0\0\0\0\0\0’VS\ë3]@4€‚c#D@',''),(32,0,'è¡Œæ”¿åŠå…¬æ¥¼å…¥å£',_binary '\0\0\0\0\0\0\0VS46]@ÌšFID@',''),(33,0,'æ ¡åŒ»é™¢å…¥å£',_binary '\0\0\0\0\0\0\0V\ÓY\']@ÌšFID@',''),(34,0,'å›¾ä¹¦é¦†å…¥å£',_binary '\0\0\0\0\0\0\0€VS\Æ:]@\0¼6D@',''),(35,0,'æ•™å­¦å®éªŒç»¼åˆæ¥¼å…¥å£',_binary '\0\0\0\0\0\0\0¯\í*û@]@\Øy¹D@',''),(36,0,'é¸¿é›è·¯-ä¸œ1è·¯è·¯å£',_binary '\0\0\0\0\0\0\0§\íªª\\]@T€ğe8D@',''),(37,0,'æ™ºæ…§æ•™å®¤æ¥¼å…¥å£',_binary '\0\0\0\0\0\0\0œ\íªUf]@9}D@','');
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
