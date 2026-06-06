import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  getWhatsAppUrl,
} from "../lib/contact";

export default function FooterSection() {
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer
      className="relative w-full bg-dark z-[3]"
      style={{ padding: "6vh 0 4vh" }}
    >
      {/* Decorative Top Line */}
      <div className="w-full h-0.5 bg-primary-accent" />

      <div className="section-container">
        {/* Top Row */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 py-8">
          {/* Brand */}
          <div>
            <p className="font-display text-2xl text-primary-light tracking-wider mb-2">
              PANELART 3D
            </p>
            <p className="font-body text-xs uppercase tracking-[0.12em] text-primary-light/50">
              Paneles decorativos 3D en yeso — Cartagena de Indias, Colombia
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-3">
            {[
              { label: "Inicio", href: "#hero" },
              { label: "Portafolio", href: "#gallery" },
              { label: "Proceso", href: "#craft" },
              { label: "Contacto", href: "#contact" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="font-body text-sm uppercase tracking-[0.1em] text-primary-light/60 hover:text-primary-light transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-2">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body inline-flex items-center justify-center rounded-full border border-primary-accent px-4 py-2 text-sm text-primary-light hover:bg-primary-accent hover:text-dark transition-colors duration-300"
            >
              WhatsApp: {CONTACT_PHONE_DISPLAY}
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61590263687253&active_status=null&start_date[min]=null&start_date[max]=null"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body inline-flex items-center justify-center rounded-full border border-primary-accent px-4 py-2 text-sm text-primary-light hover:bg-primary-accent hover:text-dark transition-colors duration-300"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com/panelart3d"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body inline-flex items-center justify-center rounded-full border border-primary-accent px-4 py-2 text-sm text-primary-light hover:bg-primary-accent hover:text-dark transition-colors duration-300"
            >
              Instagram
            </a>
            <a
              href="mailto:hola@panelart3d.com"
              className="font-body text-sm text-primary-light/60 hover:text-primary-accent transition-colors duration-300"
            >
              hola@panelart3d.com
            </a>
          </div>
        </div>

        {/* Bottom Row */}
        <div
          className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6"
          style={{ borderTop: "1px solid rgba(200, 150, 62, 0.15)" }}
        >
          <p className="font-body text-xs uppercase tracking-[0.12em] text-primary-light/30">
            © 2025 PanelArt 3D. Todos los derechos reservados.
          </p>
          <p className="font-body text-xs uppercase tracking-[0.12em] text-primary-light/30">
            Cartagena de Indias, Colombia
          </p>
        </div>
      </div>
    </footer>
  );
}
