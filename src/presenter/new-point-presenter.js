import EditPointView from '../view/edit-point-view';
import { RenderPosition, remove, render } from '../framework/render';
import { UserAction, UpdateType } from '../const';

export default class NewPointPresenter {
  #pointsListContainer = null;
  #editPointComponent = null;
  #handleDataChange = null;
  #handleResetMode = null;
  #newEventBtn = null;
  #mode = null;

  constructor({ pointsListContainer, onDataChange, onResetMode, newEventBtn, mode }) {
    this.#pointsListContainer = pointsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleResetMode = onResetMode;
    this.#newEventBtn = newEventBtn;
    this.#mode = mode;
  }

  init() {
    if (this.#editPointComponent) {
      return;
    }

    this.#editPointComponent = new EditPointView({
      onEditPointSave: this.#handleEditPointSave,
      onEditDeletePoint: this.#handleEditCancelPoint,
      mode: this.#mode,
    });

    render(this.#editPointComponent, this.#pointsListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (!this.#editPointComponent) {
      return;
    }

    this.#newEventBtn.disabled = false;
    this.#handleResetMode();
    remove(this.#editPointComponent);
    this.#editPointComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleEditPointSave = (updatedPoint) => {
    this.destroy();
    this.#handleDataChange(
      UserAction.ADD_TASK,
      UpdateType.MAJOR,
      updatedPoint,
    );
  };

  #handleEditCancelPoint = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
