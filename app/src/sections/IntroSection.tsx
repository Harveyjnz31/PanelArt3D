import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function IntroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    const text = textRef.current;
    if (!section || !line || !text) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    tl.fromTo(line, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.6, ease: 'power2.out' })
      .fromTo(text, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0.2);

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-dark z-[2]"
      style={{ padding: '20vh 0' }}
    >
      <div className="section-container flex flex-col items-center text-center">
        <div
          ref={lineRef}
          className="w-[60px] h-px bg-subtle-line mb-8 origin-center"
        />
        <p
          ref={textRef}
          className="font-accent italic text-warm-light max-w-[900px] leading-relaxed opacity-0"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 500 }}
        >
          Nuestros paneles no decoran paredes. Las transforman en superficies tridimensionales que juegan con la luz, crean profundidad y convierten cualquier espacio en una experiencia visual.
        </p>
      </div>
    </section>
  );
}
