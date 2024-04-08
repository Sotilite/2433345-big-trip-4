import TripInfoView from '../view/trip-info-view';
import FilterView from '../view/filter-view';
import SortView from '../view/sort-view';
import PointsListView from '../view/points-list-view';
import EmptyListView from '../view/empty-list-view';
import { RenderPosition, render } from '../framework/render';
import PointPresenter from './point-presenter';
import { updateItem } from '../utils';

export default class TripPresenter {
  #pointsListContainer = new PointsListView();
  #containers = null;
  #pointsModel = null;
  #tripPoints = null;
  #pointPresenters = new Map();

  constructor({ containers, pointsModel }) {
    this.#containers = containers;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#renderBoard();
  }

  #renderBoard() {
    this.#tripPoints = [...this.#pointsModel.points];

    render(new FilterView(this.#tripPoints.length), this.#containers.filter);

    if (this.#tripPoints.length === 0) {
      render(new EmptyListView(), this.#containers.event);
      return;
    }

    render(new TripInfoView(this.#tripPoints), this.#containers.tripInfo, RenderPosition.AFTERBEGIN);
    render(new SortView(), this.#containers.event);
    render(this.#pointsListContainer, this.#containers.event);
    this.#tripPoints.forEach((point) => this.#renderPoint(point));
  }

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
