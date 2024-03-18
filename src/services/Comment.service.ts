import { CONSOLE_LOG_ERROR_TITLE } from '../constants';
import CommentActions from '../database/models/CommentActions.model';
import CustomError, { cannotGetCommentActions } from '../utils/customError.util';

export default class CommentService {
  public static async getCommentActions() {
    try {
      const allActions = await CommentActions.findAll();

      return allActions;
    } catch (error) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      if (error instanceof CustomError) throw error;

      throw new CustomError(cannotGetCommentActions);
    }
  }
}
