import FetchMoviesAPIUtil from '../../utils/fetchMoviesAPI.util';
import { IDate } from '../../interfaces/IUrlDate';
import CustomError, { fetchError } from '../../utils/customError.util';

export default class MoviesAPIModel {
  public static async getNowPlaying(pastDate: IDate, currentDate: IDate) {
    try {
      const allMoviesPlayingNow = await FetchMoviesAPIUtil.fetchAllMovies(pastDate, currentDate);

      return allMoviesPlayingNow;
    } catch {
      throw new CustomError(fetchError);
    }
  }

  public static async getPopular(pastDate: IDate, currentDate: IDate) {
    try {
      const allMoviesPlayingSortedByPopular = await FetchMoviesAPIUtil.fetchAllMovies(
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
      const allMoviesUpcoming = await FetchMoviesAPIUtil.fetchAllMovies(tomorrowDate, futureDate);

      return allMoviesUpcoming;
    } catch {
      throw new CustomError(fetchError);
    }
  }

  public static async getPremieres(lastSundayDate: IDate, nextSundayDate: IDate) {
    try {
      const allMoviesPremier = await FetchMoviesAPIUtil.fetchAllMovies(
        lastSundayDate,
        nextSundayDate,
      );

      return allMoviesPremier;
    } catch {
      throw new CustomError(fetchError);
    }
  }

  public static async getPreview(tomorrowDate: IDate, futureDate: IDate) {
    try {
      const allMoviesPreview = await FetchMoviesAPIUtil.fetchAllMovies(tomorrowDate, futureDate);

      return allMoviesPreview;
    } catch {
      throw new CustomError(fetchError);
    }
  }

  public static async getMovieDetails(movieId: number | string) {
    try {
      const movieDetails = await FetchMoviesAPIUtil.fetchMovieDetails(movieId);

      return movieDetails;
    } catch {
      throw new CustomError(fetchError);
    }
  }

  public static async getGenres() {
    try {
      const movieGenres = await FetchMoviesAPIUtil.fetchGenres();

      return movieGenres;
    } catch {
      throw new CustomError(fetchError);
    }
  }
}
