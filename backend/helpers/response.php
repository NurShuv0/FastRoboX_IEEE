<?php
function respond(bool $success, string $message, $data = null, int $code = 200): void {
    http_response_code($code);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data'    => $data,
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit();
}

function success($data = null, string $message = 'OK', int $code = 200): void {
    respond(true, $message, $data, $code);
}

function error(string $message, int $code = 400, $data = null): void {
    respond(false, $message, $data, $code);
}

function getBody(): array {
    $raw = file_get_contents('php://input');
    if (empty($raw)) return [];
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function sanitize(string $value): string {
    return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
}

function required_fields(array $body, array $fields): void {
    foreach ($fields as $field) {
        if (empty($body[$field])) {
            error("Field '$field' is required.", 422);
        }
    }
}

function paginate(PDO $db, string $query, array $params, int $page, int $limit, string $countQuery = ''): array {
    $offset = ($page - 1) * $limit;
    $stmt = $db->prepare($query . " LIMIT :limit OFFSET :offset");
    foreach ($params as $k => $v) $stmt->bindValue($k, $v);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $items = $stmt->fetchAll();

    $cq = $countQuery ?: "SELECT COUNT(*) FROM (" . $query . ") AS sub";
    $cStmt = $db->prepare($cq);
    foreach ($params as $k => $v) $cStmt->bindValue($k, $v);
    $cStmt->execute();
    $total = (int) $cStmt->fetchColumn();

    return ['items' => $items, 'total' => $total, 'page' => $page, 'limit' => $limit];
}
