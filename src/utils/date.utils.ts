import {
  formatISO,
  subDays,
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  differenceInCalendarDays,
  addMinutes,
} from 'date-fns';

class DateUtils {
  formatDateToISO = (date: Date) => formatISO(date, { representation: 'date' });

  subtractDays = (date: Date, amountOfDays: number) => subDays(date, amountOfDays);

  addDays = (date: Date, amountOfDays: number) => addDays(date, amountOfDays);

  getLastSunday = (date: Date) => this.formatDateToISO(startOfWeek(date));

  getNextSunday = (date: Date) => this.formatDateToISO(endOfWeek(date, { weekStartsOn: 1 }));

  getFirstDayOfMonth = (date: Date) => this.formatDateToISO(startOfMonth(date));

  getLastDayOfMonth = (date: Date) => this.formatDateToISO(endOfMonth(date));

  getFirstAndLastOfMonth = ({ year, month }: { year: string, month: string }) => {
    const dateString = `${year}-${month}`;
    const date = new Date(dateString);

    const firstDay = this.getFirstDayOfMonth(date);
    const lastDay = this.getLastDayOfMonth(date);

    return { firstDay, lastDay };
  };

  differenceInDays = (beforeDate: Date, afterDate: Date) =>
    differenceInCalendarDays(afterDate, beforeDate);

  addFiveMinutes = (currentDate: Date) => formatISO(addMinutes(currentDate, 5));

  adjustDateToBrazilTimezone = (date: Date) => {
    const currentDateToBrazilTimezone = date.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
    });
    const dateObjectConvertedFromDateString = new Date(currentDateToBrazilTimezone);

    // Essa função retorna um Date porque todas as funções do date-fns tem Date como tipo do parametro
    return new Date(formatISO(dateObjectConvertedFromDateString));
  };
}

export default new DateUtils();
