import { Router } from 'express';
import { MoviesAPIController } from '../controllers';

const moviesAPIRouter = Router();

moviesAPIRouter.get('/nowplaying', MoviesAPIController.getNowPlaying);
moviesAPIRouter.get('/popular', MoviesAPIController.getPopular);

export default moviesAPIRouter;
