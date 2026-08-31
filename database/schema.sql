-- FastRobox 1.0 — MySQL Database Schema
-- Bangladesh University of Business and Technology (BUBT)
-- ================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+06:00";

CREATE DATABASE IF NOT EXISTS `fastrobox_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `fastrobox_db`;

-- ================================================================
-- ADMINS
-- ================================================================
CREATE TABLE `admins` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('superadmin','admin') DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- NOTICE CATEGORIES
-- ================================================================
CREATE TABLE `notice_categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `color` VARCHAR(20) DEFAULT 'green',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- NOTICES
-- ================================================================
CREATE TABLE `notices` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(300) NOT NULL,
  `description` TEXT NOT NULL,
  `category_id` INT UNSIGNED,
  `is_published` TINYINT(1) DEFAULT 1,
  `pdf_path` VARCHAR(500) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`category_id`) REFERENCES `notice_categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- COMPETITION SEGMENTS
-- ================================================================
CREATE TABLE `segments` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) NOT NULL UNIQUE,
  `short_description` VARCHAR(500) NOT NULL,
  `full_description` TEXT,
  `rules` TEXT,
  `eligibility` TEXT,
  `min_team_size` TINYINT UNSIGNED DEFAULT 1,
  `max_team_size` TINYINT UNSIGNED DEFAULT 5,
  `registration_fee` DECIMAL(10,2) DEFAULT 0.00,
  `prize_pool` VARCHAR(200) DEFAULT NULL,
  `image_path` VARCHAR(500) DEFAULT NULL,
  `rulebook_path` VARCHAR(500) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `display_order` TINYINT UNSIGNED DEFAULT 0,
  `contact_email` VARCHAR(150) DEFAULT NULL,
  `contact_phone` VARCHAR(30) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- REGISTRATIONS
-- ================================================================
CREATE TABLE `registrations` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `registration_id` VARCHAR(20) NOT NULL UNIQUE,
  `segment_id` INT UNSIGNED NOT NULL,
  `team_name` VARCHAR(200) NOT NULL,
  `institution` VARCHAR(300) NOT NULL,
  `leader_name` VARCHAR(150) NOT NULL,
  `leader_email` VARCHAR(150) NOT NULL,
  `leader_phone` VARCHAR(30) NOT NULL,
  `status` ENUM('pending','approved','rejected') DEFAULT 'pending',
  `rejection_reason` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`segment_id`) REFERENCES `segments`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- REGISTRATION MEMBERS
-- ================================================================
CREATE TABLE `registration_members` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `registration_id` INT UNSIGNED NOT NULL,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `is_leader` TINYINT(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`registration_id`) REFERENCES `registrations`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- PAYMENTS
-- ================================================================
CREATE TABLE `payments` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `registration_id` INT UNSIGNED NOT NULL,
  `method` VARCHAR(50) NOT NULL,
  `transaction_id` VARCHAR(200) NOT NULL,
  `screenshot_path` VARCHAR(500) DEFAULT NULL,
  `amount` DECIMAL(10,2) DEFAULT 0.00,
  `is_verified` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`registration_id`) REFERENCES `registrations`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- TIMELINE EVENTS
-- ================================================================
CREATE TABLE `timeline_events` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT,
  `event_date` DATE NOT NULL,
  `status` ENUM('upcoming','active','completed') DEFAULT 'upcoming',
  `icon` VARCHAR(50) DEFAULT 'calendar',
  `display_order` TINYINT UNSIGNED DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- SPONSOR CATEGORIES
-- ================================================================
CREATE TABLE `sponsor_categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `display_order` TINYINT UNSIGNED DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- SPONSORS
-- ================================================================
CREATE TABLE `sponsors` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `logo_path` VARCHAR(500) DEFAULT NULL,
  `category_id` INT UNSIGNED,
  `website_url` VARCHAR(500) DEFAULT NULL,
  `display_order` TINYINT UNSIGNED DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`category_id`) REFERENCES `sponsor_categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- FAQS
-- ================================================================
CREATE TABLE `faqs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `question` TEXT NOT NULL,
  `answer` TEXT NOT NULL,
  `display_order` TINYINT UNSIGNED DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- GALLERY
-- ================================================================
CREATE TABLE `gallery` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `type` ENUM('image','video') DEFAULT 'image',
  `file_path` VARCHAR(500) NOT NULL,
  `thumbnail_path` VARCHAR(500) DEFAULT NULL,
  `caption` VARCHAR(300) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- CONTACT MESSAGES
