-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: fastrobox_db
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin_sessions`
--

DROP TABLE IF EXISTS `admin_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_sessions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `admin_id` int(10) unsigned NOT NULL,
  `token_hash` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `admin_sessions_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_sessions`
--

LOCK TABLES `admin_sessions` WRITE;
/*!40000 ALTER TABLE `admin_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admins` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('superadmin','admin') DEFAULT 'admin',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'Super Admin','admin@fastrobox.bubt.edu.bd','$2y$10$sVcAUC3EprSyOW8XSUz//Ofw.PMy2soJp5sdNX7ykvQkSszkCLUXK','superadmin','2026-09-08 21:08:04','2026-09-08 21:08:04');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_messages`
--

DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contact_messages` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `subject` varchar(300) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faqs`
--

DROP TABLE IF EXISTS `faqs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `faqs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `question` text NOT NULL,
  `answer` text NOT NULL,
  `display_order` tinyint(3) unsigned DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faqs`
--

LOCK TABLES `faqs` WRITE;
/*!40000 ALTER TABLE `faqs` DISABLE KEYS */;
INSERT INTO `faqs` VALUES (1,'Who can participate in FASTROBOX 1.0?','FASTROBOX 1.0 is open to students across Bangladesh. Eligibility varies by competition: Robo Soccer and Line Following Robot are open to undergraduate college and university students. Project Showcasing has a Junior category (Class 5???12) and Senior category (university/polytechnic). Techathon is open to undergraduate university students (cross-university teams allowed). Poster Presentation is open to undergraduate students from recognized universities.',1,1),(2,'What are the five competition segments?','FASTROBOX 1.0 features five competitions: (1) Project Showcasing ??? Junior & Senior categories for innovative technology projects. (2) Line Following Robot (LFR) ??? build the fastest autonomous track-following robot. (3) Robo Soccer ??? wireless-controlled robot soccer matches. (4) Techathon ??? a two-round IoT Hackathon. (5) Poster Presentation ??? academic research poster presentation across 6 tracks.',2,1),(3,'What are the registration fees?','Fees vary by segment: Project Showcasing: BDT 2,000 for 1???4 members, +BDT 500 per additional member. Line Following Robot: BDT 2,000 for 1???4 members, +BDT 500 per additional member. Robo Soccer: BDT 2,000 for 1???4 members, +BDT 500 per additional member. Techathon Round 1: BDT 100/team (Grand Finale: BDT 2,400 for qualified teams). Poster Presentation: BDT 400/member (team of 3???4 members).',3,1),(4,'What is the registration deadline?','The registration deadline for FASTROBOX 1.0 is 20 October 2026. No late registrations will be accepted. Registration opens on 7 September 2026.',4,1),(5,'When and where is the event?','FASTROBOX 1.0 will be held on 14 November 2026 at BUBT Campus, Rupnagar R/A, Mirpur-2, Dhaka-1216, Bangladesh. Organized by the IEEE Students\' Branch.',5,1),(6,'Can team members be from different universities?','For Techathon, cross-university teams are explicitly allowed. For other segments, check the specific eligibility rules. Generally, students from different institutions within the same level (school/college/university) may form teams.',6,1),(7,'How does registration and payment work?','Complete your registration online through this website in 6 steps: select competition, enter team info, add leader details, add members, submit payment, and review. After submitting, you receive a unique Registration ID. Pay the registration fee via bKash or Nagad, upload the payment screenshot, and our admin team will verify within 24???48 hours.',7,1),(8,'Can I participate in multiple competitions?','You may register for multiple competitions separately. However, if event timings overlap on the competition day, you may not be able to participate in both simultaneously. Plan accordingly.',8,1),(9,'How do I check my registration status?','Visit the Registration Status page and enter your Registration ID and team leader email address. You can see whether your registration is Pending, Approved, or Rejected, along with any feedback from the organizing team.',9,1),(10,'What are the LFR robot technical requirements?','Line Following Robot must be: fully autonomous (no wireless control), max dimensions 25cm ?? 25cm ?? 15cm, max weight 1 kg, max battery voltage 16V DC, onboard power only. Ready-made robots are prohibited. The robot must not damage the track.',10,1),(11,'What communication is required for Robo Soccer robots?','Robo Soccer robots MUST use wireless communication (RF, NRF, or Bluetooth). Wired communication is prohibited. Maximum onboard voltage is 12V. A kill switch/emergency shutdown is required. Ready-made toy car chassis and controllers are prohibited.',11,1),(12,'Where can I download the official rulebook?','Visit the Rulebook page on this website to read complete rules for each competition. You can also download the official rulebook PDF if it has been uploaded by the organizers.',12,1);
/*!40000 ALTER TABLE `faqs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gallery`
--

DROP TABLE IF EXISTS `gallery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gallery` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` enum('image','video') DEFAULT 'image',
  `file_path` varchar(500) NOT NULL,
  `thumbnail_path` varchar(500) DEFAULT NULL,
  `caption` varchar(300) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gallery`
--

LOCK TABLES `gallery` WRITE;
/*!40000 ALTER TABLE `gallery` DISABLE KEYS */;
/*!40000 ALTER TABLE `gallery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notice_categories`
--

DROP TABLE IF EXISTS `notice_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notice_categories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `color` varchar(20) DEFAULT 'green',
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notice_categories`
--

LOCK TABLES `notice_categories` WRITE;
/*!40000 ALTER TABLE `notice_categories` DISABLE KEYS */;
INSERT INTO `notice_categories` VALUES (1,'General Notice','general','blue'),(2,'Registration Update','registration','green'),(3,'Competition Update','competition','yellow'),(4,'Important Announcement','announcement','red'),(5,'Schedule Update','schedule','purple'),(6,'Result','result','orange');
/*!40000 ALTER TABLE `notice_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notices`
--

DROP TABLE IF EXISTS `notices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notices` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(300) NOT NULL,
  `description` text NOT NULL,
  `category_id` int(10) unsigned DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT 1,
  `pdf_path` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `notices_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `notice_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notices`
--

LOCK TABLES `notices` WRITE;
/*!40000 ALTER TABLE `notices` DISABLE KEYS */;
INSERT INTO `notices` VALUES (1,'FASTROBOX 1.0 Registration Now Open!','We are thrilled to announce that registration for FASTROBOX 1.0 ??? the National Robotics & Tech Carnival organized by IEEE Students\' Branch at BUBT ??? is now officially open! Five exciting competitions await: Project Showcasing (Junior & Senior), Line Following Robot, Robo Soccer, Techathon (IoT Hackathon), and Poster Presentation. Registration is open from 7 September 2026 to 20 October 2026. Visit the registration page to secure your spot!',2,1,NULL,'2026-09-08 21:08:04','2026-09-08 21:08:04');
/*!40000 ALTER TABLE `notices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `registration_id` int(10) unsigned NOT NULL,
  `method` varchar(50) NOT NULL,
  `transaction_id` varchar(200) NOT NULL,
  `screenshot_path` varchar(500) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT 0.00,
  `is_verified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `registration_id` (`registration_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`registration_id`) REFERENCES `registrations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registration_members`
--

DROP TABLE IF EXISTS `registration_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `registration_members` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `registration_id` int(10) unsigned NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `is_leader` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `registration_id` (`registration_id`),
  CONSTRAINT `registration_members_ibfk_1` FOREIGN KEY (`registration_id`) REFERENCES `registrations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registration_members`
--

LOCK TABLES `registration_members` WRITE;
/*!40000 ALTER TABLE `registration_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `registration_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registrations`
--

DROP TABLE IF EXISTS `registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `registrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `registration_id` varchar(20) NOT NULL,
  `segment_id` int(10) unsigned NOT NULL,
  `team_name` varchar(200) NOT NULL,
  `institution` varchar(300) NOT NULL,
  `leader_name` varchar(150) NOT NULL,
  `leader_email` varchar(150) NOT NULL,
  `leader_phone` varchar(30) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `rejection_reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `registration_id` (`registration_id`),
  KEY `segment_id` (`segment_id`),
  CONSTRAINT `registrations_ibfk_1` FOREIGN KEY (`segment_id`) REFERENCES `segments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registrations`
--

LOCK TABLES `registrations` WRITE;
/*!40000 ALTER TABLE `registrations` DISABLE KEYS */;
/*!40000 ALTER TABLE `registrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `segments`
--

DROP TABLE IF EXISTS `segments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `segments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `short_description` varchar(500) NOT NULL,
  `full_description` text DEFAULT NULL,
  `rules` text DEFAULT NULL,
  `eligibility` text DEFAULT NULL,
  `min_team_size` tinyint(3) unsigned DEFAULT 1,
  `max_team_size` tinyint(3) unsigned DEFAULT 5,
  `registration_fee` decimal(10,2) DEFAULT 0.00,
  `fee_additional` decimal(10,2) DEFAULT 0.00,
  `fee_note` varchar(500) DEFAULT NULL,
  `prize_pool` varchar(500) DEFAULT NULL,
  `prize_details` text DEFAULT NULL,
  `image_path` varchar(500) DEFAULT NULL,
  `rulebook_path` varchar(500) DEFAULT NULL,
  `google_form_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `display_order` tinyint(3) unsigned DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `segments`
--

LOCK TABLES `segments` WRITE;
/*!40000 ALTER TABLE `segments` DISABLE KEYS */;
INSERT INTO `segments` VALUES (1,'LFR FIXED','lfr','Test description here','','','',1,4,2000.00,500.00,'test note','BDT 30,000 total','Champion 15000','seg_lfr.png','6aa1b7406c29a_1788983104.pdf','',1,1,'2026-09-08 21:40:17','2026-09-09 20:38:15'),(2,'Robo Soccer','robo-soccer','Control custom wireless bots head-to-head in a fast-paced arena soccer showdown.','Robo Soccer challenges teams to build wireless-controlled robots that play soccer in a 4ft x 8ft arena. Matches are 6 minutes with two 3-minute halves.','Wireless control only (Bluetooth/RF/NRF). Max dimensions: 25cm x 25cm x 20cm. Max weight: 3 kg. Max voltage: 12V.','Undergraduate and Polytechnic students from Bangladesh.',1,4,2000.00,500.00,'BDT 2,000 per team (Up to 4 Students).','BDT 30,000 total','Champion: BDT 15,000 | 1st Runner-up: BDT 10,000 | 2nd Runner-up: BDT 5,000','seg_robo_soccer.png','6aa1b8074239f_1788983303.pdf','https://forms.gle/SMuDtgRnvGTMQTwG8',1,2,'2026-09-08 21:40:17','2026-09-09 20:38:15'),(3,'Project Showcase (Senior)','project-showcase-senior','Demonstrate advanced university-level robotics, IoT, AI, or engineering projects to expert judges.','Project Showcase Senior is for University &amp;amp; Polytechnic students to present innovative projects in Robotics, AI, IoT, Healthcare, Energy, and Automation. Presentation is 5-7 mins followed by 3-5 mins Q&amp;amp;A.','University &amp;amp; Polytechnic students. 5-7 mins presentation + Q&amp;amp;A.','Currently enrolled University &amp;amp; Polytechnic students.',1,4,2000.00,500.00,'BDT 2,500 per team (1-4 members).','BDT 30,000 total','Champion: BDT 15,000 | 1st Runner-up: BDT 10,000 | 2nd Runner-up: BDT 5,000','seg_project_senior.png','6aa1b8142ebe0_1788983316.pdf','https://forms.gle/7spkXASp9ELPk4rm6',1,3,'2026-09-08 21:40:17','2026-09-09 20:38:15'),(4,'Project Showcase (Junior)','project-showcase-junior','For school and college innovators (Class 5-12) to present creative science and tech projects.','Project Showcase Junior invites School &amp; College students (Class 5-12) to showcase science, electronics, and technology projects. Presentation is 5-7 mins followed by 3-5 mins Q&amp;A.','School &amp; College level (Class 5-12). 5-7 mins presentation + Q&amp;A.','Currently enrolled students in Class 5-12 (School &amp; College level).',1,4,2000.00,0.00,'BDT 2,000 per team (1-4 members).','BDT 20,000 total','Champion: BDT 10,000 | 1st Runner-up: BDT 6,000 | 2nd Runner-up: BDT 4,000','seg_project_junior.png','6aa1b821295f6_1788983329.pdf','https://forms.gle/hKpZsvudbqxQgugY8',1,4,'2026-09-08 21:40:17','2026-09-09 20:38:15'),(5,'Poster Presentation','poster-presentation','Display research posters across 6 cutting-edge tracks including AI, IoT, Healthcare, and Energy.','Poster Presentation invites teams to present research findings on a 4x4 ft poster across six academic tracks.','Poster dimensions: Max 4x4 feet. Single PDF submission.','Currently enrolled undergraduate students.',3,4,500.00,0.00,'BDT 500 per team (1-4 members).','BDT 15,000 total','Champion: BDT 8,000 | 1st Runner-up: BDT 5,000 | 2nd Runner-up: BDT 2,000','seg_poster.png','6aa1b82ee0578_1788983342.pdf','https://forms.gle/RBBnkdgxaZxUvjo1A',1,5,'2026-09-08 21:40:17','2026-09-09 20:38:15');
/*!40000 ALTER TABLE `segments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_settings`
--

DROP TABLE IF EXISTS `site_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `site_settings` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `setting_group` varchar(50) DEFAULT 'general',
  `label` varchar(200) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_settings`
--

LOCK TABLES `site_settings` WRITE;
/*!40000 ALTER TABLE `site_settings` DISABLE KEYS */;
INSERT INTO `site_settings` VALUES (1,'event_name','FASTROBOX 1.0','event','Event Name','2026-09-08 21:08:04'),(2,'event_tagline','National Robotics & Tech Carnival','event','Event Tagline','2026-09-08 21:08:04'),(3,'event_date','2026-11-14','event','Event Date','2026-09-08 21:08:04'),(4,'event_venue','BUBT Campus, Mirpur, Dhaka','event','Venue','2026-09-08 21:08:04'),(5,'event_venue_address','Rupnagar R/A, Mirpur-2, Dhaka-1216, Bangladesh','event','Full Venue Address','2026-09-08 21:08:04'),(6,'event_prize_pool','BDT 200K+','event','Prize Pool','2026-09-08 21:08:04'),(7,'registration_open_date','2026-09-07','event','Registration Opens','2026-09-08 21:08:04'),(8,'registration_deadline','2026-10-20','event','Registration Deadline','2026-09-08 21:08:04'),(9,'registration_is_open','1','event','Registration Open (1=yes, 0=no)','2026-09-08 21:08:04'),(10,'organizer_name','IEEE Students\' Branch','org','Organizer Name','2026-09-08 21:08:04'),(11,'host_university','Bangladesh University of Business and Technology (BUBT)','org','Host University','2026-09-08 21:08:04'),(12,'contact_email','','contact','Contact Email','2026-09-08 21:08:04'),(13,'contact_phone','','contact','Contact Phone','2026-09-08 21:08:04'),(14,'contact_whatsapp','','contact','WhatsApp Number','2026-09-08 21:08:04'),(15,'contact_address','BUBT Campus, Rupnagar R/A, Mirpur-2, Dhaka-1216','contact','Address','2026-09-08 21:08:04'),(16,'social_facebook','','social','Facebook URL','2026-09-08 21:08:04'),(17,'social_instagram','','social','Instagram URL','2026-09-08 21:08:04'),(18,'social_linkedin','','social','LinkedIn URL','2026-09-08 21:08:04'),(19,'social_youtube','','social','YouTube URL','2026-09-08 21:08:04'),(20,'social_website','','social','Website URL','2026-09-08 21:08:04'),(21,'payment_bkash','','payment','bKash Number','2026-09-08 21:08:04'),(22,'payment_nagad','','payment','Nagad Number','2026-09-08 21:08:04'),(23,'payment_bank_name','','payment','Bank Name','2026-09-08 21:08:04'),(24,'payment_bank_account','','payment','Bank Account Number','2026-09-08 21:08:04'),(25,'payment_bank_routing','','payment','Bank Routing Number','2026-09-08 21:08:04'),(26,'payment_instructions','','payment','Payment Instructions','2026-09-08 21:08:04'),(27,'payment_note','','payment','Payment Note','2026-09-08 21:08:04');
/*!40000 ALTER TABLE `site_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sponsor_categories`
--

DROP TABLE IF EXISTS `sponsor_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sponsor_categories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `display_order` tinyint(3) unsigned DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sponsor_categories`
--

LOCK TABLES `sponsor_categories` WRITE;
/*!40000 ALTER TABLE `sponsor_categories` DISABLE KEYS */;
INSERT INTO `sponsor_categories` VALUES (1,'Title Sponsor','title',1),(2,'Powered By','powered-by',2),(3,'Gold Sponsor','gold',3),(4,'Silver Sponsor','silver',4),(5,'Technology Partner','tech-partner',5),(6,'Robotics Partner','robotics-partner',6),(7,'Media Partner','media-partner',7),(8,'Community Partner','community-partner',8),(9,'Education Partner','education-partner',9);
/*!40000 ALTER TABLE `sponsor_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sponsors`
--

DROP TABLE IF EXISTS `sponsors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sponsors` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `logo_path` varchar(500) DEFAULT NULL,
  `category_id` int(10) unsigned DEFAULT NULL,
  `website_url` varchar(500) DEFAULT NULL,
  `display_order` tinyint(3) unsigned DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `sponsors_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `sponsor_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sponsors`
--

LOCK TABLES `sponsors` WRITE;
/*!40000 ALTER TABLE `sponsors` DISABLE KEYS */;
/*!40000 ALTER TABLE `sponsors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timeline_events`
--

DROP TABLE IF EXISTS `timeline_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `timeline_events` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `event_date` date NOT NULL,
  `status` enum('upcoming','active','completed') DEFAULT 'upcoming',
  `icon` varchar(50) DEFAULT 'calendar',
  `display_order` tinyint(3) unsigned DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timeline_events`
--

LOCK TABLES `timeline_events` WRITE;
/*!40000 ALTER TABLE `timeline_events` DISABLE KEYS */;
INSERT INTO `timeline_events` VALUES (1,'Registration Opens','Online registration portal goes live. All teams can begin registering for their preferred competition segments.','2026-09-07','active','flag',1),(3,'Registration Deadline','Last day to complete team registration and submit payment for all segments. No late registrations accepted.','2026-10-20','upcoming','clock',3),(4,'Payment Verification','Admin team verifies all submitted payment screenshots. Confirmed participants receive status updates.','2026-10-25','upcoming','credit-card',4),(5,'Participant Confirmation','Approved participants receive official confirmation with detailed event schedule and venue information.','2026-10-30','upcoming','check-circle',5),(7,'FASTROBOX 1.0 - Main Event','The National Robotics & Tech Carnival kicks off at BUBT Campus, Mirpur, Dhaka. All competition segments run throughout the day.','2026-11-14','upcoming','zap',7),(8,'Award Ceremony','Grand award ceremony. Champions across all five competition segments announced. Prizes distributed.','2026-11-14','upcoming','trophy',8);
/*!40000 ALTER TABLE `timeline_events` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-10  3:20:09
