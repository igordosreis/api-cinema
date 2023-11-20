import { fetchNowPlaying } from '../../helpers/fetch';
import { IDate } from '../../interfaces/IUrlDate';

export default class MoviesAPIModel {
  public static async getNowPlaying(currentDate: IDate, pastDate: IDate) {
    const allMoviesPlayingNow = fetchNowPlaying(currentDate, pastDate);

    return allMoviesPlayingNow;
  }
}
