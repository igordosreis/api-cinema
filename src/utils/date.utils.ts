import { formatISO, subDays, addDays } from 'date-fns';

class DateUtils {
  formatDateToISO = (date: Date) => formatISO(date, { representation: 'date' });
  subtractDays = (date: Date, amountOfDays: number) => subDays(date, amountOfDays);
  addDays = (date: Date, amountOfDays: number) => addDays(date, amountOfDays);
}

export default new DateUtils();
