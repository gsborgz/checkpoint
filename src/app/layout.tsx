import '@/assets/globals.css';
import { ThemeProvider } from 'next-themes';
import NextAuthSessionProvider from '@/providers/session';
import SnackbarProvider from '@/providers/snackbar';
import Sidebar from '@/components/sidebar';

export const metadata = {
  title: 'Checkpoint',
  description: '',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      suppressHydrationWarning
      lang='en'
    >
      <body className='h-screen'>
        <ThemeProvider attribute='class'>
          <NextAuthSessionProvider>
            <SnackbarProvider>
              <main className='bg-stone-100 dark:bg-stone-950 dark:text-stone-100 text-stone-950 h-full flex'>
                <Sidebar />

                {children}
              </main>
            </SnackbarProvider>
          </NextAuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
