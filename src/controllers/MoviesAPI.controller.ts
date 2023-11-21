import { Request, Response } from 'express';
import { MoviesAPIService } from '../services';

export default class MoviesAPIController {
  public static async getNowPlaying(_req: Request, res: Response): Promise<void> {
    const allMoviesPlayingNow = await MoviesAPIService.getNowPlaying();

    res.status(200).json(allMoviesPlayingNow);
  }

  public static async getPopular(_req: Request, res: Response): Promise<void> {
    const allMoviesPlayingSortedByPopular = await MoviesAPIService.getPopular();

    res.status(200).json(allMoviesPlayingSortedByPopular);
  }

  public static async getUpcoming(_req: Request, res: Response): Promise<void> {
    const allMoviesUpcoming = await MoviesAPIService.getUpcoming();

    res.status(200).json(allMoviesUpcoming);
  }

  public static async getPremier(_req: Request, res: Response): Promise<void> {
    const allMoviesPremier = await MoviesAPIService.getPremier();

    res.status(200).json(allMoviesPremier);
  }

  public static async getMovieDetails(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const movieDetails = await MoviesAPIService.getMovieDetails(id);

    res.status(200).json(movieDetails);
  }
}
