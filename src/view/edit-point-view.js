import dayjs from 'dayjs';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { TYPE_POINT } from '../const';

const DEFAULT_POINT = {
  id: null,
  type: null,
  price: null,
  date: null,
  destination: null,
  offer: null,
  isFavorite: false,
};

function createEditTypePointTemplate(currentType) {
  return (
    `<div class="event__type-list">
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
        ${TYPE_POINT.reduce((acc, type) => (`${acc}<div class="event__type-item">
          <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentType ? 'checked' : ''}>
          <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type[0].toUpperCase() + type.slice(1)}</label>
        </div>`), '')}
      </fieldset>
    </div>`);
}

function createEditPointOfferTemplate(offer) {
  if (offer !== null) {
    return (
      `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${offer.reduce((acc, [title, price, isChecked]) => (`${acc}<div class="event__offer-selector">
              <input class="event__offer-checkbox visually-hidden" id="event-offer-${title}-1" type="checkbox" name="event-offer-${title}" ${isChecked ? 'checked' : ''}>
              <label class="event__offer-label" for="event-offer-${title}-1">
                <span class="event__offer-title">${title}</span>
                  &plus;&euro;&nbsp;
                <span class="event__offer-price">${price}</span>
              </label>
            </div>`), '')}
          </div>
        </section>`);
  } else {
    return '';
  }
}

function createEditPointPhotoTemplate(img) {
  if (img !== null) {
    return (
      `<div class="event__photos-container">
        <div class="event__photos-tape">
          ${img.map((path) => `<img class="event__photo" src="${path}" alt="Event photo">`)}
        </div>
      </div>`);
  } else {
    return '';
  }
}

function createEditPointTemplate(point) {
  const { type, city, price, date, destination, offer } = point;
  const { description, img } = destination;

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
            ${createEditTypePointTemplate(type)}
          </div>
            
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
            <datalist id="destination-list-1">
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
              <option value="Moscow"></option>
              <option value="New York"></option>
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${date ? dayjs(date.startTime).format('DD/MM/YY HH:mm') : ''}">
              &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${date ? dayjs(date.endTime).format('DD/MM/YY HH:mm') : ''}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
                &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price ? price : ''}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${createEditPointOfferTemplate(offer)}
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>
          </section>
          ${createEditPointPhotoTemplate(img)}
        </section>
      </form>
    </li>`);
}

export default class EditPointView extends AbstractStatefulView {
  #point = null;
  #onEditPointReset = null;
  #onEditPointSubmit = null;
  #onEditCheckedPoint = null;
  #onEditInputDestination = null;
  #onEditTypePoint = null;

  constructor({ point = DEFAULT_POINT, onEditPointReset, onEditPointSubmit, onEditCheckedPoint, onEditInputDestination, onEditTypePoint }) {
    super();
    this.#point = point;
    this.#onEditPointReset = onEditPointReset;
    this.#onEditPointSubmit = onEditPointSubmit;
    this.#onEditCheckedPoint = onEditCheckedPoint;
    this.#onEditInputDestination = onEditInputDestination;
    this.#onEditTypePoint = onEditTypePoint;
    this._restoreHandlers();
  }

  _restoreHandlers() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editPointResetHandler);
    this.element.querySelector('form').addEventListener('submit', this.#editPointSubmitHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#editCheckedPointHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#editPointInputHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#editTypePointHandler);
  }

  #editPointResetHandler = (evt) => {
    evt.preventDefault();
    this.#onEditPointReset();
  };

  #editPointSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onEditPointSubmit();
  };

  #editCheckedPointHandler = (evt) => {
    evt.preventDefault();
    this.#onEditCheckedPoint(this.#point.offer, evt.currentTarget.attributes[0].ownerDocument.activeElement.id);
  };

  #editPointInputHandler = (evt) => {
    evt.preventDefault();
    this.#onEditInputDestination(evt.currentTarget.value);
  };

  #editTypePointHandler = (evt) => {
    evt.preventDefault();
    this.#onEditTypePoint(evt.target.value);
  };

  get template() {
    return createEditPointTemplate(this.#point);
  }
}
