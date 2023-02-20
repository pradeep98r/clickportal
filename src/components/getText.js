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
  }
  return getText(party);
}
export default { getText, getPartnerType };
