import AbstractView from '../framework/view/abstract-view';
import { SortType, DISABLED_SORTS } from '../const';

function createSortTemplate(currentSortType) {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${Object.values(SortType).reduce((acc, sortType) =>
      (`${acc}<div class="trip-sort__item  trip-sort__item--${sortType}">
        <input id="sort-${sortType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortType}" 
        ${DISABLED_SORTS.includes(sortType) ? 'disabled' : ''} data-sort-type="${sortType}" ${currentSortType === sortType ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-${sortType}">${sortType[0].toUpperCase() + sortType.slice(1)}</label>
      </div>`), '')}
    </form>`);
}

export default class SortView extends AbstractView {
  #currentSortType = null;
  #handleSortTypeChange = null;

  constructor({ currentSortType, onSortTypeChange}) {
    super();
    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
