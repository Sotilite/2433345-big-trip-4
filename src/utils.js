import dayjs from 'dayjs';

function getRandomArrayElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getTimeInHours(startTime, endTime) {
  const hours = dayjs(endTime).diff(dayjs(startTime), 'hours');
  return hours !== 0 ? `${hours} H` : '';
}

function getTimeInMinutes(startTime, endTime) {
  const minutes = dayjs(endTime).diff(dayjs(startTime), 'minutes') % 60;
  return minutes !== 0 ? `${minutes} M` : '';
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

export { getRandomArrayElement, getTimeInHours, getTimeInMinutes, getTripInfoTitle, getTripInfoStartDate, getTripInfoEndDate, updateItem };
