-- ================================================================
-- FASTROBOX 1.0 — MySQL Database Schema
-- National Robotics & Tech Carnival
-- Organized by: IEEE Students' Branch
-- Host: Bangladesh University of Business and Technology (BUBT)
-- Event Date: 14 November 2026
-- ================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+06:00";
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;


CREATE DATABASE IF NOT EXISTS `fastrobox_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `fastrobox_db`;

-- ================================================================
-- ADMINS
-- ================================================================
CREATE TABLE IF NOT EXISTS `admins` (
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
-- SITE SETTINGS (key-value config store)
-- ================================================================
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` TEXT DEFAULT NULL,
  `setting_group` VARCHAR(50) DEFAULT 'general',
  `label` VARCHAR(200) DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- NOTICE CATEGORIES
-- ================================================================
CREATE TABLE IF NOT EXISTS `notice_categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `color` VARCHAR(20) DEFAULT 'green',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- NOTICES
-- ================================================================
CREATE TABLE IF NOT EXISTS `notices` (
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
CREATE TABLE IF NOT EXISTS `segments` (
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
  `fee_additional` DECIMAL(10,2) DEFAULT 0.00,
  `fee_note` VARCHAR(500) DEFAULT NULL,
  `prize_pool` VARCHAR(500) DEFAULT NULL,
  `prize_details` TEXT DEFAULT NULL,
  `image_path` VARCHAR(500) DEFAULT NULL,
  `rulebook_path` VARCHAR(500) DEFAULT NULL,
  `google_form_url` VARCHAR(500) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `display_order` TINYINT UNSIGNED DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- REGISTRATIONS
-- ================================================================
CREATE TABLE IF NOT EXISTS `registrations` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `registration_id` VARCHAR(20) NOT NULL UNIQUE,
  `segment_id` INT UNSIGNED NOT NULL,
  `team_name` VARCHAR(200) NOT NULL,
  `institution` VARCHAR(300) NOT NULL,
  `leader_name` VARCHAR(150) NOT NULL,
  `leader_email` VARCHAR(150) NOT NULL,
  `leader_phone` VARCHAR(30) NOT NULL,
  `category` VARCHAR(50) DEFAULT NULL,
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
CREATE TABLE IF NOT EXISTS `registration_members` (
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
CREATE TABLE IF NOT EXISTS `payments` (
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
CREATE TABLE IF NOT EXISTS `timeline_events` (
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
CREATE TABLE IF NOT EXISTS `sponsor_categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `display_order` TINYINT UNSIGNED DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ================================================================
-- SPONSORS
-- ================================================================
CREATE TABLE IF NOT EXISTS `sponsors` (
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
CREATE TABLE IF NOT EXISTS `faqs` (
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
CREATE TABLE IF NOT EXISTS `gallery` (
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
CREATE TABLE IF NOT EXISTS `contact_messages` (
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
CREATE TABLE IF NOT EXISTS `admin_sessions` (
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
('Super Admin', 'admin@fastrobox.bubt.edu.bd', '$2y$10$sVcAUC3EprSyOW8XSUz//Ofw.PMy2soJp5sdNX7ykvQkSszkCLUXK', 'superadmin')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- ================================================================
-- SITE SETTINGS (Official event data from PDF)
-- ================================================================
INSERT INTO `site_settings` (`setting_key`, `setting_value`, `setting_group`, `label`) VALUES
-- Event Info
('event_name', 'FASTROBOX 1.0', 'event', 'Event Name'),
('event_tagline', 'National Robotics & Tech Carnival', 'event', 'Event Tagline'),
('event_date', '2026-11-14', 'event', 'Event Date'),
('event_venue', 'BUBT Campus, Mirpur, Dhaka', 'event', 'Venue'),
('event_venue_address', 'Rupnagar R/A, Mirpur-2, Dhaka-1216, Bangladesh', 'event', 'Full Venue Address'),
('event_prize_pool', 'BDT 200K+', 'event', 'Prize Pool'),
('registration_open_date', '2026-09-07', 'event', 'Registration Opens'),
('registration_deadline', '2026-10-20', 'event', 'Registration Deadline'),
('registration_is_open', '1', 'event', 'Registration Open (1=yes, 0=no)'),
-- Organization
('organizer_name', 'IEEE Students'' Branch', 'org', 'Organizer Name'),
('host_university', 'Bangladesh University of Business and Technology (BUBT)', 'org', 'Host University'),
-- Contact (Empty by default — admin fills these in)
('contact_email', '', 'contact', 'Contact Email'),
('contact_phone', '', 'contact', 'Contact Phone'),
('contact_whatsapp', '', 'contact', 'WhatsApp Number'),
('contact_address', 'BUBT Campus, Rupnagar R/A, Mirpur-2, Dhaka-1216', 'contact', 'Address'),
-- Social Media (Empty — admin fills these in)
('social_facebook', '', 'social', 'Facebook URL'),
('social_instagram', '', 'social', 'Instagram URL'),
('social_linkedin', '', 'social', 'LinkedIn URL'),
('social_youtube', '', 'social', 'YouTube URL'),
('social_website', '', 'social', 'Website URL'),
-- Payment (Empty — admin fills these in)
('payment_bkash', '', 'payment', 'bKash Number'),
('payment_nagad', '', 'payment', 'Nagad Number'),
('payment_bank_name', '', 'payment', 'Bank Name'),
('payment_bank_account', '', 'payment', 'Bank Account Number'),
('payment_bank_routing', '', 'payment', 'Bank Routing Number'),
('payment_instructions', '', 'payment', 'Payment Instructions'),
('payment_note', '', 'payment', 'Payment Note')
ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`);

-- ================================================================
-- NOTICE CATEGORIES
-- ================================================================
INSERT INTO `notice_categories` (`name`, `slug`, `color`) VALUES
('General Notice', 'general', 'blue'),
('Registration Update', 'registration', 'green'),
('Competition Update', 'competition', 'yellow'),
('Important Announcement', 'announcement', 'red'),
('Schedule Update', 'schedule', 'purple'),
('Result', 'result', 'orange')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- ================================================================
-- SPONSOR CATEGORIES
-- ================================================================
INSERT INTO `sponsor_categories` (`name`, `slug`, `display_order`) VALUES
('Title Sponsor', 'title', 1),
('Powered By', 'powered-by', 2),
('Gold Sponsor', 'gold', 3),
('Silver Sponsor', 'silver', 4),
('Technology Partner', 'tech-partner', 5),
('Robotics Partner', 'robotics-partner', 6),
('Media Partner', 'media-partner', 7),
('Community Partner', 'community-partner', 8),
('Education Partner', 'education-partner', 9)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- ================================================================
-- COMPETITION SEGMENTS (Official data from PDF)
-- ================================================================
INSERT INTO `segments` (`name`, `slug`, `short_description`, `full_description`, `rules`, `eligibility`, `min_team_size`, `max_team_size`, `registration_fee`, `fee_additional`, `fee_note`, `prize_pool`, `prize_details`, `google_form_url`, `is_active`, `display_order`) VALUES

-- 1. Line Following Robot (LFR)
('Line Following Robot (LFR)', 'lfr',
 'Build an autonomous robot to navigate black/white tracks with precision, sharp turns, and speed.',
 'The Line Following Robot (LFR) contest challenges teams to build fully autonomous robots that follow a black line on a white surface. The arena is 15ft × 15ft with complex track layouts including round corners, sharp corners (30°, 45°, 60°, 90°), inverse lines, crossovers, gaps, and discontinuities.',
 'Autonomous robot only. Max dimensions: 25cm × 25cm × 15cm. Max weight: 1 kg. Voltage: 16V max.',
 'University and College students from Bangladesh.',
 1, 5, 3000.00, 0.00, 'BDT 3,000 per team (Up to 4 Students + 1 Mentor).',
 'BDT 30,000 total', 'Champion: BDT 15,000 | 1st Runner-up: BDT 10,000 | 2nd Runner-up: BDT 5,000',
 'https://forms.gle/TrhrrxYyuEXNjNd69', 1, 1),

-- 2. Robo Soccer
('Robo Soccer', 'robo-soccer',
 'Control custom wireless bots head-to-head in a fast-paced arena soccer showdown.',
 'Robo Soccer challenges teams to build wireless-controlled robots that play soccer in a 4ft × 8ft arena. Matches are 6 minutes with two 3-minute halves.',
 'Wireless control only (Bluetooth/RF/NRF). Max dimensions: 25cm × 25cm × 20cm. Max weight: 3 kg. Max voltage: 12V.',
 'Undergraduate and Polytechnic students from Bangladesh.',
 1, 5, 3000.00, 0.00, 'BDT 3,000 per team (Up to 4 Students + 1 Mentor).',
 'BDT 30,000 total', 'Champion: BDT 15,000 | 1st Runner-up: BDT 10,000 | 2nd Runner-up: BDT 5,000',
 'https://forms.gle/SMuDtgRnvGTMQTwG8', 1, 2),

-- 3. Project Showcase (Senior)
('Project Showcase (Senior)', 'project-showcase-senior',
 'Demonstrate advanced university-level robotics, IoT, AI, or engineering projects to expert judges.',
 'Project Showcase Senior is for University & Polytechnic students to present innovative projects in Robotics, AI, IoT, Healthcare, Energy, and Automation. Presentation is 5–7 mins followed by 3–5 mins Q&A.',
 'University & Polytechnic students. 5–7 mins presentation + Q&A.',
 'Currently enrolled University & Polytechnic students.',
 1, 4, 2500.00, 0.00, 'BDT 2,500 per team (1–4 members).',
 'BDT 30,000 total', 'Champion: BDT 15,000 | 1st Runner-up: BDT 10,000 | 2nd Runner-up: BDT 5,000',
 'https://forms.gle/7spkXASp9ELPk4rm6', 1, 3),

-- 4. Project Showcase (Junior)
('Project Showcase (Junior)', 'project-showcase-junior',
 'For school and college innovators (Class 5–12) to present creative science and tech projects.',
 'Project Showcase Junior invites School & College students (Class 5–12) to showcase science, electronics, and technology projects. Presentation is 5–7 mins followed by 3–5 mins Q&A.',
 'School & College level (Class 5–12). 5–7 mins presentation + Q&A.',
 'Currently enrolled students in Class 5–12 (School & College level).',
 1, 4, 2000.00, 0.00, 'BDT 2,000 per team (1–4 members).',
 'BDT 20,000 total', 'Champion: BDT 10,000 | 1st Runner-up: BDT 6,000 | 2nd Runner-up: BDT 4,000',
 'https://forms.gle/hKpZsvudbqxQgugY8', 1, 4),

-- 5. Poster Presentation
('Poster Presentation', 'poster-presentation',
 'Display research posters across 6 cutting-edge tracks including AI, IoT, Healthcare, and Energy.',
 'Poster Presentation invites teams to present research findings on a 4×4 ft poster across six academic tracks.',
 'Poster dimensions: Max 4×4 feet. Single PDF submission.',
 'Currently enrolled undergraduate students.',
 1, 3, 1000.00, 0.00, 'BDT 1,000 per team (1–3 members).',
 'BDT 15,000 total', 'Champion: BDT 8,000 | 1st Runner-up: BDT 5,000 | 2nd Runner-up: BDT 2,000',
 'https://forms.gle/RBBnkdgxaZxUvjo1A', 1, 5)

ON DUPLICATE KEY UPDATE
  `short_description` = VALUES(`short_description`),
  `full_description` = VALUES(`full_description`),
  `rules` = VALUES(`rules`),
  `eligibility` = VALUES(`eligibility`),
  `min_team_size` = VALUES(`min_team_size`),
  `max_team_size` = VALUES(`max_team_size`),
  `registration_fee` = VALUES(`registration_fee`),
  `fee_additional` = VALUES(`fee_additional`),
  `fee_note` = VALUES(`fee_note`),
  `prize_pool` = VALUES(`prize_pool`),
  `prize_details` = VALUES(`prize_details`),
  `google_form_url` = VALUES(`google_form_url`),
  `display_order` = VALUES(`display_order`);

-- ================================================================
-- TIMELINE EVENTS (Official dates from PDF)
-- ================================================================
INSERT INTO `timeline_events` (`title`, `description`, `event_date`, `status`, `icon`, `display_order`) VALUES
('Registration Opens', 'Online registration portal goes live. All teams can begin registering for their preferred competition segments.', '2026-09-07', 'active', 'flag', 1),
('Round 1 Submission — Techathon', 'Techathon Round 1 problem statement released. Teams submit project proposals (PDF/PPT) and a maximum 3-minute pitch video.', '2026-09-15', 'upcoming', 'upload', 2),
('Registration Deadline', 'Last day to complete team registration and submit payment for all segments. No late registrations accepted.', '2026-10-20', 'upcoming', 'clock', 3),
('Payment Verification', 'Admin team verifies all submitted payment screenshots. Confirmed participants receive status updates.', '2026-10-25', 'upcoming', 'credit-card', 4),
('Participant Confirmation', 'Approved participants receive official confirmation with detailed event schedule and venue information.', '2026-10-30', 'upcoming', 'check-circle', 5),
('Techathon Grand Finale Invitations', 'Shortlisted Techathon teams receive invitations to the on-site Grand Finale. Grand Finale fee applies.', '2026-11-01', 'upcoming', 'mail', 6),
('FASTROBOX 1.0 — Main Event', 'The National Robotics & Tech Carnival kicks off at BUBT Campus, Mirpur, Dhaka. All competition segments run throughout the day.', '2026-11-14', 'upcoming', 'zap', 7),
('Award Ceremony', 'Grand award ceremony. Champions across all five competition segments announced. Prizes distributed.', '2026-11-14', 'upcoming', 'trophy', 8)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- ================================================================
-- FAQS (Based on official PDF — correct fees, dates, competitions)
-- ================================================================
INSERT INTO `faqs` (`question`, `answer`, `display_order`, `is_active`) VALUES
('Who can participate in FASTROBOX 1.0?', 'FASTROBOX 1.0 is open to students across Bangladesh. Eligibility varies by competition: Robo Soccer and Line Following Robot are open to undergraduate college and university students. Project Showcasing has a Junior category (Class 5–12) and Senior category (university/polytechnic). Techathon is open to undergraduate university students (cross-university teams allowed). Poster Presentation is open to undergraduate students from recognized universities.', 1, 1),
('What are the five competition segments?', 'FASTROBOX 1.0 features five competitions: (1) Project Showcasing — Junior & Senior categories for innovative technology projects. (2) Line Following Robot (LFR) — build the fastest autonomous track-following robot. (3) Robo Soccer — wireless-controlled robot soccer matches. (4) Techathon — a two-round IoT Hackathon. (5) Poster Presentation — academic research poster presentation across 6 tracks.', 2, 1),
('What are the registration fees?', 'Fees vary by segment: Project Showcasing: BDT 2,000 for 1–4 members, +BDT 500 per additional member. Line Following Robot: BDT 2,000 for 1–4 members, +BDT 500 per additional member. Robo Soccer: BDT 2,000 for 1–4 members, +BDT 500 per additional member. Techathon Round 1: BDT 100/team (Grand Finale: BDT 2,400 for qualified teams). Poster Presentation: BDT 400/member (team of 3–4 members).', 3, 1),
('What is the registration deadline?', 'The registration deadline for FASTROBOX 1.0 is 20 October 2026. No late registrations will be accepted. Registration opens on 7 September 2026.', 4, 1),
('When and where is the event?', 'FASTROBOX 1.0 will be held on 14 November 2026 at BUBT Campus, Rupnagar R/A, Mirpur-2, Dhaka-1216, Bangladesh. Organized by the IEEE Students'' Branch.', 5, 1),
('Can team members be from different universities?', 'For Techathon, cross-university teams are explicitly allowed. For other segments, check the specific eligibility rules. Generally, students from different institutions within the same level (school/college/university) may form teams.', 6, 1),
('How does registration and payment work?', 'Complete your registration online through this website in 6 steps: select competition, enter team info, add leader details, add members, submit payment, and review. After submitting, you receive a unique Registration ID. Pay the registration fee via bKash or Nagad, upload the payment screenshot, and our admin team will verify within 24–48 hours.', 7, 1),
('Can I participate in multiple competitions?', 'You may register for multiple competitions separately. However, if event timings overlap on the competition day, you may not be able to participate in both simultaneously. Plan accordingly.', 8, 1),
('How do I check my registration status?', 'Visit the Registration Status page and enter your Registration ID and team leader email address. You can see whether your registration is Pending, Approved, or Rejected, along with any feedback from the organizing team.', 9, 1),
('What are the LFR robot technical requirements?', 'Line Following Robot must be: fully autonomous (no wireless control), max dimensions 25cm × 25cm × 15cm, max weight 1 kg, max battery voltage 16V DC, onboard power only. Ready-made robots are prohibited. The robot must not damage the track.', 10, 1),
('What communication is required for Robo Soccer robots?', 'Robo Soccer robots MUST use wireless communication (RF, NRF, or Bluetooth). Wired communication is prohibited. Maximum onboard voltage is 12V. A kill switch/emergency shutdown is required. Ready-made toy car chassis and controllers are prohibited.', 11, 1),
('Where can I download the official rulebook?', 'Visit the Rulebook page on this website to read complete rules for each competition. You can also download the official rulebook PDF if it has been uploaded by the organizers.', 12, 1)
ON DUPLICATE KEY UPDATE `question` = VALUES(`question`), `answer` = VALUES(`answer`);

-- ================================================================
-- INITIAL NOTICES (Based on official event overview)
-- ================================================================
INSERT INTO `notices` (`title`, `description`, `category_id`, `is_published`) VALUES
('FASTROBOX 1.0 Registration Now Open!',
 'We are thrilled to announce that registration for FASTROBOX 1.0 — the National Robotics & Tech Carnival organized by IEEE Students'' Branch at BUBT — is now officially open! Five exciting competitions await: Project Showcasing (Junior & Senior), Line Following Robot, Robo Soccer, Techathon (IoT Hackathon), and Poster Presentation. Registration is open from 7 September 2026 to 20 October 2026. Visit the registration page to secure your spot!',
 2, 1),
('Welcome to FASTROBOX 1.0',
 'The IEEE Students'' Branch at Bangladesh University of Business and Technology (BUBT) proudly presents FASTROBOX 1.0 — the National Robotics & Tech Carnival! This national-level event brings together Bangladesh''s brightest engineering minds to compete, innovate, and inspire. The event will be held on 14 November 2026 at BUBT Campus, Mirpur, Dhaka. Prize pool of BDT 200K+ across five competition categories.',
 1, 1),
('Payment Information — To Be Announced',
 'Payment details for registration fees (bKash/Nagad numbers) will be announced through official channels shortly. Please check this notice board regularly for updates. Once payment information is posted, complete your payment and upload the screenshot to your registration portal using your Registration ID as the reference.',
 2, 1),
('Official Rulebook — Coming Soon',
 'The official rulebooks for all five competition segments (Project Showcasing, Line Following Robot, Robo Soccer, Techathon, and Poster Presentation) will be published soon. All registered participants are strongly advised to download and thoroughly read the rulebook for their respective competition before preparing.',
 5, 1)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

COMMIT;
