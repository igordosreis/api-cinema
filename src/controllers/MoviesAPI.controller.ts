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

  public static async getPreview(_req: Request, res: Response): Promise<void> {
    const allMoviesPreview = await MoviesAPIService.getPreview();

    res.status(200).json(allMoviesPreview);
  }

  public static async getHighlight(_req: Request, res: Response): Promise<void> {
    const allMoviesHighlight = await MoviesAPIService.getHighlight();

    res.status(200).json(allMoviesHighlight);
  }

  public static async getMovieDetails(req: Request, res: Response): Promise<void> {
    const { id: movieId } = req.params;

    const movieDetails = await MoviesAPIService.getMovieDetails(movieId);

    res.status(200).json(movieDetails);
  }

  public static async getGenres(_req: Request, res: Response): Promise<void> {
    const allMovieGenres = await MoviesAPIService.getGenres();

    res.status(200).json(allMovieGenres);
  }

  public static async getByGenreAndTitle(req: Request, res: Response): Promise<void> {
    const genreId = req.query?.genreId as string;
    const title = req.query?.title as string;

    const filteredMovies = await MoviesAPIService.getByGenreAndTitle(genreId, title);

    res.status(200).json(filteredMovies);
  }
}
