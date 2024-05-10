import { TYPE_POINT, PRICE, OFFER, DATE, CITY } from '../const';
import { getRandomArrayElement } from '../utils';
import { getMockDestination } from './destination';

function getRandomPoint() {
  const randomNumber = Math.floor(Math.random() * 10000);
  const identity = Math.floor(Math.random() * CITY.size);
  const typePoint = getRandomArrayElement(TYPE_POINT);
  return {
    id: randomNumber,
    city: CITY.get(identity),
    type: typePoint,
    price: getRandomArrayElement(PRICE),
    date: getRandomArrayElement(DATE),
    destination: getMockDestination(identity),
    offer: OFFER.get(typePoint),
    isFavorite: Math.floor(Math.random() * 2)
  };
}

export { getRandomPoint };
