import dayjs from 'dayjs';
import { TYPE_POINT, PRICE, OFFERS, DATE, CITY } from '../const';
import { getRandomArrayElement, getRandomCheckedOffers } from '../utils';
import { getRandomDestination, getDefaultDestination } from './destination';

function getRandomPoint() {
  const identity = Math.floor(Math.random() * CITY.size);
  const typePoint = getRandomArrayElement(TYPE_POINT);
  const date = getRandomArrayElement(DATE);
  const offers = JSON.parse(JSON.stringify(OFFERS.get(typePoint)));
  return {
    id: crypto.randomUUID(),
    city: CITY.get(identity),
    type: typePoint,
    price: getRandomArrayElement(PRICE),
    dateFrom: date.startTime,
    dateTo: date.endTime,
    destination: getRandomDestination(identity),
    offers: getRandomCheckedOffers(offers),
    isFavorite: Math.random() < 0.5
  };
}

function getDefaultPoint() {
  const defaultType = 'taxi';
  return {
    id: crypto.randomUUID(),
    type: defaultType,
    city: '',
    price: 0,
    dateFrom: dayjs().format('YYYY/MM/DD'),
    dateTo: dayjs().format('YYYY/MM/DD'),
    destination: getDefaultDestination(),
    offers: JSON.parse(JSON.stringify(OFFERS.get(defaultType))),
    isFavorite: false,
  };
}

export { getRandomPoint, getDefaultPoint };
