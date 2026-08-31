<?php
/**
 * Admin API — all protected routes (require JWT auth)
 * Handles: notices, segments, registrations, timeline, sponsors, faqs, gallery, contact
 */
function handleAdmin(string $method, string $resource, string $id, string $action): void {
    $admin = requireAdmin(); // Throws 401 if not authed
    $db = getDB();

    switch ($resource) {

        // ── NOTICES ──────────────────────────────────────────────
        case 'notices':
            if ($method === 'GET' && empty($id)) {
                $search = $_GET['search'] ?? '';
                $page   = max(1, (int)($_GET['page'] ?? 1));
                $limit  = min(100, max(1, (int)($_GET['limit'] ?? 15)));
                $params = [];
                $where  = [];
                if (!empty($search)) {
                    $where[] = '(n.title LIKE :s OR n.description LIKE :s)';
                    $params[':s'] = "%$search%";
                }
                $whereSQL = $where ? 'WHERE ' . implode(' AND ', $where) : '';
                $query = "SELECT n.*, nc.name AS category_name, nc.slug AS category_slug
                          FROM notices n LEFT JOIN notice_categories nc ON n.category_id = nc.id
                          $whereSQL ORDER BY n.created_at DESC";
                success(paginate($db, $query, $params, $page, $limit));
            }
            elseif ($method === 'GET' && !empty($id)) {
                $stmt = $db->prepare('SELECT n.*, nc.name AS category_name, nc.slug AS category_slug
                                      FROM notices n LEFT JOIN notice_categories nc ON n.category_id = nc.id
                                      WHERE n.id = ?');
                $stmt->execute([$id]);
                $n = $stmt->fetch(); if (!$n) error('Not found.', 404);
                success($n);
            }
            elseif ($method === 'POST' && empty($id)) {
                $title    = sanitize($_POST['title'] ?? '');
                $desc     = sanitize($_POST['description'] ?? '');
                $catId    = (int)($_POST['category_id'] ?? 0) ?: null;
                $published = (int)($_POST['is_published'] ?? 1);
                if (!$title || !$desc) error('Title and description required.', 422);
                $pdf = uploadFile('pdf', 'notices', ALLOWED_PDF_TYPES);
                $stmt = $db->prepare('INSERT INTO notices (title, description, category_id, is_published, pdf_path) VALUES (?, ?, ?, ?, ?)');
                $stmt->execute([$title, $desc, $catId, $published, $pdf]);
                success(['id' => $db->lastInsertId()], 'Notice created.', 201);
            }
            elseif ($method === 'POST' && !empty($id)) {
                // PUT via _method override
                $title    = sanitize($_POST['title'] ?? '');
                $desc     = sanitize($_POST['description'] ?? '');
                $catId    = (int)($_POST['category_id'] ?? 0) ?: null;
                $published = (int)($_POST['is_published'] ?? 1);
                $removePdf = (int)($_POST['remove_pdf'] ?? 0);
                if (!$title || !$desc) error('Title and description required.', 422);
                $existing = $db->prepare('SELECT pdf_path FROM notices WHERE id = ?');
                $existing->execute([$id]); $ex = $existing->fetch();
                $pdf = $ex['pdf_path'];
                if ($removePdf && $pdf) { deleteFile('notices', $pdf); $pdf = null; }
                $newPdf = uploadFile('pdf', 'notices', ALLOWED_PDF_TYPES);
                if ($newPdf) { if ($pdf) deleteFile('notices', $pdf); $pdf = $newPdf; }
                $stmt = $db->prepare('UPDATE notices SET title=?, description=?, category_id=?, is_published=?, pdf_path=?, updated_at=NOW() WHERE id=?');
                $stmt->execute([$title, $desc, $catId, $published, $pdf, $id]);
                success(null, 'Notice updated.');
            }
            elseif ($method === 'DELETE' && !empty($id)) {
                $stmt = $db->prepare('SELECT pdf_path FROM notices WHERE id = ?'); $stmt->execute([$id]);
                $n = $stmt->fetch(); if ($n && $n['pdf_path']) deleteFile('notices', $n['pdf_path']);
                $db->prepare('DELETE FROM notices WHERE id = ?')->execute([$id]);
                success(null, 'Notice deleted.');
            }
            break;

        // ── SEGMENTS ─────────────────────────────────────────────
        case 'segments':
            if ($method === 'GET' && empty($id)) {
                $stmt = $db->query('SELECT * FROM segments ORDER BY display_order ASC');
                success($stmt->fetchAll());
            }
            elseif ($method === 'GET' && !empty($id)) {
                $stmt = $db->prepare('SELECT * FROM segments WHERE id = ?'); $stmt->execute([$id]);
                $s = $stmt->fetch(); if (!$s) error('Not found.', 404); success($s);
            }
            elseif ($method === 'POST' && empty($id)) {
                $f = array_map('sanitize', $_POST);
                $img  = uploadFile('image', 'segments', ALLOWED_IMAGE_TYPES);
                $rb   = uploadFile('rulebook', 'rulebooks', ALLOWED_PDF_TYPES);
                $stmt = $db->prepare('INSERT INTO segments (name, slug, short_description, full_description, rules, eligibility, min_team_size, max_team_size, registration_fee, prize_pool, contact_email, contact_phone, is_active, display_order, image_path, rulebook_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
                $stmt->execute([$f['name'], $f['slug'] ?: strtolower(preg_replace('/[^a-z0-9]+/i', '-', $f['name'])), $f['short_description'], $f['full_description'] ?? '', $f['rules'] ?? '', $f['eligibility'] ?? '', (int)($f['min_team_size'] ?? 1), (int)($f['max_team_size'] ?? 5), (float)($f['registration_fee'] ?? 0), $f['prize_pool'] ?? '', $f['contact_email'] ?? '', $f['contact_phone'] ?? '', (int)($f['is_active'] ?? 1), (int)($f['display_order'] ?? 0), $img, $rb]);
                success(['id' => $db->lastInsertId()], 'Segment created.', 201);
            }
            elseif ($method === 'POST' && !empty($id)) {
                $f = array_map('sanitize', $_POST);
                $ex = $db->prepare('SELECT image_path, rulebook_path FROM segments WHERE id = ?'); $ex->execute([$id]); $ex = $ex->fetch();
                $img = $ex['image_path']; $rb = $ex['rulebook_path'];
                $newImg = uploadFile('image', 'segments', ALLOWED_IMAGE_TYPES);
                $newRb  = uploadFile('rulebook', 'rulebooks', ALLOWED_PDF_TYPES);
                if ($newImg) { if ($img) deleteFile('segments', $img); $img = $newImg; }
                if ($newRb)  { if ($rb)  deleteFile('rulebooks', $rb);  $rb  = $newRb; }
                $stmt = $db->prepare('UPDATE segments SET name=?, slug=?, short_description=?, full_description=?, rules=?, eligibility=?, min_team_size=?, max_team_size=?, registration_fee=?, prize_pool=?, contact_email=?, contact_phone=?, is_active=?, display_order=?, image_path=?, rulebook_path=?, updated_at=NOW() WHERE id=?');
                $stmt->execute([$f['name'], $f['slug'], $f['short_description'], $f['full_description'] ?? '', $f['rules'] ?? '', $f['eligibility'] ?? '', (int)($f['min_team_size'] ?? 1), (int)($f['max_team_size'] ?? 5), (float)($f['registration_fee'] ?? 0), $f['prize_pool'] ?? '', $f['contact_email'] ?? '', $f['contact_phone'] ?? '', (int)($f['is_active'] ?? 1), (int)($f['display_order'] ?? 0), $img, $rb, $id]);
                success(null, 'Segment updated.');
            }
            elseif ($method === 'DELETE' && !empty($id)) {
                $ex = $db->prepare('SELECT image_path, rulebook_path FROM segments WHERE id = ?'); $ex->execute([$id]); $ex = $ex->fetch();
                if ($ex) { if ($ex['image_path']) deleteFile('segments', $ex['image_path']); if ($ex['rulebook_path']) deleteFile('rulebooks', $ex['rulebook_path']); }
                $db->prepare('DELETE FROM segments WHERE id = ?')->execute([$id]);
                success(null, 'Segment deleted.');
            }
            break;

        // ── REGISTRATIONS ────────────────────────────────────────
        case 'registrations':
            if ($method === 'GET' && empty($id)) {
                $search = $_GET['search'] ?? '';
                $status = $_GET['status'] ?? '';
                $page   = max(1, (int)($_GET['page'] ?? 1));
                $limit  = min(100, max(1, (int)($_GET['limit'] ?? 15)));
                $where  = []; $params = [];
                if (!empty($search)) {
                    $where[] = '(r.team_name LIKE :s OR r.registration_id LIKE :s OR r.leader_email LIKE :s OR r.institution LIKE :s)';
                    $params[':s'] = "%$search%";
                }
                if (!empty($status)) { $where[] = 'r.status = :st'; $params[':st'] = $status; }
                $whereSQL = $where ? 'WHERE ' . implode(' AND ', $where) : '';
                $query = "SELECT r.*, s.name AS segment_name FROM registrations r LEFT JOIN segments s ON r.segment_id = s.id $whereSQL ORDER BY r.created_at DESC";
                success(paginate($db, $query, $params, $page, $limit));
            }
            elseif ($method === 'GET' && !empty($id)) {
                $stmt = $db->prepare('SELECT r.*, s.name AS segment_name FROM registrations r LEFT JOIN segments s ON r.segment_id = s.id WHERE r.id = ?');
                $stmt->execute([$id]); $reg = $stmt->fetch(); if (!$reg) error('Not found.', 404);
                $mStmt = $db->prepare('SELECT * FROM registration_members WHERE registration_id = ?'); $mStmt->execute([$id]); $reg['members'] = $mStmt->fetchAll();
                $pStmt = $db->prepare('SELECT * FROM payments WHERE registration_id = ?'); $pStmt->execute([$id]); $reg['payment'] = $pStmt->fetch() ?: null;
                success($reg);
            }
            elseif ($method === 'PUT' && !empty($id) && $action === 'status') {
                $body = getBody();
                $newStatus = $body['status'] ?? '';
                if (!in_array($newStatus, ['pending', 'approved', 'rejected'])) error('Invalid status.', 422);
                $reason = sanitize($body['rejection_reason'] ?? '');
                $stmt = $db->prepare('UPDATE registrations SET status = ?, rejection_reason = ?, updated_at = NOW() WHERE id = ?');
                $stmt->execute([$newStatus, $reason, $id]);
                success(null, "Registration $newStatus.");
            }
            break;

        // ── TIMELINE ─────────────────────────────────────────────
        case 'timeline':
            if ($method === 'GET') {
                success($db->query('SELECT * FROM timeline_events ORDER BY display_order ASC')->fetchAll());
            }
            elseif ($method === 'POST' && empty($id)) {
                $body = getBody(); required_fields($body, ['title', 'event_date']);
                $stmt = $db->prepare('INSERT INTO timeline_events (title, description, event_date, status, icon, display_order) VALUES (?, ?, ?, ?, ?, ?)');
                $stmt->execute([sanitize($body['title']), sanitize($body['description'] ?? ''), $body['event_date'], $body['status'] ?? 'upcoming', sanitize($body['icon'] ?? 'calendar'), (int)($body['display_order'] ?? 0)]);
                success(['id' => $db->lastInsertId()], 'Timeline event added.', 201);
            }
            elseif ($method === 'PUT' && !empty($id)) {
                $body = getBody();
                $stmt = $db->prepare('UPDATE timeline_events SET title=?, description=?, event_date=?, status=?, icon=?, display_order=? WHERE id=?');
                $stmt->execute([sanitize($body['title'] ?? ''), sanitize($body['description'] ?? ''), $body['event_date'] ?? '', $body['status'] ?? 'upcoming', sanitize($body['icon'] ?? 'calendar'), (int)($body['display_order'] ?? 0), $id]);
                success(null, 'Updated.');
            }
            elseif ($method === 'DELETE' && !empty($id)) {
                $db->prepare('DELETE FROM timeline_events WHERE id = ?')->execute([$id]);
                success(null, 'Deleted.');
            }
            break;

        // ── SPONSORS ─────────────────────────────────────────────
        case 'sponsors':
            if ($method === 'GET') {
                $stmt = $db->query('SELECT s.*, sc.name AS category_name FROM sponsors s LEFT JOIN sponsor_categories sc ON s.category_id = sc.id ORDER BY sc.display_order, s.display_order');
                success($stmt->fetchAll());
            }
            elseif ($method === 'POST' && empty($id)) {
                $f = $_POST; $logo = uploadFile('logo', 'sponsors', ALLOWED_IMAGE_TYPES);
                $catName = sanitize($f['category'] ?? 'Gold Sponsor');
                $catStmt = $db->prepare('SELECT id FROM sponsor_categories WHERE name = ?'); $catStmt->execute([$catName]); $cat = $catStmt->fetch();
                $catId = $cat ? $cat['id'] : null;
                $stmt = $db->prepare('INSERT INTO sponsors (name, logo_path, category_id, website_url, display_order) VALUES (?, ?, ?, ?, ?)');
                $stmt->execute([sanitize($f['name'] ?? ''), $logo, $catId, sanitize($f['website_url'] ?? ''), (int)($f['display_order'] ?? 0)]);
                success(['id' => $db->lastInsertId()], 'Sponsor added.', 201);
            }
            elseif ($method === 'POST' && !empty($id)) {
                $f = $_POST; $ex = $db->prepare('SELECT logo_path FROM sponsors WHERE id = ?'); $ex->execute([$id]); $ex = $ex->fetch();
                $logo = $ex['logo_path']; $newLogo = uploadFile('logo', 'sponsors', ALLOWED_IMAGE_TYPES);
                if ($newLogo) { if ($logo) deleteFile('sponsors', $logo); $logo = $newLogo; }
                $catName = sanitize($f['category'] ?? '');
                $catStmt = $db->prepare('SELECT id FROM sponsor_categories WHERE name = ?'); $catStmt->execute([$catName]); $cat = $catStmt->fetch();
                $catId = $cat ? $cat['id'] : null;
                $stmt = $db->prepare('UPDATE sponsors SET name=?, logo_path=?, category_id=?, website_url=?, display_order=? WHERE id=?');
                $stmt->execute([sanitize($f['name'] ?? ''), $logo, $catId, sanitize($f['website_url'] ?? ''), (int)($f['display_order'] ?? 0), $id]);
                success(null, 'Updated.');
            }
            elseif ($method === 'DELETE' && !empty($id)) {
                $ex = $db->prepare('SELECT logo_path FROM sponsors WHERE id = ?'); $ex->execute([$id]); $ex = $ex->fetch();
                if ($ex && $ex['logo_path']) deleteFile('sponsors', $ex['logo_path']);
                $db->prepare('DELETE FROM sponsors WHERE id = ?')->execute([$id]);
                success(null, 'Deleted.');
            }
            break;

        // ── FAQS ─────────────────────────────────────────────────
        case 'faqs':
            if ($method === 'GET') {
                success($db->query('SELECT * FROM faqs ORDER BY display_order ASC')->fetchAll());
            }
            elseif ($method === 'POST' && empty($id)) {
                $body = getBody(); required_fields($body, ['question', 'answer']);
                $stmt = $db->prepare('INSERT INTO faqs (question, answer, display_order, is_active) VALUES (?, ?, ?, ?)');
                $stmt->execute([sanitize($body['question']), sanitize($body['answer']), (int)($body['display_order'] ?? 0), (int)($body['is_active'] ?? 1)]);
                success(['id' => $db->lastInsertId()], 'FAQ added.', 201);
            }
            elseif ($method === 'PUT' && !empty($id)) {
                $body = getBody();
                $stmt = $db->prepare('UPDATE faqs SET question=?, answer=?, display_order=?, is_active=? WHERE id=?');
                $stmt->execute([sanitize($body['question'] ?? ''), sanitize($body['answer'] ?? ''), (int)($body['display_order'] ?? 0), (int)($body['is_active'] ?? 1), $id]);
                success(null, 'Updated.');
            }
            elseif ($method === 'DELETE' && !empty($id)) {
                $db->prepare('DELETE FROM faqs WHERE id = ?')->execute([$id]);
                success(null, 'Deleted.');
            }
            break;

        // ── GALLERY ──────────────────────────────────────────────
        case 'gallery':
            if ($method === 'GET') {
                success($db->query('SELECT * FROM gallery ORDER BY created_at DESC')->fetchAll());
            }
            elseif ($method === 'POST' && empty($id)) {
                $type = ($_POST['type'] ?? 'image') === 'video' ? 'video' : 'image';
                $allowedTypes = $type === 'image' ? ALLOWED_IMAGE_TYPES : ['video/mp4', 'video/webm', 'video/ogg'];
                $filePath = uploadFile('file', 'gallery', $allowedTypes);
                if (!$filePath) error('File is required.', 422);
                $caption = sanitize($_POST['caption'] ?? '');
                $stmt = $db->prepare('INSERT INTO gallery (type, file_path, caption) VALUES (?, ?, ?)');
                $stmt->execute([$type, $filePath, $caption]);
                success(['id' => $db->lastInsertId()], 'Media uploaded.', 201);
            }
            elseif ($method === 'DELETE' && !empty($id)) {
                $ex = $db->prepare('SELECT file_path FROM gallery WHERE id = ?'); $ex->execute([$id]); $ex = $ex->fetch();
                if ($ex && $ex['file_path']) deleteFile('gallery', $ex['file_path']);
                $db->prepare('DELETE FROM gallery WHERE id = ?')->execute([$id]);
                success(null, 'Deleted.');
            }
            break;

        // ── CONTACT MESSAGES ────────────────────────────────────
        case 'contact':
            if ($method === 'GET') {
                success($db->query('SELECT * FROM contact_messages ORDER BY created_at DESC')->fetchAll());
            }
            elseif ($method === 'PUT' && !empty($id) && $action === 'read') {
                $db->prepare('UPDATE contact_messages SET is_read = 1 WHERE id = ?')->execute([$id]);
                success(null, 'Marked as read.');
            }
            break;

        default:
            error('Admin resource not found.', 404);
    }
}
