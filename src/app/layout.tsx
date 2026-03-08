import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/common/Header';
import { ThemeProvider } from '@/components/common/ThemeProvider';
import { FirebaseClientProvider } from '@/firebase';
import { I18nProvider } from '@/components/I18nProvider';

export const metadata: Metadata = {
  title: 'Argument Cartographer',
  description: 'Deconstruct and visualize complex arguments with AI.',
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Bai+Jamjuree:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body" suppressHydrationWarning>
        <FirebaseClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <I18nProvider>
              <div className="relative flex min-h-screen w-full flex-col">
                <Header />
                <main className="flex-1">{children}</main>
              </div>
              <Toaster />
            </I18nProvider>
          </ThemeProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
