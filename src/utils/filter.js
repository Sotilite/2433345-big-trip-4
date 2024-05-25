import dayjs from 'dayjs';
import { FilterType } from '../const';

function isFuture(dateFrom) {
  const formatedDate = dayjs(dateFrom).format('YYYY/MM/DD');
  const currentDate = dayjs().format('YYYY/MM/DD');
  return dayjs(formatedDate).isAfter(currentDate);
}

function isPresent(dateFrom) {
  const formatedDate = dayjs(dateFrom).format('YYYY/MM/DD');
  const currentDate = dayjs().format('YYYY/MM/DD');
  return dayjs(formatedDate).isSame(currentDate);
}

function isPast(dateFrom) {
  const formatedDate = dayjs(dateFrom).format('YYYY/MM/DD');
  const currentDate = dayjs().format('YYYY/MM/DD');
  return dayjs(formatedDate).isBefore(currentDate);
}

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuture(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPresent(point.dateFrom)),
  [FilterType.PAST]: (points) => points.filter((point) => isPast(point.dateFrom)),
};

export { filter };
