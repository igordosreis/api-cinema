/* eslint-disable max-len */
import axios from 'axios';
import { IDate } from '../../interfaces/IUrlDate';
import {
  RELEASE_DATE_END,
  RELEASE_DATE_START,
  SORT_BY_POPULARITY,
  URL_BASE,
} from '../../constants';
import { IMovieAPIResponse } from '../../interfaces/IMoviesAPI';

const fetch = async (endpoint: string): Promise<IMovieAPIResponse | undefined> => {
  try {
    const { data } = await axios.get<IMovieAPIResponse>(endpoint);

    return data;
  } catch (error) {
    console.log('error manual: ', error);
  }
};

export const fetchNowPlaying = async (currentDate: IDate, pastDate: IDate) => {
  const endpoint = `${URL_BASE}${RELEASE_DATE_START}${pastDate}${RELEASE_DATE_END}${currentDate}`;

  const data = await fetch(endpoint);

  return data;
};

export const fetchPopular = async (currentDate: IDate, pastDate: IDate) => {
  const endpoint = `${URL_BASE}${RELEASE_DATE_START}${pastDate}${RELEASE_DATE_END}${currentDate}${SORT_BY_POPULARITY}`;

  const data = await fetch(endpoint);

  return data;
};

export const fetchUpcoming = async (currentDate: IDate, futureDate: IDate) => {
  const endpoint = `${URL_BASE}${RELEASE_DATE_START}${currentDate}${RELEASE_DATE_END}${futureDate}`;

  const data = await fetch(endpoint);

  return data;
};

export const fetchPremier = async (previousSundayDate: IDate, nextSundayDate: IDate) => {
  const endpoint = `${URL_BASE}${RELEASE_DATE_START}${previousSundayDate}${RELEASE_DATE_END}${nextSundayDate}`;

  const data = await fetch(endpoint);

  return data;
};
