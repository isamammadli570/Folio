export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** An Azerbaijani mobile or landline number, spaces and dashes allowed: +994 50 123 45 67. */
export const AZ_PHONE_PATTERN = /^\+994[\s-]?\d{2}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;

/** Supabase's default minimum; the project can raise it in its Auth settings. */
export const PASSWORD_MIN_LENGTH = 6;
