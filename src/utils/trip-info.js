import dayjs from 'dayjs';

function getTripInfoTitle(cities) {
  const numberOfVisibleCities = 3;

  if (cities.length > numberOfVisibleCities) {
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

function calculateTotal(points, offers) {
  let total = points.reduce((acc, point) => acc + point.basePrice, 0);
  points.forEach((point) => {
    const currentOffers = offers.find((offer) => offer.type === point.type).offers;
    currentOffers.forEach((offer) => {
      if (point.offers.includes(offer.id)) {
        total += offer.price;
      }
    });
  });
  return total;
}

export { getTripInfoTitle, getTripInfoStartDate, getTripInfoEndDate, calculateTotal };
