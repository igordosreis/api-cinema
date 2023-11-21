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
    console.log('allMoviesPlayingNow: ', allMoviesPlayingNow);

    return allMoviesPlayingNow;
  }
}
