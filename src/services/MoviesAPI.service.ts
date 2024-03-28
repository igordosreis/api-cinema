/* eslint-disable max-lines-per-function */
/* eslint-disable operator-linebreak */
import MoviesAPIModel from '../database/models/MoviesAPI.model';
import {
  IBannerUniversal,
  IGenreList,
  IMovieDetails,
  IMoviesResults,
  IMoviesSearchQuery,
  IOffer,
} from '../interfaces/IMoviesAPI';
import { IPagination } from '../interfaces/IPagination';
import CustomError, { movieNotFound } from '../utils/customError.util';
import DateUtil from '../utils/date.utils';
import formatMoviesUtil from '../utils/formatMovies.util';
import PaginationUtil from '../utils/pagination.util';
import searchMoviesUtil from '../utils/searchMovies.util';

export default class MoviesAPIService {
  public static async getNowPlaying(pagination: IPagination): Promise<IMoviesResults> {
    const currentDate = new Date();
    const subtractFortyFiveDaysDate = DateUtil.subtractDays(currentDate, 45);

    const currentDateISO = DateUtil.formatDateToISO(currentDate);
    const pastDateISO = DateUtil.formatDateToISO(subtractFortyFiveDaysDate);

    const allMoviesPlayingNow = await MoviesAPIModel.getNowPlaying(pastDateISO, currentDateISO);

    const parsedMovies = await formatMoviesUtil.formatAllMovies({
      moviesArray: allMoviesPlayingNow.results,
    });

    const { page, limit } = pagination;
    const pagedMovies = PaginationUtil.getPageContent({ page, limit, array: parsedMovies })
      .filter(({ poster_path: posterPath }) => !posterPath.endsWith('null'));

    return {
      results: pagedMovies,
      total_results: parsedMovies.length,
    };
  }

  public static async getUpcoming(pagination: IPagination): Promise<IMoviesResults> {
    const currentDate = new Date();
    const addOneDayDate = DateUtil.addDays(currentDate, 1);
    const addThirtyDaysDate = DateUtil.addDays(currentDate, 30);

    const tomorrowDateISO = DateUtil.formatDateToISO(addOneDayDate);
    const futureDateISO = DateUtil.formatDateToISO(addThirtyDaysDate);

    const allMoviesUpcoming = await MoviesAPIModel.getUpcoming(tomorrowDateISO, futureDateISO);

    const parsedMovies = await formatMoviesUtil.formatAllMovies({
      moviesArray: allMoviesUpcoming.results,
      isSortedByReleaseDate: true,
    });

    const { page, limit } = pagination;
    const pagedMovies = PaginationUtil.getPageContent({ page, limit, array: parsedMovies })
      .filter(({ poster_path: posterPath }) => !posterPath.endsWith('null'));

    return {
      results: pagedMovies,
      total_results: parsedMovies.length,
    };
  }

  public static async getPremieres(pagination: IPagination): Promise<IMoviesResults> {
    const currentDate = new Date();

    const lastSundayISO = DateUtil.getLastSunday(currentDate);
    const nextSundayISO = DateUtil.getNextSunday(currentDate);

    const allMoviesPremier = await MoviesAPIModel.getPremieres(lastSundayISO, nextSundayISO);

    const parsedMovies = await formatMoviesUtil.formatAllMovies({
      moviesArray: allMoviesPremier.results,
    });

    const { page, limit } = pagination;
    const pagedMovies = PaginationUtil.getPageContent({ page, limit, array: parsedMovies })
      .filter(({ poster_path: posterPath }) => !posterPath.endsWith('null'));

    return {
      results: pagedMovies,
      total_results: pagedMovies.length,
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

  public static async getByGenreAndTitle(searchQuery: IMoviesSearchQuery) {
    const { genreId, title: titleQuery, page, limit } = searchQuery;
    const moviesNowPlaying = await this.getNowPlaying({ page: 0, limit: 100 });
    const moviesPremieres = await this.getPremieres({ page: 0, limit: 100 });
    const moviesUpcoming = await this.getUpcoming({ page: 0, limit: 100 });

    const searchResults = searchMoviesUtil.findByGenreAndTitle({
      moviesNowPlaying,
      moviesPremieres,
      moviesUpcoming,
      genreId,
      titleQuery,
    });

    const pagedResults = PaginationUtil.getPageContent({
      page,
      limit,
      array: searchResults.results,
    });
    searchResults.results = pagedResults;

    return searchResults;
  }

  public static async getMovieOffer(): Promise<IOffer> {
    const { results } = await this.getNowPlaying({ page: 0, limit: 20 });

    const cards: IBannerUniversal[] = results.map((movie) => {
      const { title, id, poster_path: posterPath } = movie;

      const banner: IBannerUniversal = {
        title,
        image: posterPath,
        sizes: {
          width: 136,
          height: 200,
        },
        action: {
          type: 'internal',
          href: 'CineScreens',
          params: {
            screen: 'moviesDetails',
            params: {
              id,
            },
          },
        },
      };

      return banner;
    });

    const offer: IOffer = {
      title: 'Em cartaz',
      type: 'HorizontalBanners',
      cards,
    };

    return offer;
  }

  // public static async getPopular(): Promise<IMoviesResults> {
  //   const currentDate = new Date();
  //   const subtractFortyFiveDaysDate = DateUtils.subtractDays(currentDate, 45);

  //   const currentDateISO = DateUtils.formatDateToISO(currentDate);
  //   const pastDateISO = DateUtils.formatDateToISO(subtractFortyFiveDaysDate);

  //   const allMoviesByPopular = await MoviesAPIModel.getNowPlaying(pastDateISO, currentDateISO);

  //   const parsedMovies = await formatMoviesUtil.formatAllMovies({
  //     moviesArray: allMoviesByPopular.results,
  //   });

  //   allMoviesByPopular.results = parsedMovies;

  //   return allMoviesByPopular;
  // }

  // public static async getPreviews() {
  //   const currentDate = new Date();

  //   const addOneDayDate = DateUtils.addDays(currentDate, 1);
  //   const addEightDaysDate = DateUtils.addDays(currentDate, 8);

  //   const tomorrowDateISO = DateUtils.formatDateToISO(addOneDayDate);
  //   const futureDateISO = DateUtils.formatDateToISO(addEightDaysDate);

  //   const allMoviesPreview = await MoviesAPIModel.getPreview(tomorrowDateISO, futureDateISO);

  //   return allMoviesPreview;
  // }

  // public static async getHighlights() {
  //   const allMoviesByPopular = await this.getPopular();
  //   const allMoviesUpcoming = await this.getUpcoming();

  //   const allMoviesHighlight: IMoviesResults = {
  //     // page: allMoviesByPopular.page + allMoviesUpcoming.page,
  //     // total_pages: allMoviesByPopular.total_pages + allMoviesUpcoming.total_pages,
  //     total_results: allMoviesByPopular.total_results + allMoviesUpcoming.total_results,
  //     results: [...allMoviesByPopular.results, ...allMoviesUpcoming.results],
  //   };

  //   return allMoviesHighlight;
  // }
}
