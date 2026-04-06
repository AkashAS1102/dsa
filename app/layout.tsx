import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CodeForge — College Coding Platform',
  description:
    'A production-ready competitive coding platform for college students. Practice DSA, execute code in C, C++, Java, Python, and visualize algorithms step-by-step.',
  keywords: ['coding', 'leetcode', 'dsa', 'algorithms', 'college', 'programming'],
  openGraph: {
    title: 'CodeForge — College Coding Platform',
    description: 'Practice DSA, execute real code, visualize algorithms.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
