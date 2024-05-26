import EditPointView from '../view/edit-point-view';
import { RenderPosition, remove, render } from '../framework/render';
import { UserAction, UpdateType, Mode } from '../const';

export default class NewPointPresenter {
  #allOffers = [];
  #allDestinations = [];
  #pointsListContainer = null;
  #editPointComponent = null;
  #handleDataChange = null;
  #handleResetMode = null;
  #newEventBtn = null;
  #mode = Mode.CREATING;

  constructor({ pointsListContainer, onDataChange, onResetMode, newEventBtn }) {
    this.#pointsListContainer = pointsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleResetMode = onResetMode;
    this.#newEventBtn = newEventBtn;
  }

  init(allOffers, allDestinations) {
    if (this.#editPointComponent) {
      return;
    }

    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;

    this.#editPointComponent = new EditPointView({
      allOffers: this.#allOffers,
      allDestinations: this.#allDestinations,
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
      UserAction.ADD_POINT,
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
