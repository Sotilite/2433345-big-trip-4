const TYPE_POINT = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const DEFAULT_TYPE = 'taxi';

const DEFAULT_POINT = {
  type: DEFAULT_TYPE,
  basePrice: null,
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: null,
  offers: [],
  isFavorite: false,
};

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
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
  CREATING: 'CREATING',
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export { DEFAULT_POINT, TYPE_POINT, FilterType, FilterMessage, SortType, UserAction, UpdateType, Mode, TimeLimit };
