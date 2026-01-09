// Home page - main landing page for ORA luxury jewellery brand
import Bestsellers from '@/components/home/Bestsellers';
import BrandPhilosophy from '@/components/home/BrandPhilosophy';
import FeaturedCollections from '@/components/home/FeaturedCollections';
import GiftingSection from '@/components/home/GiftingSection';
import Hero from '@/components/home/Hero';
import Footer from '@/components/shared/Footer';
import Navbar from '@/components/shared/Navbar';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <FeaturedCollections />
      <Bestsellers />
      <GiftingSection />
      <BrandPhilosophy />
      <Footer />
    </main>
  );
}
