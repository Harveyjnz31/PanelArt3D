import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PillButton from '../components/PillButton';
import { getWhatsAppUrl } from '../lib/contact';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    title: 'Diseño Personalizado',
    description:
      'Eliges el patrón, las dimensiones y el acabado. Nuestro equipo te asesora para encontrar el diseño perfecto para tu espacio — desde geométricos modernos hasta orgánicos naturales.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#c8963e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="24" r="20" />
        <path d="M24 4v40M4 24h40" />
        <path d="M24 14l6 10h-12l6-10z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Fabricación Artesanal',
    description:
      'Cada panel se moldea a mano en nuestro taller con yeso de grado constructivo. Control de calidad en cada pieza: espesor uniforme, bordes limpios y detalles nítidos que garantizan un acabado profesional.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#c8963e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="20" width="32" height="20" rx="2" />
        <path d="M16 20V14a8 8 0 0116 0v6" />
        <path d="M20 32h8" />
        <circle cx="24" cy="12" r="2" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Instalación Profesional',
    description:
      'Nuestro equipo de instaladores certificados monta cada panel con precisión milimétrica. Acabado perfecto, juntas invisibles y limpieza total. Tu espacio transformado en horas, no en días.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="#c8963e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="8" width="36" height="28" rx="2" />
        <path d="M6 20h36" />
        <path d="M20 36v4M28 36v4" />
        <path d="M16 28h16" />
      </svg>
    ),
  },
];

export default function CraftSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length === 0) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    tl.fromTo(
      cards,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out' }
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="craft"
      ref={sectionRef}
      className="relative w-full z-[3]"
      style={{ background: '#e8d5b5', padding: '16vh 0' }}
    >
      {/* Section Header */}
      <div className="section-container text-center mb-[8vh]">
        <p className="font-body text-xs uppercase tracking-[0.12em] text-text-muted mb-4">
          NUESTRO PROCESO
        </p>
        <h2
          className="font-display text-dark"
          style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 1.15 }}
        >
          DEL MOLDE A TU PARED
        </h2>
      </div>

      {/* Process Steps */}
      <div className="section-container grid grid-cols-1 md:grid-cols-3 gap-12">
        {steps.map((step, i) => (
          <div
            key={step.number}
            ref={(el) => { cardsRef.current[i] = el; }}
            className="opacity-0"
          >
            <div className="mb-6">{step.icon}</div>
            <p
              className="font-body font-light mb-3"
              style={{ fontSize: '4rem', color: 'rgba(10, 10, 10, 0.1)', lineHeight: 1 }}
            >
              {step.number}
            </p>
            <h3 className="font-body text-xl font-semibold text-dark mb-4">
              {step.title}
            </h3>
            <p className="font-body text-text-muted leading-relaxed" style={{ lineHeight: 1.7 }}>
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="section-container text-center mt-16">
        <PillButton
          invert
          href={getWhatsAppUrl('Hola PanelArt 3D, quiero solicitar una cotización gratis para un proyecto en Cartagena de Indias.')}
          target="_blank"
          rel="noopener noreferrer"
        >
          Solicita una Cotización Gratis
        </PillButton>
      </div>
    </section>
  );
}
