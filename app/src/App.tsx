import { useState, useCallback } from 'react';
import SmoothScrollProvider from './components/SmoothScrollProvider';
import WebGLCanvas from './components/WebGLCanvas';
import Preloader from './components/Preloader';
import Navigation from './components/Navigation';
import HeroSection from './sections/HeroSection';
import IntroSection from './sections/IntroSection';
import GallerySection from './sections/GallerySection';
import VisionSection from './sections/VisionSection';
import CraftSection from './sections/CraftSection';
import TestimonialsSection from './sections/TestimonialsSection';
import CTASection from './sections/CTASection';
import FooterSection from './sections/FooterSection';

function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderDone(true);
  }, []);

  return (
    <SmoothScrollProvider>
      <Preloader onComplete={handlePreloaderComplete} />
      <WebGLCanvas />
      <Navigation />
      <main className="relative z-[1]">
        <HeroSection ready={preloaderDone} />
        <IntroSection />
        <GallerySection />
        <VisionSection />
        <CraftSection />
        <TestimonialsSection />
        <CTASection />
        <FooterSection />
      </main>
    </SmoothScrollProvider>
  );
}

export default App;
