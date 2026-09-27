<?php
require_once __DIR__ . '/../backend/config/database.php';

// Get email and password from command line args or default
$email    = $argv[1] ?? 'admin@fastrobox.bubt.edu.bd';
$password = $argv[2] ?? 'Nur@1234';

$hash = password_hash($password, PASSWORD_BCRYPT);

echo "===================================================\n";
echo " FASTROBOX ADMIN CREDENTIAL GENERATOR & RESET\n";
echo "===================================================\n";
echo "Email (Username): $email\n";
echo "Password        : $password\n";
echo "Bcrypt Hash     : $hash\n";
echo "---------------------------------------------------\n";
echo "SQL Query to run in InfinityFree phpMyAdmin:\n\n";

$sql = "UPDATE `admins` SET `email` = '$email', `password_hash` = '$hash' WHERE `role` = 'superadmin' OR `id` = 1;";
echo $sql . "\n\n";
echo "---------------------------------------------------\n";

if (php_sapi_name() === 'cli' && defined('DB_HOST')) {
    try {
        $db = getDB();
        $stmt = $db->prepare('UPDATE admins SET email = ?, password_hash = ? WHERE role = ? OR id = 1');
        $stmt->execute([$email, $hash, 'superadmin']);
        if ($stmt->rowCount() === 0) {
            $stmt2 = $db->prepare('INSERT INTO admins (name, email, password_hash, role) VALUES (?, ?, ?, ?)');
            $stmt2->execute(['Super Admin', $email, $hash, 'superadmin']);
        }
        echo "Database updated successfully!\n";
    } catch (Exception $e) {
        echo "Note: Database update skipped/failed: " . $e->getMessage() . "\n";
    }
}

