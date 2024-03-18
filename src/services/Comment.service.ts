import { CONSOLE_LOG_ERROR_TITLE } from '../constants';
import CommentActions from '../database/models/CommentActions.model';
import CommentLogs from '../database/models/CommentLogs.model';
import { ICommentLogsSearchQuery } from '../interfaces/IComments';
import createCommentLogsSearchSqlizeQueryDashboardUtil 
  from '../utils/createCommentLogsSearchSqlizeQueryDashboard.util';
import CustomError, {
  cannotGetCommentActions,
  cannotGetCommentLogs,
} from '../utils/customError.util';

export default class CommentService {
  public static async getAllCommentActions() {
    try {
      const allActions = await CommentActions.findAll();

      return allActions;
    } catch (error) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      if (error instanceof CustomError) throw error;

      throw new CustomError(cannotGetCommentActions);
    }
  }

  public static async getCommentLogsByQuery(commentLogsSearchQuery: ICommentLogsSearchQuery) {
    try {
      const allCommentLogs = await CommentLogs.findAll({
        include: [
          {
            model: CommentActions,
            as: 'commentAction',
          },
        ],
        ...createCommentLogsSearchSqlizeQueryDashboardUtil.create(commentLogsSearchQuery),
      });

      return allCommentLogs;
    } catch (error) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      if (error instanceof CustomError) throw error;

      throw new CustomError(cannotGetCommentLogs);
    }
  }
}
