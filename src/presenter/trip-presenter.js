import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import FilterModel from '../model/filter-model';
import FilterPresenter from './filter-presenter';
import NewPointPresenter from './new-point-presenter';
import PointPresenter from './point-presenter';
import TripInfoView from '../view/trip-info-view';
import SortView from '../view/sort-view';
import PointsListView from '../view/points-list-view';
import EmptyListView from '../view/empty-list-view';
import LoadingView from '../view/loading-view';
import { RenderPosition, remove, render } from '../framework/render';
import { SortType, UpdateType, UserAction, Mode, FilterType, TimeLimit } from '../const';
import { sortPointDay, sortPointTime, sortPointPrice } from '../utils/sort';
import { filter } from '../utils/filter';

export default class TripPresenter {
  #pointsListContainer = new PointsListView();
  #containers = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = new FilterModel();
  #filterPresenter = null;
  #newPointPresenter = null;
  #pointPresenters = new Map();
  #emptyListComponent = null;
  #loadingComponent = new LoadingView();
  #tripInfoComponent = null;
  #sortComponent = null;
  #currentSortType = SortType.DAY;
  #newEventBtn = null;
  #mode = Mode.DEFAULT;
  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ containers, pointsModel, offersModel, destinationsModel, newEventBtn }) {
    this.#containers = containers;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
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

  get destinations() {
    return this.#destinationsModel.destinations;
  }

  get offers() {
    return this.#offersModel.offers;
  }

  init() {
    this.#renderBoard();
  }

  #renderBoard() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    this.#renderFilter();

    if (this.points.length === 0) {
      render(this.#pointsListContainer, this.#containers.event);
    }

    if (this.points.length === 0 && this.#mode !== Mode.CREATING) {
      this.#emptyListComponent = new EmptyListView(this.#filterModel.filter);
      render(this.#emptyListComponent, this.#containers.event);
      return;
    }

    if (this.points.length !== 0) {
      this.#tripInfoComponent = new TripInfoView(this.points, this.offers, this.destinations);
      render(this.#tripInfoComponent, this.#containers.tripInfo, RenderPosition.AFTERBEGIN);
      this.#renderSort();
      render(this.#pointsListContainer, this.#containers.event);
      this.points.forEach((point) => this.#renderPoint(point));
    }
  }

  #clearBoard({ resetSortType = false } = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#loadingComponent);
    remove(this.#emptyListComponent);
    remove(this.#tripInfoComponent);
    this.#filterPresenter.destroy();
    remove(this.#sortComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#containers.event, RenderPosition.AFTERBEGIN);
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
    this.#mode = Mode.CREATING;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    this.#newPointPresenter = new NewPointPresenter({
      pointsListContainer: this.#pointsListContainer.element,
      onDataChange: this.#handleViewAction,
      onResetMode: this.#handleResetMode,
      newEventBtn: this.#newEventBtn,
    });
    this.#newPointPresenter.init(this.offers, this.destinations);
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  }

  #handleResetMode = () => {
    this.#mode = Mode.DEFAULT;
    if (this.points.length === 0) {
      this.#emptyListComponent = new EmptyListView(this.#filterModel.filter);
      render(this.#emptyListComponent, this.#containers.event);
    }
  };

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#pointsListContainer.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });
    pointPresenter.init(point, this.offers, this.destinations);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handleModeChange = () => {
    if (this.#newPointPresenter) {
      this.#newPointPresenter.destroy();
    }
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, updatedPoint) => {
    this.#uiBlocker.block();
    switch(actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(updatedPoint.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, updatedPoint);
        } catch {
          this.#pointPresenters.get(updatedPoint.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, updatedPoint);
          this.#newPointPresenter.destroy();
        } catch {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(updatedPoint.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, updatedPoint);
        } catch {
          this.#pointPresenters.get(updatedPoint.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch(updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data, this.offers, this.destinations);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };
}
