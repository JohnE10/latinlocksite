// app/layout.js
import Header from '../components/Header';
import Footer from '../components/Footer';
import './globals.css';
import GA4 from '../components/GA4';

export const metadata = {
  title: 'LatinLock',
  description: 'Shopify shipping helpful information',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Removed next/font so production builds do not depend on fetching Google Fonts. */}
      <body className="flex flex-col min-h-screen bg-gray-50">
        <GA4 />
        <Header />
        <main className="flex-grow container p-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
