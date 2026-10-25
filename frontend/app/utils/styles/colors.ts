// frontend/app/utils/styles/colors.ts

export const COLOR_TOKENS = {
  // Surfaces
  surface: {
    page: 'bg-surface-page text-content-primary',
    card: 'bg-surface-card border-line-default',
    cardInteractive: 'bg-surface-card hover:bg-surface-card-hover border-line-default',
    modal: 'bg-surface-modal border-line-default',
    subtle: 'bg-surface-subtle',
    overlay: 'bg-surface-overlay',
    brandTint: 'bg-btn-primary/20',
    brandTintSubtle: 'bg-btn-primary/10',
  },

  // Button color schemes
  button: {
    primary:
      'bg-btn-primary hover:bg-btn-primary-hover active:bg-btn-primary-active text-btn-primary-text disabled:bg-btn-disabled disabled:text-btn-disabled-text',
    secondary:
      'bg-btn-secondary hover:bg-btn-secondary-hover active:bg-btn-secondary-active text-btn-secondary-text disabled:bg-btn-disabled disabled:text-btn-disabled-text',
    tertiary:
      'bg-btn-tertiary hover:bg-btn-tertiary-hover active:bg-btn-tertiary-active text-btn-tertiary-text disabled:bg-btn-disabled disabled:text-btn-disabled-text',
    danger:
      'bg-btn-danger hover:bg-btn-danger-hover active:bg-btn-danger-active text-btn-danger-text disabled:bg-btn-disabled disabled:text-btn-disabled-text',
  },

  // Texts (including semantic opacity steps)
  text: {
    primary: 'text-content-primary',
    primaryStrong: 'text-content-primary/90',
    primarySoft: 'text-content-primary/80',
    primaryMuted: 'text-content-primary/70',
    primarySubtle: 'text-content-primary/60',
    primaryFaint: 'text-content-primary/50',
    secondary: 'text-content-secondary',
    muted: 'text-content-muted',
    inverse: 'text-content-inverse',
    brand: 'text-content-brand',
    brandAccent: 'text-btn-primary',
    brandHover: 'text-btn-primary-hover',
  },

  // Input fields
  input: {
    base: 'bg-field-bg border-field-border text-content-primary placeholder:text-field-placeholder focus:border-field-focus disabled:bg-field-disabled disabled:text-content-muted',
    error:
      'bg-status-error-bg border-status-error-border text-status-error-text focus:border-status-error',
  },

  // Borders
  border: {
    default: 'border-line-default',
    strong: 'border-line-strong',
    focus: 'border-line-focus',
  },

  // Status
  status: {
    success: 'text-status-success',
    error: 'text-status-error',
    errorBox: 'bg-status-error-bg border-status-error-border text-status-error-text',
    errorBadge: 'bg-status-error/20 text-status-error',
  },
} as const;
