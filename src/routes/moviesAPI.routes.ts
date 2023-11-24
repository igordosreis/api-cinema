import { Router } from 'express';
import { MoviesAPIController } from '../controllers';
import authMiddleware from '../middlewares/auth.middleware';

const moviesAPIRouter = Router();

moviesAPIRouter.get('/nowplaying', authMiddleware, MoviesAPIController.getNowPlaying);
moviesAPIRouter.get('/popular', authMiddleware, MoviesAPIController.getPopular);
moviesAPIRouter.get('/upcoming', authMiddleware, MoviesAPIController.getUpcoming);
moviesAPIRouter.get('/premier', authMiddleware, MoviesAPIController.getPremier);
moviesAPIRouter.get('/details/:id', authMiddleware, MoviesAPIController.getMovieDetails);
moviesAPIRouter.get('/genres', authMiddleware, MoviesAPIController.getGenres);
moviesAPIRouter.get('/search', authMiddleware, MoviesAPIController.getByGenreAndTitle);

export default moviesAPIRouter;
