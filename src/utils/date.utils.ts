import { formatISO, subDays } from 'date-fns';

class DateUtils {
  subtractDays = (date: Date, amountOfDays: number) => subDays(date, amountOfDays);
  formatDateToISO = (date: Date) => formatISO(date, { representation: 'date' });
}

export default new DateUtils();
