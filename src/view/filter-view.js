import AbstractView from '../framework/view/abstract-view';
import { FilterType } from '../const';

function createFilterTemplate(currentFilterType) {
  return (
    `<form class="trip-filters" action="#" method="get">
      ${Object.values(FilterType).reduce((acc, filterType) => (`${acc}<div class="trip-filters__filter">
        <input id="filter-${filterType}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" 
          value="${filterType}" ${currentFilterType === filterType ? 'checked' : ''}>
        <label class="trip-filters__filter-label" for="filter-${filterType}">${filterType[0].toUpperCase() + filterType.slice(1)}</label>
      </div>`), '')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FilterView extends AbstractView {
  #currentFilterType = null;
  #handleFilterTypeChange = null;

  constructor({ currentFilterType, onFilterTypeChange }) {
    super();
    this.#currentFilterType = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };

  get template() {
    return createFilterTemplate(this.#currentFilterType);
  }
}
