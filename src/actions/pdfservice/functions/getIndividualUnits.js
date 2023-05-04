function isIncludeWastage({ showInPdf = true, wastage = 0, weight = 0 }) {
  var _value = 0;
  if (showInPdf) {
    _value = weight - wastage;
  } else {
    _value = weight;
  }
  return _value;
}

export default function getIndividualTotalUnits(lineItemsList) {
  var totalCrates = 0;
  var totalSacs = 0;
  var totalBoxes = 0;
  var totalBags = 0;
  var totalKgs = 0;
  var totalLds = 0;
  var totalPcs = 0;
  lineItemsList.forEach((item) => {
    // eslint-disable-next-line default-case
    switch (item.qtyUnit.toUpperCase()) {
      case "CRATES":
        if (item.rateType === "RATE_PER_KG") {
          totalKgs += isIncludeWastage({
            showInPdf: true,
            wastage: item.wastage,
            weight: item.weight,
          });
          totalCrates += item.qty;
        } else {
          totalCrates += isIncludeWastage({
            showInPdf: true,
            wastage: item.wastage,
            weight: item.qty,
          });
        }
        break;
      case "SACS":
        if (item.rateType === "RATE_PER_KG") {
          totalKgs += isIncludeWastage({
            showInPdf: true,
            wastage: item.wastage,
            weight: item.weight,
          });
          totalSacs += item.qty;
        } else {
          totalSacs += isIncludeWastage({
            showInPdf: true,
            wastage: item.wastage,
            weight: item.qty,
          });
        }
        break;
      case "BOXES":
        if (item.rateType === "RATE_PER_KG") {
          totalKgs += isIncludeWastage({
            showInPdf: true,
            wastage: item.wastage,
            weight: item.weight,
          });
          totalBoxes += item.qty;
        } else {
          totalBoxes += isIncludeWastage({
            showInPdf: true,
            wastage: item.wastage,
            weight: item.qty,
          });
        }
        break;
      case "BAGS":
        if (item.rateType === "RATE_PER_KG") {
          totalKgs += isIncludeWastage({
            showInPdf: true,
            wastage: item.wastage,
            weight: item.weight,
          });
          totalBags += item.qty;
        } else {
          totalBags += isIncludeWastage({
            showInPdf: true,
            wastage: item.wastage,
            weight: item.qty,
          });
        }
        break;
      case "KGS":
        totalKgs += isIncludeWastage({
          showInPdf: true,
          wastage: item.wastage,
          weight: item.weight,
        });
        break;
      case "LOADS":
        totalLds += isIncludeWastage({
          showInPdf: true,
          wastage: item.wastage,
          weight: item.weight,
        });
        break;
      case "PIECES":
        totalPcs += isIncludeWastage({
          showInPdf: true,
          wastage: item.wastage,
          weight: item.weight,
        });
        break;
      default:
        break;
    }
  });
  var result = "";
  if (totalBoxes !== 0) {
    result += `${totalBoxes} BX |`;
  }
  if (totalCrates !== 0) {
    result += ` ${totalCrates} C |`;
  }
  if (totalSacs !== 0) {
    result += ` ${totalSacs} S |`;
  }
  if (totalBags !== 0) {
    result += ` ${totalBags} BG |`;
  }
  if (totalKgs !== 0) {
    result += ` ${totalKgs} KGS |`;
  }
  if (totalLds !== 0) {
    result += ` ${totalLds} LDS |`;
  }
  if (totalPcs !== 0) {
    result += ` ${totalPcs} PCS |`;
  }
  var finalResult =
    result.length > 0 ? result.substring(0, result.length - 1) : result;
  return finalResult;
}
