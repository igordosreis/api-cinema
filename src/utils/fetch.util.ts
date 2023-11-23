/* eslint-disable max-len */
import axios from 'axios';
import { IDate } from '../interfaces/IUrlDate';
import {
  DETAILS_AUTH_AND_APPEND,
  LANGUAGE_PT_BR,
  RELEASE_DATE_END,
  RELEASE_DATE_START,
  SORT_BY_POPULARITY_DESC,
  SORT_BY_RELEASE_DATE_ASC,
  URL_BASE_DETAILS,
  URL_BASE_DISCOVER,
  URL_BASE_GENRE,
} from '../constants';
import { IMoviesResults, IMovieDetails, GenreList } from '../interfaces/IMoviesAPI';

class MoviesAPIFetch {
  fetch = async <T>(endpoint: string): Promise<T | undefined> => {
    try {
      const { data } = await axios.get<T>(endpoint);

      return data;
    } catch (error) {
      console.log('error manual: ', error);
    }
  };

  fetchNowPlaying = async (currentDate: IDate, pastDate: IDate) => {
    const endpoint = `${URL_BASE_DISCOVER}${RELEASE_DATE_START}${pastDate}${RELEASE_DATE_END}${currentDate}`;

    const data = await this.fetch<IMoviesResults>(endpoint);

    return data;
  };

  fetchPopular = async (currentDate: IDate, pastDate: IDate) => {
    const endpoint = `${URL_BASE_DISCOVER}${RELEASE_DATE_START}${pastDate}${RELEASE_DATE_END}${currentDate}${SORT_BY_POPULARITY_DESC}`;

    const data = await this.fetch<IMoviesResults>(endpoint);

    return data;
  };

  fetchUpcoming = async (currentDate: IDate, futureDate: IDate) => {
    const endpoint = `${URL_BASE_DISCOVER}${RELEASE_DATE_START}${currentDate}${RELEASE_DATE_END}${futureDate}${SORT_BY_RELEASE_DATE_ASC}`;

    const data = await this.fetch<IMoviesResults>(endpoint);

    return data;
  };

  fetchPremier = async (previousSundayDate: IDate, nextSundayDate: IDate) => {
    const endpoint = `${URL_BASE_DISCOVER}${RELEASE_DATE_START}${previousSundayDate}${RELEASE_DATE_END}${nextSundayDate}`;

    const data = await this.fetch<IMoviesResults>(endpoint);

    return data;
  };

  fetchMovieDetails = async (id: number | string) => {
    const endpoint = `${URL_BASE_DETAILS}${id}${DETAILS_AUTH_AND_APPEND}`;

    const data = await this.fetch<IMovieDetails>(endpoint);

    return data;
  };

  fetchCategories = async () => {
    const endpoint = `${URL_BASE_GENRE}${LANGUAGE_PT_BR}`;

    const data = await this.fetch<GenreList>(endpoint);

    return data;
  };
}

export default new MoviesAPIFetch();
