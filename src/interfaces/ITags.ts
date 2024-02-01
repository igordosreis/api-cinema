import { z } from 'zod';

export const ITagsNewSchema = z.array(z.string());

export type ITagsNew = z.infer<typeof ITagsNewSchema>;

export type ITagsNewInBody = {
  tags: ITagsNew;
  typeId: number;
};

export type ITagsNewFormatted = Array<{
  name: string;
}>;
