import { Router } from 'express';
import { MoviesAPIController } from '../controllers';

const moviesAPIRouter = Router();

moviesAPIRouter.get('/nowplaying', MoviesAPIController.getNowPlaying);
moviesAPIRouter.get('/upcoming', MoviesAPIController.getUpcoming);
moviesAPIRouter.get('/premieres', MoviesAPIController.getPremieres);
moviesAPIRouter.get('/search', MoviesAPIController.getByGenreAndTitle);
moviesAPIRouter.get('/details/:id', MoviesAPIController.getMovieDetails);
moviesAPIRouter.get('/genres', MoviesAPIController.getGenres);
moviesAPIRouter.get('/offer', MoviesAPIController.getMovieOffer);
// moviesAPIRouter.get('/popular', MoviesAPIController.getPopular);
// moviesAPIRouter.get('/previews', MoviesAPIController.getPreviews);
// moviesAPIRouter.get('/highlights', MoviesAPIController.getPreviews);

export default moviesAPIRouter;
