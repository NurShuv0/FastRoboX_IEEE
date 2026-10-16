<?php
function handleRegistrationStatus(): void {
    $db = getDB();
    $regId = trim($_GET['id'] ?? '');
    $email = trim($_GET['email'] ?? '');

    if (empty($regId) || empty($email)) error('Registration ID and email are required.', 422);

    $stmt = $db->prepare(
        'SELECT r.*, s.name AS segment_name
         FROM registrations r
         LEFT JOIN segments s ON r.segment_id = s.id
         WHERE r.registration_id = ? AND r.leader_email = ?'
    );
    $stmt->execute([$regId, $email]);
    $reg = $stmt->fetch();
    if (!$reg) error('Registration not found. Please check your ID and email.', 404);

    // Get members
    $mStmt = $db->prepare('SELECT full_name, email, phone, is_leader FROM registration_members WHERE registration_id = ? ORDER BY is_leader DESC');
    $mStmt->execute([$reg['id']]);
    $reg['members'] = $mStmt->fetchAll();

    // Get payment
    $pStmt = $db->prepare('SELECT method, transaction_id, amount, is_verified, created_at FROM payments WHERE registration_id = ?');
    $pStmt->execute([$reg['id']]);
    $reg['payment'] = $pStmt->fetch() ?: null;

    unset($reg['id']); // Don't expose internal ID
    success($reg);
}

function handleRegistrations(string $method, string $id): void {
    $db = getDB();

    if ($method === 'POST' && empty($id)) {
        // Check if registration is open
        $settingStmt = $db->prepare('SELECT setting_value FROM site_settings WHERE setting_key = ?');
        $settingStmt->execute(['registration_is_open']);
        $regOpen = $settingStmt->fetch();
        if ($regOpen && $regOpen['setting_value'] === '0') {
            error('Registration is currently closed. Please check back later.', 403);
        }

        // Check deadline
        $deadlineStmt = $db->prepare('SELECT setting_value FROM site_settings WHERE setting_key = ?');
        $deadlineStmt->execute(['registration_deadline']);
        $deadline = $deadlineStmt->fetch();
        if ($deadline && !empty($deadline['setting_value'])) {
            $deadlineDate = new DateTime($deadline['setting_value'] . ' 23:59:59', new DateTimeZone('+06:00'));
            $now = new DateTime('now', new DateTimeZone('+06:00'));
            if ($now > $deadlineDate) {
                error('Registration deadline has passed. Registration is closed.', 403);
            }
        }

        $segId       = (int)($_POST['segment_id'] ?? 0);
        $teamName    = sanitize($_POST['team_name'] ?? '');
        $institution = sanitize($_POST['institution'] ?? '');
        $leaderName  = sanitize($_POST['leader_name'] ?? '');
        $leaderEmail = sanitize($_POST['leader_email'] ?? '');
        $leaderPhone = sanitize($_POST['leader_phone'] ?? '');
        $membersRaw  = $_POST['members'] ?? '[]';
        $payMethod   = sanitize($_POST['payment_method'] ?? '');
        $transId     = sanitize($_POST['transaction_id'] ?? '');
        $category    = sanitize($_POST['category'] ?? '');

        if (!$segId || !$teamName || !$institution || !$leaderName || !$leaderEmail || !$leaderPhone || !$payMethod || !$transId) {
            error('All required fields must be filled.', 422);
        }

        // Validate email format
        if (!filter_var($leaderEmail, FILTER_VALIDATE_EMAIL)) {
            error('Invalid leader email address.', 422);
        }

        // Validate segment
        $segStmt = $db->prepare('SELECT * FROM segments WHERE id = ? AND is_active = 1');
        $segStmt->execute([$segId]);
        $seg = $segStmt->fetch();
        if (!$seg) error('Invalid competition segment.', 422);

        // Parse members
        $members = json_decode($membersRaw, true) ?: [];
        $totalSize = count($members) + 1; // +1 for leader
        if ($totalSize < $seg['min_team_size'] || $totalSize > $seg['max_team_size']) {
            error("Team size must be between {$seg['min_team_size']} and {$seg['max_team_size']} members (including team leader).", 422);
        }

        // Generate unique registration ID
        $prefix = 'FR26-';
        do {
            $regId = $prefix . str_pad(mt_rand(1, 99999), 5, '0', STR_PAD_LEFT);
            $check = $db->prepare('SELECT id FROM registrations WHERE registration_id = ?');
            $check->execute([$regId]);
        } while ($check->fetch());

        // Upload payment screenshot (validate type + size)
        $screenshotPath = uploadFile(
            'payment_screenshot', 'payments',
            array_merge(ALLOWED_IMAGE_TYPES, ALLOWED_PDF_TYPES),
            5 * 1024 * 1024
        );

        if (!$screenshotPath) {
            error('Payment screenshot is required and must be JPG, PNG, or PDF (max 5MB).', 422);
        }

        $db->beginTransaction();
        try {
            // Insert registration
            $stmt = $db->prepare(
                'INSERT INTO registrations (registration_id, segment_id, team_name, institution, leader_name, leader_email, leader_phone, category)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
            );
            $stmt->execute([$regId, $segId, $teamName, $institution, $leaderName, $leaderEmail, $leaderPhone, $category]);
            $registrationDbId = $db->lastInsertId();

            // Insert leader as member (is_leader = 1)
            $mStmt = $db->prepare('INSERT INTO registration_members (registration_id, full_name, email, phone, is_leader) VALUES (?, ?, ?, ?, 1)');
            $mStmt->execute([$registrationDbId, $leaderName, $leaderEmail, $leaderPhone]);

            // Insert other members
            $mStmt2 = $db->prepare('INSERT INTO registration_members (registration_id, full_name, email, phone) VALUES (?, ?, ?, ?)');
            foreach ($members as $m) {
                $mName  = sanitize($m['full_name'] ?? '');
                $mEmail = sanitize($m['email'] ?? '');
                $mPhone = sanitize($m['phone'] ?? '');
                if ($mName && $mEmail) {
                    $mStmt2->execute([$registrationDbId, $mName, $mEmail, $mPhone]);
                }
            }

            // Calculate actual amount based on team size and segment fee model
            $baseMembers = 4;
            $baseFee = (float)$seg['registration_fee'];
            $additionalFee = (float)($seg['fee_additional'] ?? 0);
            $extraMembers = max(0, $totalSize - $baseMembers);
            $totalFee = $baseFee + ($extraMembers * $additionalFee);

            // Poster Presentation: per-member fee
            if ($seg['slug'] === 'poster-presentation') {
                $totalFee = $totalSize * $baseFee;
            }

            // Insert payment
            $pStmt = $db->prepare(
                'INSERT INTO payments (registration_id, method, transaction_id, screenshot_path, amount) VALUES (?, ?, ?, ?, ?)'
            );
            $pStmt->execute([$registrationDbId, $payMethod, $transId, $screenshotPath, $totalFee]);

            $db->commit();
            success(['registration_id' => $regId, 'status' => 'pending', 'team_name' => $teamName, 'segment_name' => $seg['name']], 'Registration submitted successfully!', 201);
        } catch (Exception $e) {
            $db->rollBack();
            if ($screenshotPath) deleteFile('payments', $screenshotPath);
            error('Registration failed. Please try again.', 500);
        }
    }
    else { error('Method not allowed.', 405); }
}
