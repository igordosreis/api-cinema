import { Router } from 'express';
import { TagsController } from '../controllers';

const tagsRouter = Router();

tagsRouter.get('/all', TagsController.getAllTags);

export default tagsRouter;
