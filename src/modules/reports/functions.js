export default function getIndividualTotalUnitsVal(lineItemsList) {
  var totalCrates = 0;
  var totalSacs = 0;
  var totalBoxes = 0;
  var totalBags = 0;
  var totalKgs = 0;
  var totalLds = 0;
  var totalPcs = 0;
  lineItemsList.forEach((item) => {
    // eslint-disable-next-line default-case
    switch (item.unit.toUpperCase()) {
      case "CRATES":
        totalCrates += item.qty;

        break;
      case "SACS":
        totalSacs += item.qty;

        break;
      case "BOXES":
        totalBoxes += item.qty;

        break;
      case "BAGS":
        totalBags += item.qty;

        break;
      case "KGS":
        totalKgs += item.qty;
        break;
      case "LOADS":
        totalLds += item.qty;
        break;
      case "PIECES":
        totalPcs += item.qty;
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
