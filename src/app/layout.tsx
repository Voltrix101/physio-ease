
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Poppins } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Chatbot } from '@/components/ClientChatbot';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700'],
  preload: true, // Preload font for faster rendering
});

export const metadata: Metadata = {
  title: 'Pain Manage Clinic',
  description: 'Appointment & Physiotherapy Hub for Dr. Amiya Ballav Roy',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable}`} suppressHydrationWarning>
      <head>
        {/* Critical resource hints for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="//fonts.gstatic.com" crossOrigin="" />
        <link rel="preload" href="/images/doctor-photo.jpeg" as="image" />
      </head>
      <body className="antialiased min-h-screen bg-background flex flex-col font-body">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Chatbot />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
