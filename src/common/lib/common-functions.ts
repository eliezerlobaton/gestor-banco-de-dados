export const uncapitalizeString = (str: string): string => {
  return str.replace(str[0], str[0].toLowerCase());
};

export const makeCammelCase = (str: string): string => {
  return uncapitalizeString(str)
    .replace(/[^A-Z0-9]/g, (m, chr) => m.toLowerCase())
    .replace(/[^a-zA-Z0-9\u00C0-\u00FF]+(.)/g, (m, chr) => chr.toUpperCase());
};

const convertTimeToYears = (time: number): number =>
  Math.floor(time * 3.1688738506811e-11);

export const convertTimeToMonths = (time: number): number =>
  Math.floor(time / 2629800000) % 12;

const convertTimeToDays = (time: number): number =>
  Math.floor(time / (24 * 60 * 60 * 1000)) % 30;

const convertTimeToHours = (time: number): number =>
  Math.floor(time / (60 * 60 * 1000)) % 24;

const convertHoursToTime = (hours: number): number => hours * 1000 * 60 * 60;

const convertTimeToMinutes = (time: number): number =>
  Math.floor(time / (60 * 1000));

export const isDate = (date: any): boolean =>
  date instanceof Date ? true : false;

export const getDifferenceBetweenDatesFormatted = (
  date1: Date,
  date2: Date,
): string => {
  if (!isDate(date1) || !isDate(date2)) return '--';

  const t1 = date1.getTime(),
    t2 = date2.getTime();
  const duration = Math.max(t1, t2) - Math.min(t1, t2);
  const years = `${convertTimeToYears(duration)} Ano${
    convertTimeToYears(duration) > 1 ? 's' : ''
  }`;
  const months = `${convertTimeToMonths(duration)} Mês${
    convertTimeToMonths(duration) > 1 ? 'es' : ''
  }`;
  const days = `${convertTimeToDays(duration)} Dia${
    convertTimeToDays(duration) > 1 ? 's' : ''
  }`;
  const hours = `${convertTimeToHours(duration)} Hora${
    convertTimeToHours(duration) > 1 ? 's' : ''
  }`;

  return `${years}, ${months}, ${days} e ${hours}`;
};

export const formatToDate = (date: Date): string =>
  isDate(date)
    ? date.toJSON().split('T').shift().split('-').reverse().join('/')
    : '--';

export const formatDateToLongStringVersion = (date: Date): string => {
  if (typeof date === 'string') return date;
  if (!isDate(date)) return '--';
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    weekday: 'long',
    month: 'long',
    year: 'numeric',
  });
};

export const formatDate = (date: Date, type: string): string =>
  isDate(date)
    ? date
        .toLocaleString(type, {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        })
        .substring(0, 10)
    : '--';
