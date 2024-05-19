import { DESCRIPTION } from '../const';

const IMG_COUNT = 5;

function getRandomDestination(identity) {
  return {
    id: identity,
    description: DESCRIPTION.get(identity),
    img: Array.from({ length: IMG_COUNT },() => `https://loremflickr.com/248/152?random=${crypto.randomUUID()}`)
  };
}

function getDefaultDestination() {
  return {
    id: null,
    description: '',
    img: null,
  };
}

export { getRandomDestination, getDefaultDestination };
