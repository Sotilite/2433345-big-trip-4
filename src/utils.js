import dayjs from 'dayjs';

function getRandomArrayElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getTimeInDays(startTime, endTime) {
  const days = dayjs(endTime).diff(dayjs(startTime), 'days');
  return days !== 0 ? `${days}D` : '';
}

function getTimeInHours(startTime, endTime) {
  const hours = dayjs(endTime).diff(dayjs(startTime), 'hours') % 24;
  return hours !== 0 ? `${hours}H` : '';
}

function getTimeInMinutes(startTime, endTime) {
  const minutes = dayjs(endTime).diff(dayjs(startTime), 'minutes') % 60;
  return minutes !== 0 ? `${minutes}M` : '';
}

function getTripInfoTitle(cities) {
  return cities.reduce((acc, city, index) => {
    if (index !== cities.length - 1) {
      acc += `${city} &mdash; `;
    } else {
      acc += `${city}`;
    }
    return acc;
  }, '');
}

function getTripInfoStartDate(sortedPoints) {
  return dayjs(sortedPoints[0].date.startTime).format('MMM DD');
}

function getTripInfoEndDate(sortedPoints) {
  const startDate = sortedPoints[0].date.startTime;
  const endDate = sortedPoints[sortedPoints.length - 1].date.endTime;
  if (dayjs(startDate).format('MMM') === dayjs(endDate).format('MMM')) {
    return dayjs(endDate).format('DD');
  } else {
    return dayjs(endDate).format('MMM DD');
  }
}

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

function sortPointDay(points) {
  return points.sort((firstPoint, secondPoint) => new Date(firstPoint.date.startTime) - new Date(secondPoint.date.startTime));
}

function sortPointTime(points) {
  return points.sort((firstPoint, secondPoint) =>
    dayjs(firstPoint.date.startTime).diff(dayjs(firstPoint.date.endTime), 'minutes') -
    dayjs(secondPoint.date.startTime).diff(dayjs(secondPoint.date.endTime), 'minutes'));
}

function sortPointPrice(points) {
  return points.sort((firstPoint, secondPoint) => secondPoint.price - firstPoint.price);
}

export {
  getRandomArrayElement,
  getTimeInDays,
  getTimeInHours,
  getTimeInMinutes,
  getTripInfoTitle,
  getTripInfoStartDate,
  getTripInfoEndDate,
  updateItem,
  sortPointDay,
  sortPointTime,
  sortPointPrice,
};
