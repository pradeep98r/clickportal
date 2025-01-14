export function getText(partType) {
  return (
    partType.charAt(0).toUpperCase() + partType.toLowerCase().slice(1)
  ).replace("_", " ");
}
export function getPartnerType(item, trader) {
  var party = item;
  switch (item) {
    case "FARMER":
      if (trader) {
        party = "TRADER";
      } else {
        party = "Farmer";
      }
      break;
    case "BUYER":
      if (trader) {
        party = "TRADER";
      } else {
        party = item;
      }
      break;
      case "TRANSPORTER":
      party = item
      break;
      case "Seller":
      if (trader) {
        party = "TRADER";
      } else {
        party = "Farmer";
      }
      break;
      case "LABOR":
      party = "COOLIE"
      break;
  }
  return getText(party);
}
export function getUnitVal(qSetting,cIndex){
  var unit =  qSetting[cIndex].qtyUnit;
  if(cIndex != -1){
    if(qSetting[cIndex].qtyUnit.toLowerCase() == 'kgs'){
    unit = 'kgs'
    }
    else if(qSetting[cIndex].qtyUnit.toLowerCase() == 'boxes'){
      unit = 'Boxes'
    }
    else if(qSetting[cIndex].qtyUnit.toLowerCase() == 'bags'){
      unit = 'Bags'
    }
    else if(qSetting[cIndex].qtyUnit.toLowerCase() == 'sacs'){
      unit = 'Sacs'
    }
    else if(qSetting[cIndex].qtyUnit.toLowerCase() == 'loads'){
      unit = 'loads'
    }
    else if(qSetting[cIndex].qtyUnit.toLowerCase() == 'pieces'){
      unit = 'pieces'
    }
    else if(qSetting[cIndex].qtyUnit.toLowerCase() == 'crates'){
      unit= 'crates'
    }
   }
   return unit;
}

export function getQuantityUnit(qSetting,cIndex){
  var unit =  qSetting[cIndex].qtyUnit;
  if(cIndex != -1){
    if(qSetting[cIndex].qtyUnit.toLowerCase() == 'kgs'){
    unit = 'kgs'
    }
    else if(qSetting[cIndex].qtyUnit.toLowerCase() == 'boxes'){
      unit = 'boxes'
    }
    else if(qSetting[cIndex].qtyUnit.toLowerCase() == 'bags'){
      unit = 'bags'
    }
    else if(qSetting[cIndex].qtyUnit.toLowerCase() == 'sacs'){
      unit = 'sacs'
    }
    else if(qSetting[cIndex].qtyUnit.toLowerCase() == 'loads'){
      unit = 'Loads'
    }
    else if(qSetting[cIndex].qtyUnit.toLowerCase() == 'pieces'){
      unit = 'pieces'
    }
    else if(qSetting[cIndex].qtyUnit.toLowerCase() == 'crates'){
      unit= 'crates'
    }
   }
   return unit;
}
export function colorAdjustBg(color, amount) {
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
export default { getText, getPartnerType, getUnitVal, getQuantityUnit, colorAdjustBg};
