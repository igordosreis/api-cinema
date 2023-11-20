import { z } from 'zod';
import dateRegex from './regex/date.regex';
// type Year = `${number}${number}${number}${number}`;
// type Month = `${number}${number}`;
// type Day = `${number}${number}`;

// export type DateString = `${Year}-${Month}-${Day}`;

const IDateSchema = z.string().regex(dateRegex);

export type IDate = z.infer<typeof IDateSchema>;
