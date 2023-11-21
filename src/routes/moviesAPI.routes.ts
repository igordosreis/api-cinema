import { Router } from 'express';
import { MoviesAPIController } from '../controllers';

const moviesAPIRouter = Router();

moviesAPIRouter.get('/nowplaying', MoviesAPIController.getNowPlaying);

export default moviesAPIRouter;
