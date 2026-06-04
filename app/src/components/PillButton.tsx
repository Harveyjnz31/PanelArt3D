interface PillButtonProps {
  children: React.ReactNode;
  invert?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
  href?: string;
  target?: string;
  rel?: string;
}

export default function PillButton({
  children,
  invert = false,
  onClick,
  className = '',
  type = 'button',
  href,
  target,
  rel,
}: PillButtonProps) {
  const baseClasses = 'inline-block rounded-full font-body text-sm uppercase tracking-[0.1em] px-10 py-3.5 border border-primary-accent transition-all duration-300 ease-out cursor-pointer';
  const normalClasses = 'bg-transparent text-primary-accent hover:bg-primary-accent hover:text-dark';
  const invertClasses = 'bg-primary-accent text-dark hover:bg-transparent hover:text-primary-accent';
  const classes = `${baseClasses} ${invert ? invertClasses : normalClasses} ${className}`;

  if (href) {
    return (
      <a href={href} target={target} rel={rel} onClick={onClick} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
    >
      {children}
    </button>
  );
}
