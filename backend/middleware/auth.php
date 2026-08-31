<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

// Simple JWT implementation (no external library needed)
function jwtEncode(array $payload): string {
    $header = base64url_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload['iat'] = time();
    $payload['exp'] = time() + JWT_EXPIRY;
    $body = base64url_encode(json_encode($payload));
    $sig = base64url_encode(hash_hmac('sha256', "$header.$body", JWT_SECRET, true));
    return "$header.$body.$sig";
}

function jwtDecode(string $token): ?array {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    [$header, $body, $sig] = $parts;
    $validSig = base64url_encode(hash_hmac('sha256', "$header.$body", JWT_SECRET, true));
    if (!hash_equals($validSig, $sig)) return null;
    $payload = json_decode(base64url_decode($body), true);
    if (!$payload || $payload['exp'] < time()) return null;
    return $payload;
}

function base64url_encode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode(string $data): string {
    return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', (4 - strlen($data) % 4) % 4));
}

function getAuthorizationHeader(): string {
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        return trim($_SERVER['HTTP_AUTHORIZATION']);
    }
    if (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        return trim($_SERVER['REDIRECT_HTTP_AUTHORIZATION']);
    }
    if (isset($_SERVER['Authorization'])) {
        return trim($_SERVER['Authorization']);
    }
    if (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        if (is_array($headers)) {
            foreach ($headers as $key => $value) {
                if (strcasecmp($key, 'Authorization') === 0) {
                    return trim($value);
                }
            }
        }
    }
    return '';
}

function requireAdmin(): array {
    $authHeader = getAuthorizationHeader();
    if (!str_starts_with($authHeader, 'Bearer ')) {
        error('Unauthorized. Please log in.', 401);
    }
    $token = substr($authHeader, 7);
    $payload = jwtDecode($token);
    if (!$payload || empty($payload['admin_id'])) {
        error('Invalid or expired session.', 401);
    }
    // Verify admin still exists
    $db = getDB();
    $stmt = $db->prepare('SELECT id, name, email, role FROM admins WHERE id = ?');
    $stmt->execute([$payload['admin_id']]);
    $admin = $stmt->fetch();
    if (!$admin) {
        error('Admin account not found.', 401);
    }
    return $admin;
}
