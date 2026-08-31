<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

function uploadFile(string $field, string $subdir, array $allowedTypes, int $maxSize = 0): ?string {
    if (!isset($_FILES[$field]) || $_FILES[$field]['error'] === UPLOAD_ERR_NO_FILE) {
        return null;
    }

    $file = $_FILES[$field];
    $maxSize = $maxSize ?: MAX_FILE_SIZE;

    if ($file['error'] !== UPLOAD_ERR_OK) {
        error("File upload error for '$field'.", 422);
    }

    if ($file['size'] > $maxSize) {
        error("File '$field' exceeds maximum size of " . ($maxSize / 1024 / 1024) . "MB.", 422);
    }

    // Validate MIME type
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!in_array($mimeType, $allowedTypes)) {
        error("Invalid file type for '$field'. Allowed: " . implode(', ', $allowedTypes), 422);
    }

    // Generate unique filename
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '_' . time() . '.' . strtolower($ext);

    $dir = UPLOAD_DIR . $subdir . '/';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    $dest = $dir . $filename;
    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        error("Failed to save uploaded file '$field'.", 500);
    }

    return $filename;
}

function deleteFile(string $subdir, string $filename): void {
    if (empty($filename)) return;
    $path = UPLOAD_DIR . $subdir . '/' . $filename;
    if (file_exists($path)) {
        unlink($path);
    }
}
