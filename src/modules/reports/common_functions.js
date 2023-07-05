export default function getIndividualTotalUnitsValgross(lineItemsList, fromGross) {
    var totalCrates = 0;
    var totalSacs = 0;
    var totalBoxes = 0;
    var totalBags = 0;
    var totalKgs = 0;
    var totalLds = 0;
    var totalPcs = 0;
    var ratetype= '';
    var totalCratesWeiht = 0;
    var totalSacsWeight = 0;
    var totalBoxesWeight = 0;
    var totalBagsWeight = 0;
    lineItemsList.forEach((item) => {
      // eslint-disable-next-line default-case
  
      var unit = !fromGross
        ? item.unit.toUpperCase()
        : item.qtyType.toUpperCase();
      var weight = !fromGross ? item.weight : item.qtyWeight;
      switch (unit) {
        case "CRATES":
          totalCrates += item.qty;
           if(weight != 0 ){
               ratetype =' KGS/PCS'
               totalCratesWeiht = weight;
           }
          break;
        case "SACS":
          totalSacs += item.qty;
          if(weight != 0 ){
            ratetype = ' KGS/PCS';
            totalSacsWeight = weight;
        }
          break;
        case "BOXES":
          totalBoxes += item.qty;
          if(weight != 0 ){
            ratetype = ' KGS/PCS';
            totalBoxesWeight = weight;
        }
          break;
        case "BAGS":
          totalBags += item.qty;
          if(weight != 0 ){
            ratetype = ' KGS/PCS';
            totalBagsWeight = weight;
        }
          break;
        case "KGS":
          totalKgs += item.qty;
          if (item.qty == 0) {
            totalKgs += weight;
          }
          break;
        case "LOADS":
          totalLds += item.qty;
          if (item.qty == 0) {
            totalLds += weight;
          }
         
          break;
        case "PIECES":
          totalPcs += item.qty;
          if (item.qty == 0) {
            totalPcs += weight;
          }
         
          break;
        default:
          break;
      }
    });
    var result = ""; 
    if (totalBoxes !== 0) {
      if(ratetype != ''){
        result += `${totalBoxes} BX | ${totalBoxesWeight + ratetype} |`;
      }
      else{
        result += `${totalBoxes} BX | `;
      }
    }
    if (totalCrates !== 0) {
      if(ratetype != ''){
        result += ` ${totalCrates} C | ${totalCratesWeiht + ratetype} |`;
      }
      else{
        result += ` ${totalCrates} C | `;
      }
    }
    if (totalSacs !== 0) {
      if(ratetype != '')
      {
        result += ` ${totalSacs} S | ${totalSacsWeight + ratetype} |`;
      }
      else{
        result += ` ${totalSacs} S |`;
      }
    }
    if (totalBags !== 0) {
     if(ratetype != ''){
      result += ` ${totalBags} BG | ${totalBagsWeight + ratetype} `;
     }
     else{
      result += ` ${totalBags} BG | `;
     }
    }
    if (totalKgs !== 0) {
      result += ` ${totalKgs} KGS`;
    }
    if (totalLds !== 0) {
      result += ` ${totalLds} LDS`;
    }
    if (totalPcs !== 0) {
      result += ` ${totalPcs} PCS  `;
    }
    var finalResult =
      result.length > 0 ? result.substring(0, result.length - 1) : result;
    return finalResult;
  }