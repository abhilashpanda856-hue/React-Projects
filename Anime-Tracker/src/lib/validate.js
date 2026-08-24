/**
 * Client-side validation helpers.
 * All functions return { valid: boolean, error?: string }.
 * Use before any Supabase mutation to prevent malformed payloads.
 */

// RFC 5322 compliant email regex (simplified but practical)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// Password policy: min 8, 1 upper, 1 lower, 1 digit, 1 special
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

const VALID_STATUSES = ['Watching', 'Completed', 'Plan to Watch', 'Dropped'];
const MAX_TITLE_LENGTH = 255;
const MAX_IMAGE_URL_LENGTH = 500;

export function validateEmail(email) {
  if (!email || typeof email !== 'string') return { valid: false, error: 'Email is required.' };
  const trimmed = email.trim();
  if (!EMAIL_REGEX.test(trimmed)) return { valid: false, error: 'Invalid email format.' };
  if (trimmed.length > 254) return { valid: false, error: 'Email too long.' };
  return { valid: true };
}

export function validatePassword(password) {
  if (!password || typeof password !== 'string') return { valid: false, error: 'Password is required.' };
  if (!PASSWORD_REGEX.test(password)) {
    return { valid: false, error: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character.' };
  }
  return { valid: true };
}

export function validateAnimePayload(payload) {
  if (!payload || typeof payload !== 'object') return { valid: false, error: 'Invalid anime data.' };
  
  // Required fields
  if (!Number.isInteger(payload.mal_id) || payload.mal_id <= 0) {
    return { valid: false, error: 'Invalid anime ID.' };
  }
  if (!payload.title || typeof payload.title !== 'string' || payload.title.trim().length === 0) {
    return { valid: false, error: 'Title is required.' };
  }
  if (payload.title.length > MAX_TITLE_LENGTH) {
    return { valid: false, error: `Title too long (max ${MAX_TITLE_LENGTH} chars).` };
  }
  
  // Optional fields with validation
  if (payload.image !== undefined) {
    if (typeof payload.image !== 'string' || payload.image.length > MAX_IMAGE_URL_LENGTH) {
      return { valid: false, error: 'Invalid image URL.' };
    }
    // Basic URL format check
    try { new URL(payload.image); } catch { return { valid: false, error: 'Invalid image URL format.' }; }
  }
  
  if (payload.episodes !== undefined && payload.episodes !== null) {
    if (!Number.isInteger(payload.episodes) || payload.episodes < 0) {
      return { valid: false, error: 'Episodes must be a non-negative integer.' };
    }
  }
  
  return { valid: true };
}

export function validateRating(rating) {
  if (rating === 0 || rating === '0') return { valid: true }; // "Unrated" is allowed
  const num = Number(rating);
  if (!Number.isInteger(num) || num < 1 || num > 10) {
    return { valid: false, error: 'Rating must be an integer between 1 and 10.' };
  }
  return { valid: true };
}

export function validateStatus(status) {
  if (!VALID_STATUSES.includes(status)) {
    return { valid: false, error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}.` };
  }
  return { valid: true };
}

export function validateEpisodes(watched, total) {
  if (!Number.isInteger(watched) || watched < 0) {
    return { valid: false, error: 'Watched episodes must be a non-negative integer.' };
  }
  if (total !== undefined && total !== null) {
    if (!Number.isInteger(total) || total < 0) {
      return { valid: false, error: 'Total episodes must be a non-negative integer.' };
    }
    if (watched > total) {
      return { valid: false, error: 'Watched episodes cannot exceed total episodes.' };
    }
  }
  return { valid: true };
}

export function validateRewatches(rewatches) {
  if (!Number.isInteger(rewatches) || rewatches < 0) {
    return { valid: false, error: 'Rewatches must be a non-negative integer.' };
  }
  return { valid: true };
}