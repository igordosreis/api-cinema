import {
  formatISO,
  subDays,
  addDays,
  startOfWeek,
  endOfWeek,
  differenceInCalendarDays,
  addHours,
} from 'date-fns';

class DateUtils {
  formatDateToISO = (date: Date) => formatISO(date, { representation: 'date' });

  subtractDays = (date: Date, amountOfDays: number) => subDays(date, amountOfDays);

  addDays = (date: Date, amountOfDays: number) => addDays(date, amountOfDays);

  getLastSunday = (date: Date) => this.formatDateToISO(startOfWeek(date));

  getNextSunday = (date: Date) => this.formatDateToISO(endOfWeek(date, { weekStartsOn: 1 }));

  differenceInDays = (beforeDate: Date, afterDate: Date) =>
    differenceInCalendarDays(afterDate, beforeDate);

  addOneHour = (currentDate: Date) => {
    const currentDateToBrazilTimezone = currentDate.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
    });
    const dateObjectConvertedFromDateString = new Date(currentDateToBrazilTimezone);

    return formatISO(addHours(dateObjectConvertedFromDateString, 1));
  };
}

export default new DateUtils();
