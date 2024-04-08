import { TYPE_POINT, PRICE, OFFER, DATE, CITY } from '../const';
import { getRandomArrayElement } from '../utils';
import { getMockDestination } from './destination';

const BOUND = 5;

function getRandomPoint() {
  const randomNumber = Math.floor(Math.random() * 10000);
  const identity = Math.floor(Math.random() * CITY.size);
  const offerCount = Math.floor(Math.random() * BOUND + 1);
  return {
    id: randomNumber,
    city: CITY.get(identity),
    type: getRandomArrayElement(TYPE_POINT),
    price: getRandomArrayElement(PRICE),
    date: getRandomArrayElement(DATE),
    destination: getMockDestination(identity),
    offer: Array.from({ length: offerCount }, () => getRandomArrayElement(OFFER)),
    isFavorite: Math.floor(Math.random() * 2)
  };
}

export { getRandomPoint };
