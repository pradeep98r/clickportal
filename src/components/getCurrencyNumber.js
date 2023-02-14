export function getCurrencyNumberWithSymbol(number) {
  return number == null || number == 0 ? '':number.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    style: "currency",
    currency: "INR",
  });
}
export function getCurrencyNumberWithOutSymbol(number) {
  return number == null || number == 0 ? '' : number
  .toLocaleString("en-IN", {
    maximumFractionDigits: 2,
    style: "currency",
    currency: "INR",
  })
  .replace("₹", "");
}
export function getCurrencyNumberWithOneDigit(number) {
  return number == null || number == 0 ?  '': number.toFixed(1);
}
export function getMaskedMobileNumber(number) {
  return number.replace(
    /.(?=.{4})/g,
    "X"
  );
}
export default {
  getCurrencyNumberWithSymbol,
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithOneDigit,
  getMaskedMobileNumber
};
