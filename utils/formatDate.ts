/**
 * Formats a date string or Date object into human-readable strings.
 */
export function formatDate(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return String(dateInput);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export function formatTime(timeInput: string | Date | undefined | null): string {
  if (!timeInput) return '';
  if (typeof timeInput === 'string' && (timeInput.includes('AM') || timeInput.includes('PM'))) {
    return timeInput;
  }
  const date = typeof timeInput === 'string' ? new Date(timeInput) : timeInput;
  if (isNaN(date.getTime())) return String(timeInput);

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;

  return `${hours}:${minutesStr} ${ampm}`;
}

export function formatDateTime(dateTimeInput: string | Date | undefined | null): string {
  if (!dateTimeInput) return '';
  return `${formatDate(dateTimeInput)} at ${formatTime(dateTimeInput)}`;
}

export default { formatDate, formatTime, formatDateTime };
