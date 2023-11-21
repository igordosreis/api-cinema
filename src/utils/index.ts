/* eslint-disable import/prefer-default-export */
import { formatISO } from 'date-fns';

export const formatDateToISO = (date: Date) => formatISO(date, { representation: 'date' });
