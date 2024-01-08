import { getCurrencyNumberForWastage } from "./getCurrencyNumber";
import { getCurrencyNumberWithOneDigit } from "./getCurrencyNumber";

export function qtyValues(qty, qtyUnit, weight, wastage, rateType) {
  const getCropUnit = (unit) => {
    var unitType = "";
    switch (unit.toLowerCase()) {
      case "crates":
        unitType = " C";
        break;
      case "boxes":
        unitType = " BX";
        break;
      case "bags":
        unitType = " BG";
        break;
      case "sacs":
        unitType = " S";
        break;
      case "loads":
        unitType = " LDS";
        break;
      case "pieces":
        unitType = " PCS";
        break;
      case "kgs":
        unitType = " KGS";
        break;
    }
    return unitType;
  };
  return (
    <p className="crop_name text-left">
      {(qty == 0 ? "" : getCurrencyNumberWithOneDigit(qty)) +
        (qtyUnit.toLowerCase() == "loads" ||
        qtyUnit.toLowerCase() == "pieces" ||
        qtyUnit.toLowerCase() == "kgs"
          ? ""
          : getCropUnit(qtyUnit))}
      {qty == 0 || qty == null
        ? ""
        : weight == 0 || weight == null
        ? ""
        : " | "}
      {getCurrencyNumberWithOneDigit(weight) +
        (qtyUnit.toLowerCase() == "loads" ||
        qtyUnit.toLowerCase() == "pieces" ||
        qtyUnit.toLowerCase() == "kgs"
          ? getCropUnit(qtyUnit)
          : weight == 0 || weight == null
          ? ""
          : " KGS")}
      <span className="color_red">
        {wastage != "0"
          ? wastage != null
            ? " - " +
              getCurrencyNumberForWastage(wastage) +
              (qtyUnit.toLowerCase() == "pieces"
                ? getCropUnit(qtyUnit)
                : qtyUnit.toLowerCase() == "loads"
                ? ""
                : rateType == "RATE_PER_KG"
                ? " KGS"
                : getCropUnit(qtyUnit))
            : ""
          : ""}
      </span>
    </p>
  );
}

export function colorAdjustBill(color, amount) {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (color) =>
        (
          "0" +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2)
      )
  );
}
export default { qtyValues, colorAdjustBill };
