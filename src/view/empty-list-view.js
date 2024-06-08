import AbstractView from '../framework/view/abstract-view';
import { FilterMessage } from '../const';

function createEmptyListView(currentFilterType, hasError) {
  return (
    `<p class="trip-events__msg">${!hasError ? FilterMessage[currentFilterType] : 'Failed to load latest route information'}</p>`
  );
}

export default class EmptyListView extends AbstractView {
  #currentFilterType = null;
  #hasError = null;

  constructor({ currentFilterType, hasError }) {
    super();
    this.#currentFilterType = currentFilterType;
    this.#hasError = hasError;
  }

  get template() {
    return createEmptyListView(this.#currentFilterType, this.#hasError);
  }
}
