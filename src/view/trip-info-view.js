import { getTripInfoTitle, getTripInfoStartDate, getTripInfoEndDate, calculateTotal } from '../utils/trip-info';
import AbstractView from '../framework/view/abstract-view';

function createTripInfoView(points, offers, destinations) {
  const total = calculateTotal(points, offers);
  const sortedPoints = points.sort((firstDate, secondDate) => new Date(firstDate.dateFrom) - new Date(secondDate.dateFrom));
  const cities = sortedPoints.map((point) => destinations.find((destination) => destination.id === point.destination).name);
  const tripInfoTitle = getTripInfoTitle(cities);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${tripInfoTitle}</h1>
        <p class="trip-info__dates">${getTripInfoStartDate(sortedPoints)}&nbsp;&mdash;&nbsp;${getTripInfoEndDate(sortedPoints)}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${total}</span>
      </p>
    </section>`
  );
}

export default class TripInfoView extends AbstractView {
  #points = null;
  #offers = null;
  #destinations = null;

  constructor(points, offers, destinations) {
    super();
    this.#points = points;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  get template() {
    return createTripInfoView(this.#points, this.#offers, this.#destinations);
  }
}
