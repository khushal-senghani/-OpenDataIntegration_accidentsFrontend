/** Thousands-separated integer, "—" for null/undefined. */
export function formatNumber(value) {
  if (value === null || value === undefined) return '—';
  return Number(value).toLocaleString('en-US');
}

/** Category code (1/2/3) -> human label. */
export function categoryLabel(category) {
  return { 1: 'Fatal', 2: 'Serious injury', 3: 'Light injury' }[category] || 'Unknown';
}

/** Weekday code (1=Sunday..7=Saturday, German official numbering) -> label. */
export function weekdayLabel(weekday) {
  const names = ['', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return names[weekday] || 'Unknown';
}

/** Marker colour by accident category, used consistently on the map and charts. */
export function categoryColor(category) {
  return { 1: '#ff4d4d', 2: '#ffb74d', 3: '#4ade80' }[category] || '#8b92a5';
}
