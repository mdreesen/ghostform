export type FieldRule = 'email' | 'phone' | 'name' | 'number' | 'none'

/** Which fields must be answered, and how each is checked. */
export const FIELD_RULES: Record<string, { required: boolean; rule: FieldRule }> = {
  // The email IS the lead — without it the realtor can't follow up and the
  // server rejects the submission outright.
  email: { required: true, rule: 'email' },
  name: { required: true, rule: 'name' },
  // Optional, but if they typed something it should be dialable.
  phone: { required: false, rule: 'phone' },
  age: { required: false, rule: 'number' },
  price: { required: false, rule: 'number' },
  sqft: { required: false, rule: 'number' },
  bedrooms: { required: false, rule: 'number' },
  bathrooms: { required: false, rule: 'number' },
  budget: { required: false, rule: 'number' }
}

/**
 * Practical email check.
 * Not RFC 5322 — that regex is enormous and still accepts addresses no mail
 * server would take. This catches the mistakes people actually make: missing @,
 * missing domain, trailing dot, spaces.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/

/**
 * Phone: count digits rather than matching a format, because people type
 * (406) 555-1234, 406.555.1234, and +1 406 555 1234 all in the same afternoon.
 * 10 digits covers US/Canada; up to 15 allows international without fuss.
 */
function digitCount(value: string): number {
  return (value.match(/\d/g) || []).length
}

export interface ValidationResult {
  valid: boolean
  message?: string
}

export function validateField(fieldId: string, raw: unknown): ValidationResult {
  const config = FIELD_RULES[fieldId]
  const value = (raw ?? '').toString().trim()

  // Unlisted fields are free-form and always fine.
  if (!config) return { valid: true }

  if (!value) {
    return config.required
      ? { valid: false, message: requiredMessage(fieldId) }
      : { valid: true }
  }

  switch (config.rule) {
    case 'email':
      return EMAIL_RE.test(value)
        ? { valid: true }
        : { valid: false, message: "That email doesn't look right — check for a typo." }

    case 'phone': {
      const digits = digitCount(value)
      if (digits === 0) {
        return { valid: false, message: 'Please enter a phone number, or leave it blank.' }
      }
      if (digits < 10) {
        return { valid: false, message: 'That looks a bit short — include the area code.' }
      }
      if (digits > 15) {
        return { valid: false, message: "That's more digits than a phone number has." }
      }
      return { valid: true }
    }

    case 'name':
      return value.length >= 2
        ? { valid: true }
        : { valid: false, message: 'Please enter your name.' }

    case 'number':
      return /^[\d,.\s$]+$/.test(value)
        ? { valid: true }
        : { valid: false, message: 'Please enter a number.' }

    default:
      return { valid: true }
  }
}

function requiredMessage(fieldId: string): string {
  if (fieldId === 'email') return "We need an email so we can get back to you."
  if (fieldId === 'name') return 'Please enter your name.'
  return 'This one is needed.'
}

/** True when a field must be answered before moving on. */
export function isRequired(fieldId: string): boolean {
  return FIELD_RULES[fieldId]?.required ?? false
}

/**
 * Correct input type + mobile keyboard for a field.
 * Every question was previously `type="text"`, which means a lead typing their
 * email on a phone gets the full alphabet keyboard with no @ key, and numbers
 * get letters. This is a small change with a real effect on completion.
 */
export function inputAttrs(fieldId: string, declaredType?: string) {
  switch (FIELD_RULES[fieldId]?.rule) {
    case 'email':
      return { type: 'email', inputmode: 'email', autocomplete: 'email', autocapitalize: 'off', spellcheck: false }
    case 'phone':
      return { type: 'tel', inputmode: 'tel', autocomplete: 'tel' }
    case 'number':
      return { type: declaredType === 'number' ? 'number' : 'text', inputmode: 'numeric' }
    case 'name':
      return { type: 'text', inputmode: 'text', autocomplete: 'name', autocapitalize: 'words' }
    default:
      return { type: declaredType || 'text' }
  }
}
