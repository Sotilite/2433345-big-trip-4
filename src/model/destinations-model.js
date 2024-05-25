// export default class DestinationsModel {
//   #service = null;
//   #destinations = [];

//   constructor(service) {
//     super();

//   }

//   get destinations() {
//     return this.#destinations;
//   }

//   async init() {
//     try {
//         const destinations = await this.#pointsApiService.points;
//         this.#destinations = destinations.map(this.#adaptToClient);
//         window.console.log(this.#destinations);
//       } catch(err) {
//         this.#destinations = [];
//       }
//   }
// }
