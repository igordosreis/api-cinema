import { Router, static as expressStatic } from 'express';

const imagesRouter = Router();

imagesRouter.use(expressStatic('images')); // https://node.clubecerto.com.br/superapp/cinema/ [ou 3071]

export default imagesRouter;
