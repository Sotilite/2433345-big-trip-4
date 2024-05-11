import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { getMockDestination } from '../mock/destination';
import { TYPE_POINT, OFFER, CITY } from '../const';

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
  #initialValueOfPoint = null;
  #onEditPointReset = null;
  #onEditPointSubmit = null;
  #onEditSavePoint = null;
  #datepickerForStart = null;
  #datepickerForEnd = null;

  constructor({ point = DEFAULT_POINT, onEditPointReset, onEditPointSubmit, onEditSavePoint }) {
    super();
    this._setState(point);
    this.#initialValueOfPoint = JSON.parse(JSON.stringify(point));
    this.#onEditPointReset = onEditPointReset;
    this.#onEditPointSubmit = onEditPointSubmit;
    this.#onEditSavePoint = onEditSavePoint;

    this.#setFlatpickr();
    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state);
  }

  _restoreHandlers() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editPointResetHandler);
    this.element.querySelector('form').addEventListener('submit', this.#editPointSubmitHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#editCheckedPointHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#editPointInputHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#editTypePointHandler);
  }

  #setFlatpickr() {
    const commonConfig = {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      'time_24hr': true,
      locale: {
        firstDayOfWeek: 1,
      }
    };

    this.#datepickerForStart = flatpickr(
      this.element.querySelectorAll('.event__input--time')[0],
      {
        ...commonConfig,
        defaultDate: dayjs(this._state.date.startTime).format('DD/MM/YY HH:mm'),
        onClose: this.#editStartDateChangeHandler,
      }
    );

    this.#datepickerForEnd = flatpickr(
      this.element.querySelectorAll('.event__input--time')[1],
      {
        ...commonConfig,
        defaultDate: dayjs(this._state.date.endTime).format('DD/MM/YY HH:mm'),
        onClose: this.#editEndDateChangeHandler,
      }
    );
  }

  #editStartDateChangeHandler = ([fullStartDate, fullEndDate]) => {
    const startTime = dayjs(fullStartDate).format('YYYY-MM-DDTHH:mm');
    const endTime = dayjs(fullEndDate).format('YYYY-MM-DDTHH:mm');

    this._setState({
      ...this._state,
      date: {
        startTime,
        endTime
      }
    });
  };

  #editEndDateChangeHandler = ([fullDate]) => {
    const endTime = dayjs(fullDate).format('YYYY-MM-DDTHH:mm');
    this._setState({
      ...this._state,
      date: {
        startTime: this._state.date.startTime,
        endTime
      }
    });
  };

  removeElement() {
    super.removeElement();

    if (this.#datepickerForStart) {
      this.#datepickerForStart.destroy();
      this.#datepickerForStart = null;
    }

    if (this.#datepickerForEnd) {
      this.#datepickerForEnd.destroy();
      this.#datepickerForEnd = null;
    }
  }

  #editPointResetHandler = (evt) => {
    evt.preventDefault();
    this.#onEditPointReset(this.#initialValueOfPoint);
  };

  #editPointSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onEditSavePoint(this._state);
    this.#onEditPointSubmit();
  };

  #editCheckedPointHandler = (evt) => {
    evt.preventDefault();
    const offer = this._state.offer;
    const checkedOffer = evt.currentTarget.attributes[0].ownerDocument.activeElement.id;
    const cleanCheckedOffer = checkedOffer.split('-')[2];
    const id = offer.findIndex((item) => item[0] === cleanCheckedOffer);
    offer[id][2] = !offer[id][2];
    this._setState({
      ...this._state,
      offer,
    });
  };

  #editPointInputHandler = (evt) => {
    evt.preventDefault();
    const currentCity = evt.currentTarget.value;
    const id = Array.from(CITY.values()).indexOf(currentCity);
    this.updateElement({
      city: currentCity,
      destination: getMockDestination(id),
    });
  };

  #editTypePointHandler = (evt) => {
    evt.preventDefault();
    const typePoint = evt.target.value;
    const offer = OFFER.get(typePoint);
    const newOffer = offer.map((item) => {
      item[2] = false;
      return item;
    });
    this.updateElement({
      type: typePoint,
      offer: newOffer,
    });
  };
}
