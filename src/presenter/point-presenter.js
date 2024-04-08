import PointView from '../view/point-view';
import EditPointView from '../view/edit-point-view';
import { remove, render, replace } from '../framework/render';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #point = null;
  #pointComponent = null;
  #editPointComponent = null;
  #pointsListContainer = null;
  #onDataChange = null;
  #onModeChange = null;
  #mode = Mode.DEFAULT;

  constructor({ pointsListContainer, onDataChange, onModeChange }) {
    this.#pointsListContainer = pointsListContainer;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;
    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      onEditClick: this.#onEditClick,
      onFavoriteClick: this.#onFavoriteClick,
    });
    this.#editPointComponent = new EditPointView({
      point: this.#point,
      onEditPointReset: this.#onEditPointReset,
      onEditPointSubmit: this.#onEditPointSubmit,
    });

    if (!prevPointComponent || !prevEditPointComponent) {
      render(this.#pointComponent, this.#pointsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editPointComponent, prevEditPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  }

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  };

  #replacePointToForm = () => {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeydown);
    this.#onModeChange();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeydown);
    this.#mode = Mode.DEFAULT;
  };

  #escKeydown = (evt) => {
    if (evt.key === 'Esc' || evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #onEditClick = () => {
    this.#replacePointToForm();
  };

  #onEditPointReset = () => {
    this.#replaceFormToPoint();
  };

  #onEditPointSubmit = () => {
    this.#replaceFormToPoint();
  };

  #onFavoriteClick = () => {
    this.#onDataChange({
      ...this.#point,
      isFavorite: !this.#point.isFavorite,
    });
  };
}
