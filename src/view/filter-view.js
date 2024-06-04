import AbstractView from '../framework/view/abstract-view';
import { filter } from '../utils/filter';
import { FilterType } from '../const';

function createFilterTemplate(allPoints, currentFilterType) {
  return (
    `<form class="trip-filters" action="#" method="get">
      ${Object.values(FilterType).reduce((acc, filterType) => (`${acc}<div class="trip-filters__filter">
        <input id="filter-${filterType}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" 
          value="${filterType}" ${currentFilterType === filterType ? 'checked' : ''} 
          ${filter[filterType](allPoints).length === 0 ? 'disabled' : ''}>
        <label class="trip-filters__filter-label" for="filter-${filterType}">${filterType[0].toUpperCase() + filterType.slice(1)}</label>
      </div>`), '')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FilterView extends AbstractView {
  #allPoints = [];
  #currentFilterType = null;
  #handleFilterTypeChange = null;

  constructor({ allPoints, currentFilterType, onFilterTypeChange }) {
    super();
    this.#allPoints = allPoints;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#allPoints, this.#currentFilterType);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
