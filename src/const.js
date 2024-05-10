const TYPE_POINT = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const PRICE = [90, 20, 80, 140, 100, 40, 110, 70, 130, 50];

const OFFER = new Map([
  ['taxi', [['Order Uber', 40, true], ['Switch to comfort', 35, true], ['Trip with a dog', 55, true], ['Drive fast', 60, true], ['Text communication only', 10, true], ['Add luggage', 90, true]]],
  ['bus', [['Trip with a cat', 45, true], ['Book tickets', 30, true], ['Add luggage', 85, true], ['Reclining seat', 55, true]]],
  ['train', [['Book tickets', 40, true], ['Add luggage', 75, true], ['Reclining seat', 80, true]]],
  ['ship', [['Trip with a pet', 100, true], ['Add big luggage', 105, true], ['Book tickets', 60, true], ['Sleeping place', 150, true], ['Add breakfast', 120, true]]],
  ['drive', [['Rent a car', 100, true], ['Trip with a pet', 80, true], ['Add luggage', 40, true]]],
  ['flight', [['Reclining seat', 200, true], ['Add breakfast', 190, true], ['Add luggage', 105, true], ['Flight with a pet', 120, true]]],
  ['check-in', [['Book tickets', 45, true], ['Add luggage', 75, true], ['Add breakfast', 110, true]]],
  ['sightseeing', [['Lunch in city', 150, true], ['Choose a speaker', 200, true], ['To see a secret place', 120, true]]],
  ['restaurant', [['Table for two', 105, true], ['Book a table', 55, true], ['Italian cuisine', 35, true], ['Japanese cuisine', 65, true]]],
]);

const DATE = [
  {
    startTime: '2024-03-18T10:30',
    endTime: '2024-03-18T16:00'
  },
  {
    startTime: '2024-03-18T16:20',
    endTime: '2024-03-18T17:00'
  },
  {
    startTime: '2024-03-19T14:20',
    endTime: '2024-03-19T15:00'
  },
  {
    startTime: '2024-03-19T16:00',
    endTime: '2024-03-19T17:00'
  },
  {
    startTime: '2024-03-19T18:00',
    endTime: '2024-03-19T19:00'
  }
];

const CITY = new Map([
  [0, 'Chamonix'],
  [1, 'Geneva'],
  [2, 'Amsterdam'],
  [3, 'Moscow'],
  [4, 'New York']
]);

const DESCRIPTION = new Map([
  [0, 'Chamonix is situated in the French Alps just north of Mont Blanc, the highest mountain in Western Europe. Between the peaks of the Aiguilles Rouges and the notable Aiguille du Midi, it borders both Switzerland and Italy. It is one of the oldest ski resorts in France, popular with alpinists and mountain enthusiasts.'],
  [1, 'Geneva is a French–speaking city in the south-west of Switzerland, the center of the canton of the same name, combining the peaceful tranquility of an elite holiday and the turbulent passions of political life. Tourists come here who appreciate cleanliness, peace, perfect service and do not pay attention to prices.'],
  [2, 'Amsterdam, capital of the Netherlands! These days the city has a population of just over 790.000 inhabitants and is the largest city in the country. Amsterdam is located in the province ‘Noord-Holland’, situated in the west. It is one of the most popular destinations in Europe, receiving more than 4.5 million tourists annually.'],
  [3, 'Moscow is the capital of Russia, with striking architecture that ranges from grand palaces and cathedrals to unique museums and Russian Baroque skyscrapers. St. Basil’s Cathedral and the Kremlin are iconic landmarks, along with the top-secret nuclear hideout Bunker 42 and elegant Metro stations decorated with chandeliers, statues, and dazzling mosaics.'],
  [4, 'New York City, city and port located at the mouth of the Hudson River, southeastern New York state, northeastern U.S. It is the largest and most influential American metropolis, encompassing Manhattan and Staten islands, the western sections of Long Island, and a small portion of the New York state mainland to the north of Manhattan.']
]);

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

export { TYPE_POINT, PRICE, OFFER, DATE, CITY, DESCRIPTION, SortType };
