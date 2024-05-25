import dayjs from 'dayjs';

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

export {
  getRandomArrayElement,
  getRandomCheckedOffers,
  getTimeInDays,
  getTimeInHours,
  getTimeInMinutes,
};
