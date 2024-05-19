import FilterModel from '../model/filter-model';
import FilterPresenter from './filter-presenter';
import NewPointPresenter from './new-point-presenter';
import PointPresenter from './point-presenter';
import TripInfoView from '../view/trip-info-view';
import SortView from '../view/sort-view';
import PointsListView from '../view/points-list-view';
import EmptyListView from '../view/empty-list-view';
import { RenderPosition, remove, render } from '../framework/render';
import { sortPointDay, sortPointTime, sortPointPrice, filter } from '../utils';
import { SortType, UpdateType, UserAction, Mode, FilterType } from '../const';

export default class TripPresenter {
  #pointsListContainer = new PointsListView();
  #containers = null;
  #pointsModel = null;
  #filterModel = new FilterModel();
  #filterPresenter = null;
  #newPointPresenter = null;
  #pointPresenters = new Map();
  #emptyListComponent = null;
  #tripInfoComponent = null;
  #sortComponent = null;
  #currentSortType = SortType.DAY;
  #newEventBtn = null;
  #mode = Mode.DEFAULT;

  constructor({ containers, pointsModel, newEventBtn }) {
    this.#containers = containers;
    this.#pointsModel = pointsModel;
    this.#newEventBtn = newEventBtn;
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#newEventBtn.addEventListener('click', this.#handleCreateNewPoint);
  }

  get points() {
    const filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[filterType](points);

    switch(this.#currentSortType) {
      case SortType.DAY:
        return sortPointDay([...filteredPoints]);
      case SortType.TIME:
        return sortPointTime([...filteredPoints]);
      case SortType.PRICE:
        return sortPointPrice([...filteredPoints]);
    }
    return filteredPoints;
  }

  init() {
    this.#renderBoard();
  }

  #renderBoard() {
    this.#renderFilter();

    if (this.points.length === 0) {
      this.#emptyListComponent = new EmptyListView(this.#filterModel.filter);
      render(this.#emptyListComponent, this.#containers.event);
      return;
    }

    this.#tripInfoComponent = new TripInfoView(this.points);
    render(this.#tripInfoComponent, this.#containers.tripInfo, RenderPosition.AFTERBEGIN);
    this.#renderSort();
    render(this.#pointsListContainer, this.#containers.event);
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #clearBoard({ resetSortType = false } = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#emptyListComponent);
    remove(this.#tripInfoComponent);
    this.#filterPresenter.destroy();
    remove(this.#sortComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderFilter() {
    this.#filterPresenter = new FilterPresenter({
      filterContainer: this.#containers.filter,
      filterModel: this.#filterModel,
      pointsModel: this.#pointsModel,
    });
    this.#filterPresenter.init();
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(this.#sortComponent, this.#containers.event);
  }

  #handleSortTypeChange = (sortType) => {
    if (sortType === this.#currentSortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #handleCreateNewPoint = (evt) => {
    evt.preventDefault();
    if (this.#mode !== Mode.CREATING) {
      this.#renderNewPoint();
      this.#newEventBtn.disabled = true;
    }
  };

  #renderNewPoint() {
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#mode = Mode.CREATING;

    this.#newPointPresenter = new NewPointPresenter({
      pointsListContainer: this.#pointsListContainer.element,
      onDataChange: this.#handleViewAction,
      onResetMode: this.#handleResetMode,
      newEventBtn: this.#newEventBtn,
      mode: this.#mode,
    });
    this.#newPointPresenter.init();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  }

  #handleResetMode = () => {
    this.#mode = Mode.DEFAULT;
  };

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#pointsListContainer.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      mode: this.#mode,
    });
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handleModeChange = () => {
    if (this.#newPointPresenter) {
      this.#newPointPresenter.destroy();
    }
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, updatedPoint) => {
    switch(actionType) {
      case UserAction.UPDATE_TASK:
        this.#pointsModel.updatePoint(updateType, updatedPoint);
        break;
      case UserAction.ADD_TASK:
        this.#pointsModel.addPoint(updateType, updatedPoint);
        break;
      case UserAction.DELETE_TASK:
        this.#pointsModel.deletePoint(updateType, updatedPoint);
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch(updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
    }
  };
}
