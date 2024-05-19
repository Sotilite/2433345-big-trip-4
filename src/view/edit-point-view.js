import he from 'he';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { TYPE_POINT, OFFERS, CITY, Mode } from '../const';
import { getRandomDestination } from '../mock/destination';
import { getDefaultPoint } from '../mock/route-point';

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

function createEditPointOfferTemplate(offers) {
  if (offers !== null) {
    return (
      `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${offers.reduce((acc, [offer, price, isChecked]) => (`${acc}<div class="event__offer-selector">
              <input class="event__offer-checkbox visually-hidden" id="event-offer-${offer}-1" type="checkbox" name="event-offer-${offer}" ${isChecked ? 'checked' : ''}>
              <label class="event__offer-label" for="event-offer-${offer}-1">
                <span class="event__offer-title">${offer}</span>
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

function createEditPointTemplate(point, mode) {
  const { type, city, price, dateFrom, dateTo, destination, offers } = point;
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
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(city)}" list="destination-list-1">
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
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom ? dayjs(dateTo).format('DD/MM/YY HH:mm') : ''}">
              &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateFrom ? dayjs(dateTo).format('DD/MM/YY HH:mm') : ''}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
                &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price ? he.encode(String(price)) : ''}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${mode === Mode.EDITING ? 'Delete' : 'Cancel'}</button>
          ${mode === Mode.EDITING ? '<button class="event__rollup-btn" type="button">\
            <span class="visually-hidden">Open event</span>\
          </button>' : ''}
        </header>
        <section class="event__details">
          ${createEditPointOfferTemplate(offers, mode)}
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">${description ? 'Destination' : ''}</h3>
            <p class="event__destination-description">${description}</p>
          </section>
          ${createEditPointPhotoTemplate(img)}
        </section>
      </form>
    </li>`);
}

export default class EditPointView extends AbstractStatefulView {
  #oldState = null;
  #handleEditPointReset = null;
  #handleEditPointSave = null;
  #handleEditDeletePoint = null;
  #datepickerForStart = null;
  #datepickerForEnd = null;
  #mode = null;

  constructor({ point = getDefaultPoint(), onEditPointReset, onEditPointSave, onEditDeletePoint, mode = Mode.EDITING }) {
    super();
    this._setState(point);
    this.#oldState = JSON.parse(JSON.stringify(point));
    this.#handleEditPointReset = onEditPointReset;
    this.#handleEditPointSave = onEditPointSave;
    this.#handleEditDeletePoint = onEditDeletePoint;
    this.#mode = mode;

    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state, this.#mode);
  }

  _restoreHandlers() {
    if (this.#mode === Mode.EDITING) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editPointResetHandler);
    }
    this.element.querySelector('.event__type-group').addEventListener('change', this.#editTypePointHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#editInputPointHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#editPricePointHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#editCheckedPointHandler);
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#editPointSaveHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#editDeletePointHandler);
    this.#setFlatpickr();
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
        defaultDate: dayjs(this._state.dateFrom).format('DD/MM/YY HH:mm'),
        onClose: this.#editDateFromChangeHandler,
      }
    );

    this.#datepickerForEnd = flatpickr(
      this.element.querySelectorAll('.event__input--time')[1],
      {
        ...commonConfig,
        defaultDate: dayjs(this._state.dateTo).format('DD/MM/YY HH:mm'),
        onClose: this.#editDateToChangeHandler,
      }
    );
  }

  #editDateFromChangeHandler = ([fullStartDate]) => {
    const dateFrom = dayjs(fullStartDate).format('YYYY-MM-DDTHH:mm');
    this._setState({
      ...this._state,
      dateFrom,
      dateTo: this._state.dateTo
    });
  };

  #editDateToChangeHandler = ([fullEndDate]) => {
    const dateTo = dayjs(fullEndDate).format('YYYY-MM-DDTHH:mm');
    this._setState({
      ...this._state,
      dateFrom: this._state.dateFrom,
      dateTo
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

  #editTypePointHandler = (evt) => {
    evt.preventDefault();
    const typePoint = evt.target.value;
    const offers = OFFERS.get(typePoint);
    const newOffers = offers.map((item) => {
      item[2] = false;
      return item;
    });
    this.updateElement({
      type: typePoint,
      offers: newOffers,
    });
  };

  #editInputPointHandler = (evt) => {
    evt.preventDefault();
    const currentCity = evt.currentTarget.value;
    const id = Array.from(CITY.values()).indexOf(currentCity);
    if (id === -1) {
      return;
    }

    this.updateElement({
      city: currentCity,
      destination: getRandomDestination(id),
    });
  };

  #editPricePointHandler = (evt) => {
    evt.preventDefault();
    const price = Number(evt.currentTarget.value);
    this.updateElement({
      price,
    });
  };

  #editPointSaveHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditPointSave(this._state);
  };

  #editDeletePointHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditDeletePoint(this._state);
  };

  #editPointResetHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditPointReset(this.#oldState);
  };

  #editCheckedPointHandler = (evt) => {
    evt.preventDefault();
    const offers = this._state.offers;
    const checkedOffer = evt.currentTarget.attributes[0].ownerDocument.activeElement.id;
    const cleanCheckedOffer = checkedOffer.split('-')[2];
    const id = offers.findIndex((item) => item[0] === cleanCheckedOffer);
    offers[id][2] = !offers[id][2];
    this._setState({
      ...this._state,
      offers,
    });
  };
}
