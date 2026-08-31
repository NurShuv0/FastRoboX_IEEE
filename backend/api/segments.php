<?php
function handleSegments(string $method, string $id): void {
    $db = getDB();

    if ($method === 'GET' && empty($id)) {
        $stmt = $db->query('SELECT * FROM segments WHERE is_active = 1 ORDER BY display_order ASC, id ASC');
        success($stmt->fetchAll());
    }
    elseif ($method === 'GET' && !empty($id)) {
        $stmt = $db->prepare('SELECT * FROM segments WHERE id = ? AND is_active = 1');
        $stmt->execute([$id]);
        $seg = $stmt->fetch();
        if (!$seg) error('Segment not found.', 404);
        success($seg);
    }
    else { error('Method not allowed.', 405); }
}
