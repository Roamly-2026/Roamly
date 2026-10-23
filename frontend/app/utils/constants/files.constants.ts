import { UI_TEXT } from '~/locales/en';
// frontend/app/utils/constants/files.constants.ts
export const GROUP_DOCUMENT_TYPES = [
  { label: UI_TEXT.documentTypes.ticket, value: 'TICKET' },
  { label: UI_TEXT.documentTypes.bookingConfirmation, value: 'BOOKING_CONFIRMATION' },
  { label: UI_TEXT.documentTypes.hotelVoucher, value: 'HOTEL_VOUCHER' },
  { label: UI_TEXT.documentTypes.guestRegistrationCard, value: 'GUEST_REGISTRATION_CARD' },
  { label: UI_TEXT.documentTypes.other, value: 'OTHER' },
];

export const PRIVATE_DOCUMENT_TYPES = [
  { label: UI_TEXT.documentTypes.personalId, value: 'ID' },
  { label: UI_TEXT.documentTypes.passport, value: 'PASSPORT' },
  { label: UI_TEXT.documentTypes.drivingLicense, value: 'DRIVING_LICENSE' },
  { label: UI_TEXT.documentTypes.other, value: 'OTHER' },
];
