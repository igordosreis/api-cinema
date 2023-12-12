/* eslint-disable max-lines-per-function */
/* eslint-disable operator-linebreak */
import MoviesAPIModel from '../database/models/MoviesAPI.model';
import { IGenreList, IMovieDetails, IMoviesResults } from '../interfaces/IMoviesAPI';
import CustomError, { movieNotFound } from '../utils/customError.util';
import DateUtils from '../utils/date.utils';
import formatMoviesUtil from '../utils/formatMovies.util';
import searchMoviesUtil from '../utils/searchMovies.util';

export default class MoviesAPIService {
  public static async getNowPlaying(): Promise<IMoviesResults> {
    const currentDate = new Date();
    const subtractFortyFiveDaysDate = DateUtils.subtractDays(currentDate, 45);

    const currentDateISO = DateUtils.formatDateToISO(currentDate);
    const pastDateISO = DateUtils.formatDateToISO(subtractFortyFiveDaysDate);

    const allMoviesPlayingNow = await MoviesAPIModel.getNowPlaying(pastDateISO, currentDateISO);

    const parsedMovies = await formatMoviesUtil.formatAllMovies({
      moviesArray: allMoviesPlayingNow.results,
    });

    return {
      results: parsedMovies,
      total_results: parsedMovies.length,
    };
  }

  public static async getUpcoming(): Promise<IMoviesResults> {
    const currentDate = new Date();
    const addOneDayDate = DateUtils.addDays(currentDate, 1);
    const addThirtyDaysDate = DateUtils.addDays(currentDate, 30);

    const tomorrowDateISO = DateUtils.formatDateToISO(addOneDayDate);
    const futureDateISO = DateUtils.formatDateToISO(addThirtyDaysDate);

    const allMoviesUpcoming = await MoviesAPIModel.getUpcoming(tomorrowDateISO, futureDateISO);

    const parsedMovies = await formatMoviesUtil.formatAllMovies({
      moviesArray: allMoviesUpcoming.results,
      isSortedByReleaseDate: true,
    });

    return {
      results: parsedMovies,
      total_results: parsedMovies.length,
    };
  }

  public static async getPremieres(): Promise<IMoviesResults> {
    const currentDate = new Date();

    const lastSundayISO = DateUtils.getLastSunday(currentDate);
    const nextSundayISO = DateUtils.getNextSunday(currentDate);

    const allMoviesPremier = await MoviesAPIModel.getPremieres(lastSundayISO, nextSundayISO);

    const parsedMovies = await formatMoviesUtil.formatAllMovies({
      moviesArray: allMoviesPremier.results,
    });

    return {
      results: parsedMovies,
      total_results: parsedMovies.length,
    };
  }

  public static async getMovieDetails(movieId: number | string): Promise<IMovieDetails> {
    const movieDetails = await MoviesAPIModel.getMovieDetails(movieId);

    const isMovieNotFound = !movieDetails;
    if (isMovieNotFound) throw new CustomError(movieNotFound);

    const formatedMovieDetails = formatMoviesUtil.formatMovieDetails(movieDetails);

    return formatedMovieDetails;
  }

  public static async getGenres(): Promise<IGenreList> {
    const allMovieGenres = await MoviesAPIModel.getGenres();

    return allMovieGenres;
  }

  public static async getByGenreAndTitle(
    genreId: string | undefined,
    titleQuery: string | undefined,
  ) {
    const moviesNowPlaying = await this.getNowPlaying();
    const moviesPremieres = await this.getPremieres();
    const moviesUpcoming = await this.getUpcoming();

    const searchResults = searchMoviesUtil.findByGenreAndTitle({
      moviesNowPlaying,
      moviesPremieres,
      moviesUpcoming,
      genreId,
      titleQuery,
    });

    return searchResults;
  }

  public static async getPopular(): Promise<IMoviesResults> {
    const currentDate = new Date();
    const subtractFortyFiveDaysDate = DateUtils.subtractDays(currentDate, 45);

    const currentDateISO = DateUtils.formatDateToISO(currentDate);
    const pastDateISO = DateUtils.formatDateToISO(subtractFortyFiveDaysDate);

    const allMoviesByPopular = await MoviesAPIModel.getNowPlaying(pastDateISO, currentDateISO);

    const parsedMovies = await formatMoviesUtil.formatAllMovies({
      moviesArray: allMoviesByPopular.results,
    });

    allMoviesByPopular.results = parsedMovies;

    return allMoviesByPopular;
  }

  public static async getPreviews() {
    const currentDate = new Date();

    const addOneDayDate = DateUtils.addDays(currentDate, 1);
    const addEightDaysDate = DateUtils.addDays(currentDate, 8);

    const tomorrowDateISO = DateUtils.formatDateToISO(addOneDayDate);
    const futureDateISO = DateUtils.formatDateToISO(addEightDaysDate);

    const allMoviesPreview = await MoviesAPIModel.getPreview(tomorrowDateISO, futureDateISO);

    return allMoviesPreview;
  }

  public static async getHighlights() {
    const allMoviesByPopular = await this.getPopular();
    const allMoviesUpcoming = await this.getUpcoming();

    const allMoviesHighlight: IMoviesResults = {
      // page: allMoviesByPopular.page + allMoviesUpcoming.page,
      // total_pages: allMoviesByPopular.total_pages + allMoviesUpcoming.total_pages,
      total_results: allMoviesByPopular.total_results + allMoviesUpcoming.total_results,
      results: [...allMoviesByPopular.results, ...allMoviesUpcoming.results],
    };

    return allMoviesHighlight;
  }
}
