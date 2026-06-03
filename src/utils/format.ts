export const formatCurrency = (value: string | number): string => {
  if (!value && value !== 0) return '';
  const number = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
  if (isNaN(number)) return '';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(number);
};

export const handleCurrencyMask = (
  e: React.ChangeEvent<HTMLInputElement>, 
  onChange: (val: string) => void
) => {
  const digits = e.target.value.replace(/\D/g, '');
  if (!digits) {
    onChange('');
    return;
  }
  const val = (Number(digits) / 100).toFixed(2);
  onChange(val);
};
