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

    const allMoviesPlayingNow = await MoviesAPIModel.getNowPlaying(currentDateISO, pastDateISO);

    if (allMoviesPlayingNow) {
      const randomizedMoviesOrder = allMoviesPlayingNow.results.sort(() => Math.random() - 0.5);
      allMoviesPlayingNow.results = randomizedMoviesOrder;

      const moviesWithImgLinks = formatMoviesUtil.addImgLinksToAllMovies(
        allMoviesPlayingNow.results,
      );

      const allMoviesPlayingNowWithLinks = {
        ...allMoviesPlayingNow,
        results: moviesWithImgLinks,
      };

      return allMoviesPlayingNowWithLinks;
    }
  }

  public static async getPopular(): Promise<IMoviesResults | undefined> {
    const currentDate = new Date();
    const subtractFortyFiveDaysDate = DateUtils.subtractDays(currentDate, 45);

    const currentDateISO = DateUtils.formatDateToISO(currentDate);
    const pastDateISO = DateUtils.formatDateToISO(subtractFortyFiveDaysDate);

    const allMoviesByPopular = await MoviesAPIModel.getNowPlaying(currentDateISO, pastDateISO);

    if (allMoviesByPopular) {
      const moviesWithImgLinks = formatMoviesUtil.addImgLinksToAllMovies(
        allMoviesByPopular.results,
      );
      allMoviesByPopular.results = moviesWithImgLinks;

      return allMoviesByPopular;
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
      const moviesWithImgLinks = formatMoviesUtil.addImgLinksToAllMovies(allMoviesUpcoming.results);
      allMoviesUpcoming.results = moviesWithImgLinks;

      return allMoviesUpcoming;
    }
  }

  public static async getPremier(): Promise<IMoviesResults | undefined> {
    const currentDate = new Date();

    const lastSundayISO = DateUtils.getLastSunday(currentDate);
    const nextSundayISO = DateUtils.getNextSunday(currentDate);

    const allMoviesPremier = await MoviesAPIModel.getPremier(lastSundayISO, nextSundayISO);

    if (allMoviesPremier) {
      const moviesWithImgLinks = formatMoviesUtil.addImgLinksToAllMovies(allMoviesPremier.results);
      allMoviesPremier.results = moviesWithImgLinks;

      return allMoviesPremier;
    }
  }

  public static async getMovieDetails(
    movieId: number | string,
  ): Promise<IMovieDetails | undefined> {
    const movieDetails = await MoviesAPIModel.getMovieDetails(movieId);

    if (movieDetails) {
      const movieDetailsWithImgLinks = formatMoviesUtil.addImgLinksToMovieDetails(movieDetails);
      const movieDetailsWithYoutubeLinks =
        formatMoviesUtil.addYoutubeLinksToMovieDetails(movieDetailsWithImgLinks);

      return movieDetailsWithYoutubeLinks;
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
        allMoviesByPopular,
        genreId,
        titleQuery,
      );

      return { parsedPopular, parsedUpcoming };
    }
  }
}
