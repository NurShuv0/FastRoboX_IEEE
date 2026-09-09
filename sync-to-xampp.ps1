
# ============================================================
# FastRoboX — Backend Auto-Sync to XAMPP
# Watches d:\MY_CODE\ieee\natinal robotic project\backend\
# and copies any changed PHP files to C:\xampp\htdocs\fastrobox\backend\
# ============================================================

$src = "d:\MY_CODE\ieee\natinal robotic project\backend"
$dst = "C:\xampp\htdocs\fastrobox\backend"

Write-Host "=======================================" -ForegroundColor Cyan
Write-Host " FastRoboX Backend Auto-Sync Watcher" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  Source : $src" -ForegroundColor Gray
Write-Host "  Target : $dst" -ForegroundColor Gray
Write-Host "  Watching for changes... (Ctrl+C to stop)" -ForegroundColor Yellow
Write-Host ""

# Do an initial full sync
Write-Host "[INIT] Doing initial full sync..." -ForegroundColor DarkYellow
$srcFiles = Get-ChildItem -Path $src -Recurse -File | Where-Object { $_.FullName -notmatch '\\uploads\\' }
foreach ($f in $srcFiles) {
    $rel     = $f.FullName.Substring($src.Length)
    $dstFile = $dst + $rel
    $dstDir  = Split-Path $dstFile -Parent
    if (!(Test-Path $dstDir)) { New-Item -ItemType Directory -Path $dstDir -Force | Out-Null }
    Copy-Item -Path $f.FullName -Destination $dstFile -Force
}
Write-Host "[INIT] Full sync complete. $($srcFiles.Count) files synced." -ForegroundColor Green
Write-Host ""

# Set up file system watcher
$watcher                  = New-Object System.IO.FileSystemWatcher
$watcher.Path             = $src
$watcher.Filter           = "*.*"
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents   = $true
$watcher.NotifyFilter     = [System.IO.NotifyFilters]'LastWrite,FileName,DirectoryName'

$onChange = {
    $path = $Event.SourceEventArgs.FullPath
    # Skip uploads folder
    if ($path -match '\\uploads\\') { return }
    $rel     = $path.Substring($src.Length)
    $dstFile = $dst + $rel
    $dstDir  = Split-Path $dstFile -Parent
    Start-Sleep -Milliseconds 200  # brief delay for file to finish writing
    if (Test-Path $path -PathType Leaf) {
        if (!(Test-Path $dstDir)) { New-Item -ItemType Directory -Path $dstDir -Force | Out-Null }
        Copy-Item -Path $path -Destination $dstFile -Force
        $time = Get-Date -Format "HH:mm:ss"
        Write-Host "[$time] SYNCED: $rel" -ForegroundColor Green
    }
}

$onDelete = {
    $path    = $Event.SourceEventArgs.FullPath
    if ($path -match '\\uploads\\') { return }
    $rel     = $path.Substring($src.Length)
    $dstFile = $dst + $rel
    if (Test-Path $dstFile) {
        Remove-Item $dstFile -Force
        $time = Get-Date -Format "HH:mm:ss"
        Write-Host "[$time] DELETED: $rel" -ForegroundColor Red
    }
}

Register-ObjectEvent $watcher "Changed" -Action $onChange  | Out-Null
Register-ObjectEvent $watcher "Created" -Action $onChange  | Out-Null
Register-ObjectEvent $watcher "Deleted" -Action $onDelete  | Out-Null

# Keep script alive
try {
    while ($true) { Start-Sleep -Seconds 1 }
} finally {
    $watcher.EnableRaisingEvents = $false
    $watcher.Dispose()
    Write-Host "`n[STOPPED] Watcher stopped." -ForegroundColor Red
}
