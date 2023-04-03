export function getCropUnit(unit, qty) {
  const unitTypes = {
    "CRATES": "C",
    "BOXES": "Bx",
    "BAGS": "Bg",
    "SACS": "S",
    "LOADS": "L",
    "PIECES": "P",
  };
  const abbreviation = unitTypes[unit.toUpperCase()] || "";
  return qty? qty.toFixed(1) + abbreviation : "";
}

export function formatInvLedger(array) {
  const items = array?array:[];
  const formattedItems = items
    .map((item) => getCropUnit(item.unit, item.qty))
    .filter((cropUnit) => cropUnit !== "");
  return formattedItems.join(" | ");
}

export default { getCropUnit, formatInvLedger };
