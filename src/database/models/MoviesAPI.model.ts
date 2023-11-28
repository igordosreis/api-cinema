import FetchMoviesAPI from '../../utils/fetchMoviesAPI.util';
import { IDate } from '../../interfaces/IUrlDate';
import CustomError, { fetchError } from '../../utils/customError.util';

export default class MoviesAPIModel {
  public static async getNowPlaying(currentDate: IDate, pastDate: IDate) {
    try {
      const allMoviesPlayingNow = await FetchMoviesAPI.fetchNowPlaying(currentDate, pastDate);

      return allMoviesPlayingNow;
    } catch {
      throw new CustomError(fetchError);
    }
  }

  public static async getPopular(currentDate: IDate, pastDate: IDate) {
    try {
      const allMoviesPlayingSortedByPopular = await FetchMoviesAPI.fetchPopular(
        currentDate,
        pastDate,
      );

      return allMoviesPlayingSortedByPopular;
    } catch {
      throw new CustomError(fetchError);
    }
  }

  public static async getUpcoming(tomorrowDate: IDate, futureDate: IDate) {
    try {
      const allMoviesUpcoming = await FetchMoviesAPI.fetchUpcoming(tomorrowDate, futureDate);

      return allMoviesUpcoming;
    } catch {
      throw new CustomError(fetchError);
    }
  }

  public static async getPremier(lastSundayDate: IDate, nextSundayDate: IDate) {
    try {
      const allMoviesPremier = await FetchMoviesAPI.fetchPremier(lastSundayDate, nextSundayDate);

      return allMoviesPremier;
    } catch {
      throw new CustomError(fetchError);
    }
  }

  public static async getPreview(tomorrowDate: IDate, futureDate: IDate) {
    try {
      const allMoviesPreview = await FetchMoviesAPI.fetchPreview(tomorrowDate, futureDate);

      return allMoviesPreview;
    } catch {
      throw new CustomError(fetchError);
    }
  }

  public static async getMovieDetails(movieId: number | string) {
    try {
      const movieDetails = await FetchMoviesAPI.fetchMovieDetails(movieId);

      return movieDetails;
    } catch {
      throw new CustomError(fetchError);
    }
  }

  public static async getGenres() {
    try {
      const movieGenres = await FetchMoviesAPI.fetchGenres();

      return movieGenres;
    } catch {
      throw new CustomError(fetchError);
    }
  }
}
