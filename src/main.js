import TripPresenter from './presenter/trip-presenter';
import PointsModel from './model/points-model';
import OffersModel from './model/offers-model';
import DestinationsModel from './model/destinations-model';
import PointsApiService from './points-api-service';

const AUTHORIZATION = 'Basic Hs12p4wSl2dwetgEWe34J';
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

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);
const offersModel = new OffersModel(pointsApiService);
const destinationsModel = new DestinationsModel(pointsApiService);
const pointsModel = new PointsModel({ pointsApiService, offersModel, destinationsModel });
const tripPresenter = new TripPresenter({ containers, pointsModel, offersModel, destinationsModel, newEventBtn });

pointsModel.init().finally(() => {
  newEventBtn.style.visibility = offersModel.offers.length || destinationsModel.destinations.length ? 'visible' : 'hidden';
});

tripPresenter.init();
