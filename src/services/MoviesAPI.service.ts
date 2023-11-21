import MoviesAPIModel from '../database/models/MoviesAPI.model';
import DateUtils from '../utils/date.utils';

export default class MoviesAPIService {
  public static async getNowPlaying() {
    const currentDate = new Date();
    const subtractFortyFiveDaysDate = DateUtils.subtractDays(currentDate, 45);

    const currentDateISO = DateUtils.formatDateToISO(currentDate);
    const pastDateISO = DateUtils.formatDateToISO(subtractFortyFiveDaysDate);

    const allMoviesPlayingNow = MoviesAPIModel.getNowPlaying(currentDateISO, pastDateISO);

    return allMoviesPlayingNow;
  }
}
