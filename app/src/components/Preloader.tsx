import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const images = document.querySelectorAll('img');
    let loaded = 0;
    const total = images.length || 1;

    const checkComplete = () => {
      loaded++;
      if (loaded >= total) {
        setReady(true);
      }
    };

    if (images.length === 0) {
      setReady(true);
    } else {
      images.forEach((img) => {
        if (img.complete) {
          checkComplete();
        } else {
          img.addEventListener('load', checkComplete);
          img.addEventListener('error', checkComplete);
        }
      });
    }

    const timer = setTimeout(() => setReady(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const progress = progressRef.current;
    if (!progress) return;

    gsap.to(progress, {
      scaleX: 1,
      duration: 1.5,
      ease: 'power2.inOut',
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    const container = containerRef.current;
    if (!container) return;

    gsap.to(container, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => {
        container.style.display = 'none';
        onComplete();
      },
    });
  }, [ready, onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-dark flex flex-col items-center justify-center"
    >
      <span className="font-display text-2xl text-primary-accent tracking-wider mb-8">
        PANELART 3D
      </span>
      <div className="w-24 h-0.5 bg-white/10 rounded-full overflow-hidden">
        <div
          ref={progressRef}
          className="h-full bg-primary-accent origin-left"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
    </div>
  );
}
