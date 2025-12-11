import { Providers } from './providers';
import { Kumbh_Sans } from 'next/font/google';

const kumbh = Kumbh_Sans({ subsets: ['latin'] });

export const metadata = {
  title: 'Vocab App',
  description: 'A Dictionary App with Oxford API',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={kumbh.className} style={{ margin: 0, backgroundColor: '#F4F4F4' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}