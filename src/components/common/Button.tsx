import React, { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'cream' | 'dark' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  let variantStyles = 'bg-[var(--color-primary)] text-white';

  if (variant === 'secondary') {
    variantStyles = 'bg-[var(--color-secondary)] text-white';
  } else if (variant === 'cream') {
    variantStyles = 'bg-[var(--color-background)] text-[var(--color-text-accent-dark)]';
  } else if (variant === 'dark') {
    variantStyles = 'bg-[var(--color-text-accent-dark)] text-white';
  } else if (variant === 'outline') {
    variantStyles = 'bg-white text-[var(--color-text-accent-dark)]';
  }

  let sizeStyles = 'px-5 py-2.5 text-base';
  if (size === 'sm') {
    sizeStyles = 'px-3.5 py-1.5 text-sm rounded-lg';
  } else if (size === 'lg') {
    sizeStyles = 'px-7 py-3.5 text-lg rounded-2xl';
  } else {
    sizeStyles = 'px-5 py-2.5 text-base rounded-xl';
  }

  const disabledStyles = disabled
    ? 'opacity-60 cursor-not-allowed shadow-none translate-x-0 translate-y-0'
    : 'cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_var(--color-text-accent-dark)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_var(--color-text-accent-dark)] shadow-[4px_4px_0px_var(--color-text-accent-dark)]';

  return (
    <button
      disabled={disabled}
      className={`neu-btn border-[2.5px] border-[var(--color-text-accent-dark)] font-extrabold tracking-tight transition-all duration-150 inline-flex items-center justify-center gap-2 select-none ${variantStyles} ${sizeStyles} ${disabledStyles} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
