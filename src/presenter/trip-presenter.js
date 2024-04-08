import TripInfoView from '../view/trip-info-view';
import FilterView from '../view/filter-view';
import SortView from '../view/sort-view';
import PointsListView from '../view/points-list-view';
import EmptyListView from '../view/empty-list-view';
import { RenderPosition, render } from '../framework/render';
import PointPresenter from './point-presenter';
import { updateItem, sortPointDay, sortPointTime, sortPointPrice } from '../utils';
import { SortType } from '../const';

export default class TripPresenter {
  #pointsListContainer = new PointsListView();
  #containers = null;
  #pointsModel = null;
  #tripPoints = null;
  #pointPresenters = new Map();
  #sortComponent = null;
  #currentSortType = SortType.DAY;

  constructor({ containers, pointsModel }) {
    this.#containers = containers;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#renderBoard();
  }

  #renderBoard() {
    this.#tripPoints = sortPointDay([...this.#pointsModel.points]);

    render(new FilterView(this.#tripPoints.length), this.#containers.filter);

    if (this.#tripPoints.length === 0) {
      render(new EmptyListView(), this.#containers.event);
      return;
    }

    render(new TripInfoView(this.#tripPoints), this.#containers.tripInfo, RenderPosition.AFTERBEGIN);
    this.#renderSort();
    render(this.#pointsListContainer, this.#containers.event);
    this.#tripPoints.forEach((point) => this.#renderPoint(point));
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#onSortTypeChange,
    });
    render(this.#sortComponent, this.#containers.event);
  }

  #onSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);

    this.#clearPointsList();
    this.#tripPoints.forEach((point) => this.#renderPoint(point));
  };

  #sortPoints = (sortType) => {
    switch(sortType) {
      case SortType.DAY:
        this.#tripPoints = sortPointDay([...this.#tripPoints]);
        break;
      case SortType.TIME:
        this.#tripPoints = sortPointTime([...this.#tripPoints]);
        break;
      case SortType.PRICE:
        this.#tripPoints = sortPointPrice([...this.#tripPoints]);
        break;
    }

    this.#currentSortType = sortType;
  };

  #clearPointsList = () => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  };

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#pointsListContainer.element,
      onDataChange: this.#onDataChange,
      onModeChange: this.#onModeChange,
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #onDataChange = (updatedPoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #onModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
