import {
  formatISO,
  subDays,
  addDays,
  startOfWeek,
  endOfWeek,
  differenceInCalendarDays,
} from 'date-fns';

class DateUtils {
  formatDateToISO = (date: Date) => formatISO(date, { representation: 'date' });

  subtractDays = (date: Date, amountOfDays: number) => subDays(date, amountOfDays);

  addDays = (date: Date, amountOfDays: number) => addDays(date, amountOfDays);

  getLastSunday = (date: Date) => this.formatDateToISO(startOfWeek(date));

  getNextSunday = (date: Date) => this.formatDateToISO(endOfWeek(date, { weekStartsOn: 1 }));

  differenceInDays = (beforeDate: Date, afterDate: Date) =>
    differenceInCalendarDays(afterDate, beforeDate);
}

export default new DateUtils();
