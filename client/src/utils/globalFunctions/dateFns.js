import dayjs from 'dayjs';

export function formatDate(dateStr) {
  return dayjs(dateStr).format("DD/MM/YYYY");
}