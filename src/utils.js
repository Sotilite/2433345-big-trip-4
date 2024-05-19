import dayjs from 'dayjs';
import { FilterType } from './const';

function getRandomArrayElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomCheckedOffers(offers) {
  return offers.map((offer) => {
    offer[2] = Math.floor(Math.random() * 2);
    return offer;
  });
}

function getTimeInDays(dateFrom, dateTo) {
  const days = dayjs(dateTo).diff(dayjs(dateFrom), 'days');
  return days !== 0 ? `${days}D` : '';
}

function getTimeInHours(dateFrom, dateTo) {
  const hours = dayjs(dateTo).diff(dayjs(dateFrom), 'hours') % 24;
  return hours !== 0 ? `${hours}H` : '';
}

function getTimeInMinutes(dateFrom, dateTo) {
  const minutes = dayjs(dateTo).diff(dayjs(dateFrom), 'minutes') % 60;
  return minutes !== 0 ? `${minutes}M` : '';
}

function getTripInfoTitle(cities) {
  if (cities.length > 3) {
    return `${cities[0]} &mdash; ... &mdash; ${cities[cities.length - 1]}`;
  } else {
    return cities.reduce((acc, city, index) => {
      if (index !== cities.length - 1) {
        acc += `${city} &mdash; `;
      } else {
        acc += `${city}`;
      }
      return acc;
    }, '');
  }
}

function getTripInfoStartDate(sortedPoints) {
  return dayjs(sortedPoints[0].dateFrom).format('MMM DD');
}

function getTripInfoEndDate(sortedPoints) {
  const startDate = sortedPoints[0].dateFrom;
  const endDate = sortedPoints[sortedPoints.length - 1].dateTo;
  if (dayjs(startDate).format('MMM') === dayjs(endDate).format('MMM')) {
    return dayjs(endDate).format('DD');
  } else {
    return dayjs(endDate).format('MMM DD');
  }
}

function sortPointDay(points) {
  return points.sort((firstPoint, secondPoint) => new Date(firstPoint.dateFrom) - new Date(secondPoint.dateFrom));
}

function sortPointTime(points) {
  return points.sort((firstPoint, secondPoint) =>
    dayjs(firstPoint.dateFrom).diff(dayjs(firstPoint.dateTo), 'minutes') -
    dayjs(secondPoint.dateFrom).diff(dayjs(secondPoint.dateTo), 'minutes'));
}

function sortPointPrice(points) {
  return points.sort((firstPoint, secondPoint) => secondPoint.price - firstPoint.price);
}

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

export {
  getRandomArrayElement,
  getRandomCheckedOffers,
  getTimeInDays,
  getTimeInHours,
  getTimeInMinutes,
  getTripInfoTitle,
  getTripInfoStartDate,
  getTripInfoEndDate,
  sortPointDay,
  sortPointTime,
  sortPointPrice,
  filter,
};
