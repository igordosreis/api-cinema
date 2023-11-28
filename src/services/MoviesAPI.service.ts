/* eslint-disable max-lines-per-function */
/* eslint-disable operator-linebreak */
import MoviesAPIModel from '../database/models/MoviesAPI.model';
import { IGenreList, IMovieDetails, IMoviesResults } from '../interfaces/IMoviesAPI';
import DateUtils from '../utils/date.utils';
import formatMoviesUtil from '../utils/formatMovies.util';
import searchMoviesUtil from '../utils/searchMovies.util';

export default class MoviesAPIService {
  public static async getNowPlaying(): Promise<IMoviesResults | undefined> {
    const currentDate = new Date();
    const subtractFortyFiveDaysDate = DateUtils.subtractDays(currentDate, 45);

    const currentDateISO = DateUtils.formatDateToISO(currentDate);
    const pastDateISO = DateUtils.formatDateToISO(subtractFortyFiveDaysDate);

    const allMoviesPlayingNow = await MoviesAPIModel.getNowPlaying(pastDateISO, currentDateISO);

    if (allMoviesPlayingNow) {
      const parsedMovies = await formatMoviesUtil.formatAllMovies({
        moviesArray: allMoviesPlayingNow.results,
        isRandomized: true,
      });

      if (parsedMovies) {
        allMoviesPlayingNow.results = parsedMovies;

        return allMoviesPlayingNow;
      }
    }
  }

  public static async getPopular(): Promise<IMoviesResults | undefined> {
    const currentDate = new Date();
    const subtractFortyFiveDaysDate = DateUtils.subtractDays(currentDate, 45);

    const currentDateISO = DateUtils.formatDateToISO(currentDate);
    const pastDateISO = DateUtils.formatDateToISO(subtractFortyFiveDaysDate);

    const allMoviesByPopular = await MoviesAPIModel.getNowPlaying(pastDateISO, currentDateISO);

    if (allMoviesByPopular) {
      const parsedMovies = await formatMoviesUtil.formatAllMovies({
        moviesArray: allMoviesByPopular.results,
      });

      if (parsedMovies) {
        allMoviesByPopular.results = parsedMovies;

        return allMoviesByPopular;
      }
    }
  }

  public static async getUpcoming(): Promise<IMoviesResults | undefined> {
    const currentDate = new Date();
    const addOneDayDate = DateUtils.addDays(currentDate, 1);
    const addThirtyDaysDate = DateUtils.addDays(currentDate, 30);

    const tomorrowDateISO = DateUtils.formatDateToISO(addOneDayDate);
    const futureDateISO = DateUtils.formatDateToISO(addThirtyDaysDate);

    const allMoviesUpcoming = await MoviesAPIModel.getUpcoming(tomorrowDateISO, futureDateISO);

    if (allMoviesUpcoming) {
      const parsedMovies = await formatMoviesUtil.formatAllMovies({
        moviesArray: allMoviesUpcoming.results,
        isSorted: true,
      });

      if (parsedMovies) {
        allMoviesUpcoming.results = parsedMovies;

        return allMoviesUpcoming;
      }
    }
  }

  public static async getPremier(): Promise<IMoviesResults | undefined> {
    const currentDate = new Date();

    const lastSundayISO = DateUtils.getLastSunday(currentDate);
    const nextSundayISO = DateUtils.getNextSunday(currentDate);

    const allMoviesPremier = await MoviesAPIModel.getPremier(lastSundayISO, nextSundayISO);

    if (allMoviesPremier) {
      const parsedMovies = await formatMoviesUtil.formatAllMovies({
        moviesArray: allMoviesPremier.results,
      });

      if (parsedMovies) {
        allMoviesPremier.results = parsedMovies;

        return allMoviesPremier;
      }
    }
  }

  public static async getPreview() {
    const currentDate = new Date();

    const addOneDayDate = DateUtils.addDays(currentDate, 1);
    const addEightDaysDate = DateUtils.addDays(currentDate, 8);

    const tomorrowDateISO = DateUtils.formatDateToISO(addOneDayDate);
    const futureDateISO = DateUtils.formatDateToISO(addEightDaysDate);

    const allMoviesPreview = await MoviesAPIModel.getPreview(tomorrowDateISO, futureDateISO);

    return allMoviesPreview;
  }

  public static async getMovieDetails(
    movieId: number | string,
  ): Promise<IMovieDetails | undefined> {
    const movieDetails = await MoviesAPIModel.getMovieDetails(movieId);

    if (movieDetails) {
      const movieDetailsWithLinks = formatMoviesUtil.formatMovieDetails(movieDetails);

      return movieDetailsWithLinks;
    }
  }

  public static async getGenres(): Promise<IGenreList | undefined> {
    const allMovieGenres = await MoviesAPIModel.getGenres();

    return allMovieGenres;
  }

  public static async getByGenreAndTitle(
    genreId: string | undefined,
    titleQuery: string | undefined,
  ) {
    const allMoviesByPopular = await this.getPopular();
    const allMoviesUpcoming = await this.getUpcoming();

    if (allMoviesByPopular && allMoviesUpcoming) {
      const parsedPopular = searchMoviesUtil.findByGenreAndTitle(
        allMoviesByPopular,
        genreId,
        titleQuery,
      );
      const parsedUpcoming = searchMoviesUtil.findByGenreAndTitle(
        allMoviesUpcoming,
        genreId,
        titleQuery,
      );

      return { parsedPopular, parsedUpcoming };
    }
  }
}
