<?php
/**
 * Site Settings API
 * GET  /api/settings         — Public: returns all settings as key→value map
 * GET  /api/admin/settings   — Admin: returns all settings with metadata
 * POST /api/admin/settings   — Admin: bulk-update settings
 */

function handleSettings(string $method, string $sub): void {
    $db = getDB();

    if ($method === 'GET') {
        $stmt = $db->query('SELECT setting_key, setting_value FROM site_settings ORDER BY setting_group, setting_key');
        $rows = $stmt->fetchAll();
        $map = [];
        foreach ($rows as $row) {
            $map[$row['setting_key']] = $row['setting_value'];
        }
        success($map);
    } else {
        error('Method not allowed.', 405);
    }
}

function handleAdminSettings(string $method): void {
    $db = getDB();

    if ($method === 'GET') {
        $stmt = $db->query('SELECT * FROM site_settings ORDER BY setting_group, setting_key');
        $rows = $stmt->fetchAll();
        // Group by setting_group
        $grouped = [];
        foreach ($rows as $row) {
            $grouped[$row['setting_group']][] = $row;
        }
        success($grouped);
    } elseif ($method === 'POST') {
        $body = getBody();
        if (empty($body) || !is_array($body)) {
            error('No settings data provided.', 422);
        }
        $stmt = $db->prepare('INSERT INTO site_settings (setting_key, setting_value, setting_group, label)
                               VALUES (?, ?, ?, ?)
                               ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)');
        foreach ($body as $key => $value) {
            // Only allow updating existing keys (security: don't allow arbitrary key creation from API)
            $check = $db->prepare('SELECT id FROM site_settings WHERE setting_key = ?');
            $check->execute([$key]);
            if ($check->fetch()) {
                $stmt->execute([sanitize($key), sanitize($value ?? ''), 'general', $key]);
            }
        }
        success(null, 'Settings updated successfully.');
    } else {
        error('Method not allowed.', 405);
    }
}
