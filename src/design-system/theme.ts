/**
 * Design system theme constants and configuration.
 * Neo-Brutalism + Glassmorphism
 */

export const THEME_COLORS = {
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  background: 'var(--color-background)',
  textDark: 'var(--color-text-accent-dark)',
} as const;

export const NEUBRUTALISM = {
  border:
    'border-[2.5px] border-[var(--color-text-accent-dark)]',

  borderThick:
    'border-[3px] border-[var(--color-text-accent-dark)]',

  shadow:
    'shadow-[4px_4px_0px_var(--color-text-accent-dark)]',

  shadowLg:
    'shadow-[6px_6px_0px_var(--color-text-accent-dark)]',

  shadowSm:
    'shadow-[2px_2px_0px_var(--color-text-accent-dark)]',

  interactive:
    'transition-all duration-150 ease-out active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_var(--color-text-accent-dark)] hover:-translate-y-[1px] hover:-translate-x-[1px] hover:shadow-[5px_5px_0px_var(--color-text-accent-dark)]',

  card:
    'bg-[var(--color-background)] border-[2.5px] border-[var(--color-text-accent-dark)] shadow-[4px_4px_0px_var(--color-text-accent-dark)] rounded-2xl',

  buttonPrimary:
    'bg-[var(--color-primary)] text-[var(--color-text-accent-dark)] font-bold border-[2.5px] border-[var(--color-text-accent-dark)] shadow-[4px_4px_0px_var(--color-text-accent-dark)] rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_var(--color-text-accent-dark)] active:translate-y-1 active:shadow-[1px_1px_0px_var(--color-text-accent-dark)]',

  buttonSecondary:
    'bg-[var(--color-secondary)] text-[var(--color-text-accent-dark)] font-bold border-[2.5px] border-[var(--color-text-accent-dark)] shadow-[4px_4px_0px_var(--color-text-accent-dark)] rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_var(--color-text-accent-dark)] active:translate-y-1 active:shadow-[1px_1px_0px_var(--color-text-accent-dark)]',
} as const;

export const GLASSMORPHISM = {
  navbar:
    'backdrop-blur-md bg-[var(--color-background)]/80 border-b border-[var(--color-primary)]/30 shadow-[0_8px_30px_rgba(20,20,30,0.08)]',

  floating:
    'backdrop-blur-lg bg-[var(--color-background)]/75 border border-[var(--color-primary)]/40 shadow-[0_10px_25px_rgba(20,20,30,0.12)] rounded-2xl',

  floatingPill:
    'backdrop-blur-md bg-[var(--color-background)]/85 border border-[var(--color-secondary)]/40 shadow-[0_4px_16px_rgba(20,20,30,0.1)] rounded-full',
} as const;