import { Router } from 'express';
import { MoviesAPIController } from '../controllers';

const moviesAPIRouter = Router();

moviesAPIRouter.get('/nowplaying', MoviesAPIController.getNowPlaying);
moviesAPIRouter.get('/popular', MoviesAPIController.getPopular);
moviesAPIRouter.get('/upcoming', MoviesAPIController.getUpcoming);
moviesAPIRouter.get('/premier', MoviesAPIController.getPremier);
moviesAPIRouter.get('/preview', MoviesAPIController.getPreview);
moviesAPIRouter.get('/details/:id', MoviesAPIController.getMovieDetails);
moviesAPIRouter.get('/genres', MoviesAPIController.getGenres);
moviesAPIRouter.get('/search', MoviesAPIController.getByGenreAndTitle);

export default moviesAPIRouter;
