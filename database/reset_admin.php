<?php
require_once __DIR__ . '/../backend/config/database.php';

$db = getDB();
$email = 'admin@fastrobox.bubt.edu.bd';
$password = 'Admin@123';
$hash = password_hash($password, PASSWORD_BCRYPT);

$stmt = $db->prepare('UPDATE admins SET password_hash = ? WHERE email = ?');
$stmt->execute([$hash, $email]);

if ($stmt->rowCount() === 0) {
    // If no row updated, insert
    $stmt2 = $db->prepare('INSERT INTO admins (name, email, password_hash, role) VALUES (?, ?, ?, ?)');
    $stmt2->execute(['Super Admin', $email, $hash, 'superadmin']);
}

echo "Admin password reset successfully for $email to '$password'!\n";
echo "Verified: " . (password_verify($password, $hash) ? "YES ✅" : "NO ❌") . "\n";
