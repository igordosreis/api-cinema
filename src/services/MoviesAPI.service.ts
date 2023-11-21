import { subDays } from 'date-fns';
import MoviesAPIModel from '../database/models/MoviesAPI.model';
import { formatDateToISO } from '../utils';

export default class MoviesAPIService {
  public static async getNowPlaying() {
    const currentDate = new Date();
    const subtractFortyFiveDaysDate = subDays(currentDate, 45);

    const currentDateISO = formatDateToISO(currentDate);
    const pastDateISO = formatDateToISO(subtractFortyFiveDaysDate);

    const result = MoviesAPIModel.getNowPlaying(currentDateISO, pastDateISO);

    return result;
  }
}
