import he from 'he';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { DEFAULT_POINT, TYPE_POINT, Mode } from '../const';

function createEditTypePointTemplate(currentType) {
  return (
    `<div class="event__type-list" >
      <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>
        ${TYPE_POINT.reduce((acc, type) => (`${acc}<div class="event__type-item">
          <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentType ? 'checked' : ''}>
          <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type[0].toUpperCase() + type.slice(1)}</label>
        </div>`), '')}
      </fieldset>
    </div>`
  );
}

function createEditPointDestinationTemplate(type, name, cities, isDisabled) {
  return (
    `<div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" 
        value="${he.encode(name ? name : '')}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
      <datalist id="destination-list-1">
        ${Array.from(cities).reduce((acc, city) => (`${acc}<option value="${city}"></option>`), '')}
      </datalist>
    </div>`
  );
}

function createEditPointButtonsTemplate(mode, isDisabled, isSaving, isDeleting) {
  const rollupBtn =
  '<button class="event__rollup-btn" type="button">\
    <span class="visually-hidden">Open event</span>\
  </button>';

  let resetBtn = '';
  if (mode === Mode.EDITING) {
    if (isDeleting) {
      resetBtn = 'Deleting...';
    } else {
      resetBtn = 'Delete';
    }
  } else {
    resetBtn = 'Cancel';
  }

  return (
    `<button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>
      ${isSaving ? 'Saving...' : 'Save'}
    </button>
    <button class="event__reset-btn" type="reset" ${isDisabled && mode === Mode.CREATING ? 'disabled' : ''}>
      ${resetBtn}
    </button>
    ${mode === Mode.EDITING ? rollupBtn : ''}`
  );
}

function createEditPointOfferTemplate(offers, currentOffers, isDisabled) {
  if (currentOffers.length !== 0) {
    return (
      `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${currentOffers.reduce((acc, { id, title, price }) => (`${acc}<div class="event__offer-selector">
            <input class="event__offer-checkbox visually-hidden" id="${title}" type="checkbox" 
              name="event-offer-${title}" ${offers.includes(id) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
            <label class="event__offer-label" for="${title}">
              <span class="event__offer-title">${title}</span>
                &plus;&euro;&nbsp;
              <span class="event__offer-price">${price}</span>
            </label>
          </div>`), '')}
        </div>
      </section>`
    );
  } else {
    return '';
  }
}

function createEditPointPhotoTemplate(pictures) {
  if (pictures !== null) {
    return (
      `<div class="event__photos-container">
        <div class="event__photos-tape">
          ${pictures.map(({src}) => `<img class="event__photo" src="${src}" alt="Event photo">`)}
        </div>
      </div>`
    );
  } else {
    return '';
  }
}

function createEditPointTemplate(point, allOffers, allDestinations, mode) {
  const { isDisabled, isSaving, isDeleting, type, basePrice, dateFrom, dateTo, destination, offers } = point;
  const currentOffers = allOffers.find((obj) => obj.type === type).offers;
  const currentDestination = allDestinations.find((destintn) => destintn.id === destination);
  const cities = new Set(allDestinations.map((destintn) => destintn.name));
  let name, description, pictures = null;
  if (currentDestination) {
    name = currentDestination.name;
    description = currentDestination.description;
    pictures = currentDestination.pictures;
  }

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>
            ${createEditTypePointTemplate(type)}
          </div>
            
          ${createEditPointDestinationTemplate(type, name, cities, isDisabled)}

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" 
            value="${dateFrom ? dayjs(dateFrom).format('DD/MM/YY HH:mm') : ''}" ${isDisabled ? 'disabled' : ''}>
              &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" 
            value="${dateTo ? dayjs(dateTo).format('DD/MM/YY HH:mm') : ''}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
                &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" 
              value="${basePrice ? he.encode(String(basePrice)) : ''}" ${isDisabled ? 'disabled' : ''}>
          </div>

          ${createEditPointButtonsTemplate(mode, isDisabled, isSaving, isDeleting)}
        </header>
        <section class="event__details">
          ${createEditPointOfferTemplate(offers, currentOffers, isDisabled)}
          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">${description ? 'Destination' : ''}</h3>
            <p class="event__destination-description">${description ? description : ''}</p>
          </section>
          ${createEditPointPhotoTemplate(pictures)}
        </section>
      </form>
    </li>`
  );
}

export default class EditPointView extends AbstractStatefulView {
  #allOffers = [];
  #allDestinations = [];
  #handleEditPointReset = null;
  #handleEditPointSave = null;
  #handleEditDeletePoint = null;
  #datepickerForStart = null;
  #datepickerForEnd = null;
  #mode = null;

  constructor({ point = DEFAULT_POINT, allOffers, allDestinations, onEditPointReset, onEditPointSave, onEditDeletePoint, mode = Mode.EDITING }) {
    super();
    this._setState(this.parsePointToState(point));
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#handleEditPointReset = onEditPointReset;
    this.#handleEditPointSave = onEditPointSave;
    this.#handleEditDeletePoint = onEditDeletePoint;
    this.#mode = mode;

    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state, this.#allOffers, this.#allDestinations, this.#mode);
  }

  parsePointToState(point) {
    return {
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  parseStateToPoint(state) {
    const point = { ...state };

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }

  _restoreHandlers() {
    if (this.#mode === Mode.EDITING) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editPointResetHandler);
    }
    this.element.querySelector('.event__type-group').addEventListener('change', this.#editTypePointHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#editInputPointHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#editPricePointHandler);
    if (this.#allOffers.find((obj) => obj.type === this._state.type).offers.length !== 0) {
      this.element.querySelector('.event__available-offers').addEventListener('change', this.#editCheckedPointHandler);
    }
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

    this.updateElement({
      type: typePoint,
    });
  };

  #editInputPointHandler = (evt) => {
    evt.preventDefault();
    const currentName = evt.currentTarget.value;
    const currentDestination = this.#allDestinations.find((destination) => destination.name === currentName);
    const destinationId = currentDestination ? currentDestination.id : null;

    this.updateElement({
      destination: destinationId,
    });
  };

  #editPricePointHandler = (evt) => {
    evt.preventDefault();
    const basePrice = Number(evt.currentTarget.value);

    this.updateElement({
      basePrice,
    });
  };

  #editPointSaveHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditPointSave(this.parseStateToPoint(this._state));
  };

  #editDeletePointHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditDeletePoint(this.parseStateToPoint(this._state));
  };

  #editPointResetHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditPointReset();
  };

  #editCheckedPointHandler = (evt) => {
    evt.preventDefault();
    let offers = this._state.offers;
    const currentAllOffers = this.#allOffers.find((obj) => obj.type === this._state.type).offers;
    const checkedOfferTitle = evt.currentTarget.attributes[0].ownerDocument.activeElement.id;
    const cleanCheckedOfferId = currentAllOffers.find((offer) => offer.title === checkedOfferTitle).id;

    if (offers.includes(cleanCheckedOfferId)) {
      const index = offers.indexOf(cleanCheckedOfferId);
      offers = [
        ...offers.slice(0, index),
        ...offers.slice(index + 1)];
    } else {
      offers.push(cleanCheckedOfferId);
    }

    this._setState({
      ...this._state,
      offers,
    });
  };
}
