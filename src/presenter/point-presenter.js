import PointView from '../view/point-view';
import EditPointView from '../view/edit-point-view';
import { remove, render, replace } from '../framework/render';
import { UserAction, UpdateType, Mode } from '../const';
import dayjs from 'dayjs';

export default class PointPresenter {
  #point = null;
  #allOffers = [];
  #allDestinations = [];
  #pointComponent = null;
  #editPointComponent = null;
  #pointsListContainer = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;

  constructor({ pointsListContainer, onDataChange, onModeChange }) {
    this.#pointsListContainer = pointsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point, allOffers, allDestinations) {
    this.#point = point;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      allOffers: this.#allOffers,
      allDestinations: this.#allDestinations,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#editPointComponent = new EditPointView({
      point: this.#point,
      allOffers: this.#allOffers,
      allDestinations: this.#allDestinations,
      onEditPointReset: this.#handleEditPointReset,
      onEditPointSave: this.#handleEditPointSave,
      onEditDeletePoint: this.#handleEditDeletePoint,
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
    this.#handleModeChange();
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

  #handleEditClick = () => {
    this.#replacePointToForm();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      { ...this.#point, isFavorite: !this.#point.isFavorite },
    );
  };

  #handleEditPointReset = (oldPoint) => {
    this.#replaceFormToPoint();
    this.#handleEditPointSave(oldPoint);
  };

  #handleEditPointSave = (updatedPoint) => {
    const isMinorUpdate = dayjs(updatedPoint.dateFrom).isSame(this.#point.dateFrom)
    || dayjs(updatedPoint.dateTo).isSame(this.#point.dateTo)
    || updatedPoint.price === this.#point.price;

    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      updatedPoint,
    );
  };

  #handleEditDeletePoint = (updatedPoint) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      updatedPoint,
    );
  };
}
