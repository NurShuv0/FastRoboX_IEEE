<?php
function handleTimeline(string $method, string $id): void {
    $db = getDB();
    if ($method === 'GET') {
        $stmt = $db->query('SELECT * FROM timeline_events ORDER BY display_order ASC, event_date ASC');
        success($stmt->fetchAll());
    } else { error('Method not allowed.', 405); }
}

// --- Remaining public APIs ---

function handleSponsors(string $method, string $id): void {
    $db = getDB();
    if ($method === 'GET') {
        $stmt = $db->query(
            'SELECT s.*, sc.name AS category_name, sc.slug AS category_slug
             FROM sponsors s LEFT JOIN sponsor_categories sc ON s.category_id = sc.id
             WHERE s.is_active = 1 ORDER BY sc.display_order ASC, s.display_order ASC'
        );
        success($stmt->fetchAll());
    } else { error('Method not allowed.', 405); }
}

function handleFaqs(string $method, string $id): void {
    $db = getDB();
    if ($method === 'GET') {
        $stmt = $db->query('SELECT * FROM faqs WHERE is_active = 1 ORDER BY display_order ASC');
        success($stmt->fetchAll());
    } else { error('Method not allowed.', 405); }
}

function handleGallery(string $method, string $id): void {
    $db = getDB();
    if ($method === 'GET') {
        $stmt = $db->query('SELECT * FROM gallery ORDER BY created_at DESC');
        success($stmt->fetchAll());
    } else { error('Method not allowed.', 405); }
}

function handleContact(string $method, string $id): void {
    $db = getDB();
    if ($method === 'POST') {
        $body = getBody();
        required_fields($body, ['name', 'email', 'subject', 'message']);
        $stmt = $db->prepare('INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)');
        $stmt->execute([sanitize($body['name']), sanitize($body['email']), sanitize($body['subject']), sanitize($body['message'])]);
        success(null, 'Message sent successfully!', 201);
    } else { error('Method not allowed.', 405); }
}
