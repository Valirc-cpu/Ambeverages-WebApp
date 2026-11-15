import './globals.css';

export const metadata = {
  title: 'Ambeverages — I Am Beverages.',
  description: 'Pesan minuman segar artisanal racikan buah pilihan. Langsung pesan via WhatsApp resmi.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
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
            `,
          }}
        />
      </head>
      <body className="min-h-full font-sans antialiased bg-[#F7F8FA] dark:bg-[#0E1013] text-[#121417] dark:text-[#F2F4F7] selection:bg-[#FA4B00] selection:text-white transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
