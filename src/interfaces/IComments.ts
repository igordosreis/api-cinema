import { z } from 'zod';
import { IAdminInfo } from './IAdmin';

export interface ICommentsInBody {
  comment: string;
  userInfo: IAdminInfo;
}

export const ICommentLogsSearchQuerySchema = z.object({
  userId: z.string().pipe(z.coerce.number()).optional(),
  createdAt: z.string().pipe(z.coerce.date()).optional(),
  action: z.string().optional(),
});

export type ICommentLogsSearchQuery = z.infer<typeof ICommentLogsSearchQuerySchema>;
