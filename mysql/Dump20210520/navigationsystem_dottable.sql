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
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dottable`
--

LOCK TABLES `dottable` WRITE;
/*!40000 ALTER TABLE `dottable` DISABLE KEYS */;
INSERT INTO `dottable` VALUES (1,1,'æ²™æ²³å›¾ä¹¦é¦†',_binary '\0\0\0\0\0\0\0jşQBF]@\\ŸhDD@',''),(3,2,'é›åŒ—å›­BåŒº',_binary '\0\0\0\0\0\0\0¢\Ûú]@\Üÿ‰†D@',''),(6,2,'å­¦ç”Ÿé£Ÿå ‚',_binary '\0\0\0\0\0\0\0Ubq”#]@p\Û-D@',''),(7,2,'æ•™å·¥é£Ÿå ‚',_binary '\0\0\0\0\0\0\0Tbq\Ò!]@d\Ë*¹?D@',''),(8,3,'å­¦ç”Ÿæ´»åŠ¨ä¸­å¿ƒ',_binary '\0\0\0\0\0\0\0º`²j0]@h¶´4D@',''),(12,2,'æ²™æ²³æ ¡åŒ»é™¢',_binary '\0\0\0\0\0\0\0ªGªz&]@¤\Ü@\ÆRD@',''),(13,2,'æ²™æ²³å¿«é€’ç«™',_binary '\0\0\0\0\0\0\0Ò«#\Ê]@pxıtşD@',''),(14,3,'ç”°å¾„åœº',_binary '\0\0\0\0\0\0\0ÿ	Ğ¿\è]@˜Jµ*D@',''),(15,3,'ç¯®çƒåœº',_binary '\0\0\0\0\0\0\0\0\nĞ¢ö]@,İ¨À\'D@',''),(16,3,'ç½‘çƒåœº',_binary '\0\0\0\0\0\0\0ÿ	P\ë]@0w\ÖD@',''),(17,3,'æ’çƒåœº',_binary '\0\0\0\0\0\0\0ş	\Ğ\İ÷]@8_\rD@',''),(18,0,'å¿«é€’ç«™è·¯å£',_binary '\0\0\0\0\0\0\0&™¹\Ò]@”:9}\ïD@',''),(19,0,'å›½è„‰è¥¿è·¯-é¸¿é›è·¯è·¯å£',_binary '\0\0\0\0\0\0\0\æ]@À¯”LD@',''),(20,0,'ä½“è‚²åœºå…¥å£',_binary '\0\0\0\0\0\0\0\"™=]@\ë¥D@',''),(21,0,'å›½è„‰è¥¿è·¯-é›åŒ—è·¯å£1',_binary '\0\0\0\0\0\0\03rJ\0]@\äªo?*D@',''),(22,0,'é›åŒ—å›­EåŒºå…¥å£',_binary '\0\0\0\0\0\0\04r\Ş\Ê\n]@tÿ˜i.D@',''),(23,0,'å®¿èˆè·¯è·¯å£1',_binary '\0\0\0\0\0\0\0o…ò]@x|‡¹5D@',''),(24,2,'é›åŒ—å›­EåŒº',_binary '\0\0\0\0\0\0\0ş˜\Ùe]@¸\âY!<D@',''),(25,2,'é›åŒ—å›­AåŒº',_binary '\0\0\0\0\0\0\0ş˜Y]@\ĞbiD@',''),(26,2,'é›åŒ—å›­D1åŒº',_binary '\0\0\0\0\0\0\0ÿ˜\Ù\Z]@˜]ª*D@',''),(28,0,'äºŒç»´ç å¹¿åœº',_binary '\0\0\0\0\0\0\0ÿ˜\ÙU&]@¬¹,9D@',''),(29,0,'é¸¿é›è·¯-å®¿èˆè·¯è·¯å£',_binary '\0\0\0\0\0\0\0\ïF\å ]@xc®D@',''),(30,0,'å­¦ç”Ÿé£Ÿå ‚-é›åŒ—D1å…¥å£',_binary '\0\0\0\0\0\0\0\á¡]@¼º{\é*D@',''),(31,0,'å­¦ç”Ÿæ´»åŠ¨ä¸­å¿ƒå…¥å£',_binary '\0\0\0\0\0\0\0’VS\ë3]@4€‚c#D@',''),(33,0,'æ ¡åŒ»é™¢å…¥å£',_binary '\0\0\0\0\0\0\0V\ÓY\']@ÌšFID@',''),(34,0,'å›¾ä¹¦é¦†å…¥å£',_binary '\0\0\0\0\0\0\0€VS\Æ:]@\0¼6D@',''),(35,1,'æ•™å­¦å®éªŒç»¼åˆæ¥¼',_binary '\0\0\0\0\0\0\0¯\í*û@]@\Øy¹D@',''),(36,0,'é¸¿é›è·¯-ä¸œ1è·¯è·¯å£',_binary '\0\0\0\0\0\0\0§\íªª\\]@T€ğe8D@',''),(37,1,'æ™ºæ…§æ•™å®¤æ¥¼',_binary '\0\0\0\0\0\0\0œ\íªUf]@9}D@',''),(38,0,'é›å—å›­S6',_binary '\0\0\0\0\0\0\0\ç8›÷2]@\äasö\ÇD@',''),(39,2,'é›å—å›­S2',_binary '\0\0\0\0\0\0\0\0ú¦\ï\"]@€Q\ï±D@',''),(40,2,'é›å—å›­S3',_binary '\0\0\0\0\0\0\09Ox†&]@˜\ëØ¿şD@',''),(41,2,'é›å—å›­S4',_binary '\0\0\0\0\0\0\09Ox°)]@\È;ÄµğD@',''),(42,2,'é›å—å›­S5',_binary '\0\0\0\0\0\0\0õ¦8%-]@¨-„x\áD@',''),(43,2,'é›åŒ—å›­D2',_binary '\0\0\0\0\0\0\0ıT\Ú%]@œRoXAD@',''),(44,0,'é›åŒ—å›­AåŒº',_binary '\0\0\0\0\0\0\0ü]@ô\é-£D@',''),(45,2,'é›åŒ—å›­ç”Ÿæ´»æœåŠ¡åŒº',_binary '\0\0\0\0\0\0\0G\Ì\n\å]@\Ä\0\îD@',''),(46,2,'é›åŒ—å›­CåŒº',_binary '\0\0\0\0\0\0\0ús{\ë]@H\î\Ü1D@',''),(47,4,'è¡Œæ”¿åŠå…¬æ¥¼',_binary '\0\0\0\0\0\0\0rp¿\Ï.]@\ä\ãñ=D@',''),(48,0,'è¡Œæ”¿åŠå…¬æ¥¼è·¯å£',_binary '\0\0\0\0\0\0\0u¨ˆ\è4]@\à\Z(\ïOD@',''),(49,0,'å›¾ä¹¦é¦†è·¯å£',_binary '\0\0\0\0\0\0\0u¨ü7]@´*‘BD@',''),(50,0,'é¸¿é›è·¯-å›½è„‰è·¯è·¯å£',_binary '\0\0\0\0\0\0\0 	¢R>]@\0@`0(D@',''),(51,0,'é¸¿é›è·¯-é£Ÿå ‚è·¯å£',_binary '\0\0\0\0\0\0\0¥ö\ÙK,]@ˆ\'VD@','');
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

-- Dump completed on 2021-05-20 12:36:31
