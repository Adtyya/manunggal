export const toNumberFormat = (num) => {
  const format = new Intl.NumberFormat("id-ID");
  return format.format(num);
};
