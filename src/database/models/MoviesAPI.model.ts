import MoviesAPIFetch from '../../utils/fetch.util';
import { IDate } from '../../interfaces/IUrlDate';

export default class MoviesAPIModel {
  public static async getNowPlaying(currentDate: IDate, pastDate: IDate) {
    const allMoviesPlayingNow = await MoviesAPIFetch.fetchNowPlaying(currentDate, pastDate);

    return allMoviesPlayingNow;
  }

  public static async getPopular(currentDate: IDate, pastDate: IDate) {
    const allMoviesPlayingSortedByPopular = await MoviesAPIFetch
      .fetchPopular(currentDate, pastDate);

    return allMoviesPlayingSortedByPopular;
  }

  public static async getUpcoming(tomorrowDate: IDate, futureDate: IDate) {
    const allMoviesUpcoming = await MoviesAPIFetch.fetchUpcoming(tomorrowDate, futureDate);

    return allMoviesUpcoming;
  }

  public static async getPremier(lastSundayDate: IDate, nextSundayDate: IDate) {
    const allMoviesPremier = await MoviesAPIFetch.fetchPremier(lastSundayDate, nextSundayDate);

    return allMoviesPremier;
  }

  public static async getMovieDetails(movieId: number | string) {
    const movieDetails = await MoviesAPIFetch.fetchMovieDetails(movieId);

    return movieDetails;
  }

  public static async getGenres() {
    const movieGenres = await MoviesAPIFetch.fetchGenres();

    return movieGenres;
  }
}
