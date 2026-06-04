import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CONTACT_PHONE_DISPLAY, getWhatsAppUrl } from '../lib/contact';

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    if (!section || !left || !right) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    tl.fromTo(left, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' })
      .fromTo(right, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }, 0.2);

    return () => {
      tl.kill();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const message = [
      'Hola PanelArt 3D, quiero cotizar un proyecto en Cartagena de Indias.',
      `Nombre: ${data.get('name') || ''}`,
      `Email: ${data.get('email') || ''}`,
      `Teléfono: ${data.get('phone') || ''}`,
      `Tipo de proyecto: ${data.get('projectType') || ''}`,
      `Mensaje: ${data.get('message') || ''}`,
    ].join('\n');

    window.open(getWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full z-[3]"
      style={{ background: '#e8d5b5', padding: '16vh 0' }}
    >
      <div className="section-container grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-16">
        {/* Left Column */}
        <div ref={leftRef} className="opacity-0">
          <p className="font-body text-xs uppercase tracking-[0.12em] text-primary-accent mb-4">
            CONTÁCTANOS
          </p>
          <h2
            className="font-display text-dark"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.15 }}
          >
            LISTO PARA TRANSFORMAR TU ESPACIO?
          </h2>
          <p className="font-body text-text-muted mt-6 leading-relaxed" style={{ lineHeight: 1.7 }}>
            Cuéntanos sobre tu proyecto. Te asesoramos gratis y te enviamos una cotización sin compromiso. Atendemos proyectos residenciales, comerciales y hoteleros en Cartagena de Indias, Colombia.
          </p>
          <p className="font-body text-dark mt-4 font-semibold">
            WhatsApp: {CONTACT_PHONE_DISPLAY}
          </p>
        </div>

        {/* Right Column — Form */}
        <div ref={rightRef} className="opacity-0">
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <div className="w-16 h-16 rounded-full bg-primary-accent/20 flex items-center justify-center mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c8963e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="font-body text-xl font-semibold text-dark mb-2">¡Mensaje Enviado!</h3>
              <p className="font-body text-text-muted text-center">
                Tu mensaje se abrió en WhatsApp para enviarlo directamente.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <input
                type="text"
                name="name"
                placeholder="Nombre"
                required
                className="bg-transparent border-0 border-b border-dark/20 py-4 font-body text-dark placeholder:text-text-muted/60 focus:border-primary-accent focus:outline-none transition-colors duration-300"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="bg-transparent border-0 border-b border-dark/20 py-4 font-body text-dark placeholder:text-text-muted/60 focus:border-primary-accent focus:outline-none transition-colors duration-300"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Teléfono"
                className="bg-transparent border-0 border-b border-dark/20 py-4 font-body text-dark placeholder:text-text-muted/60 focus:border-primary-accent focus:outline-none transition-colors duration-300"
              />
              <select
                name="projectType"
                required
                defaultValue=""
                className="bg-transparent border-0 border-b border-dark/20 py-4 font-body text-dark focus:border-primary-accent focus:outline-none transition-colors duration-300 appearance-none cursor-pointer"
              >
                <option value="" disabled className="text-text-muted">
                  Tipo de Proyecto
                </option>
                <option value="residencial">Residencial</option>
                <option value="comercial">Comercial</option>
                <option value="hotelero">Hotelero</option>
                <option value="otro">Otro</option>
              </select>
              <textarea
                name="message"
                placeholder="Cuéntanos sobre tu proyecto..."
                rows={3}
                className="bg-transparent border-0 border-b border-dark/20 py-4 font-body text-dark placeholder:text-text-muted/60 focus:border-primary-accent focus:outline-none transition-colors duration-300 resize-none"
              />
              <button
                type="submit"
                className="w-full bg-dark text-primary-light font-body text-sm uppercase tracking-[0.1em] py-4 border-0 hover:bg-primary-accent hover:text-dark transition-all duration-300 cursor-pointer"
              >
                Enviar por WhatsApp
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
