/* eslint-disable max-lines-per-function */
import CustomError, { invalidCommentLength } from './customError.util';

export default class CommentsUtil {
  public static validateMethod(method: string) {
    const methodsToLog = ['PATCH', 'PUT', 'DELETE'];

    const isLogMethod = methodsToLog.includes(method);

    return isLogMethod;
  }

  public static validateComment(comment: string | undefined) {
    const isCommentNotFound = !comment;
    if (isCommentNotFound) throw new CustomError(invalidCommentLength);

    const minCharQuantity = 40;
    const trimmedComment = comment.trim();

    const isCommentLengthInvalid = trimmedComment.length < minCharQuantity;
    if (isCommentLengthInvalid) throw new CustomError(invalidCommentLength);
  }
}
