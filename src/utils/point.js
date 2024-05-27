import dayjs from 'dayjs';

function getTimeInDays(dateFrom, dateTo) {
  const days = dayjs(dateTo).diff(dayjs(dateFrom), 'days');
  return days !== 0 ? `${days}` : '';
}

function getTimeInHours(dateFrom, dateTo) {
  const hours = dayjs(dateTo).diff(dayjs(dateFrom), 'hours') % 24;
  return hours !== 0 ? `${hours}` : '';
}

function getTimeInMinutes(dateFrom, dateTo) {
  const minutes = dayjs(dateTo).diff(dayjs(dateFrom), 'minutes') % 60;
  return minutes !== 0 ? `${minutes}` : '';
}

function getTime(dateFrom, dateTo) {
  const NUMBER_OF_ZEROS = 2;
  const days = getTimeInDays(dateFrom, dateTo);
  const hours = getTimeInHours(dateFrom, dateTo);
  const minutes = getTimeInMinutes(dateFrom, dateTo);
  let time = '';

  if (days) {
    time += `${days.padStart(NUMBER_OF_ZEROS, '0')}D `;
  } if (hours) {
    time += `${hours.padStart(NUMBER_OF_ZEROS, '0')}H `;
  } if (minutes) {
    time += `${minutes.padStart(NUMBER_OF_ZEROS, '0')}M`;
  }
  return time;
}

export { getTime };
