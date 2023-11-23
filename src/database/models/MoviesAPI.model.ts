import MoviesAPIFetch from '../../utils/fetch.util';
import { IDate } from '../../interfaces/IUrlDate';

export default class MoviesAPIModel {
  public static async getNowPlaying(currentDate: IDate, pastDate: IDate) {
    const allMoviesPlayingNow = MoviesAPIFetch.fetchNowPlaying(currentDate, pastDate);

    return allMoviesPlayingNow;
  }

  public static async getPopular(currentDate: IDate, pastDate: IDate) {
    const allMoviesPlayingSortedByPopular = MoviesAPIFetch.fetchPopular(currentDate, pastDate);

    return allMoviesPlayingSortedByPopular;
  }

  public static async getUpcoming(currentDate: IDate, futureDate: IDate) {
    const allMoviesUpcoming = MoviesAPIFetch.fetchUpcoming(currentDate, futureDate);

    return allMoviesUpcoming;
  }

  public static async getPremier(lastSundayDate: IDate, nextSundayDate: IDate) {
    const allMoviesPremier = MoviesAPIFetch.fetchPremier(lastSundayDate, nextSundayDate);

    return allMoviesPremier;
  }

  public static async getMovieDetails(id: number | string) {
    const movieDetails = MoviesAPIFetch.fetchMovieDetails(id);

    return movieDetails;
  }

  public static async getGenres() {
    const movieGenres = MoviesAPIFetch.fetchGenres();

    return movieGenres;
  }
}
