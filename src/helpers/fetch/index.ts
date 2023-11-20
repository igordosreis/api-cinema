import axios from 'axios';
import { IDate } from '../../interfaces/IUrlDate';
import { RELEASE_DATE_END, RELEASE_DATE_START, URL_BASE } from '../../constants';
import { IMovieAPIResponse } from '../../interfaces/IMoviesAPI';

export const getNowPlaying = async (
  currentDate: IDate,
  pastDate: IDate,
): Promise<IMovieAPIResponse | undefined> => {
  const endpoint = `${URL_BASE}${RELEASE_DATE_START}${pastDate}${RELEASE_DATE_END}${currentDate}`;

  try {
    const { data } = await axios.get<IMovieAPIResponse>(endpoint);

    return data;
  } catch (error) {
    console.log('error manual: ', error);
  }
};

export const getPopular = async (_currentDate: IDate, _pastDate: IDate) => {};
// export const getUpcoming = async (currentDate: IDate, futureDate: IDate) => {};
// export const getPremier = async (previousSundayDate: IDate, nextSundayDate: IDate) => {};
