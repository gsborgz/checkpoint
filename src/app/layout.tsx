import '@/assets/globals.css';

export const metadata = {
  title: 'Checkpoint',
  description: '',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang='en'>
      <body className='h-screen'>{children}</body>
    </html>
  );
}
