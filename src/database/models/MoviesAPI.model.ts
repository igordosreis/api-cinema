import FetchMoviesAPI from '../../utils/fetchMoviesAPI.util';
import { IDate } from '../../interfaces/IUrlDate';
import CustomError, { fetchError } from '../../utils/customError.util';

export default class MoviesAPIModel {
  public static async getNowPlaying(pastDate: IDate, currentDate: IDate) {
    try {
      const allMoviesPlayingNow = await FetchMoviesAPI.fetchAllMovies(pastDate, currentDate);

      return allMoviesPlayingNow;
    } catch {
      throw new CustomError(fetchError);
    }
  }

  public static async getPopular(pastDate: IDate, currentDate: IDate) {
    try {
      const allMoviesPlayingSortedByPopular = await FetchMoviesAPI.fetchAllMovies(
        pastDate,
        currentDate,
      );

      return allMoviesPlayingSortedByPopular;
    } catch {
      throw new CustomError(fetchError);
    }
  }

  public static async getUpcoming(tomorrowDate: IDate, futureDate: IDate) {
    try {
      const allMoviesUpcoming = await FetchMoviesAPI.fetchAllMovies(tomorrowDate, futureDate);

      return allMoviesUpcoming;
    } catch {
      throw new CustomError(fetchError);
    }
  }

  public static async getPremier(lastSundayDate: IDate, nextSundayDate: IDate) {
    try {
      const allMoviesPremier = await FetchMoviesAPI.fetchAllMovies(lastSundayDate, nextSundayDate);

      return allMoviesPremier;
    } catch {
      throw new CustomError(fetchError);
    }
  }

  public static async getPreview(tomorrowDate: IDate, futureDate: IDate) {
    try {
      const allMoviesPreview = await FetchMoviesAPI.fetchAllMovies(tomorrowDate, futureDate);

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
