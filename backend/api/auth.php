<?php
function handleAuth(string $method, string $action): void {
    $db = getDB();

    if ($action === 'login' && $method === 'POST') {
        $body = getBody();
        required_fields($body, ['email', 'password']);

        $stmt = $db->prepare('SELECT * FROM admins WHERE email = ?');
        $stmt->execute([trim($body['email'])]);
        $admin = $stmt->fetch();

        if (!$admin || !password_verify($body['password'], $admin['password_hash'])) {
            error('Invalid email or password.', 401);
        }

        $token = jwtEncode(['admin_id' => $admin['id'], 'role' => $admin['role']]);
        unset($admin['password_hash']);
        success(['token' => $token, 'admin' => $admin], 'Login successful.');
    }

    elseif ($action === 'logout' && $method === 'POST') {
        // JWT is stateless; client discards token
        success(null, 'Logged out successfully.');
    }

    elseif ($action === 'me' && $method === 'GET') {
        $admin = requireAdmin();
        success($admin, 'Authenticated.');
    }

    else {
        error('Auth endpoint not found.', 404);
    }
}
