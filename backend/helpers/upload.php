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
        $uploadErrors = [
            UPLOAD_ERR_INI_SIZE   => 'The uploaded file exceeds the upload_max_filesize limit in php.ini.',
            UPLOAD_ERR_FORM_SIZE  => 'The uploaded file exceeds MAX_FILE_SIZE.',
            UPLOAD_ERR_PARTIAL    => 'The file was only partially uploaded.',
            UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary upload directory on server.',
            UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk. Check folder permissions.',
            UPLOAD_ERR_EXTENSION  => 'A PHP extension stopped the file upload.',
        ];
        $msg = $uploadErrors[$file['error']] ?? "Error code {$file['error']}.";
        error("File upload error for '$field': $msg", 422);
    }

    if ($file['size'] > $maxSize) {
        error("File '$field' exceeds maximum size of " . round($maxSize / 1024 / 1024, 1) . "MB.", 422);
    }

    // Validate MIME type & Extension
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $mimeType = null;

    if (function_exists('finfo_open') && !empty($file['tmp_name'])) {
        $finfo = @finfo_open(FILEINFO_MIME_TYPE);
        if ($finfo) {
            $mimeType = @finfo_file($finfo, $file['tmp_name']);
            @finfo_close($finfo);
        }
    }
    if (!$mimeType && function_exists('mime_content_type') && !empty($file['tmp_name'])) {
        $mimeType = @mime_content_type($file['tmp_name']);
    }

    $isValidMime = $mimeType && in_array($mimeType, $allowedTypes);
    $isValidExt  = false;

    if (in_array('application/pdf', $allowedTypes) && $ext === 'pdf') {
        $isValidExt = true;
    }
    if (in_array('image/jpeg', $allowedTypes) && in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
        $isValidExt = true;
    }

    if (!$isValidMime && !$isValidExt) {
        error("Invalid file type for '$field'. Uploaded extension: .$ext, MIME: " . ($mimeType ?: 'unknown'), 422);
    }

    // Generate unique filename
    $filename = uniqid() . '_' . time() . '.' . ($ext ?: 'bin');

    $dir = UPLOAD_DIR . $subdir . '/';
    if (!is_dir($dir)) {
        if (!@mkdir($dir, 0755, true)) {
            error("Failed to create upload directory 'uploads/$subdir' on server.", 500);
        }
    }

    $dest = $dir . $filename;
    if (!@move_uploaded_file($file['tmp_name'], $dest)) {
        error("Failed to save uploaded file '$field'. Check write permissions for uploads/$subdir.", 500);
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
