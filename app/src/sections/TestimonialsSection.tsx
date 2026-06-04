import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote:
      'Los paneles de PanelArt transformaron completamente nuestra sala. El patrón de ondas crea un efecto hipnótico cuando la luz del atardecer entra por la ventana. Todos los visitantes preguntan quién los hizo.',
    name: 'María Elena Vásquez',
    role: 'Residencial — Casa del Sol, Cartagena',
  },
  {
    quote:
      'Como arquitecto, valoro la calidad del acabado. Los paneles de yeso de PanelArt son superiores a las opciones importadas. La instalación fue impecable y el resultado habla por sí solo.',
    name: 'Carlos Mendoza',
    role: 'Arquitecto — Estudio Mendoza & Asocs.',
  },
  {
    quote:
      'Instalamos paneles en la recepción de nuestro hotel y los huéspedes no paran de tomar fotos. El patrón geométrico dorado sobre el yeso blanco crea una atmósfera de lujo sutil.',
    name: 'Anabella Ferreira',
    role: 'Directora — Hotel Casa Colonial',
  },
];

export default function TestimonialsSection() {
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
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' }
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-dark z-[3]"
      style={{ padding: '16vh 0' }}
    >
      {/* Section Header */}
      <div className="section-container text-center mb-[8vh]">
        <p className="font-body text-xs uppercase tracking-[0.12em] text-primary-accent mb-4">
          TESTIMONIOS
        </p>
        <h2
          className="font-display text-primary-light text-glow"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.15 }}
        >
          LO QUE DICEN NUESTROS CLIENTES
        </h2>
      </div>

      {/* Testimonial Grid */}
      <div className="section-container grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, i) => (
          <div
            key={i}
            ref={(el) => { cardsRef.current[i] = el; }}
            className="opacity-0"
          >
            <p
              className="font-accent italic text-warm-light leading-relaxed"
              style={{ fontSize: '1.25rem', lineHeight: 1.6 }}
            >
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="w-10 h-px bg-primary-accent my-6" />
            <p className="font-body text-primary-light font-medium">{t.name}</p>
            <p className="font-body text-xs uppercase tracking-[0.12em] text-primary-light/50 mt-1">
              {t.role}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
