/**
 * Centralized error sanitization for production-safe error messages.
 * Never leaks database schema, constraint names, or internal details to the client.
 */

export function sanitizeError(err) {
  // Supabase/Postgres error codes we handle explicitly
  if (err?.code === '23505') return 'This item already exists in your list.';
  if (err?.code === '23503') return 'Referenced record not found.';
  if (err?.code === '42501') return 'Permission denied.';
  if (err?.code === '22001') return 'Input value too long.';
  if (err?.code === '22003') return 'Numeric value out of range.';
  if (err?.code === '23514') return 'Value violates a check constraint.';
  if (err?.code === 'PGRST116') return 'No rows found.';
  if (err?.code === 'PGRST204') return 'Invalid API request.';

  // Network / auth errors
  if (err?.message?.includes('JWT')) return 'Session expired. Please log in again.';
  if (err?.message?.includes('network') || err?.message?.includes('fetch')) return 'Network error. Please check your connection.';

  // Generic fallback — never expose the raw error
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Logs a minimal, non-sensitive error record for debugging.
 * Safe to call in catch blocks before showing user-facing message.
 */
export function logError(context, err) {
  // Only log safe, non-sensitive fields
  const safe = {
    context,
    code: err?.code,
    hint: err?.hint,
    // intentionally omit: message, details, schema, table, column, constraint
  };
  console.error(`[${context}]`, safe);
}