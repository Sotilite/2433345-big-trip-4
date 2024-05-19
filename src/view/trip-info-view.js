import { getTripInfoTitle, getTripInfoStartDate, getTripInfoEndDate } from '../utils';
import AbstractView from '../framework/view/abstract-view';

function createTripInfoView(points) {
  const total = points.reduce((acc, point) => acc + point.price, 0);
  const sortedPoints = points.sort((firstDate, secondDate) => new Date(firstDate.dateFrom) - new Date(secondDate.dateFrom));
  const cities = sortedPoints.map((point) => point.city);
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

  constructor(points) {
    super();
    this.#points = [...points];
  }

  get template() {
    return createTripInfoView(this.#points);
  }
}
