<?php
function handleDashboard(string $method, string $action): void {
    if ($method !== 'GET') error('Method not allowed.', 405);
    requireAdmin();
    $db = getDB();

    $stats = [];

    // Registrations
    $r = $db->query('SELECT
        COUNT(*) AS total,
        SUM(status = "pending") AS pending,
        SUM(status = "approved") AS approved,
        SUM(status = "rejected") AS rejected
        FROM registrations')->fetch();
    $stats['total_registrations']    = (int)$r['total'];
    $stats['pending_registrations']  = (int)$r['pending'];
    $stats['approved_registrations'] = (int)$r['approved'];
    $stats['rejected_registrations'] = (int)$r['rejected'];

    $stats['total_notices']  = (int)$db->query('SELECT COUNT(*) FROM notices')->fetchColumn();
    $stats['total_segments'] = (int)$db->query('SELECT COUNT(*) FROM segments')->fetchColumn();
    $stats['total_sponsors'] = (int)$db->query('SELECT COUNT(*) FROM sponsors WHERE is_active = 1')->fetchColumn();
    $stats['unread_messages'] = (int)$db->query('SELECT COUNT(*) FROM contact_messages WHERE is_read = 0')->fetchColumn();
    $stats['total_faqs']     = (int)$db->query('SELECT COUNT(*) FROM faqs WHERE is_active = 1')->fetchColumn();

    success($stats);
}
