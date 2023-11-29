/* eslint-disable max-len */
import axios from 'axios';
import { IDate } from '../interfaces/IUrlDate';
import { IMoviesResults, IMovieDetails, IGenreList } from '../interfaces/IMoviesAPI';
import {
  DETAILS_AUTH_AND_APPEND,
  LANGUAGE_PT_BR,
  RELEASE_DATE_END,
  RELEASE_DATE_START,
  TMDB_URL_BASE_DETAILS,
  TMDB_URL_BASE_DISCOVER,
  TMDB_URL_BASE_GENRE,
} from '../constants';
import CustomError, { fetchError } from './customError.util';

// interface FetchParams {
//   firstDate: Date;
//   secondDate: Date;
//   fetchType: 'nowplaying' | 'popular';
//   movieId?: number | string;
//   genreId?: number | string;
// }

class FetchMoviesAPI {
  private fetch = async <T>(endpoint: string): Promise<T> => {
    try {
      const { data } = await axios.get<T>(endpoint);

      return data;
    } catch {
      throw new CustomError(fetchError);
    }
  };

  // getMovies = async (fetchParams: FetchParams) => {};

  fetchAllMovies = async (beforeDate: IDate, afterDate: IDate) => {
    const endpoint = `${TMDB_URL_BASE_DISCOVER}${RELEASE_DATE_START}${beforeDate}${RELEASE_DATE_END}${afterDate}`;

    const data = await this.fetch<IMoviesResults>(endpoint);

    return data;
  };

  fetchMovieDetails = async (movieId: number | string) => {
    const endpoint = `${TMDB_URL_BASE_DETAILS}${movieId}${DETAILS_AUTH_AND_APPEND}`;

    const data = await this.fetch<IMovieDetails>(endpoint);

    return data;
  };

  fetchGenres = async () => {
    const endpoint = `${TMDB_URL_BASE_GENRE}${LANGUAGE_PT_BR}`;

    const data = await this.fetch<IGenreList>(endpoint);

    return data;
  };
}

export default new FetchMoviesAPI();
