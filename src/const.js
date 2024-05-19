const TYPE_POINT = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const PRICE = [90, 20, 80, 140, 100, 40, 110, 70, 130, 50];

const OFFERS = new Map([
  ['taxi', [['Order Uber', 40, false], ['Switch to comfort', 35, false], ['Trip with a dog', 55, false], ['Drive fast', 60, false], ['Text communication only', 10, false], ['Add luggage', 90, false]]],
  ['bus', [['Trip with a cat', 45, false], ['Book tickets', 30, false], ['Add luggage', 85, false], ['Reclining seat', 55, false]]],
  ['train', [['Book tickets', 40, false], ['Add luggage', 75, false], ['Reclining seat', 80, false]]],
  ['ship', [['Trip with a pet', 100, false], ['Add big luggage', 105, false], ['Book tickets', 60, false], ['Sleeping place', 150, false], ['Add breakfast', 120, false]]],
  ['drive', [['Rent a car', 100, false], ['Trip with a pet', 80, false], ['Add luggage', 40, false]]],
  ['flight', [['Reclining seat', 200, false], ['Add breakfast', 190, false], ['Add luggage', 105, false], ['Flight with a pet', 120, false]]],
  ['check-in', [['Book tickets', 45, false], ['Add luggage', 75, false], ['Add breakfast', 110, false]]],
  ['sightseeing', [['Lunch in city', 150, false], ['Choose a speaker', 200, false], ['To see a secret place', 120, false]]],
  ['restaurant', [['Table for two', 105, false], ['Book a table', 55, false], ['Italian cuisine', 35, false], ['Japanese cuisine', 65, false]]],
]);

const DATE = [
  {
    startTime: '2024-03-18T10:15',
    endTime: '2024-03-18T16:00'
  },
  {
    startTime: '2024-06-18T16:20',
    endTime: '2024-06-19T18:00'
  },
  {
    startTime: '2024-05-15T14:20',
    endTime: '2024-05-15T15:00'
  },
  {
    startTime: '2024-03-19T15:30',
    endTime: '2024-03-19T17:00'
  },
  {
    startTime: '2024-03-20T18:00',
    endTime: '2024-03-20T20:30'
  },
  {
    startTime: '2024-03-21T13:00',
    endTime: '2024-03-21T16:30'
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

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const FilterMessage = {
  'everything': 'Click New Event to create your first point',
  'future': 'There are no future events now',
  'present': 'There are no present events now',
  'past': 'There are no past events now',
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

const UserAction = {
  UPDATE_TASK: 'UPDATE_TASK',
  ADD_TASK: 'ADD_TASK',
  DELETE_TASK: 'DELETE_TASK',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
  CREATING: 'CREATING',
};

export { TYPE_POINT, PRICE, OFFERS, DATE, CITY, DESCRIPTION, FilterType, FilterMessage, SortType, UserAction, UpdateType, Mode };
