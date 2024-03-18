/* eslint-disable complexity */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines-per-function */
import { NextFunction, Request, Response } from 'express';
import CommentsUtil from '../utils/comments.util';
import { ICommentsInBody } from '../interfaces/IComments';
import CommentActions from '../database/models/CommentActions.model';
import CommentLogs from '../database/models/CommentLogs.model';
import db from '../database/models';
import { CONSOLE_LOG_ERROR_TITLE } from '../constants';
import CustomError, {
  commentActionUnavailable,
  commentServiceUnavailable,
} from '../utils/customError.util';

const commentsMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  const { method, originalUrl, path, body } = req;

  const isLogMethod = CommentsUtil.validateMethod(method);
  if (isLogMethod) {
    const t = await db.transaction();

    try {
      const {
        comment,
        userInfo: { id: userId },
      } = <ICommentsInBody>body;
  
      CommentsUtil.validateComment(comment);
  
      const commentAction = await CommentActions.findOne({
        where: { urlPath: path, httpMethod: method },
        transaction: t,
      });
  
      const isCommentActionFound = commentAction;
      if (isCommentActionFound) {
        const { id: actionId } = commentAction;
        await CommentLogs.create({ originalUrl, userId, comment, actionId }, { transaction: t });
      } else {
        throw new CustomError(commentActionUnavailable);
      }

      await t.commit();
    } catch (error) {
      await t.rollback();

      console.log(CONSOLE_LOG_ERROR_TITLE, error);
      if (error instanceof CustomError) throw error;
  
      throw new CustomError(commentServiceUnavailable);
    }
  }

  next();
};

export default commentsMiddleware;
