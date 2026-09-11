<?php
function handleSponsors(string $method, string $id = ''): void {
    $db = getDB();
    if ($method === 'GET') {
        if ($id) {
            $stmt = $db->prepare('SELECT s.*, sc.name AS category_name FROM sponsors s LEFT JOIN sponsor_categories sc ON s.category_id = sc.id WHERE s.id = ? AND s.is_active = 1');
            $stmt->execute([$id]);
            $sponsor = $stmt->fetch();
            if (!$sponsor) error('Sponsor not found.', 404);
            success($sponsor);
        } else {
            $stmt = $db->query('SELECT s.*, sc.name AS category_name FROM sponsors s LEFT JOIN sponsor_categories sc ON s.category_id = sc.id WHERE s.is_active = 1 ORDER BY sc.display_order ASC, s.display_order ASC');
            $sponsors = $stmt->fetchAll();
            success($sponsors);
        }
    } else {
        error('Method not allowed.', 405);
    }
}
