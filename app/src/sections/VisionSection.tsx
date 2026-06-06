import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function VisionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const text = textRef.current;
    if (!section || !image || !text) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 75%",
        toggleActions: "play none none none",
      },
    });

    tl.fromTo(
      image,
      { opacity: 0, x: -60 },
      { opacity: 1, x: 0, duration: 1, ease: "power2.out" },
    ).fromTo(
      text.children,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" },
      0.3,
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-dark z-[3]"
      style={{ padding: "20vh 0" }}
    >
      {/* Section Header */}
      <div className="section-container text-center mb-[10vh]">
        <p className="font-body text-xs uppercase tracking-[0.12em] text-primary-accent mb-4">
          NUESTRO COMPROMISO
        </p>
        <h2
          className="font-display text-primary-light text-glow"
          style={{ fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: 1.15 }}
        >
          MÁS QUE PANELES, CREAMOS TEXTURAS VIVAS
        </h2>
      </div>

      {/* Two Column Layout */}
      <div className="section-container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Column — Image */}
        <div ref={imageRef} className="opacity-0">
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={`${import.meta.env.BASE_URL}images/vision.jpg`}
              alt="Artesano trabajando paneles 3D en yeso"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Right Column — Text */}
        <div ref={textRef}>
          <h3
            className="font-accent italic text-warm-light leading-snug"
            style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)" }}
          >
            Materiales que Respiran
          </h3>

          <p
            className="font-body mt-6 leading-relaxed"
            style={{ color: "rgba(245, 245, 245, 0.8)", lineHeight: 1.8 }}
          >
            Cada panel comienza como una visión. Trabajamos con yeso de alta
            calidad, moldeado a mano para proyectos en Cartagena de Indias. El
            yeso no es solo un material — es un lienzo tridimensional que
            captura la luz, crea sombras danzantes y da vida a las paredes.
            Nuestros paneles son resistentes al fuego, fáciles de pintar y duran
            décadas.
          </p>

          <p
            className="font-body mt-6 leading-relaxed"
            style={{ color: "rgba(245, 245, 245, 0.8)", lineHeight: 1.8 }}
          >
            Desde patrones geométricos audaces hasta ondas orgánicas fluidas,
            cada diseño está pensado para transformar espacios planos en
            experiencias visuales. No importa si es una pared de TV, un cabecero
            de cama o la recepción de un hotel — nuestros paneles convierten lo
            ordinario en extraordinario.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-12">
            <div>
              <p
                className="font-body text-primary-accent font-medium"
                style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)" }}
              >
                200+
              </p>
              <p className="font-body text-xs uppercase tracking-[0.12em] text-primary-light/60 mt-1">
                Proyectos Completados
              </p>
            </div>
            <div className="w-px h-16 bg-subtle-line" />
            <div>
              <p
                className="font-body text-primary-accent font-medium"
                style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)" }}
              >
                10+
              </p>
              <p className="font-body text-xs uppercase tracking-[0.12em] text-primary-light/60 mt-1">
                Años de Experiencia
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
