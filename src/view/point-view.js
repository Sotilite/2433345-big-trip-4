import dayjs from "dayjs";
import { createElement } from "../render";
import { getTimeInHours, getTimeInMinutes } from "../utils";

function createNewPointOfferTemplate(offer) {
    return (
        `<ul class="event__selected-offers">
            ${Array.from(new Set(offer)).map(([title, price]) => `<li class="event__offer">
                <span class="event__offer-title">${title}</span>
                    &plus;&euro;&nbsp;
                <span class="event__offer-price">${price}</span>
            </li>`).join('')}
        </ul>`
    )
}

function createNewPointTemplate(point) {
  const { type, price, date, destination, offer, isFavorite } = point;

  const { city } = destination;

  const hours = getTimeInHours(date.startTime, date.endTime);

  const minutes = getTimeInMinutes(date.startTime, date.endTime);

  const eventFavoriteClass = isFavorite && true ? 'event__favorite-btn--active' : '';

  return `<li class="trip-events__item">
            <div class="event">
                <time class="event__date" datetime="${date.startTime}">${dayjs(date.startTime).format("DD MMM")}</time>
                <div class="event__type">
                    <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type} ${city}</h3>
                <div class="event__schedule">
                    <p class="event__time">
                        <time class="event__start-time" datetime="${date.startTime}">${dayjs(date.startTime).format("HH:mm")}</time>
                        &mdash;
                        <time class="event__end-time" datetime="${date.endTime}">${dayjs(date.endTime).format("HH:mm")}</time>
                    </p>
                    <p class="event__duration">${hours} ${minutes}</p>
                </div>
                <p class="event__price">
                    &euro;&nbsp;<span class="event__price-value">${price}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>

                ${createNewPointOfferTemplate(offer)}

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
        </li>`;
}

export default class PointView {
  constructor({ point }) {
    this.point = point;
  }

  getTemplate() {
    return createNewPointTemplate(this.point);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
