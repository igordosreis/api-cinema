import MoviesAPIFetch from '../../utils/fetch.util';
import { IDate } from '../../interfaces/IUrlDate';
import CustomError, { FetchError } from '../../utils/customError.util';

export default class MoviesAPIModel {
  public static async getNowPlaying(currentDate: IDate, pastDate: IDate) {
    try {
      const allMoviesPlayingNow = await MoviesAPIFetch.fetchNowPlaying(currentDate, pastDate);

      return allMoviesPlayingNow;
    } catch {
      throw new CustomError(FetchError);
    }
  }

  public static async getPopular(currentDate: IDate, pastDate: IDate) {
    try {
      const allMoviesPlayingSortedByPopular = await MoviesAPIFetch.fetchPopular(
        currentDate,
        pastDate,
      );

      return allMoviesPlayingSortedByPopular;
    } catch {
      throw new CustomError(FetchError);
    }
  }

  public static async getUpcoming(tomorrowDate: IDate, futureDate: IDate) {
    try {
      const allMoviesUpcoming = await MoviesAPIFetch.fetchUpcoming(tomorrowDate, futureDate);

      return allMoviesUpcoming;
    } catch {
      throw new CustomError(FetchError);
    }
  }

  public static async getPremier(lastSundayDate: IDate, nextSundayDate: IDate) {
    try {
      const allMoviesPremier = await MoviesAPIFetch.fetchPremier(lastSundayDate, nextSundayDate);

      return allMoviesPremier;
    } catch {
      throw new CustomError(FetchError);
    }
  }

  public static async getMovieDetails(movieId: number | string) {
    try {
      const movieDetails = await MoviesAPIFetch.fetchMovieDetails(movieId);

      return movieDetails;
    } catch {
      throw new CustomError(FetchError);
    }
  }

  public static async getGenres() {
    try {
      const movieGenres = await MoviesAPIFetch.fetchGenres();

      return movieGenres;
    } catch {
      throw new CustomError(FetchError);
    }
  }
}
