import dayjs from 'dayjs';
import { FilterType } from '../const';

function isFuture(dateFrom) {
  const formatedDate = dayjs(dateFrom).format('YYYY/MM/DD');
  const currentDate = dayjs().format('YYYY/MM/DD');
  return dayjs(formatedDate).isAfter(currentDate);
}

function isPresent(dateFrom, dateTo) {
  const formatedDateFrom = dayjs(dateFrom).format('YYYY/MM/DD');
  const formatedDateTo = dayjs(dateTo).format('YYYY/MM/DD');
  const currentDate = dayjs().format('YYYY/MM/DD');
  return dayjs(formatedDateFrom).isSame(currentDate) || dayjs(formatedDateTo).isSame(currentDate)
         || (dayjs(formatedDateFrom).isBefore(currentDate) && dayjs(formatedDateTo).isAfter(currentDate));
}

function isPast(dateTo) {
  const formatedDate = dayjs(dateTo).format('YYYY/MM/DD');
  const currentDate = dayjs().format('YYYY/MM/DD');
  return dayjs(formatedDate).isBefore(currentDate);
}

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuture(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPresent(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isPast(point.dateTo)),
};

export { filter };
