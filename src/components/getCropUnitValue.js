export function getCropUnit (unit, qty){
    var unitType = "";
    switch (unit.toUpperCase()) {
      case "CRATES":
        unitType = "C";
        break;
      case "BOXES":
        unitType = "BX";
        break;
      case "BAGS":
        unitType = "Bg";
        break;
      case "SACS":
        unitType = "S";
        break;
      case "LOADS":
        unitType = "L";
        break;
      case "PIECES":
        unitType = "P";
        break;
    }
    return qty ? unitType + " | " : "";
  };
  export default {getCropUnit}