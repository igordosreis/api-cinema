import { Request, Response } from 'express';
import { MoviesAPIService } from '../services';
import { IPaginationRequest } from '../interfaces/IPagination';
import formatRequestQueryUtil from '../utils/formatRequestQuery.util';
import { IMoviesSearchQuerySchema, IMoviesSearchRawQuery } from '../interfaces/IMoviesAPI';

export default class MoviesAPIController {
  public static async getNowPlaying(req: Request, res: Response): Promise<void> {
    const paginationRequest = <IPaginationRequest>req.query;

    const pagination = formatRequestQueryUtil.formatPagination(paginationRequest);
    const allMoviesPlayingNow = await MoviesAPIService.getNowPlaying(pagination);

    res.status(200).json(allMoviesPlayingNow);
  }

  public static async getUpcoming(req: Request, res: Response): Promise<void> {
    const paginationRequest = <IPaginationRequest>req.query;

    const pagination = formatRequestQueryUtil.formatPagination(paginationRequest);
    const allMoviesUpcoming = await MoviesAPIService.getUpcoming(pagination);

    res.status(200).json(allMoviesUpcoming);
  }

  public static async getPremieres(req: Request, res: Response): Promise<void> {
    const paginationRequest = <IPaginationRequest>req.query;

    const pagination = formatRequestQueryUtil.formatPagination(paginationRequest);
    const allMoviesPremier = await MoviesAPIService.getPremieres(pagination);

    res.status(200).json(allMoviesPremier);
  }

  public static async getByGenreAndTitle(req: Request, res: Response): Promise<void> {
    const searchQuery = <IMoviesSearchRawQuery>req.query;

    const formattedSearchQuery = formatRequestQueryUtil.formathMoviesSearcQuery(searchQuery);
    IMoviesSearchQuerySchema.parse(formattedSearchQuery);

    const filteredMovies = await MoviesAPIService.getByGenreAndTitle(formattedSearchQuery);

    res.status(200).json(filteredMovies);
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

  // public static async getPopular(_req: Request, res: Response): Promise<void> {
  //   const allMoviesPlayingSortedByPopular = await MoviesAPIService.getPopular();

  //   res.status(200).json(allMoviesPlayingSortedByPopular);
  // }

  // public static async getPreviews(_req: Request, res: Response): Promise<void> {
  //   const allMoviesPreview = await MoviesAPIService.getPreviews();

  //   res.status(200).json(allMoviesPreview);
  // }

  // public static async getHighlights(_req: Request, res: Response): Promise<void> {
  //   const allMoviesHighlight = await MoviesAPIService.getHighlights();

  //   res.status(200).json(allMoviesHighlight);
  // }
}
