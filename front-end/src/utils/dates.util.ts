export const isValidBirthDate = (value: string): boolean => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return false;
  }

  const data = convertToForm(trimmedValue);

  const match = data.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (!match) {
    return false;
  }

  const [, dayStr, monthStr, yearStr] = match;

  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);

  if (year < 1900) {
    return false;
  }

  if (month < 1 || month > 12) {
    return false;
  }

  if (day < 1) {
    return false;
  }

  const date = new Date(year, month - 1, day);

  const isRealDate =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  if (!isRealDate) {
    return false;
  }

  const today = new Date();

  today.setHours(23, 59, 59, 999);

  if (date > today) {
    return false;
  }

  return true;
};

export const convertToAPI = (data: string) => {
  const [day, month, year] = data.split('/');
  return `${year}-${month}-${day}`;
};

export const convertToForm = (date?: string): string => {
  if (!date) return '';

  const [year, month, day] = date.split('-');

  if (!year || !month || !day) return '';

  return `${day}/${month}/${year}`;
};
