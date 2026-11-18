<?php

return [
    /*
    | Content locales. The first one is the default / fallback locale.
    */
    'locales' => array_values(array_filter(array_map('trim', explode(',', env('APP_SUPPORTED_LOCALES', 'fa,en,ar'))))),

    'frontend_url' => env('FRONTEND_URL', 'http://localhost:3000'),

    'public_cache_ttl' => (int) env('PUBLIC_CACHE_TTL', 3600),

    'leads_notification_email' => env('LEADS_NOTIFICATION_EMAIL'),

    /*
    | Role based access control. Each role maps to a list of abilities.
    | "super_admin" bypasses all checks (see AuthServiceProvider / Gate::before).
    */
    'roles' => [
        'super_admin' => ['*'],
        'content_manager' => [
            'products', 'categories', 'articles', 'pages', 'media',
            'production_lines', 'production_steps', 'settings', 'reports',
        ],
        'sales_manager' => [
            'representatives', 'contact_requests', 'reports', 'products.view',
        ],
        'qc_manager' => [
            'certificates', 'production_lines', 'production_steps', 'media',
        ],
    ],

    'uploads' => [
        'image_mimes' => ['jpg', 'jpeg', 'png', 'webp', 'avif'],
        'document_mimes' => ['pdf'],
        'video_mimes' => ['mp4', 'webm'],
        'max_image_kb' => 10 * 1024,
        'max_document_kb' => 20 * 1024,
        'max_video_kb' => 100 * 1024,
    ],
];
