import { useEffect, useRef, useState } from 'react';
import { getWhatsAppUrl } from '../lib/contact';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Inicio', href: '#hero' },
    { label: 'Portafolio', href: '#gallery' },
    { label: 'Proceso', href: '#craft' },
    { label: 'Contacto', href: '#contact' },
  ];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-[100] h-16 flex items-center justify-between px-8 transition-all duration-400 ${
        scrolled
          ? 'bg-dark/90 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <a href="#hero" onClick={(e) => handleClick(e, '#hero')} className="flex items-center">
        <img
          src={`${import.meta.env.BASE_URL}logo.png`}
          alt="PanelArt 3D"
          className="h-10 w-auto object-contain"
          style={{ filter: 'drop-shadow(0 0 8px rgba(200, 150, 62, 0.2))' }}
        />
      </a>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={(e) => handleClick(e, link.href)}
            className="font-body text-sm uppercase tracking-[0.1em] text-primary-light/80 hover:text-primary-accent transition-colors duration-300"
          >
            {link.label}
          </a>
        ))}
        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-xs uppercase tracking-[0.1em] text-primary-accent border border-primary-accent rounded-full px-5 py-2 hover:bg-primary-accent hover:text-dark transition-all duration-300"
        >
          Cotizar
        </a>
      </div>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        <span className={`block w-6 h-0.5 bg-primary-light transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`block w-6 h-0.5 bg-primary-light transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
        <span className={`block w-6 h-0.5 bg-primary-light transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-dark/95 backdrop-blur-xl md:hidden flex flex-col items-center gap-6 py-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="font-body text-sm uppercase tracking-[0.1em] text-primary-light/80 hover:text-primary-accent transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="font-body text-xs uppercase tracking-[0.1em] text-primary-accent border border-primary-accent rounded-full px-5 py-2"
          >
            Cotizar
          </a>
        </div>
      )}
    </nav>
  );
}
