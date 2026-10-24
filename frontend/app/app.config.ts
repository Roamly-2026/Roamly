// frontend/app/app.config.ts

export default defineAppConfig({
  // Global Nuxt UI component overrides
  ui: {
    button: {
      variants: {
        variant: BUTTON_VARIANTS,
      },
    },
    checkbox: CHECKBOX_CONFIG,
    card: CARD_CONFIG,
    input: INPUT_CONFIG,
    formField: FORM_FIELD_CONFIG,
    textarea: TEXTAREA_CONFIG,
    avatar: AVATAR_CONFIG,
    select: SELECT_CONFIG,
    dropdownMenu: DROPDOWN_MENU_CONFIG,
    wideDropdownMenu: WIDE_DROPDOWN_MENU_CONFIG,
    selectMenu: SELECT_MENU_CONFIG,
    modal: MODAL_CONFIG,
    tooltip: TOOLTIP_CONFIG,
  },

  // Structural & View-Specific Configurations
  layout: LAYOUT_CONFIG,
  typography: TYPOGRAPHY_CONFIG,
  footer: FOOTER_CONFIG,
  calendar: CALENDAR_CONFIG,
});