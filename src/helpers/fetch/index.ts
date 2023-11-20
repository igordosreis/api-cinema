import axios from 'axios';
import { IDate } from '../../interfaces/IUrlDate';
import { RELEASE_DATE_END, RELEASE_DATE_START, URL_BASE } from '../../constants';

export const getNowPlaying = async (currentDate: IDate, pastDate: IDate) => {
  const endpoint = `${URL_BASE}${RELEASE_DATE_START}${currentDate}${RELEASE_DATE_END}${pastDate}`;

  try {
    const response = await axios.get(endpoint);

    return response;
  } catch (error) {
    return error;
  }
};

export const getPopular = async (_currentDate: IDate, _pastDate: IDate) => {};
// export const getUpcoming = async (currentDate: IDate, futureDate: IDate) => {};
// export const getPremier = async (previousSundayDate: IDate, nextSundayDate: IDate) => {};
