import MoviesAPIModel from '../database/models/MoviesAPI.model';
import DateUtils from '../utils/date.utils';

export default class MoviesAPIService {
  public static async getNowPlaying() {
    const currentDate = new Date();
    const subtractFortyFiveDaysDate = DateUtils.subtractDays(currentDate, 45);

    const currentDateISO = DateUtils.formatDateToISO(currentDate);
    const pastDateISO = DateUtils.formatDateToISO(subtractFortyFiveDaysDate);
    console.log('currentDateISO: ', currentDateISO);
    console.log('pastDateISO: ', pastDateISO);

    const allMoviesPlayingNow = await MoviesAPIModel.getNowPlaying(currentDateISO, pastDateISO);

    if (allMoviesPlayingNow) {
      const randomizedMoviesOrder = allMoviesPlayingNow.results.sort(() => Math.random() - 0.5);
      allMoviesPlayingNow.results = randomizedMoviesOrder;
      console.log('allMoviesPlayingNow: ', allMoviesPlayingNow);
    }

    return allMoviesPlayingNow;
  }

  public static async getPopular() {
    const currentDate = new Date();
    const subtractFortyFiveDaysDate = DateUtils.subtractDays(currentDate, 45);

    const currentDateISO = DateUtils.formatDateToISO(currentDate);
    const pastDateISO = DateUtils.formatDateToISO(subtractFortyFiveDaysDate);

    const allMoviesPlayingSortedByPopular = await MoviesAPIModel.getNowPlaying(
      currentDateISO,
      pastDateISO,
    );

    return allMoviesPlayingSortedByPopular;
  }

  public static async getUpcoming() {
    const currentDate = new Date();
    const addThirtyDaysDate = DateUtils.addDays(currentDate, 30);

    const currentDateISO = DateUtils.formatDateToISO(currentDate);
    const pastDateISO = DateUtils.formatDateToISO(addThirtyDaysDate);

    const allMoviesUpcoming = await MoviesAPIModel.getUpcoming(currentDateISO, pastDateISO);

    return allMoviesUpcoming;
  }
}
