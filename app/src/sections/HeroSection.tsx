import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import PillButton from '../components/PillButton';
import { getWhatsAppUrl } from '../lib/contact';

interface HeroSectionProps {
  ready: boolean;
}

export default function HeroSection({ ready }: HeroSectionProps) {
  const overlineRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      overlineRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      0.3
    )
      .fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.6
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        1.0
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        1.3
      );

    return () => {
      tl.kill();
    };
  }, [ready]);

  return (
    <section
      id="hero"
      className="relative w-full min-h-[100dvh] overflow-hidden z-[2]"
    >
      {/* Hero Content */}
      <div className="absolute bottom-[12vh] left-0 w-full z-[2] pointer-events-none px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <p
            ref={overlineRef}
            className="font-body text-xs uppercase tracking-[0.12em] text-primary-accent mb-6 opacity-0"
          >
            PANELES 3D EN YESO — CARTAGENA DE INDIAS
          </p>

          <h1
            ref={titleRef}
            className="font-display text-primary-light text-glow opacity-0"
            style={{ fontSize: 'clamp(2rem, 8vw, 7rem)', lineHeight: 1.1 }}
          >
            TRANSFORMA
            <br />
            TUS PAREDES EN ARTE
          </h1>

          <p
            ref={subtitleRef}
            className="font-body text-warm-light mt-6 max-w-[560px] opacity-0"
            style={{ fontSize: 'clamp(1rem, 1.2vw, 1.125rem)', lineHeight: 1.7 }}
          >
            Diseño, fabricación e instalación de paneles decorativos en yeso para interiores residenciales y comerciales en Cartagena de Indias, Colombia.
          </p>

          <div ref={ctaRef} className="mt-8 opacity-0 pointer-events-auto">
            <PillButton
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              Cotiza Tu Proyecto
            </PillButton>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-[4vh] left-1/2 -translate-x-1/2 z-[2]">
        <div className="w-10 h-px bg-primary-accent animate-float" />
      </div>
    </section>
  );
}
