<?php
$isLocal = ($_SERVER['HTTP_HOST'] ?? '') === 'localhost' 
    || ($_SERVER['SERVER_NAME'] ?? '') === 'localhost' 
    || (isset($_SERVER['SERVER_ADDR']) && ($_SERVER['SERVER_ADDR'] === '127.0.0.1' || $_SERVER['SERVER_ADDR'] === '::1'))
    || php_sapi_name() === 'cli';

if ($isLocal) {
    define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
    define('DB_NAME', getenv('DB_NAME') ?: 'fastrobox_db');
    define('DB_USER', getenv('DB_USER') ?: 'root');
    define('DB_PASS', getenv('DB_PASS') ?: '');
} else {
    define('DB_HOST', 'sql304.infinityfree.com');
    define('DB_NAME', 'if0_42874533_fastrobox');
    define('DB_USER', 'if0_42874533');
    define('DB_PASS', 'Hellonur123');
}
define('DB_CHARSET', 'utf8mb4');

define('JWT_SECRET', 'fastrobox_jwt_secret_2026_bubt_super_secure');
define('JWT_EXPIRY', 86400); // 24 hours

define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('MAX_FILE_SIZE', 10 * 1024 * 1024); // 10MB
define('ALLOWED_IMAGE_TYPES', ['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
define('ALLOWED_PDF_TYPES', ['application/pdf']);

function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            die(json_encode(['success' => false, 'message' => 'Database connection failed.']));
        }
    }
    return $pdo;
}
