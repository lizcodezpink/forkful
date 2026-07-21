/**
 * Format a SQLite `datetime('now')` UTC timestamp (e.g. "2026-07-21 20:30:00")
 * into a readable date. The stored value is UTC without a timezone marker, so
 * we append `Z` before parsing.
 */
export function formatDate(value: string): string {
  const iso = value.includes('T') ? value : `${value.replace(' ', 'T')}Z`;
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
