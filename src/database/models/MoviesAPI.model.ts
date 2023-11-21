import { fetchNowPlaying, fetchPopular, fetchPremier, fetchUpcoming } from '../../helpers/fetch';
import { IDate } from '../../interfaces/IUrlDate';

export default class MoviesAPIModel {
  public static async getNowPlaying(currentDate: IDate, pastDate: IDate) {
    const allMoviesPlayingNow = fetchNowPlaying(currentDate, pastDate);

    return allMoviesPlayingNow;
  }

  public static async getPopular(currentDate: IDate, pastDate: IDate) {
    const allMoviesPlayingSortedByPopular = fetchPopular(currentDate, pastDate);

    return allMoviesPlayingSortedByPopular;
  }

  public static async getUpcoming(currentDate: IDate, futureDate: IDate) {
    const allMoviesUpcoming = fetchUpcoming(currentDate, futureDate);

    return allMoviesUpcoming;
  }

  public static async getPremier(lastSundayDate: IDate, nextSundayDate: IDate) {
    const allMoviesPremier = fetchPremier(lastSundayDate, nextSundayDate);

    return allMoviesPremier;
  }
}
