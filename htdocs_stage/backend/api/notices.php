<?php
function handleNoticeCategories(): void {
    $db = getDB();
    $cats = $db->query('SELECT * FROM notice_categories ORDER BY id')->fetchAll();
    success($cats);
}

function handleNotices(string $method, string $id): void {
    $db = getDB();

    if ($method === 'GET' && empty($id)) {
        // Public: published notices only
        $search = $_GET['search'] ?? '';
        $cat = $_GET['category'] ?? '';
        $page = max(1, (int)($_GET['page'] ?? 1));
        $limit = min(50, max(1, (int)($_GET['limit'] ?? 20)));

        $where = ['n.is_published = 1'];
        $params = [];

        if (!empty($search)) {
            $where[] = '(n.title LIKE :search OR n.description LIKE :search)';
            $params[':search'] = "%$search%";
        }
        if (!empty($cat)) {
            $where[] = 'nc.slug = :cat';
            $params[':cat'] = $cat;
        }

        $whereSQL = 'WHERE ' . implode(' AND ', $where);
        $query = "SELECT n.*, nc.name AS category_name, nc.slug AS category_slug
                  FROM notices n
                  LEFT JOIN notice_categories nc ON n.category_id = nc.id
                  $whereSQL ORDER BY n.created_at DESC";

        $result = paginate($db, $query, $params, $page, $limit);
        success($result);
    }

    elseif ($method === 'GET' && !empty($id)) {
        $stmt = $db->prepare('SELECT n.*, nc.name AS category_name, nc.slug AS category_slug
                              FROM notices n LEFT JOIN notice_categories nc ON n.category_id = nc.id
                              WHERE n.id = ? AND n.is_published = 1');
        $stmt->execute([$id]);
        $notice = $stmt->fetch();
        if (!$notice) error('Notice not found.', 404);
        success($notice);
    }

    else {
        error('Method not allowed.', 405);
    }
}
