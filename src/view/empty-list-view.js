import AbstractView from '../framework/view/abstract-view';
import { FilterMessage } from '../const';

function createEmptyListView(currentFilterType) {
  return (
    `<p class="trip-events__msg">${FilterMessage[currentFilterType]}</p>`
  );
}

export default class EmptyListView extends AbstractView {
  #currentFilterType = null;

  constructor(currentFilterType) {
    super();
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createEmptyListView(this.#currentFilterType);
  }
}
