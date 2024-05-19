import EditPointView from '../view/edit-point-view';
import { RenderPosition, remove, render } from '../framework/render';
import { UserAction, UpdateType, Mode } from '../const';

export default class NewPointPresenter {
  #pointsListContainer = null;
  #editPointComponent = null;
  #handleDataChange = null;
  #mode = null;

  constructor({ pointsListContainer, onDataChange, mode }) {
    this.#pointsListContainer = pointsListContainer;
    this.#handleDataChange = onDataChange;
    this.#mode = mode;
  }

  init() {
    if (this.#editPointComponent !== null) {
      return;
    }

    this.#editPointComponent = new EditPointView({
      onEditPointSave: this.#handleEditPointSave,
      onEditDeletePoint: this.#handleEditCancelPoint,
      mode: this.#mode,
    });

    render(this.#editPointComponent, this.#pointsListContainer, RenderPosition.AFTERBEGIN);
  }

  destroy() {
    if (this.#editPointComponent === null) {
      return;
    }
    remove(this.#editPointComponent);
    this.#editPointComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleEditPointSave = (updatedPoint) => {
    document.getElementsByClassName('trip-main__event-add-btn')[0].disabled = false;
    this.#handleDataChange(
      UserAction.ADD_TASK,
      UpdateType.MAJOR,
      updatedPoint,
      Mode.DEFAULT,
    );
    this.destroy();
  };

  #handleEditCancelPoint = () => {
    document.getElementsByClassName('trip-main__event-add-btn')[0].disabled = false;
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
