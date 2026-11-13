<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full antialiased">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title inertia>{{ config('app.name', 'MetaDrink') }}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        
        <script>
            (function() {
                try {
                    const saved = localStorage.getItem('metadrink_theme');
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    const theme = saved ? saved : (prefersDark ? 'dark' : 'light');
                    if (theme === 'dark') {
                        document.documentElement.classList.add('dark');
                        document.documentElement.setAttribute('data-theme', 'dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                        document.documentElement.setAttribute('data-theme', 'light');
                    }
                } catch (e) {}
            })();
        </script>

        @viteReactRefresh
        @vite(['resources/js/app.jsx', 'resources/css/app.css'])
        @inertiaHead
    </head>
    <body class="h-full font-sans antialiased bg-[#F7F8FA] dark:bg-[#0E1013] text-[#121417] dark:text-[#F2F4F7] selection:bg-[#FA4B00] selection:text-white transition-colors duration-200">
        @inertia
    </body>
</html>
