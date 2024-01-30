import { z } from 'zod';

export const ITagsNewSchema = z.array(z.string());

export type ITagsNew = z.infer<typeof ITagsNewSchema>;
