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
      <body className='h-screen dark:text-stone-100 text-stone-950'>
        <ThemeProvider attribute='class'>
          <NextAuthSessionProvider>
            <SnackbarProvider>
              <Sidebar />

              <main className='h-full flex bg-stone-100 dark:bg-stone-950 ml-14'>{children}</main>
            </SnackbarProvider>
          </NextAuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
