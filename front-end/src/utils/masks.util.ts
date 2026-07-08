const onlyNumbers = (value: string) => value.replace(/\D/g, '');

export const maskCPF = (value: string): string => {
  const v = onlyNumbers(value).slice(0, 11);

  return v
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
};

export const maskCEP = (value: string): string => {
  const v = onlyNumbers(value).slice(0, 8);

  return v.replace(/^(\d{5})(\d)/, '$1-$2');
};

export const maskPhone = (value: string): string => {
  const v = onlyNumbers(value).slice(0, 11);

  if (v.length <= 10) {
    return v
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }

  return v
    .replace(/^(\d{2})(\d)(\d)/, '($1) $2.$3')
    .replace(/(\d{4})(\d{4})$/, '$1-$2');
};

export const maskIncome = (value: string): string => {
  const digits = onlyNumbers(value);

  const amount = Number(digits) / 100;

  return amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};