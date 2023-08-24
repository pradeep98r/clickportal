export function getCurrencyNumberWithSymbol(number) {
  return number == null || number == 0
    ? ""
    : number.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
        style: "currency",
        currency: "INR",
      });
}
export function getCurrencyNumberWithOutSymbol(number) {
  return number == null || number == 0
    ? ""
    : number
        .toLocaleString("en-IN", {
          maximumFractionDigits: 2,
          style: "currency",
          currency: "INR",
        })
        .replace("₹", "");
}
export function getCurrencyNumberWithOneDigit(number) {
  return number == null || number == 0 ? "" : number.toFixed(1);
}
export function getCurrencyNumberForWastage(number) {
  return number == null || number == 0 ? "" : number;
}
export function getMaskedMobileNumber(number) {
  return number.replace(/.(?=.{4})/g, "X");
}
export function getQuantityData(qty, qtyUnit, weight) {
  console.log("hi,", qty,qtyUnit,weight);
  var qtyData = {
    majorUnitVal: `${
      (qty === 0 ? "" : getCurrencyNumberWithOneDigit(qty)) +
      (qtyUnit.toLowerCase() === "loads" ||
      qtyUnit.toLowerCase() === "pieces" ||
      qtyUnit.toLowerCase() === "kgs"
        ? ""
        : " " + getCropUnit(qtyUnit))
    } ${
      qty === 0 || qty === null
        ? ""
        : weight === 0 || weight === null
        ? ""
        : " | "
    }`,
    minorUnitVal:
      getCurrencyNumberWithOneDigit(weight) +
      (qtyUnit.toLowerCase() === "loads" ||
      qtyUnit.toLowerCase() === "pieces" ||
      qtyUnit.toLowerCase() === "kgs"
        ? getCropUnit(qtyUnit)
        : weight === 0 || weight === null
        ? ""
        : " KGS"),
  };
  return qtyData;
}
const getCropUnit = (unit) => {
  var unitType = "";
  switch (unit.toLowerCase()) {
    case "crates":
      unitType = "C";
      break;
    case "boxes":
      unitType = "BX";
      break;
    case "bags":
      unitType = "BG";
      break;
    case "sacs":
      unitType = "S";
      break;
    case "loads":
      unitType = "LDS";
      break;
    case "pieces":
      unitType = "PCS";
      break;
    case "kgs":
      unitType = "KGS";
      break;
    default:
      unitType = "KGS";
      break;
  }
  return unitType;
};
export function getWastage(wastage, qtyUnit, rateType) {
  return `${
    wastage !== 0
      ? wastage !== null
        ? " - " +
          getCurrencyNumberWithOneDigit(wastage) +
          (qtyUnit.toLowerCase() === "pieces"
            ? getCropUnit(qtyUnit)
            : qtyUnit.toLowerCase() === "loads"
            ? ""
            : rateType === "RATE_PER_KG"
            ? "KGS"
            : getCropUnit(qtyUnit))
        : ""
      : ""
  }`;
}

export default {
  getCurrencyNumberWithSymbol,
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithOneDigit,
  getMaskedMobileNumber,
  getQuantityData,
  getWastage,
};
