import dayjs from 'dayjs';

function getTripInfoTitle(cities) {
  const NUMBER_OF_VISIBLE_CITIES = 3;

  if (cities.length > NUMBER_OF_VISIBLE_CITIES) {
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
  for (let i = 0; i < points.length; i++) {
    const currentOffers = offers.find((offer) => offer.type === points[i].type).offers;
    currentOffers.forEach((offer) => {
      if (points[i].offers.includes(offer.id)) {
        total += offer.price;
      }
    });
  }
  return total;
}

export { getTripInfoTitle, getTripInfoStartDate, getTripInfoEndDate, calculateTotal };
