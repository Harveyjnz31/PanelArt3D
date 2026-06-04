import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const galleryItems = [
  { col: 1, src: '/images/gallery-1.jpg', type: 'RESIDENCIAL', name: 'Sala Principal — Casa del Sol' },
  { col: 1, src: '/images/gallery-2.jpg', type: 'HOTELERÍA', name: 'Lobby — Hotel Aurora' },
  { col: 1, src: '/images/gallery-3.jpg', type: 'RESTAURANTE', name: 'El Jardín Secreto' },
  { col: 2, src: '/images/gallery-4.jpg', type: 'COMERCIAL', name: 'Oficinas Torres del Parque' },
  { col: 2, src: '/images/gallery-5.jpg', type: 'RESIDENCIAL', name: 'Suite Principal — Villa Serena' },
  { col: 2, src: '/images/gallery-6.jpg', type: 'COMERCIAL', name: 'Boutique Estilo 3D' },
  { col: 3, src: '/images/gallery-7.jpg', type: 'RESIDENCIAL', name: 'Spa — Residencial Oasis' },
  { col: 3, src: '/images/gallery-8.jpg', type: 'RESIDENCIAL', name: 'Comedor — Casa Colonial' },
  { col: 3, src: '/images/gallery-9.jpg', type: 'WELLNESS', name: 'Centro Bienestar Zen' },
];

const startWidths = ['20%', '25%', '18%', '28%', '22%', '30%', '20%', '26%', '19%'];

export default function GallerySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    const items = itemRefs.current.filter(Boolean) as HTMLDivElement[];
    const images = imageRefs.current.filter(Boolean) as HTMLImageElement[];

    const triggers: ScrollTrigger[] = [];

    items.forEach((item, i) => {
      const image = images[i];
      if (!image) return;

      const st1 = ScrollTrigger.create({
        trigger: item,
        start: 'top 80%',
        end: 'top 20%',
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const startW = parseFloat(startWidths[i]) / 100;
          const currentW = startW + (1 - startW) * progress;
          gsap.set(item, { width: `${currentW * 100}%` });
          gsap.set(image, { scale: 2.2 - 1.2 * progress });
        },
      });
      triggers.push(st1);

      const st2 = ScrollTrigger.create({
        trigger: item,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          gsap.set(image, { yPercent: -15 * self.progress });
        },
      });
      triggers.push(st2);
    });

    return () => {
      triggers.forEach((st) => st.kill());
    };
  }, []);

  const columns = [1, 2, 3];

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative w-full z-[3]"
      style={{ background: '#e8d5b5' }}
    >
      {/* Dark Band on Left */}
      <div
        className="absolute left-0 top-0 h-full bg-dark hidden lg:block"
        style={{ width: '35%' }}
      />

      {/* Section Title */}
      <div className="relative z-10 lg:pl-12 pt-[8vh] pb-[4vh]">
        <p className="font-body text-xs uppercase tracking-[0.12em] text-primary-accent mb-4">
          PORTAFOLIO
        </p>
        <h2
          className="font-display text-primary-light text-glow"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.15 }}
        >
          DISEÑOS QUE REVELAN{' '}
          <span className="text-primary-accent">PROFUNDIDAD</span>
        </h2>
      </div>

      {/* Gallery Grid */}
      <div className="relative z-10 section-container pb-[12vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {columns.map((col) => (
            <div key={col} className="flex flex-col gap-6">
              {galleryItems
                .filter((item) => item.col === col)
                .map((item) => {
                  const globalIndex = galleryItems.findIndex(
                    (gi) => gi.src === item.src
                  );
                  return (
                    <div
                      key={item.src}
                      ref={(el) => { itemRefs.current[globalIndex] = el; }}
                      className="relative overflow-hidden cursor-pointer group mx-auto"
                      style={{ width: startWidths[globalIndex], aspectRatio: '4/5' }}
                    >
                      <img
                        ref={(el) => { imageRefs.current[globalIndex] = el; }}
                        src={item.src}
                        alt={item.name}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover will-change-transform transition-transform duration-600 ease-out group-hover:scale-105"
                      />
                      {/* Overlay Label */}
                      <div className="absolute bottom-0 left-0 right-0 bg-dark/85 p-4 transition-transform duration-300 group-hover:-translate-y-1">
                        <p className="font-body text-xs uppercase tracking-[0.12em] text-primary-accent mb-1">
                          {item.type}
                        </p>
                        <p className="font-body text-sm text-primary-light font-medium">
                          {item.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
