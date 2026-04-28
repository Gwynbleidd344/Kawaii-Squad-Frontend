import Navbar from '../../components/landing/Navbar';
import Hero from '../../components/landing/Hero';
import Stats from '../../components/landing/Stats';
import HowItWorks from '../../components/landing/HowItWorks';
import Features from '../../components/landing/Features';
import CTA from '../../components/landing/CTA';
import Footer from '../../components/landing/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <HowItWorks />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
