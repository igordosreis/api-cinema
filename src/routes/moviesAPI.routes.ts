import { Router } from 'express';
import { MoviesAPIController } from '../controllers';

const moviesAPIRouter = Router();

moviesAPIRouter.get('/nowplaying', MoviesAPIController.getNowPlaying);
// moviesAPIRouter.get('/popular', MoviesAPIController.getPopular);
moviesAPIRouter.get('/upcoming', MoviesAPIController.getUpcoming);
moviesAPIRouter.get('/premieres', MoviesAPIController.getPremieres);
// moviesAPIRouter.get('/previews', MoviesAPIController.getPreviews);
// moviesAPIRouter.get('/highlights', MoviesAPIController.getPreviews);
moviesAPIRouter.get('/details/:id', MoviesAPIController.getMovieDetails);
moviesAPIRouter.get('/genres', MoviesAPIController.getGenres);
moviesAPIRouter.get('/search', MoviesAPIController.getByGenreAndTitle);

export default moviesAPIRouter;
