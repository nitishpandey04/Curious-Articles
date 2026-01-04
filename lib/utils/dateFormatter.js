// Centralized date/time formatting utilities

const dateFmt = new Intl.DateTimeFormat('en-IN', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const timeFmt = new Intl.DateTimeFormat('en-IN', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

export function formatDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  return dateFmt.format(d);
}

export function formatTime(date) {
  const d = date instanceof Date ? date : new Date(date);
  return timeFmt.format(d);
}

export function formatDateTime(date) {
  return `${formatDate(date)} at ${formatTime(date)}`;
}
