export const COLLECTION_TIME_ZONE = 'Australia/Brisbane';

export const COLLECTION_TIME_SLOTS = Array.from({ length: 15 }, (_, index) => {
  const totalMinutes = 9 * 60 + index * 30;
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, '0');
  const minutes = (totalMinutes % 60).toString().padStart(2, '0');

  return `${hours}:${minutes}`;
});

function getDatePart(parts: Intl.DateTimeFormatPart[], type: string) {
  return parts.find((part) => part.type === type)?.value ?? '';
}

export function getBrisbaneDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-AU', {
    timeZone: COLLECTION_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);

  return `${getDatePart(parts, 'year')}-${getDatePart(parts, 'month')}-${getDatePart(parts, 'day')}`;
}

export function addCalendarDays(dateValue: string, days: number) {
  const [year, month, day] = dateValue.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);

  return [
    date.getUTCFullYear(),
    (date.getUTCMonth() + 1).toString().padStart(2, '0'),
    date.getUTCDate().toString().padStart(2, '0'),
  ].join('-');
}

export function isCollectionWeekday(dateValue: string) {
  const [year, month, day] = dateValue.split('-').map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();

  return weekday >= 1 && weekday <= 5;
}

export function getEarliestCollectionDate(
  leadTimeDays: number,
  now = new Date(),
) {
  let dateValue = addCalendarDays(
    getBrisbaneDate(now),
    Math.max(0, Math.ceil(leadTimeDays)),
  );

  while (!isCollectionWeekday(dateValue)) {
    dateValue = addCalendarDays(dateValue, 1);
  }

  return dateValue;
}

export function isCollectionTimeSlot(value: string) {
  return COLLECTION_TIME_SLOTS.includes(value);
}

export function formatCollectionDate(dateValue: string) {
  const [year, month, day] = dateValue.split('-').map(Number);

  return new Intl.DateTimeFormat('en-AU', {
    timeZone: COLLECTION_TIME_ZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}

export function formatCollectionTime(value: string) {
  const [hours, minutes] = value.split(':').map(Number);
  const period = hours >= 12 ? 'pm' : 'am';
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}
