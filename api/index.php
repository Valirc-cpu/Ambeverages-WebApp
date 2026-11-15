<?php

// Forward Vercel serverless requests to Laravel's public/index.php
// Redirect temporary storage directories for Vercel's read-only filesystem
$storagePaths = [
    '/tmp/storage/framework/views',
    '/tmp/storage/framework/cache/data',
    '/tmp/storage/framework/sessions',
    '/tmp/storage/logs',
    '/tmp/bootstrap/cache',
];

foreach ($storagePaths as $path) {
    if (! is_dir($path)) {
        mkdir($path, 0755, true);
    }
}

$cacheMappings = [
    'VIEW_COMPILED_PATH' => '/tmp/storage/framework/views',
    'APP_SERVICES_CACHE' => '/tmp/bootstrap/cache/services.php',
    'APP_PACKAGES_CACHE' => '/tmp/bootstrap/cache/packages.php',
    'APP_CONFIG_CACHE' => '/tmp/bootstrap/cache/config.php',
    'APP_ROUTES_CACHE' => '/tmp/bootstrap/cache/routes.php',
    'APP_EVENTS_CACHE' => '/tmp/bootstrap/cache/events.php',
];

foreach ($cacheMappings as $key => $val) {
    $_ENV[$key] = $val;
    $_SERVER[$key] = $val;
    putenv("{$key}={$val}");
}

try {
    require __DIR__.'/../public/index.php';
} catch (Throwable $e) {
    http_response_code(500);
    echo '<div style="font-family:sans-serif;padding:30px;background:#fff5f5;color:#991b1b;border:1px solid #fecaca;border-radius:12px;max-width:800px;margin:40px auto;">';
    echo '<h2 style="margin-top:0;">Vercel Serverless Exception</h2>';
    echo '<p><strong>Message:</strong> '.htmlspecialchars($e->getMessage()).'</p>';
    echo '<p><strong>File:</strong> '.htmlspecialchars($e->getFile()).':'.$e->getLine().'</p>';
    echo '<pre style="background:#1e1e1e;color:#f3f4f6;padding:16px;border-radius:8px;overflow-x:auto;font-size:12px;">'.htmlspecialchars($e->getTraceAsString()).'</pre>';
    echo '</div>';
}
