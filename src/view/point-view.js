import dayjs from 'dayjs';
import { getTimeInDays, getTimeInHours, getTimeInMinutes } from '../utils';
import AbstractView from '../framework/view/abstract-view';

function createNewPointOfferTemplate(offers) {
  return (
    `<ul class="event__selected-offers">
      ${offers.reduce((acc, [offer, price, isCheched]) => (acc += isCheched ? `<li class="event__offer">
        <span class="event__offer-title">${offer}</span>
          &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </li>` : ''), '')}
    </ul>`);
}

function createNewPointTemplate(point) {
  const { type, city, price, dateFrom, dateTo, offers, isFavorite } = point;
  const days = getTimeInDays(dateFrom, dateTo);
  const hours = getTimeInHours(dateFrom, dateTo);
  const minutes = getTimeInMinutes(dateFrom, dateTo);
  const eventFavoriteClass = isFavorite ? 'event__favorite-btn--active' : '';

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${dayjs(dateFrom).format('MMM DD')}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${city}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${dayjs(dateFrom).format('HH:mm')}</time>
              &mdash;
            <time class="event__end-time" datetime="${dateTo}">${dayjs(dateTo).format('HH:mm')}</time>
          </p>
          <p class="event__duration">${days} ${hours} ${minutes}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price ? price : ''}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>

        ${createNewPointOfferTemplate(offers)}

        <button class="event__favorite-btn ${eventFavoriteClass}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`);
}

export default class PointView extends AbstractView {
  #point = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({ point, onEditClick, onFavoriteClick }) {
    super();
    this.#point = point;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createNewPointTemplate(this.#point);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