-- ================================================================
CREATE TABLE `contact_messages` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `subject` VARCHAR(300) NOT NULL,
  `message` TEXT NOT NULL,
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- ADMIN SESSIONS (JWT blacklist for logout)
-- ================================================================
CREATE TABLE `admin_sessions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `admin_id` INT UNSIGNED NOT NULL,
  `token_hash` VARCHAR(255) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- SEED DATA
-- ================================================================

-- Admin user: admin@fastrobox.bubt.edu.bd / Admin@123
INSERT INTO `admins` (`name`, `email`, `password_hash`, `role`) VALUES
('Super Admin', 'admin@fastrobox.bubt.edu.bd', '$2y$10$sVcAUC3EprSyOW8XSUz//Ofw.PMy2soJp5sdNX7ykvQkSszkCLUXK', 'superadmin');
-- password: Admin@123

-- Notice Categories
INSERT INTO `notice_categories` (`name`, `slug`, `color`) VALUES
('General Notice', 'general', 'blue'),
('Registration Update', 'registration', 'green'),
('Competition Update', 'competition', 'yellow'),
('Important Announcement', 'announcement', 'red'),
('Schedule Update', 'schedule', 'purple'),
('Result', 'result', 'orange');

-- Sponsor Categories
INSERT INTO `sponsor_categories` (`name`, `slug`, `display_order`) VALUES
('Title Sponsor', 'title', 1),
('Powered By', 'powered-by', 2),
('Gold Sponsor', 'gold', 3),
('Silver Sponsor', 'silver', 4),
('Technology Partner', 'tech-partner', 5),
('Robotics Partner', 'robotics-partner', 6),
('Media Partner', 'media-partner', 7),
('Community Partner', 'community-partner', 8),
('Education Partner', 'education-partner', 9);

-- Competition Segments
INSERT INTO `segments` (`name`, `slug`, `short_description`, `full_description`, `rules`, `eligibility`, `min_team_size`, `max_team_size`, `registration_fee`, `prize_pool`, `display_order`, `contact_email`, `contact_phone`) VALUES
('Robo Soccer', 'robo-soccer',
 'Autonomous robots compete head-to-head in an electrifying soccer match. Program your bot to score goals and dominate the field.',
 'Robo Soccer is one of the most exciting events where teams build autonomous robots programmed to play soccer. Robots must navigate the field, detect the ball, and score goals without human intervention during the game.',
 '1. Each team must have 1-2 robots.\n2. Robots must be fully autonomous during gameplay.\n3. Maximum robot dimensions: 25cm x 25cm x 25cm.\n4. Robots must stop within 1 second of a stop signal.\n5. No wireless communication during matches.\n6. Matches are 5 minutes each.\n7. Standard FIFA-inspired rules apply for scoring.',
 'Open to all university students currently enrolled in any semester. Students from any department may participate. Each participant can only join one Robo Soccer team.',
 2, 4, 500.00, '1st: ৳30,000 | 2nd: ৳15,000 | 3rd: ৳8,000',
 1, 'robosoccer@fastrobox.bubt.edu.bd', '+880 1700 000001'),

('Line Follower Contest', 'line-follower',
 'Build the fastest robot that can flawlessly trace a complex track. Speed, precision, and engineering excellence will be tested.',
 'The Line Follower Contest challenges teams to build robots that follow a white or black line on a contrasting surface as fast as possible. The robot must navigate curves, intersections, and obstacles autonomously.',
 '1. Robot must complete the course without human assistance.\n2. Maximum 3 attempts per team per round.\n3. Robot must start from designated start position.\n4. Robot must follow the line without crossing outer boundaries.\n5. No wireless controls allowed during run.\n6. Time penalty for going off-track: +5 seconds per occurrence.\n7. Track specifications will be released in the rulebook.',
 'Open to all university and college students. Teams must consist of 2-3 members from the same or different institutions.',
 2, 3, 300.00, '1st: ৳20,000 | 2nd: ৳10,000 | 3rd: ৳5,000',
 2, 'linefollower@fastrobox.bubt.edu.bd', '+880 1700 000002'),

('Project Showcase', 'project-showcase',
 'Present your innovative robotics or AI project to a panel of expert judges. Turn your ideas into award-winning innovations.',
 'The Project Showcase is a platform for students to present innovative projects in robotics, AI, IoT, and emerging technologies. Teams will present their projects to a panel of expert judges who will evaluate them on innovation, implementation, impact, and presentation.',
 '1. Projects must be original work by the team members.\n2. Each team gets 10 minutes for presentation + 5 minutes Q&A.\n3. Projects must relate to: Robotics, AI, IoT, Machine Learning, or Automation.\n4. Working prototype or demo is required.\n5. Teams must submit a 2-page abstract before the event.\n6. Plagiarism will result in immediate disqualification.\n7. All projects must be ethical and socially responsible.',
 'Open to undergraduate and postgraduate students from any university in Bangladesh. Teams can be interdisciplinary.',
 1, 5, 400.00, '1st: ৳50,000 | 2nd: ৳25,000 | 3rd: ৳12,000 | Best Innovation Award: ৳10,000',
 3, 'showcase@fastrobox.bubt.edu.bd', '+880 1700 000003');

-- Timeline Events
INSERT INTO `timeline_events` (`title`, `description`, `event_date`, `status`, `icon`, `display_order`) VALUES
('Registration Opens', 'Online registration portal goes live. All teams can begin registering for their preferred competition segments.', '2026-09-01', 'active', 'flag', 1),
('Rulebook Release', 'Official rulebooks for all competition segments will be published. Teams must download and read rulebooks carefully.', '2026-09-05', 'upcoming', 'book-open', 2),
('Registration Deadline', 'Last day to complete team registration and submit payment. No late registrations will be accepted.', '2026-09-25', 'upcoming', 'clock', 3),
('Payment Deadline', 'All registration fees must be paid and payment screenshots submitted before this deadline.', '2026-09-28', 'upcoming', 'credit-card', 4),
('Participant Confirmation', 'Approved participants will receive official confirmation emails with event details and schedules.', '2026-10-05', 'upcoming', 'check-circle', 5),
('Preliminary Round', 'Online preliminary screening for Project Showcase category. Shortlisted teams will proceed to the main event.', '2026-10-10', 'upcoming', 'layers', 6),
('Main Competition Day 1', 'Day 1 of FastRobox 1.0 - Robo Soccer and Line Follower qualifying rounds. Event held at BUBT campus.', '2026-10-18', 'upcoming', 'zap', 7),
('Main Competition Day 2', 'Day 2 - Finals for all categories. Project Showcase presentations. Semi-finals and finals for robotics events.', '2026-10-19', 'upcoming', 'trophy', 8),
('Award Ceremony', 'Grand award ceremony. Champions will be announced and prizes distributed. Closing event of FastRobox 1.0.', '2026-10-19', 'upcoming', 'award', 9);

-- FAQs
INSERT INTO `faqs` (`question`, `answer`, `display_order`) VALUES
('Who can participate in FastRobox 1.0?', 'FastRobox 1.0 is open to all university and college students in Bangladesh. Both undergraduate and postgraduate students are eligible. Students from any department or discipline are welcome to participate.', 1),
('Can team members be from different universities?', 'Yes! For the Project Showcase category, team members can be from different universities. For Robo Soccer and Line Follower, team members may also be from different institutions. We encourage interdisciplinary and inter-university collaboration.', 2),
('How does the registration process work?', 'Registration is done online through our website. You need to: (1) Select your competition, (2) Fill in team details, (3) Add team member information, (4) Complete payment, and (5) Submit. You will receive a unique Registration ID upon submission.', 3),
('How does payment verification work?', 'After completing your registration form, you need to pay the registration fee via bKash, Nagad, or bank transfer. Upload a clear screenshot of your payment transaction. Our admin team will verify your payment within 24-48 hours and update your registration status.', 4),
('Can I participate in multiple competition segments?', 'You can participate in multiple competitions, but you must register separately for each. Please note that if event timings overlap, you may not be able to participate in both. Check the schedule carefully before registering for multiple events.', 5),
('Where will the event take place?', 'FastRobox 1.0 will be held at the campus of Bangladesh University of Business and Technology (BUBT), Mirpur, Dhaka. Detailed venue information including hall numbers and directions will be shared with confirmed participants.', 6),
('What is the registration fee?', 'Registration fees vary by competition: Robo Soccer - ৳500, Line Follower - ৳300, Project Showcase - ৳400. The fee covers participation, event materials, lunch, and certificate.', 7),
('How will I know if my registration is approved?', 'You can check your registration status on our website using your Registration ID and email address. You will also receive an email notification when your payment is verified and registration is approved.', 8),
('What happens if my registration is rejected?', 'If your registration is rejected (due to payment issues or other reasons), you will see the reason in your registration status. You can contact us at info@fastrobox.bubt.edu.bd for assistance.', 9),
('Can I change my team members after registration?', 'Minor changes to team members can be requested by contacting the organizing committee via email before the registration deadline. Changes are subject to approval and must comply with team size requirements.', 10);

-- Sample Notices
INSERT INTO `notices` (`title`, `description`, `category_id`, `is_published`) VALUES
('FastRobox 1.0 Registration Now Open!', 'We are thrilled to announce that registration for FastRobox 1.0 — the National Robotics and Technology Competition organized by BUBT — is now officially open! Teams can register for Robo Soccer, Line Follower Contest, and Project Showcase. Visit the registration page to secure your spot. Limited slots available!', 2, 1),
('Welcome to FastRobox 1.0', 'Bangladesh University of Business and Technology (BUBT) proudly presents FastRobox 1.0, a national-level robotics and technology competition. This event aims to foster innovation, creativity, and technical excellence among students from across Bangladesh. We invite all passionate students to participate and showcase their talents.', 1, 1),
('Important: Payment Methods Accepted', 'Participants can complete their registration fee payment via the following methods: (1) bKash - 01XXXXXXXXX, (2) Nagad - 01XXXXXXXXX, (3) Bank Transfer - Account details TBA. After payment, upload the screenshot in your registration portal. Reference: Your Registration ID.', 2, 1),
('Rulebooks Will Be Available from September 5th', 'Official rulebooks for all three competition categories (Robo Soccer, Line Follower, and Project Showcase) will be published on September 5, 2026. Participants are strongly advised to download and thoroughly read the rulebooks before preparing for the competition.', 5, 1);

COMMIT;
