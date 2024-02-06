import { Router } from 'express';
import { TagsController } from '../controllers';

const tagsRouter = Router();

tagsRouter.get('/all', TagsController.getAllTags);
tagsRouter.get('/type/:id', TagsController.getTagsByType);

export default tagsRouter;
