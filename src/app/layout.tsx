import '@/assets/globals.css';
import { ThemeProvider } from 'next-themes';
import NextAuthSessionProvider from '@/providers/session';

export const metadata = {
  title: 'Checkpoint',
  description: '',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang='en'>
      <body className='h-screen'>
        <ThemeProvider attribute='class'>
          <NextAuthSessionProvider>
            <main className='bg-stone-100 dark:bg-stone-950 h-full'>{children}</main>
          </NextAuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
