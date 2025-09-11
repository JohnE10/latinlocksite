// app/layout.js
import { Inter } from 'next/font/google';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './globals.css';
import GA4 from '@/components/GA4';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LatinLock',
  description: 'Shopify shipping helpful information',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-50`}>
        <GA4 />
        <Header />
        <main className="flex-grow container">{children}</main>
        <Footer />
      </body>
    </html>
  );
}