import TripPresenter from './presenter/trip-presenter';
import PointsModel from './model/points-model';
import PointsApiService from './points-api-service';

const AUTHORIZATION = 'Basic Hs12pS44wSl2sa2J';
const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip';

const tripInfoContainer = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const eventContainer = document.querySelector('.trip-events');
const newEventBtn = document.querySelector('.trip-main__event-add-btn');

const containers = {
  tripInfo: tripInfoContainer,
  filter: filterContainer,
  event: eventContainer,
};

const pointsModel = new PointsModel({ pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION) });
const tripPresenter = new TripPresenter({ containers, pointsModel, newEventBtn });

tripPresenter.init();
pointsModel.init().
  finally(() => {
    newEventBtn.style.visibility = 'visible';
  });
