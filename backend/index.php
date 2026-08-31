<?php
require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/helpers/response.php';
require_once __DIR__ . '/helpers/upload.php';
require_once __DIR__ . '/middleware/auth.php';

// Parse request
$method   = $_SERVER['REQUEST_METHOD'];
$uri      = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Strip /fastrobox/backend prefix if running under XAMPP subfolder
$uri = preg_replace('#^/fastrobox/backend#', '', $uri);
$uri = trim($uri, '/');
$segments = explode('/', $uri);

$resource = $segments[0] ?? '';
$sub1     = $segments[1] ?? '';
$sub2     = $segments[2] ?? '';

// Route: /api/*
if ($resource !== 'api') {
    error('Not found.', 404);
}

// Load all API files
require_once __DIR__ . '/api/auth.php';
require_once __DIR__ . '/api/notices.php';
require_once __DIR__ . '/api/segments.php';
require_once __DIR__ . '/api/registrations.php';
require_once __DIR__ . '/api/timeline.php'; // also defines sponsors, faqs, gallery, contact

switch ($sub1) {

    // ── AUTH ──────────────────────────────────────────────────────
    case 'auth':
        handleAuth($method, $sub2);
        break;

    // ── NOTICES (public) ─────────────────────────────────────────
    case 'notices':
        if ($sub2 === 'categories') {
            handleNoticeCategories();
        } else {
            handleNotices($method, $sub2);
        }
        break;

    // ── SEGMENTS (public) ────────────────────────────────────────
    case 'segments':
        handleSegments($method, $sub2);
        break;

    // ── REGISTRATIONS ────────────────────────────────────────────
    case 'registrations':
        if ($sub2 === 'status') {
            handleRegistrationStatus();
        } else {
            handleRegistrations($method, $sub2);
        }
        break;

    // ── TIMELINE (public) ────────────────────────────────────────
    case 'timeline':
        require_once __DIR__ . '/api/timeline.php';
        handleTimeline($method, $sub2);
        break;

    // ── SPONSORS (public) ────────────────────────────────────────
    case 'sponsors':
        require_once __DIR__ . '/api/sponsors.php';
        handleSponsors($method, $sub2);
        break;

    // ── FAQS (public) ────────────────────────────────────────────
    case 'faqs':
        require_once __DIR__ . '/api/faqs.php';
        handleFaqs($method, $sub2);
        break;

    // ── GALLERY (public) ─────────────────────────────────────────
    case 'gallery':
        require_once __DIR__ . '/api/gallery.php';
        handleGallery($method, $sub2);
        break;

    // ── CONTACT ──────────────────────────────────────────────────
    case 'contact':
        require_once __DIR__ . '/api/contact.php';
        handleContact($method, $sub2);
        break;

    // ── ADMIN (protected routes) ─────────────────────────────────
    case 'admin':
        $adminRoute  = $sub2;   // notices, segments, registrations, timeline, sponsors, faqs, gallery
        $adminId     = $segments[3] ?? '';
        $adminAction = $segments[4] ?? '';
        require_once __DIR__ . '/api/admin.php';
        handleAdmin($method, $adminRoute, $adminId, $adminAction);
        break;

    // ── DASHBOARD ────────────────────────────────────────────────
    case 'dashboard':
        require_once __DIR__ . '/api/dashboard.php';
        handleDashboard($method, $sub2);
        break;

    default:
        error('Endpoint not found.', 404);
}
