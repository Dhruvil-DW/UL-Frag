import dayjs from 'dayjs';

export function formatDate(dateStr) {
  return dayjs(dateStr).format("DD/MM/YYYY");
}

export function getInputDate(dateObj) {
  return dayjs(dateObj).format("YYYY-MM-DD");
}