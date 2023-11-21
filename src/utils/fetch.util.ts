/* eslint-disable max-len */
import axios from 'axios';
import { IDate } from '../interfaces/IUrlDate';
import {
  RELEASE_DATE_END,
  RELEASE_DATE_START,
  SORT_BY_POPULARITY_DESC,
  SORT_BY_RELEASE_DATE_ASC,
  URL_BASE,
} from '../constants';
import { IMovieAPIResponse } from '../interfaces/IMoviesAPI';

class MoviesAPIFetch {
  fetch = async (endpoint: string): Promise<IMovieAPIResponse | undefined> => {
    try {
      const { data } = await axios.get<IMovieAPIResponse>(endpoint);

      return data;
    } catch (error) {
      console.log('error manual: ', error);
    }
  };

  fetchNowPlaying = async (currentDate: IDate, pastDate: IDate) => {
    const endpoint = `${URL_BASE}${RELEASE_DATE_START}${pastDate}${RELEASE_DATE_END}${currentDate}`;

    const data = await this.fetch(endpoint);

    return data;
  };

  fetchPopular = async (currentDate: IDate, pastDate: IDate) => {
    const endpoint = `${URL_BASE}${RELEASE_DATE_START}${pastDate}${RELEASE_DATE_END}${currentDate}${SORT_BY_POPULARITY_DESC}`;

    const data = await this.fetch(endpoint);

    return data;
  };

  fetchUpcoming = async (currentDate: IDate, futureDate: IDate) => {
    const endpoint = `${URL_BASE}${RELEASE_DATE_START}${currentDate}${RELEASE_DATE_END}${futureDate}${SORT_BY_RELEASE_DATE_ASC}`;

    const data = await this.fetch(endpoint);

    return data;
  };

  fetchPremier = async (previousSundayDate: IDate, nextSundayDate: IDate) => {
    const endpoint = `${URL_BASE}${RELEASE_DATE_START}${previousSundayDate}${RELEASE_DATE_END}${nextSundayDate}`;

    const data = await this.fetch(endpoint);

    return data;
  };
}

export default new MoviesAPIFetch();
