/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines-per-function */
import { NextFunction, Request, Response } from 'express';
import CommentsUtil from '../utils/comments.util';
import { ICommentsInBody } from '../interfaces/IComments';
import CommentActions from '../database/models/CommentActions.model';
import CommentLogs from '../database/models/CommentLogs.model';
import db from '../database/models';
import { CONSOLE_LOG_ERROR_TITLE } from '../constants';
import CustomError, { commentServiceUnavailable } from '../utils/customError.util';

const commentsMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  console.log(
    `
  ----------          ----------          ----------          ----------
  ----------          ----------   req.url       ----------          ----------
  `,
    req.url,
  );

  console.log(
    `
  ----------          ----------          ----------          ----------
  ----------          ----------   req.body       ----------          ----------
  `,
    req.body,
  );

  console.log(
    `
  ----------          ----------          ----------          ----------
  ----------          ----------   req.baseUrl       ----------          ----------
  `,
    req.baseUrl,
  );

  console.log(
    `
  ----------          ----------          ----------          ----------
  ----------          ----------  req.originalUrl        ----------          ----------
  `,
    req.originalUrl,
  );

  console.log(
    `
  ----------          ----------          ----------          ----------
  ----------          ----------  req.method        ----------          ----------
  `,
    req.method,
  );

  console.log(
    `
  ----------          ----------          ----------          ----------
  ----------          ----------  req.path        ----------          ----------
  `,
    req.path,
  );

  const t = await db.transaction();
  try {
    const { method, originalUrl, path, body } = req;

    const isRequestLog = CommentsUtil.validateMethod(method);
    if (isRequestLog) {
      const {
        comment,
        userInfo: { id: userId },
      } = <ICommentsInBody>body;

      CommentsUtil.validateComment(comment);

      const commentAction = await CommentActions.findOne({
        where: { urlPath: path, method },
        transaction: t,
      });
      if (commentAction) {
        const { id: actionId } = commentAction;
        await CommentLogs.create({ originalUrl, userId, comment, actionId }, { transaction: t });
      }
    }

    next();
  } catch (error) {
    await t.rollback();

    console.log(CONSOLE_LOG_ERROR_TITLE, error);
    if (error instanceof CustomError) throw error;

    throw new CustomError(commentServiceUnavailable);
  }
};

export default commentsMiddleware;
