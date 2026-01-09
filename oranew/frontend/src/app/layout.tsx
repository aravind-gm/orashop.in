import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ORA Jewellery | Premium Artificial Fashion Jewellery',
  description: 'own. radiate. adorn. - Discover our exquisite collection of artificial fashion jewellery. Chains, necklaces, bracelets, rings, earrings and more.',
  keywords: 'jewellery, fashion jewellery, artificial jewellery, necklaces, earrings, bracelets, rings, ORA',
  openGraph: {
    title: 'ORA Jewellery',
    description: 'own. radiate. adorn.',
    images: ['/oralogo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="smooth-scroll">
      <body className={`${inter.variable} ${cormorant.variable} font-sans`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'toast-luxury',
            duration: 3000,
            style: {
              background: '#FFFFFF',
              color: '#2D2D2D',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
              borderRadius: '8px',
            },
          }}
        />
      </body>
    </html>
  );
}
