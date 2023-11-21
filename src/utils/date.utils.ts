import { formatISO, subDays, addDays, startOfWeek, endOfWeek } from 'date-fns';

class DateUtils {
  formatDateToISO = (date: Date) => formatISO(date, { representation: 'date' });
  subtractDays = (date: Date, amountOfDays: number) => subDays(date, amountOfDays);
  addDays = (date: Date, amountOfDays: number) => addDays(date, amountOfDays);
  getLastSunday = (date: Date) => this.formatDateToISO(startOfWeek(date));
  getNextSunday = (date: Date) => this.formatDateToISO(endOfWeek(date, { weekStartsOn: 1 }));
}

export default new DateUtils();
