//frontend/app/utils/styles/colors.ts

export const COLOR_TOKENS = {
  // Surfaces
  surface: {
    page: 'bg-surface-page text-content-primary',
    card: 'bg-surface-card border-line-default',
    cardInteractive: 'bg-surface-card hover:bg-surface-card-hover border-line-default',
    modal: 'bg-surface-modal border-line-default',
    subtle: 'bg-surface-subtle',
    overlay: 'bg-surface-overlay',
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

  // Texts
  text: {
    primary: 'text-content-primary',
    secondary: 'text-content-secondary',
    muted: 'text-content-muted',
    inverse: 'text-content-inverse',
    brand: 'text-content-brand',
  },

  // Input fields
  input: {
    base: 'bg-field-bg border-field-border text-content-primary placeholder:text-field-placeholder focus:border-field-focus disabled:bg-field-disabled disabled:text-content-muted',
    error: 'bg-status-error-bg border-status-error-border text-status-error-text focus:border-status-error',
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
  },
} as const;