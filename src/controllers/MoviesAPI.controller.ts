import { Request, Response } from 'express';
import { MoviesAPIService } from '../services';

export default class MoviesAPIController {
  public static async getNowPlaying(_req: Request, res: Response): Promise<void> {
    const allMoviesPlayingNow = await MoviesAPIService.getNowPlaying();

    res.status(200).json(allMoviesPlayingNow);
  }
}
