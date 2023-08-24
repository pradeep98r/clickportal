import { getCurrencyNumberWithOneDigit } from "../../../components/getCurrencyNumber";

export default function getQuantityData(qty, qtyUnit, weight) {
  console.log(qtyUnit);
  if (qtyUnit != null) {
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

//   export default function getWastage(wastage, qtyUnit, rateType) {
//     return `${
//       wastage !== 0
//         ? wastage !== null
//           ? " - " +
//             getCurrencyNumberWithOneDigit(wastage) +
//             (qtyUnit.toLowerCase() === "pieces"
//               ? getCropUnit(qtyUnit)
//               : qtyUnit.toLowerCase() === "loads"
//               ? ""
//               : rateType === "RATE_PER_KG"
//               ? "KGS"
//               : getCropUnit(qtyUnit))
//           : ""
//         : ""
//     }`;
//   }
